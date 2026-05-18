// ── Portal App — Container App Module ────────────────────────────────────────
//
// Deploys a single Azure Container App within a pre-existing Container Apps
// environment.  Registry authentication uses a long-lived pull credential
// (GHCR_PULL_TOKEN) stored as a Container Apps secret — never the ephemeral
// GITHUB_TOKEN which expires when the workflow run ends.

@description('Azure region.')
param location string = resourceGroup().location

@description('Container Apps environment resource ID.')
param containerAppsEnvironmentId string

@description('Container app name.')
param appName string

@description('Fully-qualified container image reference (e.g. ghcr.io/org/image:sha-abc).')
param image string

@description('GHCR registry username (typically the GitHub org or actor).')
param registryUsername string

@description('Long-lived GHCR pull token (PAT with read:packages scope). Use secrets.GHCR_PULL_TOKEN — never GITHUB_TOKEN.')
@secure()
param registryPassword string

@description('Target port the container listens on.')
param targetPort int = 3000

@description('CPU cores allocated to each replica.')
param cpuCores string = '0.5'

@description('Memory allocated to each replica.')
param memoryGi string = '1.0'

@description('Minimum number of replicas (0 = scale to zero).')
param minReplicas int = 1

@description('Maximum number of replicas.')
param maxReplicas int = 3

@description('Environment variables to inject into the container (non-secret).')
param envVars array = []

@description('Resource tags.')
param tags object = {}

// ── Container App ─────────────────────────────────────────────────────────────

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: appName
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      ingress: {
        external: true
        targetPort: targetPort
        transport: 'http'
        allowInsecure: false
      }
      // Store the long-lived pull token as a Container Apps secret.
      // This secret persists across container restarts and scale events.
      secrets: [
        { name: 'ghcr-pull-token', value: registryPassword }
      ]
      registries: [
        {
          server: 'ghcr.io'
          username: registryUsername
          passwordSecretRef: 'ghcr-pull-token'
        }
      ]
    }
    template: {
      containers: [
        {
          name: appName
          image: image
          resources: {
            cpu: json(cpuCores)
            memory: '${memoryGi}Gi'
          }
          env: envVars
          probes: [
            {
              type: 'Liveness'
              httpGet: { path: '/health', port: targetPort }
              initialDelaySeconds: 15
              periodSeconds: 30
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: { path: '/health', port: targetPort }
              initialDelaySeconds: 5
              periodSeconds: 10
            }
          ]
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-scaling'
            http: { metadata: { concurrentRequests: '20' } }
          }
        ]
      }
    }
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────

@description('Fully-qualified domain name of the Container App.')
output fqdn string = containerApp.properties.configuration.ingress.fqdn

@description('Container App resource ID.')
output appId string = containerApp.id
