# MCP Server Infrastructure — Azure Container Apps

Provisions the `basecoat-metrics-mcp` server on Azure Container Apps.
The server exposes Base Coat adoption metrics to AI agents over HTTP/MCP.

## Architecture

```
GHCR image
  ghcr.io/ibuyspy-shared/basecoat-metrics-mcp:latest
           │
           ▼
Azure Container Apps Environment  (bcmcp-env)
  └── Container App  (bcmcp-app)
        ├── Port 8080 → HTTPS ingress (auto-TLS)
        ├── GET /health → 200 ok
        └── MCP tools over HTTP/SSE
           ├── get-latest-metrics
           ├── get-history
           ├── get-alerts
           └── get-repo-metrics
```

Scales to zero between requests. Costs ~$0 at idle.

## One-Time Setup

### 1. Create a resource group

```bash
az group create --name rg-basecoat-mcp --location eastus
```

### 2. Create a service principal for CI

```bash
az ad sp create-for-rbac \
  --name "basecoat-mcp-deploy" \
  --role "Contributor" \
  --scopes "/subscriptions/<SUB_ID>/resourceGroups/rg-basecoat-mcp" \
  --sdk-auth
```

Copy the JSON output. Add it as a GitHub secret:

```bash
gh secret set AZURE_CREDENTIALS \
  --repo IBuySpy-Shared/basecoat \
  --body '<paste JSON here>'

gh secret set MCP_RESOURCE_GROUP \
  --repo IBuySpy-Shared/basecoat \
  --body 'rg-basecoat-mcp'
```

### 3. First deploy

Trigger manually or push a change to `mcp/basecoat-metrics/`:

```bash
gh workflow run mcp-deploy.yml --repo IBuySpy-Shared/basecoat
```

The workflow outputs the FQDN. Update `.vscode/mcp.json` with it:

```json
"basecoat-metrics-remote": {
  "type": "http",
  "url": "https://<FQDN>"
}
```

## Manual Deploy

```bash
# Build and push image
cd mcp/basecoat-metrics
IMAGE="ghcr.io/ibuyspy-shared/basecoat-metrics-mcp:latest"
docker build -t "${IMAGE}" .
docker push "${IMAGE}"

# Deploy Bicep
az deployment group create \
  --resource-group rg-basecoat-mcp \
  --template-file infra/mcp/main.bicep \
  --parameters imageTag=latest
```

## Parameters

| Parameter | Default | Description |
|---|---|---|
| `location` | RG location | Azure region |
| `environment` | `prod` | `prod`, `staging`, or `dev` |
| `imageTag` | `latest` | Container image tag |
| `imageRepo` | `ibuyspy-shared/basecoat-metrics-mcp` | GHCR repo |
| `metricsBaseUrl` | GitHub Pages URL | Override metrics data source |
| `cpuCores` | `0.25` | vCPU per replica |
| `memoryGi` | `0.5` | Memory per replica |
| `minReplicas` | `0` | Scale to zero when idle |
| `maxReplicas` | `3` | Max replicas under load |

## Outputs

| Output | Description |
|---|---|
| `fqdn` | Fully-qualified domain name |
| `healthUrl` | `GET /health` → 200 |
| `mcpUrl` | MCP endpoint for `.vscode/mcp.json` |

## Required Secrets

| Secret | Description |
|---|---|
| `AZURE_CREDENTIALS` | Service principal JSON from `az ad sp create-for-rbac --sdk-auth` |
| `MCP_RESOURCE_GROUP` | Azure resource group name |

## Teardown

```bash
az group delete --name rg-basecoat-mcp --yes
```
