---
name: security-operations
title: Security Operations & Threat Detection
description: Threat detection patterns, SIEM rules, secrets management, audit logging, and incident response automation
compatibility: ["agent:security-operations"]
metadata:
  domain: security
  maturity: production
  audience: [sre, security-engineer, devops-engineer]
allowed-tools: [bash, terraform, kubectl, azure-cli, docker]
---

# Security Operations Skill

Use this skill when implementing threat detection, secrets management, audit logging, and incident response automation. Covers cloud-native (Azure, AWS) and Kubernetes environments.

---

## Threat Detection Patterns

### 1. Authentication Attack Detection

**Azure AD Authentication Anomalies (KQL):**
```kusto
SigninLogs
| where TimeGenerated > ago(24h)
| where ResultType != 0  // Failed logins only
| summarize FailureCount = count() by UserPrincipalName, IPAddress
| where FailureCount > 10
| project UserPrincipalName, IPAddress, FailureCount, 
  Alert = strcat("Brute force detected: ", UserPrincipalName, " from ", IPAddress)
```

**Kubernetes API Server Attack Detection:**
```bash
#!/bin/bash
# detect-k8s-api-attacks.sh

# Extract API audit logs from last hour
kubectl logs -n kube-system -l component=kube-apiserver --tail=10000 | \
  jq -r 'select(.verb=="create" and .objectRef.resource=="pods" and .stage=="RequestReceived")' | \
  jq -s 'group_by(.user.username) | map({user: .[0].user.username, count: length}) | 
    sort_by(.count) | reverse | .[0:5]' > /tmp/pod_creation_ranking.json

# Alert if single user creates >50 pods/hour
jq '.[] | select(.count > 50) | .user' /tmp/pod_creation_ranking.json | while read user; do
  echo "ALERT: Possible privilege escalation by $user (>50 pod creations)"
  # Send to SIEM
  curl -X POST https://siem.example.com/api/events \
    -H "Authorization: Bearer $SIEM_TOKEN" \
    -d "{'severity': 'high', 'alert': 'K8s privilege escalation attempt by $user'}"
done
```

### 2. Data Access Anomalies

**Detecting Unusual Database Queries:**
```sql
-- Identify queries reading unusually large result sets
SELECT
  user,
  query,
  rows_returned,
  execution_time_ms,
  NOW() as alert_time
FROM query_audit_log
WHERE timestamp > NOW() - INTERVAL 1 HOUR
AND rows_returned > (
  SELECT AVG(rows_returned) + (STDDEV_POP(rows_returned) * 3)
  FROM query_audit_log
  WHERE timestamp > NOW() - INTERVAL 30 DAY
  AND user = query_audit_log.user
)
ORDER BY rows_returned DESC
LIMIT 100;
```

**Azure Blob Storage Anomalies:**
```kusto
StorageBlobLogs
| where TimeGenerated > ago(1h)
| where OperationName in ("GetBlob", "ListBlobs")
| summarize 
    TotalRead_GB = sum(ContentLengthBytes) / (1024*1024*1024),
    RequestCount = count() 
    by UserPrincipalName, ClientIpAddress
| where TotalRead_GB > 10  // Threshold: 10GB per hour
| project UserPrincipalName, ClientIpAddress, TotalRead_GB, RequestCount,
  Alert = "Unusual bulk data access"
```

### 3. Privilege Escalation Detection

**RBAC Role Change Detection:**
```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: RequestResponse
    verbs: ["create", "update", "patch", "delete"]
    resources: ["clusterroles", "clusterrolebindings", "roles", "rolebindings"]
    omitStages: ["RequestReceived"]

---
# Post-audit log analysis
apiVersion: v1
kind: ConfigMap
metadata:
  name: rbac-alert-rules
  namespace: kube-system
data:
  detect_rbac_changes.sh: |
    #!/bin/bash
    # Alert if non-admin modifies admin roles
    jq -r 'select(
      (.verb == "patch" or .verb == "update") and
      (.objectRef.resource == "clusterroles" or .objectRef.resource == "roles") and
      .user.username != "system:admin"
    ) | .user.username + " modified " + .objectRef.resource' audit-log.json | \
    while read entry; do
      echo "ALERT: Unauthorized RBAC modification: $entry"
    done
```

---

## Secrets Management

### 1. Automated Credential Rotation

**Kubernetes Secret Rotation (CronJob):**
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: rotate-db-credentials
  namespace: security
spec:
  schedule: "0 2 * * 0"  # Weekly at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: credential-rotator
          containers:
          - name: rotator
            image: registry.example.com/rotator:latest
            env:
            - name: DB_HOST
              value: postgres.default.svc.cluster.local
            - name: VAULT_ADDR
              value: https://vault.example.com
            args:
            - --database=postgres
            - --users=app_user,backup_user
            - --length=32
            - --symbols=true
          restartPolicy: OnFailure
          securityContext:
            runAsNonRoot: true
            readOnlyRootFilesystem: true
```

**Rotation Script (Python):**
```python
import os
import psycopg2
import hvac
import secrets
import string

def rotate_postgres_password(db_user: str):
    """Rotate PostgreSQL user password and store in Vault"""
    
    # Generate new password
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    new_password = ''.join(secrets.choice(alphabet) for i in range(32))
    
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_ADMIN_USER"),
        password=os.getenv("DB_ADMIN_PASS")
    )
    cursor = conn.cursor()
    
    try:
        # Update password
        cursor.execute(f"ALTER USER {db_user} WITH PASSWORD %s", (new_password,))
        conn.commit()
        print(f"✓ Password rotated for {db_user}")
        
        # Store in Vault
        client = hvac.Client(url=os.getenv("VAULT_ADDR"))
        client.auth.kubernetes.login(
            role="app-rotation-role",
            jwt=open("/var/run/secrets/kubernetes.io/serviceaccount/token").read()
        )
        
        client.secrets.kv.v2.create_or_update_secret(
            path=f"database/postgres/{db_user}",
            secret_data={
                "username": db_user,
                "password": new_password,
                "connection_string": f"postgresql://{db_user}:{new_password}@{os.getenv('DB_HOST')}/app"
            }
        )
        print(f"✓ Credentials stored in Vault")
        
        # Audit log
        audit_event = {
            "event": "credential_rotation",
            "resource": f"database:postgres:{db_user}",
            "timestamp": datetime.now().isoformat(),
            "status": "success"
        }
        send_audit_event(audit_event)
        
    except Exception as e:
        print(f"✗ Rotation failed: {e}")
        audit_event["status"] = "failed"
        audit_event["error"] = str(e)
        send_audit_event(audit_event)
        raise
    finally:
        cursor.close()
        conn.close()

def send_audit_event(event: dict):
    """Send audit event to SIEM"""
    import requests
    requests.post(
        "https://siem.example.com/api/audit-events",
        json=event,
        headers={"Authorization": f"Bearer {os.getenv('SIEM_TOKEN')}"}
    )
```

### 2. Secret Access Auditing

**Vault Secret Access Logs (HCL):**
```hcl
path "database/data/postgres/*" {
  capabilities = ["read"]
}

path "sys/leases/lookup" {
  capabilities = ["update"]
}

path "auth/token/renew-self" {
  capabilities = ["update"]
}

# Audit all database access
audit {
  file {
    path = "/var/log/vault-audit.log"
  }

  syslog {
    tag      = "vault"
    facility = "LOCAL7"
  }
}

# Vault audit query (after enabling)
policy "audit-db-access" {
  rules {
    # Alert if same user accesses multiple database credentials in 5 min
    query = """
      SELECT user_identity, COUNT(*) as access_count 
      FROM vault_audit_log 
      WHERE timestamp > NOW() - INTERVAL 5 MINUTE 
      AND path LIKE 'database/data/%'
      GROUP BY user_identity 
      HAVING access_count > 3
    """
    threshold = 1
    severity  = "high"
  }
}
```

---

## Audit Logging

### 1. Centralized Log Collection

**ELK Stack Configuration (Filebeat + Elasticsearch):**
```yaml
# filebeat.yml
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/auth.log
    - /var/log/audit/audit.log
    - /var/log/kubernetes/*.log
  fields:
    source: "system-logs"
    environment: "production"

- type: container
  enabled: true
  paths:
    - "/var/lib/docker/containers/*/*.log"
  fields:
    source: "container-logs"

processors:
  - add_kubernetes_metadata:
      in_cluster: true
  - add_docker_metadata: {}
  - add_fields:
      target: metadata
      fields:
        region: us-east-1
        account: prod

output.elasticsearch:
  hosts: ["elasticsearch.siem.svc.cluster.local:9200"]
  indices:
    - index: "audit-%{+yyyy.MM.dd}"
      when.contains:
        source: "audit"
    - index: "container-%{+yyyy.MM.dd}"
      when.contains:
        source: "container"

logging.level: info
logging.to_files: true
```

**Log Parsing & Enrichment (Logstash):**
```
input {
  elasticsearch {
    hosts => "elasticsearch:9200"
    index => "raw-logs-*"
  }
}

filter {
  # Parse syslog
  if [source] == "system-logs" {
    grok {
      match => {
        "message" => "%{SYSLOGLINE}"
      }
    }
  }

  # Enrich with threat intelligence
  file {
    include => "/etc/logstash/threat-intel.conf"
  }

  # GeoIP enrichment
  geoip {
    source => "source_ip"
    target => "geoip"
  }

  # Add severity scoring
  if [event_type] == "authentication_failure" {
    mutate {
      add_field => { "severity_score" => 3 }
      add_tag => [ "auth_attack" ]
    }
  }
}

output {
  # Write to separate indices for performance
  elasticsearch {
    hosts => "elasticsearch:9200"
    index => "audit-%{+YYYY.MM.dd}"
    document_type => "_doc"
  }

  # Alert on high-severity events
  if "auth_attack" in [tags] {
    email {
      to => "security-team@example.com"
      subject => "Security Alert: %{alert_name}"
      body => "Severity: %{severity_score}\nDetails: %{message}"
    }
  }
}
```

### 2. Immutable Audit Trail

**Azure Immutable Blob Storage (Terraform):**
```hcl
resource "azurerm_storage_account" "audit" {
  name                     = "auditlogs${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.security.name
  location                 = azurerm_resource_group.security.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  access_tier              = "Cool"

  identity {
    type = "SystemAssigned"
  }

  network_rules {
    default_action = "Deny"
    bypass         = ["AzureServices"]
  }
}

# Enable immutability
resource "azurerm_storage_container_immutability_policy" "audit" {
  storage_account_name          = azurerm_storage_account.audit.name
  container_name                = "audit-logs"
  immutability_policy_until_date = "2034-05-02T00:00:00Z"  # 8 years
  protected_append_writes_enabled = true
}

# Enable versioning for audit trail
resource "azurerm_storage_account_management_policy" "audit" {
  storage_account_id = azurerm_storage_account.audit.id

  rule {
    name    = "DeleteOldVersions"
    enabled = false  # Never delete, just move to archive tier
    
    actions {
      version {
        delete_after_days_since_creation = 2555  # 7 years
      }
      
      snapshot {
        tier_to_archive_after_days_since_creation = 365
      }
    }

    filters {
      blob_types   = ["blockBlob"]
      prefix_match = ["audit/"]
    }
  }
}
```

---

## Incident Response Automation

**Alert Triage & Escalation (Python):**
```python
import asyncio
import httpx
from enum import Enum
from dataclasses import dataclass

class Severity(Enum):
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4

@dataclass
class SecurityAlert:
    id: str
    alert_name: str
    severity: Severity
    source_ip: str
    target_resource: str
    timestamp: str

class IncidentResponder:
    def __init__(self, siem_url: str, ticket_system_url: str):
        self.siem_url = siem_url
        self.ticket_system_url = ticket_system_url
        self.client = httpx.AsyncClient()
    
    async def triage_alert(self, alert: SecurityAlert) -> dict:
        """Enrich and prioritize alert"""
        
        # Check for false positive patterns
        is_false_positive = await self._check_false_positive(alert)
        if is_false_positive:
            alert.severity = Severity.LOW
            return {"status": "dismissed", "reason": "known_false_positive"}
        
        # Correlate with threat intelligence
        threat_info = await self._lookup_threat_intel(alert.source_ip)
        
        # Check for ongoing incidents
        related_incidents = await self._find_related_incidents(alert)
        
        return {
            "status": "triaged",
            "threat_intel": threat_info,
            "related_incidents": related_incidents,
            "recommended_action": self._recommend_action(alert)
        }
    
    async def escalate_critical(self, alert: SecurityAlert):
        """Escalate critical alerts"""
        if alert.severity != Severity.CRITICAL:
            return
        
        # Create incident ticket
        ticket = await self._create_ticket(alert)
        
        # Page on-call engineer
        await self._page_oncall(alert, ticket)
        
        # Isolate affected resource (optional)
        if alert.target_resource.startswith("prod-"):
            await self._isolate_resource(alert.target_resource)
        
        # Collect forensics
        forensics_job_id = await self._start_forensics_collection(alert)
        
        return {
            "ticket_id": ticket["id"],
            "forensics_job_id": forensics_job_id
        }
    
    async def _check_false_positive(self, alert: SecurityAlert) -> bool:
        """Check against known false positive patterns"""
        # Query historical alerts for similar patterns
        response = await self.client.get(
            f"{self.siem_url}/api/alerts",
            params={
                "alert_name": alert.alert_name,
                "dismissed": "true",
                "limit": 100
            }
        )
        historical = response.json()
        
        # If >80% of similar alerts were dismissed, likely false positive
        return len(historical) > 80
    
    async def _lookup_threat_intel(self, source_ip: str) -> dict:
        """Check IP against threat intelligence feeds"""
        # Call TI service (OSINT, feeds, etc.)
        response = await self.client.get(f"https://threat-intel.example.com/ip/{source_ip}")
        return response.json()
    
    async def _find_related_incidents(self, alert: SecurityAlert) -> list:
        """Correlate with other recent alerts"""
        response = await self.client.get(
            f"{self.siem_url}/api/incidents",
            params={
                "target_resource": alert.target_resource,
                "days": 7,
                "status": "open"
            }
        )
        return response.json()
    
    def _recommend_action(self, alert: SecurityAlert) -> str:
        """Recommend incident response action"""
        if alert.severity == Severity.CRITICAL:
            return "isolate_resource"
        elif alert.alert_name == "privilege_escalation":
            return "revoke_tokens"
        elif alert.alert_name == "data_exfiltration":
            return "block_network"
        return "investigate"

# Usage
async def main():
    responder = IncidentResponder(
        siem_url="https://siem.example.com",
        ticket_system_url="https://tickets.example.com"
    )
    
    alert = SecurityAlert(
        id="ALERT-12345",
        alert_name="Privilege escalation detected",
        severity=Severity.CRITICAL,
        source_ip="203.0.113.42",
        target_resource="prod-k8s-cluster",
        timestamp="2026-05-02T02:16:00Z"
    )
    
    triage_result = await responder.triage_alert(alert)
    print(f"Triage result: {triage_result}")
    
    escalation_result = await responder.escalate_critical(alert)
    print(f"Escalation result: {escalation_result}")

asyncio.run(main())
```

---

## Monitoring & Metrics

**Key SOC Metrics:**
```promql
# Alert response time
histogram_quantile(0.95,
  rate(alert_response_time_seconds[5m])
)

# False positive rate
sum(rate(alert_dismissed_false_positive[1d])) /
sum(rate(alert_total[1d]))

# Mean time to detect (MTTD)
avg(alert_time_to_escalation_seconds) / 60

# Patch compliance
count(system{patched="true", asset_criticality="high"}) /
count(system{asset_criticality="high"})

# Incident resolution rate
sum(rate(incident_resolved[1w])) /
sum(rate(incident_created[1w]))
```

---

## Security Operations Playbooks

### Brute Force Attack Playbook
1. Identify compromised account
2. Reset password
3. Revoke active sessions
4. Review access logs for lateral movement
5. Isolate workstations with successful logins
6. Notify user of incident

### Data Exfiltration Playbook
1. Isolate affected resource
2. Dump memory for forensics
3. Capture network traffic
4. Query data access logs for scope
5. Notify data owner
6. Escalate to incident management

---

## References

- [SANS Incident Handling](https://www.sans.org/incident-response/)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [CIS Controls](https://www.cisecurity.org/controls)
