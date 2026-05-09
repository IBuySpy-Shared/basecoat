---
name: container-migration
description: Scaffold containerization of a legacy app for Azure Container Apps or Kubernetes — generates Dockerfile, health probe endpoint, managed identity config, ACR push/pull workflow, and ACA Bicep module.
metadata:
  category: infrastructure
  keywords: "docker, containers, azure-container-apps, aks, kubernetes, acr, dockerfile, health-check, bicep"
  maturity: production
  audience: [backend-engineer, devops-engineer, platform-engineer]
allowed-tools: [bash, azure-cli, git, bicep]
---

# Container Migration

Scaffold containerization of a legacy application targeting Azure Container Apps (ACA),
Azure Kubernetes Service (AKS), or an ACR-only workflow. Generates a multi-stage
Dockerfile, `/healthz` endpoint stub, GitHub Actions ACR workflow, and platform-specific
infrastructure files.

## Triggers

Use this skill when the user asks to:

- "containerize this app" / "create a Dockerfile"
- "migrate to Azure Container Apps" / "deploy to ACA"
- "deploy to Kubernetes" / "add Dockerfile to this project"
- "set up ACR push" / "add container workflow"
- "add health check endpoint" / "add /healthz"

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `app_stack` | ✅ | — | `dotnet`, `python`, `java`, `node`, or `ruby` |
| `app_entry_point` | ✅ | — | Main entry point (e.g. `MyApp.dll`, `app.py`, `target/*.jar`, `server.js`) |
| `port` | ✅ | 8080 | Port the app listens on |
| `target_platform` | ✅ | — | `aca` (Container Apps), `aks` (Kubernetes), or `acr-only` (just ACR workflow) |
| `managed_identity` | ❌ | true | Wire up managed identity in container config |
| `app_name` | ❌ | — | Used for naming ACA/AKS resources |

## Base Images

| Stack | Base image |
|---|---|
| `dotnet` | `mcr.microsoft.com/dotnet/aspnet:8.0` |
| `python` | `python:3.12-slim` |
| `java` | `eclipse-temurin:21-jre-alpine` |
| `node` | `node:20-slim` |
| `ruby` | `ruby:3.3-slim` |

## Workflow

### 1. Select base image

Choose the runtime base image from the table above based on `app_stack`.
For the build stage, use the corresponding SDK image:

- `dotnet` build → `mcr.microsoft.com/dotnet/sdk:8.0`
- `python` build → same `python:3.12-slim` (install deps with pip)
- `java` build → `eclipse-temurin:21-jdk-alpine` (Maven or Gradle)
- `node` build → same `node:20-slim` (install with npm ci)
- `ruby` build → same `ruby:3.3-slim` (bundle install)

### 2. Generate multi-stage Dockerfile

Produce a two-stage Dockerfile: a **build** stage that compiles or installs
dependencies, and a **runtime** stage that copies only the necessary artifacts.

Key requirements for the runtime stage:

- Run as a non-root user (`appuser`) — never `root`
- Install a SIGTERM handler so the process exits cleanly on container stop
- `EXPOSE {port}` matches the `port` input
- Add a `HEALTHCHECK` instruction pointing to `/healthz`

Example skeleton (dotnet):

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
RUN adduser --disabled-password --gecos "" appuser
COPY --from=build /app/publish .
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:8080/healthz || exit 1
ENTRYPOINT ["dotnet", "MyApp.dll"]
```

### 3. Generate `/healthz` endpoint stub

Add a lightweight health probe route to the application — returns HTTP 200 with
no authentication required. Generate a language-appropriate snippet:

**dotnet (minimal API):**

```csharp
app.MapGet("/healthz", () => Results.Ok(new { status = "healthy" }))
   .AllowAnonymous();
```

**python (Flask):**

```python
@app.route("/healthz")
def healthz():
    return {"status": "healthy"}, 200
```

**java (Spring Boot):**

```java
@GetMapping("/healthz")
public ResponseEntity<Map<String, String>> healthz() {
    return ResponseEntity.ok(Map.of("status", "healthy"));
}
```

**node (Express):**

```javascript
app.get('/healthz', (req, res) => res.json({ status: 'healthy' }));
```

**ruby (Rails):**

```ruby
get '/healthz', to: proc { [200, {}, [{ status: 'healthy' }.to_json]] }
```

### 4. Generate ACR push/pull GitHub Actions workflow

Create `.github/workflows/container-build-push.yml` using OIDC federated credentials
(no stored secrets). Tag the image with `${{ github.sha }}` — never `:latest`.

```yaml
name: Build and push container image

on:
  push:
    branches: [main]

permissions:
  id-token: write
  contents: read

jobs:
  build-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Log in to ACR
        run: az acr login --name ${{ vars.ACR_NAME }}

      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ vars.ACR_NAME }}.azurecr.io/${{ vars.IMAGE_NAME }}:${{ github.sha }}
```

### 5. If target = aca — generate Bicep module

Create `infra/container-app.bicep` with a `containerApp` resource:

- System-assigned managed identity (when `managed_identity = true`)
- Ingress on the configured `port`, `external: true`
- Configurable `minReplicas` / `maxReplicas`
- Image tagged with the deployment SHA (pass as parameter)

```bicep
param appName string
param location string = resourceGroup().location
param containerImage string
param port int = 8080
param minReplicas int = 1
param maxReplicas int = 3

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: appName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    configuration: {
      ingress: {
        external: true
        targetPort: port
      }
    }
    template: {
      containers: [
        {
          name: appName
          image: containerImage
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
      }
    }
  }
}
```

### 6. If target = aks — generate Kubernetes manifests

Create `k8s/deployment.yaml` and `k8s/service.yaml`.

The Deployment must include:

- `readinessProbe` and `livenessProbe` on `/healthz`
- CPU and memory `requests` and `limits`
- `securityContext` with `runAsNonRoot: true`

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <app_name>
spec:
  replicas: 2
  selector:
    matchLabels:
      app: <app_name>
  template:
    metadata:
      labels:
        app: <app_name>
    spec:
      securityContext:
        runAsNonRoot: true
      containers:
        - name: <app_name>
          image: <acr>.azurecr.io/<image>:<sha>
          ports:
            - containerPort: <port>
          resources:
            requests:
              cpu: 250m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /healthz
              port: <port>
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /healthz
              port: <port>
            initialDelaySeconds: 15
            periodSeconds: 20
```

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: <app_name>
spec:
  type: ClusterIP
  selector:
    app: <app_name>
  ports:
    - port: 80
      targetPort: <port>
```

## Anti-patterns

- **Never use `:latest`** image tags in production — always pin to digest or SHA
- **Always set CPU/memory resource limits** — unbounded containers starve neighbours
- **Never run as root** — always `USER appuser` in the Dockerfile runtime stage
- **Never store secrets in Dockerfile** — use Key Vault references or mounted secrets
- **Never use `ADD` for local files** when `COPY` suffices — `ADD` has implicit extraction behaviour

## Related

- `azure-linux-app-service` skill — App Service alternative when containerization is not required
- `legacy-modernization` agent — determines whether containerization is the right modernization path
- `java-spring-boot.instructions.md` — layered JARs pattern for Java multi-stage builds
