---
name: azure-container-apps
description: Deploy, scale, and manage containerized applications on Azure Container Apps with Dapr, revision management, and advanced networking.
---

# Azure Container Apps Skill

Azure Container Apps (ACA) is a fully managed serverless container service for building and deploying modern applications at scale. This skill covers deployment patterns, Dapr integration, scaling strategies, revision management, and multi-container environments.

## Deployment Patterns

### Basic Container Deployment

Deploy a simple container image to Azure Container Apps:

```bash
az containerapp create \
  --name myapp \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/myapp:latest \
  --environment myEnvironment \
  --ingress external \
  --target-port 8080
```

### Using Azure Container Registry

Configure authentication with ACR:

```bash
az containerapp create \
  --name myapp \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/myapp:latest \
  --environment myEnvironment \
  --registry-server myregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --ingress external \
  --target-port 8080
```

## Dapr Integration

### Enable Dapr for a Container App

Enable Dapr sidecar with specific components:

```bash
az containerapp create \
  --name myapp \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/myapp:latest \
  --environment myEnvironment \
  --dapr-enabled true \
  --dapr-app-id myapp \
  --dapr-app-port 8080 \
  --ingress external \
  --target-port 8080
```

### State Management Component

Define a Dapr state store component:

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: statestore
spec:
  type: state.azure.cosmosdb
  version: v1
  metadata:
  - name: url
    value: "https://myaccount.documents.azure.com:443/"
  - name: masterKey
    secretRef: cosmosdb-master-key
  - name: databaseName
    value: mydb
  - name: collectionName
    value: mycollection
```

### Using Dapr with Container Apps

Create and apply a Dapr component in Azure Container Apps:

```bash
az containerapp env dapr-component set \
  --name myComponent \
  --environment myEnvironment \
  --resource-group myResourceGroup \
  --yaml @component.yaml
```

## Scaling Rules

### HTTP-Based Scaling

Configure HTTP request-based scaling rules:

```bash
az containerapp create \
  --name myapp \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/myapp:latest \
  --environment myEnvironment \
  --min-replicas 2 \
  --max-replicas 10 \
  --ingress external \
  --target-port 8080
```

### KEDA Scaling Rules

Define scaling based on custom metrics using KEDA:

```yaml
apiVersion: apps/containerapp.io/v1alpha1
kind: ContainerApp
metadata:
  name: myapp
spec:
  template:
    scale:
      minReplicas: 1
      maxReplicas: 10
      rules:
      - name: http-rule
        http:
          metadata:
            concurrentRequests: "50"
      - name: custom-metric
        custom:
          type: azure-queue
          metadata:
            connection: AzureStorageConnectionString
            queueName: myqueue
            queueLength: "10"
```

### Azure Event Hub Scaling

Scale based on Event Hub throughput:

```yaml
apiVersion: apps/containerapp.io/v1alpha1
kind: ContainerApp
metadata:
  name: myapp
spec:
  template:
    scale:
      rules:
      - name: eventhub-scaler
        custom:
          type: azure-eventhub
          metadata:
            storageConnectionString: "connection-string"
            storageContainerName: "container"
            eventHubName: "myeventhub"
            consumerGroup: "myconsumergroup"
            unprocessedEventThreshold: "30"
```

## Revision Management

### Create a New Revision

Update a container app to create a new revision automatically:

```bash
az containerapp update \
  --name myapp \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/myapp:v2.0 \
  --set-env-vars VERSION=2.0
```

### Traffic Splitting Between Revisions

Route traffic across multiple revisions for blue-green deployment:

```bash
az containerapp revision set-traffic \
  --name myapp \
  --resource-group myResourceGroup \
  --traffic-weight myapp--1=70 myapp--2=30
```

### List and Manage Revisions

View all revisions of a container app:

```bash
az containerapp revision list \
  --name myapp \
  --resource-group myResourceGroup \
  --query "[].{Name:name, Active:properties.active, CreatedTime:properties.createdTime}"
```

## Ingress Configuration

### External Ingress with TLS

Configure external ingress with automatic TLS certificate:

```bash
az containerapp create \
  --name myapp \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/myapp:latest \
  --environment myEnvironment \
  --ingress external \
  --target-port 8080 \
  --exposed-port 443
```

### Internal Ingress

Create an internal container app accessible only within the environment:

```bash
az containerapp create \
  --name myapp \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/myapp:latest \
  --environment myEnvironment \
  --ingress internal \
  --target-port 8080
```

### Custom Domain and SSL

Bind a custom domain to your container app:

```bash
az containerapp hostname add \
  --name myapp \
  --resource-group myResourceGroup \
  --hostname mycustom.domain.com \
  --bind-mount-path /path/to/cert \
  --cert-file /path/to/cert.pfx \
  --cert-password <password>
```

## Managed Identity

### Enable System-Assigned Managed Identity

Configure a system-assigned managed identity:

```bash
az containerapp identity assign \
  --name myapp \
  --resource-group myResourceGroup \
  --system-assigned
```

### Grant Permissions to Managed Identity

Assign role to the managed identity for Azure resources:

```bash
PRINCIPAL_ID=$(az containerapp identity show \
  --name myapp \
  --resource-group myResourceGroup \
  --query principalId -o tsv)

az role assignment create \
  --assignee $PRINCIPAL_ID \
  --role "Key Vault Secrets User" \
  --scope /subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.KeyVault/vaults/<vault-name>
```

### Access Azure Key Vault

Use managed identity to securely access Key Vault secrets:

```bash
az containerapp secrets set \
  --name myapp \
  --resource-group myResourceGroup \
  --secrets keyvault-secret=keyvault-ref
```

## Azure Container Apps Jobs

### Create a Job

Deploy a long-running or batch job:

```bash
az containerapp job create \
  --name myjob \
  --resource-group myResourceGroup \
  --environment myEnvironment \
  --trigger-type schedule \
  --cron-expression "0 0 * * *" \
  --image myregistry.azurecr.io/myjob:latest \
  --cpu 0.5 \
  --memory 1Gi
```

### Event-Driven Job

Create a job triggered by external events:

```bash
az containerapp job create \
  --name eventjob \
  --resource-group myResourceGroup \
  --environment myEnvironment \
  --trigger-type event \
  --replica-completion-count 1 \
  --image myregistry.azurecr.io/eventjob:latest
```

### Scale Job Executions

Configure scaling for job executions:

```bash
az containerapp job create \
  --name scalablejob \
  --resource-group myResourceGroup \
  --environment myEnvironment \
  --trigger-type event \
  --min-executions 0 \
  --max-executions 10 \
  --image myregistry.azurecr.io/scalablejob:latest
```

## Multi-Container Environments

### Environment Setup

Create a Container Apps Environment for hosting multiple apps:

```bash
az containerapp env create \
  --name myEnvironment \
  --resource-group myResourceGroup \
  --location eastus \
  --logs-workspace-id <workspace-id> \
  --logs-workspace-key <workspace-key>
```

### Internal Communication Between Apps

Enable apps to communicate within the same environment:

```bash
az containerapp create \
  --name frontend \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/frontend:latest \
  --environment myEnvironment \
  --ingress external \
  --target-port 3000

az containerapp create \
  --name backend \
  --resource-group myResourceGroup \
  --image myregistry.azurecr.io/backend:latest \
  --environment myEnvironment \
  --ingress internal \
  --target-port 8080
```

The frontend can reach the backend using the internal DNS name `http://backend` within the environment.

## Bicep Templates

### Complete Container App Template

Define infrastructure as code using Bicep:

```bicep
param containerAppName string
param containerImage string
param environment string
param location string = resourceGroup().location

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: resourceId('Microsoft.App/managedEnvironments', environment)
    configuration: {
      ingress: {
        external: true
        targetPort: 8080
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]
      }
    }
    template: {
      containers: [
        {
          name: containerAppName
          image: containerImage
          resources: {
            cpu: '0.5'
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
}

output containerAppId string = containerApp.id
output fqdn string = containerApp.properties.configuration.ingress.fqdn
```

### Bicep Template with Dapr

Define a container app with Dapr components:

```bicep
param containerAppName string
param containerImage string
param daprAppId string
param environment string
param location string = resourceGroup().location

resource containerAppWithDapr 'Microsoft.App/containerApps@2023-05-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: resourceId('Microsoft.App/managedEnvironments', environment)
    configuration: {
      dapr: {
        enabled: true
        appId: daprAppId
        appPort: 8080
      }
      ingress: {
        external: true
        targetPort: 8080
      }
    }
    template: {
      containers: [
        {
          name: containerAppName
          image: containerImage
          resources: {
            cpu: '0.5'
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 2
        maxReplicas: 10
      }
    }
  }
}

output containerAppId string = containerAppWithDapr.id
```

### Deploy Bicep Template

Deploy the Bicep template to Azure:

```bash
az deployment group create \
  --name aca-deployment \
  --resource-group myResourceGroup \
  --template-file template.bicep \
  --parameters \
    containerAppName=myapp \
    containerImage=myregistry.azurecr.io/myapp:latest \
    daprAppId=myapp \
    environment=myEnvironment
```

## Related Topics

- Azure Container Registry for container image storage
- Azure Key Vault for secure secret management
- Azure Cosmos DB for Dapr state management
- Azure Event Hubs and Storage Queues for event-driven scaling
- Azure Monitor and Log Analytics for observability
