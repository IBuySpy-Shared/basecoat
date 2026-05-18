// ── Portal App — PostgreSQL Flexible Server ───────────────────────────────────
//
// Security posture:
//   - Public network access is DISABLED; all connectivity goes through a
//     private endpoint in the provided subnet.
//   - Password authentication is DISABLED; access is via Azure AD / Entra ID
//     RBAC only (managed identity or AD user/group).
//   - A private DNS zone (privatelink.postgres.database.azure.com) is linked
//     to the VNet so that clients resolve the server through the private IP.

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('PostgreSQL server name (must be globally unique).')
param serverName string

@description('PostgreSQL version.')
@allowed(['14', '15', '16'])
param postgresVersion string = '16'

@description('SKU name for the flexible server (e.g. Standard_D2ds_v4).')
param skuName string = 'Standard_D2ds_v4'

@description('SKU tier.')
@allowed(['Burstable', 'GeneralPurpose', 'MemoryOptimized'])
param skuTier string = 'GeneralPurpose'

@description('Storage size in GB. Must be a multiple of 1 GB (e.g. 32, 64, 128).')
@minValue(32)
@maxValue(16384)
param storageSizeGb int = 32

@description('Backup retention days.')
@minValue(7)
@maxValue(35)
param backupRetentionDays int = 7

@description('Geo-redundant backup enabled.')
param geoRedundantBackup bool = false

@description('Resource ID of the subnet delegated to Microsoft.DBforPostgreSQL/flexibleServers for the private endpoint.')
param privateEndpointSubnetId string

@description('Resource ID of the VNet to link the private DNS zone to.')
param vnetId string

@description('Object ID of the Entra ID administrator (user or group) for the server.')
param aadAdminObjectId string

@description('Login name of the Entra ID administrator.')
param aadAdminLogin string

@description('Principal type of the Entra ID administrator.')
@allowed(['User', 'Group', 'ServicePrincipal'])
param aadAdminPrincipalType string = 'ServicePrincipal'

@description('Resource tags.')
param tags object = {}

// ── Private DNS Zone ──────────────────────────────────────────────────────────

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.postgres.database.azure.com'
  location: 'global'
  tags: tags
}

resource privateDnsZoneLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: privateDnsZone
  name: '${serverName}-vnet-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnetId
    }
  }
}

// ── PostgreSQL Flexible Server ────────────────────────────────────────────────

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-12-01-preview' = {
  name: serverName
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuTier
  }
  properties: {
    version: postgresVersion
    storage: {
      storageSizeGB: storageSizeGb
    }
    backup: {
      backupRetentionDays: backupRetentionDays
      geoRedundantBackup: geoRedundantBackup ? 'Enabled' : 'Disabled'
    }
    // RBAC-only: Entra ID authentication required; password auth is disabled.
    authConfig: {
      activeDirectoryAuth: 'Enabled'
      passwordAuth: 'Disabled'
    }
    // Private endpoint is used; no public network access permitted.
    network: {
      publicNetworkAccess: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// ── Entra ID Administrator ────────────────────────────────────────────────────

resource aadAdmin 'Microsoft.DBforPostgreSQL/flexibleServers/administrators@2023-12-01-preview' = {
  parent: postgresServer
  name: aadAdminObjectId
  properties: {
    principalType: aadAdminPrincipalType
    principalName: aadAdminLogin
    tenantId: subscription().tenantId
  }
}

// ── Private Endpoint ──────────────────────────────────────────────────────────

resource privateEndpoint 'Microsoft.Network/privateEndpoints@2023-09-01' = {
  name: '${serverName}-pe'
  location: location
  tags: tags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: '${serverName}-pe-conn'
        properties: {
          privateLinkServiceId: postgresServer.id
          groupIds: ['postgresqlServer']
        }
      }
    ]
  }
}

resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-09-01' = {
  parent: privateEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'postgres-private-dns'
        properties: {
          privateDnsZoneId: privateDnsZone.id
        }
      }
    ]
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────

@description('Fully-qualified domain name of the PostgreSQL server.')
output fqdn string = postgresServer.properties.fullyQualifiedDomainName

@description('Resource ID of the PostgreSQL server.')
output serverId string = postgresServer.id

@description('Private endpoint IP (resolved via private DNS zone).')
output privateEndpointId string = privateEndpoint.id
