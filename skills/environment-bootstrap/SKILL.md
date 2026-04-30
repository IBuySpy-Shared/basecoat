---
name: environment-bootstrap
description: Automated setup for OIDC federation, state storage, Key Vault, and environment promotion in Azure CI/CD pipelines
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

OpenID Connect (OIDC) federation allows GitHub Actions to authenticate to Azure without storing service principal credentials as secrets.

### Prerequisites

Before setting up OIDC federation, ensure you have:

- Azure subscription with Owner or Contributor access
- GitHub repository with Actions enabled
- Azure CLI installed locally
- Permissions to create Entra ID applications and federated credentials

### Step 1: Create an Entra ID Application

```bash
# Create the Entra ID app registration
az ad app create --display-name "github-actions-ci"

# Get the application ID
APP_ID=$(az ad app list --query "[?displayName=='github-actions-ci'].appId" -o tsv)
echo "Application ID: $APP_ID"

# Create a service principal for the app
az ad sp create --id $APP_ID
```

### Step 2: Configure Federated Credentials

```bash
# Set variables
TENANT_ID=$(az account show --query tenantId -o tsv)
REPO_OWNER="IBuySpy-Shared"
REPO_NAME="basecoat"
GITHUB_ENTITY="repo:${REPO_OWNER}/${REPO_NAME}:ref:refs/heads/main"

# Create federated credential for main branch
az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "github-main",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "'$GITHUB_ENTITY'",
    "audiences": ["api://AzureADTokenExchange"]
  }'
```

### Step 3: Assign Azure RBAC Roles

```bash
# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Assign Contributor role to service principal
az role assignment create \
  --role "Contributor" \
  --assignee-object-id $(az ad sp show --id $APP_ID --query id -o tsv) \
  --scope "/subscriptions/$SUBSCRIPTION_ID"
```

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
        uses: azure/login@v1
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

### Prerequisites

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

## References

- [Azure Workload Identity Federation](https://learn.microsoft.com/en-us/azure/active-directory/workload-identities/workload-identity-federation)
- [GitHub OIDC in Azure](https://learn.microsoft.com/en-us/azure/active-directory/workload-identities/workload-identity-federation-create-trust-github)
- [Terraform Azure Backend](https://www.terraform.io/language/settings/backends/azurerm)
- [Azure Key Vault Best Practices](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)
- [AKS Workload Identity](https://learn.microsoft.com/en-us/azure/aks/workload-identity-overview)