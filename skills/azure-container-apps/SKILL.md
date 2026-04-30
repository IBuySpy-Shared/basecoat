---
name: azure-container-apps
description: Deploy, manage, and scale containerized applications on Azure Container Apps with Dapr, managed identity, and advanced configuration.
---

# Azure Container Apps Skill

Azure Container Apps (ACA) is a serverless container hosting platform that simplifies deploying microservices and containerized applications without managing Kubernetes infrastructure. This skill covers deployment patterns, scaling strategies, Dapr integration, revision management, and multi-container environments.

## Core Concepts

Azure Container Apps provides a managed environment for running containers with:

- **Serverless container hosting** — Pay only for resources consumed
- **Built-in Dapr integration** — Service-to-service communication and state management
- **Automatic scaling** — Based on HTTP traffic, custom metrics, or KEDA rules
- **Managed identity** — Native Azure AD integration without managing secrets
- **Multi-container support** — Run multiple containers in a single environment

## Deployment Patterns

### Basic Container App Deployment

Deploy a simple container image from Azure Container Registry (ACR) or Docker Hub:

\\\icep
resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: appName
  location: location
  properties: {
    environmentId: environment.id
    template: {
      containers: [
        {
          name: 'app'
          image: '${acrLoginServer}/${imageName}:${imageTag}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
      }
    }
  }
}
\\\

### Multi-Container Applications

Run multiple containers with shared networking:

\\\yaml
containers:
  - name: api
    image: myregistry.azurecr.io/api:v1
    resources:
      cpu: 0.5
      memory: 1Gi
    ports:
      - containerPort: 3000
        name: http
    env:
      - name: SERVICE_NAME
        value: api
      - name: SHARED_VOLUME
        value: /shared

  - name: sidecar
    image: myregistry.azurecr.io/sidecar:v1
    resources:
      cpu: 0.25
      memory: 512Mi
    volumeMounts:
      - mountPath: /shared
        volumeName: shared-storage

volumes:
  - name: shared-storage
    emptyDir: {}
\\\

## Dapr Integration

### Enable Dapr for a Container App

Dapr provides APIs for service-to-service communication, state management, pub/sub messaging, and external integrations:

\\\icep
properties: {
  template: {
    containers: [
      {
        name: 'myapp'
        image: 'myregistry.azurecr.io/myapp:v1'
      }
    ]
    dapr: {
      enabled: true
      appId: 'myapp'
      appPort: 3000
      httpReadBufferSize: 16777216
    }
  }
}
\\\

### Dapr Service Invocation

Call another container app using Dapr:

\\\ash
curl -X POST http://localhost:3500/v1.0/invoke/order-service/method/orders \
  -H "Content-Type: application/json" \
  -d '{\"customerId\": \"123\"}'
\\\

### Dapr State Management

Store and retrieve state without managing a database:

\\\ash
curl -X POST http://localhost:3500/v1.0/state/statestore \
  -H "Content-Type: application/json" \
  -d '[{\"key\": \"user-123\", \"value\": {\"name\": \"John\", \"email\": \"john@example.com\"}}]'
\\\

### Dapr Pub/Sub Messaging

Publish events between services:

\\\ash
curl -X POST http://localhost:3500/v1.0/publish/pubsub/orders \
  -H "Content-Type: application/json" \
  -d '{\"orderId\": \"456\", \"status\": \"completed\"}'
\\\

## Scaling Rules

### HTTP-Based Scaling

Automatically scale based on HTTP requests per second:

\\\yaml
scale:
  minReplicas: 1
  maxReplicas: 20
  rules:
    - name: http-scaling
      http:
        metadata:
          concurrentRequests: '100'
\\\

### KEDA Scaling Rules

Use KEDA scalers for custom metrics (Azure Queue, Service Bus, Prometheus, etc.):

\\\yaml
scale:
  minReplicas: 0
  maxReplicas: 100
  rules:
    - name: queue-scaler
      custom:
        type: azure-queue
        metadata:
          queueName: myqueue
          queueLength: '5'
          storageAccount: myaccount
          connection: AzureWebJobsStorage

    - name: service-bus-scaler
      custom:
        type: azure-servicebus
        metadata:
          topicName: myservice-topic
          subscriptionName: mysubscription
          messageCount: '10'
          connection: ServiceBusConnection

    - name: prometheus-scaler
      custom:
        type: prometheus
        metadata:
          serverAddress: http://prometheus:9090
          metricName: http_requests_total
          query: sum(rate(http_requests_total[1m]))
          threshold: '1000'
\\\

### CPU and Memory Scaling

For workloads dependent on compute resources:

\\\yaml
scale:
  minReplicas: 2
  maxReplicas: 50
  rules:
    - name: cpu-scaling
      custom:
        type: cpu
        metadata:
          type: Utilization
          value: '80'

    - name: memory-scaling
      custom:
        type: memory
        metadata:
          type: Utilization
          value: '75'
\\\

## Revision Management

### Traffic Splitting and Canary Deployments

Route traffic to multiple revisions for gradual rollouts:

\\\icep
configuration: {
  ingress: {
    external: true
    targetPort: 3000
    traffic: [
      {
        revisionName: 'myapp--v1'
        weight: 90
        label: 'stable'
      }
      {
        revisionName: 'myapp--v2'
        weight: 10
        label: 'canary'
      }
    ]
  }
}
\\\

### Update Application with New Revision

Update the template to trigger a new revision:

\\\icep
template: {
  containers: [
    {
      name: 'app'
      image: '${acrLoginServer}/myapp:v2'
      resources: {
        cpu: json('0.5')
        memory: '1Gi'
      }
    }
  ]
  revisionSuffix: 'v2'
}
\\\

### Manage Revision Policies

Control how many inactive revisions are retained:

\\\icep
properties: {
  template: {
    revisionSuffix: 'v2'
  }
  configuration: {
    activeRevisionsLimit: 5
  }
}
\\\

## Ingress Configuration

### External and Internal Ingress

Configure ingress for external traffic or internal service-to-service communication:

\\\icep
configuration: {
  ingress: {
    external: true
    targetPort: 3000
    transport: 'auto'
    allowInsecure: false
    customDomains: [
      {
        name: 'api.example.com'
        certificateId: certificateId
      }
    ]
  }
}
\\\

### Custom Domains with TLS

Bind a custom domain with an SSL certificate:

\\\ash
az containerapp ingress update \
  --name myapp \
  --resource-group myresourcegroup \
  --type external \
  --target-port 3000 \
  --custom-domain-name api.example.com \
  --certificate-id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.App/managedEnvironments/{environmentName}/certificates/{certificateName}
\\\

## Managed Identity

### System-Assigned Managed Identity

Enable system-assigned identity for accessing Azure resources without storing credentials:

\\\icep
identity: {
  type: 'SystemAssigned'
}
\\\

### Access Azure Resources

Use managed identity to authenticate with Azure Key Vault, Storage, or other services:

\\\ash
curl -X GET \
  'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2017-12-01&resource=https://vault.azure.net' \
  -H 'Metadata: true'
\\\

### Grant RBAC Permissions

Assign roles to the managed identity:

\\\ash
az role assignment create \
  --assignee-object-id <MANAGED_IDENTITY_OBJECT_ID> \
  --role "Key Vault Secrets User" \
  --scope /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.KeyVault/vaults/{vaultName}
\\\

## Container Apps Jobs

### Define a Job

Run one-time or scheduled tasks:

\\\icep
resource containerAppJob 'Microsoft.App/containerAppJobs@2024-03-01' = {
  name: jobName
  location: location
  properties: {
    environmentId: environment.id
    template: {
      containers: [
        {
          name: 'job'
          image: '${acrLoginServer}/batch-processor:v1'
          resources: {
            cpu: json('1.0')
            memory: '2Gi'
          }
          env: [
            {
              name: 'JOB_TIMEOUT'
              value: '3600'
            }
          ]
        }
      ]
    }
    configuration: {
      scheduleTriggerConfig: {
        schedule: '0 0 * * *'
        parallelism: 1
        replicaCompletionCount: 1
      }
      triggerType: 'Schedule'
    }
  }
}
\\\

### Event-Driven Jobs

Trigger jobs from external events (Azure Queue Storage, Service Bus):

\\\icep
configuration: {
  eventTriggerConfig: {
    parallelism: 5
    replicaCompletionCount: 1
  }
  triggerType: 'Event'
  dapr: {
    enabled: true
    appId: 'job-processor'
  }
}
\\\

## Bicep Template Example

### Complete ACA Deployment with Environment

Deploy a managed environment and container app together:

\\\icep
param location string = resourceGroup().location
param appName string
param acrLoginServer string
param imageName string
param imageTag string = 'latest'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${appName}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource environment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${appName}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
    workloadProfiles: [
      {
        name: 'Consumption'
        workloadProfileType: 'Consumption'
      }
    ]
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: appName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    environmentId: environment.id
    workloadProfileName: 'Consumption'
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        transport: 'auto'
        allowInsecure: false
      }
      dapr: {
        enabled: true
        appId: appName
        appPort: 3000
      }
      activeRevisionsLimit: 3
    }
    template: {
      containers: [
        {
          name: 'app'
          image: '${acrLoginServer}/${imageName}:${imageTag}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'ENVIRONMENT'
              value: 'production'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 2
        maxReplicas: 10
        rules: [
          {
            name: 'http-scaling'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
}

output appUrl string = containerApp.properties.configuration.ingress.fqdn
output managedIdentityId string = containerApp.identity.principalId
\\\

## Multi-Container Environments

### Sidecar Pattern

Deploy application containers with logging, monitoring, or service mesh sidecars:

\\\yaml
containers:
  - name: application
    image: myregistry.azurecr.io/myapp:v1
    resources:
      cpu: 0.5
      memory: 1Gi
    ports:
      - containerPort: 3000
        name: http
    env:
      - name: LOG_LEVEL
        value: info

  - name: logging-sidecar
    image: myregistry.azurecr.io/fluent-bit:latest
    resources:
      cpu: 0.25
      memory: 256Mi
    volumeMounts:
      - mountPath: /var/log
        volumeName: application-logs
    env:
      - name: LOG_DESTINATION
        value: log-analytics

  - name: metrics-sidecar
    image: myregistry.azurecr.io/telegraf:latest
    resources:
      cpu: 0.1
      memory: 128Mi
    env:
      - name: METRICS_ENDPOINT
        value: http://localhost:8086

volumes:
  - name: application-logs
    emptyDir: {}
\\\

### Service Mesh Integration

Use Dapr as a lightweight service mesh for traffic management:

\\\icep
dapr: {
  enabled: true
  appId: 'myapp'
  appPort: 3000
  appProtocol: 'http'
  logLevel: 'info'
  enableApiLogging: false
}
\\\

## Environment Quotas and Limits

Configure resource quotas for the Container Apps environment:

\\\icep
resource environment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${appName}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
    infrastructureResourceGroup: 'MC_${resourceGroup().name}_${appName}-env'
  }
}
\\\

## Common Patterns and Best Practices

- **Stateless design** — Design applications to be horizontally scalable with no local state
- **Dapr for patterns** — Use Dapr state stores, pub/sub, and service invocation instead of building custom communication
- **Gradual rollouts** — Use traffic splitting to test new revisions before full deployment
- **Resource requests** — Always specify CPU and memory to enable proper scaling
- **Managed identity** — Prefer system-assigned managed identity over connection strings
- **Revision cleanup** — Set \ctiveRevisionsLimit\ to control cost and complexity
- **Observability** — Send logs to Log Analytics for monitoring and debugging
- **Dapr components** — Secure component definitions using managed identity instead of storing connection strings

