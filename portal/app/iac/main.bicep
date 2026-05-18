// ── Portal App — Main IaC Template ───────────────────────────────────────────
//
// Provisions:
//   - Log Analytics Workspace
//   - Container Apps Environment (VNet-integrated)
//   - Backend Container App  (pulls from GHCR using GHCR_PULL_TOKEN)
//   - PostgreSQL Flexible Server (private endpoint, RBAC-only auth)
//   - Private DNS zone + VNet link for PostgreSQL
//
// Deploy:
//   az group create -n <rg> -l eastus
//   az deployment group create -g <rg> -f portal/app/iac/main.bicep \
//     --parameters @portal/app/iac/environments/staging.bicepparam

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Short environment label (staging | prod).')
@allowed(['staging', 'prod'])
param environment string = 'staging'

@description('Container image tag to deploy.')
param imageTag string

@description('GHCR image repository (org/repo).')
param imageRepo string

@description('GHCR registry username (GitHub actor or org name).')
param registryUsername string

@description('Long-lived GHCR pull token (PAT with read:packages scope). Provide via secrets.GHCR_PULL_TOKEN — never GITHUB_TOKEN.')
@secure()
param registryPassword string

@description('Address space for the portal VNet.')
param vnetAddressPrefix string = '10.10.0.0/16'

@description('Subnet prefix for Container Apps environment infrastructure.')
param containerAppsSubnetPrefix string = '10.10.0.0/23'

@description('Subnet prefix for private endpoints (PostgreSQL).')
param privateEndpointSubnetPrefix string = '10.10.2.0/28'

@description('Object ID of the Entra ID principal that will be the PostgreSQL administrator.')
param dbAadAdminObjectId string

@description('Login name of the Entra ID PostgreSQL administrator.')
param dbAadAdminLogin string

@description('Principal type of the Entra ID PostgreSQL administrator.')
@allowed(['User', 'Group', 'ServicePrincipal'])
param dbAadAdminPrincipalType string = 'ServicePrincipal'

@description('PostgreSQL database name to create and connect to.')
param dbDatabaseName string = 'basecoat_portal'

@description('Resource tags.')
param tags object = {
  environment: environment
  managedBy: 'portal-iac'
  workload: 'basecoat-portal'
}

// ── Variables ─────────────────────────────────────────────────────────────────

var suffix     = environment == 'prod' ? '' : '-${environment}'
var prefix     = 'bcportal'
var lawName    = '${prefix}-law${suffix}'
var envName    = '${prefix}-env${suffix}'
var backendApp = '${prefix}-backend${suffix}'
var dbName     = '${prefix}-db${suffix}'
var vnetName   = '${prefix}-vnet${suffix}'
var image      = 'ghcr.io/${imageRepo}:${imageTag}'

// ── Virtual Network ───────────────────────────────────────────────────────────

resource vnet 'Microsoft.Network/virtualNetworks@2023-09-01' = {
  name: vnetName
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [vnetAddressPrefix]
    }
    subnets: [
      {
        // Container Apps environment requires a dedicated /23 or larger subnet.
        name: 'ContainerAppsSubnet'
        properties: {
          addressPrefix: containerAppsSubnetPrefix
          delegations: [
            {
              name: 'Microsoft.App.environments'
              properties: { serviceName: 'Microsoft.App/environments' }
            }
          ]
        }
      }
      {
        // Private endpoints subnet — no service delegation required.
        name: 'PrivateEndpointSubnet'
        properties: {
          addressPrefix: privateEndpointSubnetPrefix
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
    ]
  }
}

// ── Log Analytics Workspace ───────────────────────────────────────────────────

resource law 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: lawName
  location: location
  tags: tags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
    features: { enableLogAccessUsingOnlyResourcePermissions: true }
  }
}

// ── Container Apps Environment (VNet-integrated) ──────────────────────────────

resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: envName
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: law.properties.customerId
        sharedKey: law.listKeys().primarySharedKey
      }
    }
    vnetConfiguration: {
      infrastructureSubnetId: vnet.properties.subnets[0].id
      internal: false
    }
  }
}

// ── PostgreSQL Flexible Server (private endpoint, RBAC-only) ─────────────────

module postgresModule './modules/postgresql-flexible-server.bicep' = {
  name: 'postgres-${environment}'
  params: {
    location: location
    serverName: dbName
    privateEndpointSubnetId: vnet.properties.subnets[1].id
    vnetId: vnet.id
    aadAdminObjectId: dbAadAdminObjectId
    aadAdminLogin: dbAadAdminLogin
    aadAdminPrincipalType: dbAadAdminPrincipalType
    tags: tags
  }
}

// ── Backend Container App ─────────────────────────────────────────────────────

module backendModule './modules/container-app.bicep' = {
  name: 'backend-${environment}'
  params: {
    location: location
    containerAppsEnvironmentId: containerAppsEnv.id
    appName: backendApp
    image: image
    registryUsername: registryUsername
    registryPassword: registryPassword
    targetPort: 3000
    minReplicas: environment == 'prod' ? 1 : 0
    maxReplicas: environment == 'prod' ? 5 : 2
    envVars: [
      { name: 'NODE_ENV',      value: 'production' }
      { name: 'PORT',          value: '3000' }
      // PostgreSQL connection — RBAC-only; no password. The app must use an
      // Azure AD access token (via DefaultAzureCredential) as the password.
      { name: 'DB_HOST',       value: postgresModule.outputs.fqdn }
      { name: 'DB_PORT',       value: '5432' }
      { name: 'DB_NAME',       value: dbDatabaseName }
      { name: 'DB_SSLMODE',    value: 'require' }
    ]
    tags: tags
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────

@description('Backend Container App FQDN.')
output backendFqdn string = backendModule.outputs.fqdn

@description('PostgreSQL server FQDN (private, resolved via private DNS zone).')
output dbFqdn string = postgresModule.outputs.fqdn

@description('Health check URL for the backend.')
output healthUrl string = 'https://${backendModule.outputs.fqdn}/health'
