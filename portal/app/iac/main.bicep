@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Deployment environment name.')
@allowed([
  'staging'
])
param environment string = 'staging'

@description('Backend container image.')
param backendImage string

@description('Frontend container image.')
param frontendImage string

@description('Container registry host for app images.')
param containerRegistryServer string = 'ghcr.io'

@description('Container registry username for image pulls.')
param containerRegistryUsername string = ''

@secure()
@description('Container registry password for image pulls.')
param containerRegistryPassword string = ''

@description('PostgreSQL administrator login.')
param postgresAdminLogin string = 'portaladmin'

@secure()
@description('PostgreSQL administrator password.')
param postgresAdminPassword string

@description('PostgreSQL database name.')
param postgresDatabaseName string = 'portaldb'

var nameSuffix = environment == 'staging' ? '-staging' : ''
var prefix = 'portal'
var lawName = '${prefix}-law${nameSuffix}'
var envName = '${prefix}-env${nameSuffix}'
var backendName = '${prefix}-backend${nameSuffix}'
var frontendName = '${prefix}-frontend${nameSuffix}'
var postgresServerName = toLower('${prefix}-pg${nameSuffix}-${substring(uniqueString(resourceGroup().id), 0, 6)}')

resource law 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: lawName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

resource env 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: envName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: law.properties.customerId
        sharedKey: law.listKeys().primarySharedKey
      }
    }
  }
}

module database './modules/postgresql-flexible-server.bicep' = {
  name: 'postgresql-flexible-server'
  params: {
    location: location
    serverName: postgresServerName
    databaseName: postgresDatabaseName
    administratorLogin: postgresAdminLogin
    administratorLoginPassword: postgresAdminPassword
  }
}

module frontend './modules/frontend-container-app.bicep' = {
  name: 'frontend-container-app'
  params: {
    location: location
    appName: frontendName
    environmentId: env.id
    image: frontendImage
    containerRegistryServer: containerRegistryServer
    containerRegistryUsername: containerRegistryUsername
    containerRegistryPassword: containerRegistryPassword
  }
}

module backend './modules/backend-container-app.bicep' = {
  name: 'backend-container-app'
  params: {
    location: location
    appName: backendName
    environmentId: env.id
    image: backendImage
    containerRegistryServer: containerRegistryServer
    containerRegistryUsername: containerRegistryUsername
    containerRegistryPassword: containerRegistryPassword
    dbHost: database.outputs.fqdn
    dbPort: 5432
    dbName: postgresDatabaseName
    dbUser: postgresAdminLogin
    dbPassword: postgresAdminPassword
    corsOrigins: 'https://${frontend.outputs.fqdn}'
  }
}

output backendUrl string = 'https://${backend.outputs.fqdn}'
output frontendUrl string = 'https://${frontend.outputs.fqdn}'
output databaseFqdn string = database.outputs.fqdn
