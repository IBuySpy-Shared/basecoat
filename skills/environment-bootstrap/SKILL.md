---
name: environment-bootstrap
description: Automated setup for OIDC federation, state storage, Key Vault, and environment promotion in Azure CI/CD pipelines. Now includes Fabric workspace service principal access automation.
license: MIT
compatibility: "Requires Azure CLI and Terraform. Works with VS Code Copilot, GitHub Copilot CLI, and Claude Code."
metadata:
  category: devops
  keywords: "environment, bootstrap, oidc, azure, terraform, key-vault, ci-cd"
  model-tier: standard
allowed-tools: "search/codebase run_terminal_command"
---

# Environment Bootstrap Skill

## Overview

The Environment Bootstrap Skill provides a complete setup for establishing secure, reproducible Azure environments with federated identity credentials for CI/CD, centralized state management, secrets handling, and multi-environment promotion workflows.

## Key Capabilities

- **OIDC Federation**: Configure workload identity federation for GitHub Actions without storing long-lived credentials
- **State Storage**: Set up Terraform and Bicep deployment state backends with encryption and access controls
- **Key Vault Provisioning**: Automate Azure Key Vault creation with RBAC policies and secret management
- **GitHub Actions Secrets**: Integrate environment secrets with GitHub Actions for CI/CD workflows
- **Environment Promotion**: Establish dev→staging→prod promotion pipelines with gating controls
- **Workload Identity**: Enable service principals with federated identity for pod-level authentication

## OIDC Federation Setup for CI/CD

See [`references/oidc-federation.md`](references/oidc-federation.md) for complete OIDC federation setup instructions including:
- Creating Entra ID applications
- Configuring federated credentials
- Assigning RBAC roles
- GitHub Actions OIDC token exchange
- Multi-environment federation
- Troubleshooting guide

## Terraform and Bicep State Storage Configuration

Centralized state management ensures consistent infrastructure deployments across environments.

### Storage Account Setup

```bash
# Create resource group for state management
RESOURCE_GROUP="rg-terraform-state"
LOCATION="eastus"

az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION"

# Create storage account
STORAGE_ACCOUNT="tfstate$(date +%s)"

az storage account create \
  --resource-group "$RESOURCE_GROUP" \
  --name "$STORAGE_ACCOUNT" \
  --sku Standard_LRS \
  --encryption-services blob \
  --https-only true \
  --min-tls-version TLS1_2
```

### Storage Container and Backend Configuration

```bash
# Create blob container
az storage container create \
  --name "terraform-state" \
  --account-name "$STORAGE_ACCOUNT" \
  --public-access off

# Enable versioning for state recovery
az storage account blob-service-properties update \
  --account-name "$STORAGE_ACCOUNT" \
  --enable-versioning
```

Bicep template for Terraform backend:

```bicep
param storageAccountName string
param location string = resourceGroup().location

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: storageAccountName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    httpsTrafficOnlyEnabled: true
    minimumTlsVersion: 'TLS1_2'
  }
}

resource blobServices 'Microsoft.Storage/storageAccounts/blobServices@2021-06-01' = {
  parent: storageAccount
  name: 'default'
  properties: {
    deleteRetentionPolicy: {
      enabled: true
      days: 30
    }
  }
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-06-01' = {
  parent: blobServices
  name: 'terraform-state'
  properties: {
    publicAccess: 'None'
  }
}

output storageAccountId string = storageAccount.id
output containerName string = container.name
```

## Azure Key Vault Provisioning

Secure secret storage and automatic rotation for application credentials.

### Key Vault Creation

```bash
# Create Key Vault
KEYVAULT_NAME="kv-$(openssl rand -hex 4)"
RESOURCE_GROUP="rg-secrets"

az keyvault create \
  --name "$KEYVAULT_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "eastus" \
  --enable-rbac-authorization true \
  --public-network-access Enabled
```

### RBAC Configuration for CI/CD

```bash
# Grant service principal access to Key Vault secrets
SERVICE_PRINCIPAL_ID=$(az ad sp show --id $APP_ID --query id -o tsv)

# Assign Key Vault Secrets Officer role
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee-object-id "$SERVICE_PRINCIPAL_ID" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
```

### Bicep Template for Key Vault

```bicep
param keyVaultName string
param location string = resourceGroup().location
param tenantId string

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    tenantId: tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
  }
}

output keyVaultId string = keyVault.id
output keyVaultUri string = keyVault.properties.vaultUri
```

## GitHub Actions Secrets Configuration

Integrate Azure credentials and environment-specific secrets into GitHub Actions workflows.

### Workflow Example

```yaml
name: Deploy Infrastructure

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v3

      - name: Azure Login
        uses: azure/login@v2
        with:
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy with Bicep
        run: |
          az deployment group create \
            --resource-group ${{ secrets.AZURE_RESOURCE_GROUP }} \
            --template-file main.bicep \
            --parameters environment=prod

      - name: Retrieve Secrets from Key Vault
        run: |
          SECRET=$(az keyvault secret show \
            --vault-name ${{ secrets.KEYVAULT_NAME }} \
            --name database-password \
            --query value -o tsv)
          echo "::add-mask::$SECRET"
          echo "DB_PASSWORD=$SECRET" >> $GITHUB_ENV
```

### Setting GitHub Secrets

```bash
# Store Azure credentials in GitHub repository secrets
gh secret set AZURE_TENANT_ID --body "your-tenant-id" --repo IBuySpy-Shared/basecoat
gh secret set AZURE_CLIENT_ID --body "your-client-id" --repo IBuySpy-Shared/basecoat
gh secret set AZURE_SUBSCRIPTION_ID --body "your-subscription-id" --repo IBuySpy-Shared/basecoat
gh secret set AZURE_RESOURCE_GROUP --body "your-resource-group" --repo IBuySpy-Shared/basecoat
gh secret set KEYVAULT_NAME --body "your-keyvault-name" --repo IBuySpy-Shared/basecoat
```

## Environment Promotion

Establish a structured promotion path from development through production with approval gates.

### Multi-Environment Architecture

```text
Development → Staging → Production
    ↓            ↓           ↓
   Auto         Auto      Manual Approval
  Deploy       Deploy     Required
```

### Environment Configuration

```yaml
environments:
  dev:
    resource-group: rg-basecoat-dev
    location: eastus
    sku: Standard_B2s
    auto-deploy: true

  staging:
    resource-group: rg-basecoat-staging
    location: eastus2
    sku: Standard_D2s_v3
    auto-deploy: true
    requires-approval: false

  prod:
    resource-group: rg-basecoat-prod
    location: eastus
    sku: Standard_D4s_v3
    auto-deploy: false
    requires-approval: true
    approval-team: infrastructure-team
```

### GitHub Environments Configuration

```yaml
name: Multi-Environment Deployment

on:
  push:
    branches:
      - main

jobs:
  deploy-dev:
    runs-on: ubuntu-latest
    environment: development
    steps:
      - uses: actions/checkout@v3
      - run: az deployment group create --resource-group rg-basecoat-dev --template-file main.bicep

  deploy-staging:
    needs: deploy-dev
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - run: az deployment group create --resource-group rg-basecoat-staging --template-file main.bicep

  deploy-prod:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - run: az deployment group create --resource-group rg-basecoat-prod --template-file main.bicep
```

## Workload Identity Federation

Enable pod-level authentication in AKS using Azure Workload Identity.

### Prerequisites for AKS

- Azure Kubernetes Service cluster
- Azure CLI and kubectl configured

### Setup Steps

```bash
# Create namespace for workload identity
kubectl create namespace workload-identity

# Create Kubernetes service account
kubectl create serviceaccount workload-identity-sa -n workload-identity

# Export OIDC issuer URL
export AKS_OIDC_ISSUER=$(az aks show \
  --name myAKSCluster \
  --resource-group myResourceGroup \
  --query "oidcIssuerProfile.issuerUrl" -o tsv)

# Create Entra ID application for AKS workload
az ad app create --display-name "aks-workload-identity"
```

### Federated Credential for AKS Pod

```bash
# Get Kubernetes service account info
KUBE_NAMESPACE="workload-identity"
KUBE_SERVICE_ACCOUNT="workload-identity-sa"
KUBE_SERVICE_ACCOUNT_EMAIL="$KUBE_SERVICE_ACCOUNT@$AKS_CLUSTER_NAME.iam.gke.google.com"

# Create federated credential
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "kubernetes-workload",
    "issuer": "'$AKS_OIDC_ISSUER'",
    "subject": "system:serviceaccount:'$KUBE_NAMESPACE':'$KUBE_SERVICE_ACCOUNT'",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### Deploy Workload with Identity

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: workload-identity-sa
  namespace: workload-identity
  annotations:
    azure.workload.identity/client-id: <APPLICATION_CLIENT_ID>

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: workload-identity-app
  namespace: workload-identity
spec:
  replicas: 1
  selector:
    matchLabels:
      app: workload-identity-app
  template:
    metadata:
      labels:
        app: workload-identity-app
        azure.workload.identity/use: "true"
    spec:
      serviceAccountName: workload-identity-sa
      containers:
      - name: app
        image: myregistry.azurecr.io/myapp:latest
        env:
        - name: AZURE_TENANT_ID
          value: "<TENANT_ID>"
        - name: AZURE_CLIENT_ID
          value: "<CLIENT_ID>"
```

## Troubleshooting

### OIDC Token Exchange Failures

```powershell
# Verify federated credential configuration
$appId = "your-app-id"
az ad app federated-credential list --id $appId

# Check service principal role assignments
$spId = az ad sp show --id $appId --query id -o tsv
az role assignment list --assignee-object-id $spId
```

### State Storage Access Issues

```bash
# Verify storage account access
az storage account show-connection-string --name $STORAGE_ACCOUNT

# Check container permissions
az storage container exists --name terraform-state --account-name $STORAGE_ACCOUNT
```

### Key Vault Access Denied

```bash
# Review role assignments
az role assignment list \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"

# Grant additional permissions if needed
az role assignment create \
  --role "Key Vault Administrator" \
  --assignee-object-id $PRINCIPAL_ID \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourcegroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME"
```

## Microsoft Fabric Workspace Service Principal Access

Automate role assignment and permissions for service principals to access Fabric workspaces programmatically.

### Prerequisites

- Azure subscription with Contributor access
- Microsoft Fabric tenant provisioned
- Azure CLI and Fabric Python SDK installed

### Step 1: Create Service Principal for Fabric

```bash
# Create Entra ID application for Fabric access
az ad app create --display-name "fabric-automation"

# Get the application ID
FABRIC_APP_ID=$(az ad app list --query "[?displayName=='fabric-automation'].appId" -o tsv)
echo "Fabric App ID: $FABRIC_APP_ID"

# Create service principal
az ad sp create --id $FABRIC_APP_ID

# Get the service principal object ID
FABRIC_SP_ID=$(az ad sp show --id $FABRIC_APP_ID --query id -o tsv)
echo "Fabric Service Principal ID: $FABRIC_SP_ID"
```

### Step 2: Assign Fabric Workspace Roles

Use the Fabric REST API to assign workspace roles:

```bash
# Get Fabric workspace ID (from Fabric UI or API)
FABRIC_WORKSPACE_ID="your-workspace-id"

# Authenticate with Fabric
TOKEN=$(az account get-access-token --resource "https://analysis.windows.net/powerbi/api" --query accessToken -o tsv)

# Assign Contributor role to service principal
curl -X POST \
  "https://api.powerbi.com/v1.0/myorg/groups/$FABRIC_WORKSPACE_ID/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "'$FABRIC_SP_ID'",
    "principalType": "ServicePrincipal",
    "accessRight": "Contributor"
  }'
```

### Step 3: Create Fabric Admin Secret in Key Vault

Store the service principal credentials securely:

```bash
# Generate password for service principal
FABRIC_PASSWORD=$(az ad app credential create --id $FABRIC_APP_ID --query password -o tsv)

# Store in Key Vault
az keyvault secret set \
  --vault-name "$KEYVAULT_NAME" \
  --name "fabric-sp-password" \
  --value "$FABRIC_PASSWORD"

# Store Fabric app ID
az keyvault secret set \
  --vault-name "$KEYVAULT_NAME" \
  --name "fabric-sp-id" \
  --value "$FABRIC_APP_ID"

# Store Fabric workspace ID
az keyvault secret set \
  --vault-name "$KEYVAULT_NAME" \
  --name "fabric-workspace-id" \
  --value "$FABRIC_WORKSPACE_ID"
```

### Step 4: Bicep Template for Fabric Role Assignment

```bicep
param fabricWorkspaceId string
param serviceAccountObjectId string
param tenantId string

// Create role assignment via Azure Graph API call
resource fabricRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, serviceAccountObjectId, 'Contributor')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c') // Contributor
    principalId: serviceAccountObjectId
    principalType: 'ServicePrincipal'
  }
}

output roleAssignmentId string = fabricRoleAssignment.id
```

### Step 5: Automate with GitHub Actions

```yaml
name: Configure Fabric Workspace Access

on:
  workflow_dispatch:

jobs:
  setup-fabric-access:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Azure Login
        uses: azure/login@v2
        with:
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Create Fabric Service Principal
        run: |
          # Create app
          APP_JSON=$(az ad app create --display-name "fabric-automation" --output json)
          APP_ID=$(echo $APP_JSON | jq -r '.appId')
          
          # Create service principal
          az ad sp create --id $APP_ID
          
          # Store in Key Vault
          az keyvault secret set \
            --vault-name "${{ secrets.KEYVAULT_NAME }}" \
            --name "fabric-sp-id" \
            --value "$APP_ID"

      - name: Assign Fabric Workspace Access
        run: |
          # Get token for Fabric API
          FABRIC_TOKEN=$(az account get-access-token \
            --resource "https://analysis.windows.net/powerbi/api" \
            --query accessToken \
            --output tsv)
          
          # Get credentials from Key Vault
          FABRIC_SP_ID=$(az keyvault secret show \
            --vault-name "${{ secrets.KEYVAULT_NAME }}" \
            --name "fabric-sp-id" \
            --query value -o tsv)
          
          FABRIC_WORKSPACE_ID=$(az keyvault secret show \
            --vault-name "${{ secrets.KEYVAULT_NAME }}" \
            --name "fabric-workspace-id" \
            --query value -o tsv)
          
          # Assign Contributor role
          curl -X POST \
            "https://api.powerbi.com/v1.0/myorg/groups/$FABRIC_WORKSPACE_ID/users" \
            -H "Authorization: Bearer $FABRIC_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
              "identifier": "'$FABRIC_SP_ID'",
              "principalType": "ServicePrincipal",
              "accessRight": "Contributor"
            }'
          
          echo "✓ Fabric workspace access configured"
```

### Step 6: Verify Fabric Access

```python
# verify_fabric_access.py
from azure.identity import ClientSecretCredential
from azure.keyvault.secrets import SecretClient
import requests

# Get credentials from Key Vault
keyvault_url = "https://your-keyvault-name.vault.azure.net"
secret_client = SecretClient(vault_url=keyvault_url, credential=ClientSecretCredential(
    tenant_id="your-tenant-id",
    client_id="your-client-id",
    client_secret="your-client-secret"
))

# Retrieve Fabric SP credentials
fabric_sp_id = secret_client.get_secret("fabric-sp-id").value
fabric_sp_password = secret_client.get_secret("fabric-sp-password").value
fabric_workspace_id = secret_client.get_secret("fabric-workspace-id").value

# Authenticate service principal
credential = ClientSecretCredential(
    tenant_id="your-tenant-id",
    client_id=fabric_sp_id,
    client_secret=fabric_sp_password
)

# Get Fabric token
token = credential.get_token("https://analysis.windows.net/powerbi/api")

# Verify workspace access
headers = {"Authorization": f"Bearer {token.token}"}
response = requests.get(
    f"https://api.powerbi.com/v1.0/myorg/groups/{fabric_workspace_id}",
    headers=headers
)

if response.status_code == 200:
    print("✓ Fabric workspace access verified")
    print(f"Workspace: {response.json()['name']}")
else:
    print(f"✗ Access failed: {response.status_code}")
    print(response.text)
```

### Fabric Workspace Role Matrix

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Admin** | Full control, user/role management | Workspace owner, infrastructure automation |
| **Member** | Create/edit/delete items, share | Data engineers, analysts building reports |
| **Contributor** | Create/edit items | Service principals automating data pipelines |
| **Viewer** | Read-only access | BI consumers, auditors, cross-org stakeholders |

---

## References

- [Azure Workload Identity Federation](https://learn.microsoft.com/en-us/azure/active-directory/workload-identities/workload-identity-federation)
- [GitHub OIDC in Azure](https://learn.microsoft.com/en-us/azure/active-directory/workload-identities/workload-identity-federation-create-trust-github)
- [Terraform Azure Backend](https://www.terraform.io/language/settings/backends/azurerm)
- [Azure Key Vault Best Practices](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)
- [AKS Workload Identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview)
- [Microsoft Fabric Admin API](https://learn.microsoft.com/en-us/rest/api/fabric/admin/workspace-info)
- [Fabric Service Principal Authentication](https://learn.microsoft.com/en-us/fabric/admin/service-principal-authentication)
