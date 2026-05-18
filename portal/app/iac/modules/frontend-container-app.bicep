@description('Azure region for the app.')
param location string = resourceGroup().location

@description('Container App name.')
param appName string

@description('Managed environment resource ID.')
param environmentId string

@description('Container image reference.')
param image string

@description('Target port exposed by the container.')
param targetPort int = 80

@description('Container registry host.')
param containerRegistryServer string = 'ghcr.io'

@description('Container registry username.')
param containerRegistryUsername string = ''

@secure()
@description('Container registry password.')
param containerRegistryPassword string = ''

@description('Minimum replica count.')
param minReplicas int = 0

@description('Maximum replica count.')
param maxReplicas int = 2

var secrets = empty(containerRegistryPassword) ? [] : [
  {
    name: 'registry-password'
    value: containerRegistryPassword
  }
]

var registries = empty(containerRegistryPassword) ? [] : [
  {
    server: containerRegistryServer
    username: containerRegistryUsername
    passwordSecretRef: 'registry-password'
  }
]

resource app 'Microsoft.App/containerApps@2024-03-01' = {
  name: appName
  location: location
  properties: {
    managedEnvironmentId: environmentId
    configuration: {
      ingress: {
        external: true
        targetPort: targetPort
        transport: 'http'
        allowInsecure: false
      }
      secrets: secrets
      registries: registries
    }
    template: {
      containers: [
        {
          name: 'frontend'
          image: image
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '20'
              }
            }
          }
        ]
      }
    }
  }
}

output fqdn string = app.properties.configuration.ingress.fqdn
