---
name: security-operations
description: "Use when establishing or reviewing security operations infrastructure, detection patterns, secrets management, audit logging, and incident response workflows. Covers SIEM integration, threat detection, vulnerability scanning, and compliance automation."
compatibility: ["VS Code", "Cursor", "Windsurf", "Claude Code"]
metadata:
  category: "Security & Compliance"
  tags: ["security", "soc", "detection", "secrets", "audit", "threat-management", "incident-response"]
allowed-tools: ["bash", "terraform", "azure-cli", "kubernetes", "docker"]
---

# Security Operations Agent

Use this agent when designing, implementing, or auditing security operations infrastructure, including threat detection systems, secrets management, audit logging, vulnerability scanning, and incident response automation.

## Workflow

1. **Assessment** — Evaluate current security posture, identify gaps, and prioritize detections
2. **Detection Design** — Define threat models, detection rules, and alert thresholds
3. **Secrets Management** — Implement credential rotation, access controls, and audit logging
4. **Audit Infrastructure** — Set up centralized logging, log aggregation, and compliance reporting
5. **Incident Response** — Automate alert handling, escalation, and forensics
6. **Validation** — Test detection efficacy, false-positive rates, and incident workflows

---

## Core Responsibilities

### 1. Threat Detection & SIEM Integration

**Threat Model Definition:**
```yaml
threat-vectors:
  - external-reconnaissance:
      indicators: [port-scanning, dns-enumeration, certificate-transparency-logs]
      severity: LOW
      response: [monitor, log]
  
  - authentication-attacks:
      indicators: [brute-force, credential-stuffing, spray-attack]
      severity: HIGH
      response: [alert, block, escalate]
  
  - privilege-escalation:
      indicators: [sudo-abuse, rbac-misconfiguration, service-account-abuse]
      severity: CRITICAL
      response: [alert, revoke-tokens, isolate]
  
  - data-exfiltration:
      indicators: [unusual-data-access, bulk-export, api-rate-limit-bypass]
      severity: CRITICAL
      response: [alert, block, investigate]
```

**Azure Sentinel Detection Rule (KQL):**
```kusto
SecurityAlert
| where AlertSeverity >= "High"
| where ProviderName in ("Azure Active Directory Identity Protection", "Azure Advanced Threat Protection", "Office 365 Advanced Threat Protection")
| summarize AlertCount = count() by AlertName, TimeGenerated = bin(TimeGenerated, 1h)
| where AlertCount > 10
| project TimeGenerated, AlertName, AlertCount, Severity = "INVESTIGATE"
```

**AWS CloudWatch Detection (EventBridge Rule):**
```json
{
  "Name": "Detect-Root-Account-Activity",
  "EventPattern": {
    "detail": {
      "userIdentity": {
        "type": ["Root"],
        "invokedBy": {
          "exists": false
        }
      },
      "eventName": [
        "PutUserPolicy",
        "PutRolePolicy",
        "CreateAccessKey",
        "DeleteAccessKey"
      ]
    }
  },
  "State": "ENABLED",
  "Targets": [
    {
      "Arn": "arn:aws:sns:us-east-1:111111111111:SecurityAlerts",
      "RoleArn": "arn:aws:iam::111111111111:role/EventBridgeRole"
    }
  ]
}
```

### 2. Secrets Management & Rotation

**Automated Credential Rotation (Azure Automation):**
```powershell
# Runbook: Rotate-StorageAccountKey
param(
    [string]$ResourceGroupName,
    [string]$StorageAccountName
)

# Connect to Azure
$conn = Get-AutomationConnection -Name "AzureRunAsConnection"
Connect-AzAccount -ServicePrincipal -Tenant $conn.TenantID `
    -ApplicationId $conn.ApplicationID -CertificateThumbprint $conn.CertificateThumbprint

# Rotate storage account key
$storageAccount = Get-AzStorageAccount -ResourceGroupName $ResourceGroupName -Name $StorageAccountName
$newKey = New-AzStorageAccountKey -ResourceGroupName $ResourceGroupName `
    -StorageAccountName $StorageAccountName -KeyName Secondary

# Update Key Vault secret
$secret = Get-AzKeyVaultSecret -VaultName "kv-secrets" -Name "storage-key"
$newSecret = Set-AzKeyVaultSecret -VaultName "kv-secrets" -Name "storage-key" `
    -SecretValue (ConvertTo-SecureString -AsPlainText -Force -String $newKey.Value)

# Log rotation event
Write-Output "Storage account key rotated: $StorageAccountName - $($newSecret.Id)"

# Notify SOC
Send-AzureLogAnalyticsAlert -Severity "INFORMATIONAL" `
    -AlertMessage "Credential rotation completed: $StorageAccountName"
```

**Kubernetes Secret Rotation (External Secrets Operator):**
```yaml
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: azure-secrets
spec:
  provider:
    azure:
      vaultUrl: "https://my-vault.vault.azure.net"
      auth:
        workloadIdentity:
          serviceAccountRef:
            name: external-secrets-sa

---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: app-credentials
  annotations:
    replicaof.external-secrets.io/sync-interval: "24h"  # Rotate daily
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: azure-secrets
    kind: SecretStore
  target:
    name: app-secret
    creationPolicy: Owner
  data:
    - secretKey: db-password
      remoteRef:
        key: db-password
```

### 3. Audit Logging & Compliance

**Centralized Log Collection (Fluent Bit Configuration):**
```ini
[SERVICE]
    Daemon off
    Log_Level info
    Parsers_File parsers.conf

[INPUT]
    Name tail
    Path /var/log/auth.log
    Parser syslog
    Tag host.auth
    Refresh_Interval 5
    Skip_Long_Lines On
    DB /var/lib/fluent-bit/pos/auth.log.db

[INPUT]
    Name kubernetes
    Tag kube.*
    Refresh_Interval 10
    Keep_Log On

[INPUT]
    Name syslog
    Listen 0.0.0.0
    Port 5140
    Parser syslog
    Tag syslog

[FILTER]
    Name nest
    Match *
    Operation lift
    Nested_under kubernetes
    Add_prefix k8s_

[OUTPUT]
    Name azure_blob
    Match *
    account_name myaccount
    container_name audit-logs
    path audit/%Y/%m/%d/
    auto_create_container On
```

**Audit Event Schema (JSON):**
```json
{
  "timestamp": "2026-05-02T02:16:00Z",
  "source_ip": "203.0.113.42",
  "source_system": "kubernetes-api",
  "event_type": "authorization",
  "subject": {
    "user": "service-account:workload",
    "groups": ["system:authenticated", "app-namespace"],
    "uid": "system:serviceaccount:app-namespace:workload-sa"
  },
  "action": {
    "verb": "create",
    "resource": "pods",
    "namespace": "app-namespace",
    "result": "success"
  },
  "details": {
    "pod_name": "api-worker-xyz",
    "container_image": "registry.example.com/api:v1.2.3@sha256:abcd1234...",
    "privileged": false,
    "request_duration_ms": 145
  },
  "compliance_tags": ["PCI-DSS-3.1", "SOC2-CC7.1"],
  "sensitivity": "internal"
}
```

### 4. Vulnerability Scanning & Management

**Automated Vulnerability Scanning (Trivy in CI/CD):**
```yaml
# .github/workflows/container-security-scan.yml
name: Container Security Scan

on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build container image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          format: sarif
          output: trivy-results.sarif
          severity: HIGH,CRITICAL

      - name: Upload scan results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: trivy-results.sarif

      - name: Fail if critical vulnerabilities found
        run: |
          if grep -q '"level": "CRITICAL"' trivy-results.sarif; then
            echo "Critical vulnerabilities detected!"
            exit 1
          fi
```

**Infrastructure-as-Code Scanning (Checkov):**
```yaml
# Pre-commit hook
- repo: https://github.com/bridgecrewio/checkov.pre-commit
  rev: 3.1.0
  hooks:
    - id: checkov
      name: Checkov
      entry: checkov.main
      language: python
      types: [terraform, json, yaml]
      args: [--framework, terraform, --skip-check, CKV_AWS_1]
```

### 5. Incident Response Automation

**Alert Escalation Workflow (Azure Logic Apps):**
```json
{
  "definition": {
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "actions": {
      "Condition_Severity": {
        "type": "Switch",
        "expression": "@body('Parse_Alert')?['severity']",
        "cases": {
          "CRITICAL": {
            "actions": {
              "Page_On_Call": {
                "type": "ApiConnection",
                "inputs": {
                  "host": {
                    "connection": {
                      "name": "@parameters('$connections')['pagerduty']['connectionId']"
                    }
                  },
                  "method": "post",
                  "body": {
                    "incident": {
                      "type": "incident",
                      "title": "@body('Parse_Alert')?['alert_name']",
                      "service": {
                        "id": "P123ABC",
                        "type": "service_reference"
                      },
                      "urgency": "high"
                    }
                  }
                }
              },
              "Notify_Security_Channel": {
                "type": "ApiConnection",
                "inputs": {
                  "host": {
                    "connection": {
                      "name": "@parameters('$connections')['slack']['connectionId']"
                    }
                  },
                  "method": "post",
                  "body": {
                    "text": "🚨 CRITICAL SECURITY ALERT:\n@body('Parse_Alert')?['alert_name']\nDetails: @body('Parse_Alert')?['details']"
                  }
                }
              }
            }
          },
          "HIGH": {
            "actions": {
              "Create_Jira_Issue": {
                "type": "ApiConnection",
                "inputs": {
                  "method": "post",
                  "body": {
                    "fields": {
                      "project": { "key": "SEC" },
                      "issuetype": { "name": "Security Alert" },
                      "summary": "@body('Parse_Alert')?['alert_name']",
                      "priority": { "name": "High" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

**Forensics Collection (On-Demand):**
```bash
#!/bin/bash
# forensics-collect.sh — Collect evidence from compromised system

INCIDENT_ID="$1"
EVIDENCE_DIR="/evidence/$INCIDENT_ID"

mkdir -p "$EVIDENCE_DIR"

# Memory dump
echo "Collecting memory dump..."
sudo dd if=/dev/mem of="$EVIDENCE_DIR/memory.dump" bs=1M status=progress

# Network connections
echo "Collecting network state..."
sudo netstat -anp > "$EVIDENCE_DIR/netstat.txt"
sudo iptables -L -n > "$EVIDENCE_DIR/iptables.txt"

# Running processes
echo "Collecting process tree..."
ps auxww > "$EVIDENCE_DIR/processes.txt"
lsof -i -P -n > "$EVIDENCE_DIR/open_files.txt"

# File system changes
echo "Collecting file metadata..."
find /home /opt /srv -type f -newermt "-24 hours" -ls > "$EVIDENCE_DIR/recent_files.txt"

# Audit logs
echo "Collecting audit logs..."
sudo ausearch -ts recent > "$EVIDENCE_DIR/audit.log"

# Package integrity
echo "Verifying package integrity..."
debsums -c > "$EVIDENCE_DIR/package_integrity.txt" 2>&1

# Hash evidence
echo "Creating evidence chain of custody..."
tar czf "$EVIDENCE_DIR.tar.gz" "$EVIDENCE_DIR"
sha256sum "$EVIDENCE_DIR.tar.gz" > "$EVIDENCE_DIR.sha256"

echo "Forensics collection complete: $EVIDENCE_DIR"
```

### 6. Compliance Reporting

**Automated Compliance Dashboard (Azure Monitor Workbook):**
```json
{
  "version": "Notebook/1.0",
  "items": [
    {
      "type": 1,
      "content": {
        "json": "# Security Compliance Report\n_Last updated: {time_}_ "
      }
    },
    {
      "type": 3,
      "content": {
        "version": "KqlItem/1.0",
        "query": "SecurityAlert\n| where TimeGenerated > ago(7d)\n| summarize Count=count(), HighSeverity=countif(AlertSeverity >= 'High') by AlertSeverity\n| render columnchart",
        "size": 1,
        "queryType": 8,
        "resourceType": "microsoft.operationalinsights/workspaces",
        "title": "Alerts by Severity (7d)"
      }
    },
    {
      "type": 3,
      "content": {
        "version": "KqlItem/1.0",
        "query": "AuditLogs\n| where TimeGenerated > ago(30d)\n| where Category == 'RoleManagement'\n| summarize Count=count() by Result\n| render piechart",
        "title": "Role Changes (30d)"
      }
    }
  ]
}
```

---

## Security Operations Checklist

- [ ] **Detection Rules**
  - [ ] Brute force detection (failed login attempts)
  - [ ] Privilege escalation detection (sudo abuse, role changes)
  - [ ] Data exfiltration detection (unusual data access patterns)
  - [ ] Malware/vulnerability detection (file integrity monitoring)

- [ ] **Secrets Management**
  - [ ] Credential rotation automation (keys, passwords, tokens)
  - [ ] Access logging for all secret reads/writes
  - [ ] Alert on unusual secret access
  - [ ] Revocation of compromised credentials

- [ ] **Audit Logging**
  - [ ] Centralized log collection from all systems
  - [ ] Tamper-proof audit trail (immutable storage)
  - [ ] Long-term retention (7+ years for compliance)
  - [ ] Real-time alerting on critical events

- [ ] **Incident Response**
  - [ ] Automated alert triage and enrichment
  - [ ] Escalation workflows for critical incidents
  - [ ] Forensics collection automation
  - [ ] Post-incident review process

- [ ] **Vulnerability Management**
  - [ ] Automated scanning (container images, IaC, dependencies)
  - [ ] Inventory of all components and versions
  - [ ] Patch schedule and tracking
  - [ ] Exploit prediction and prioritization

- [ ] **Compliance**
  - [ ] Automated policy enforcement
  - [ ] Evidence collection for audits
  - [ ] Regulatory reporting (SOC 2, PCI-DSS, ISO 27001)
  - [ ] Annual control testing

---

## Metrics & KPIs

| Metric | Target | Frequency |
|--------|--------|-----------|
| **MTTD** (Mean Time To Detect) | <15 min | Real-time |
| **MTTR** (Mean Time To Respond) | <60 min | Real-time |
| **Alert Accuracy** | >95% (low false positive) | Daily |
| **Patch Compliance** | >95% within 30 days | Weekly |
| **Audit Log Retention** | 100% with zero loss | Daily |
| **Vulnerability Resolution** | Critical in 24h, High in 7d | Weekly |

---

## References

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CIS Controls](https://www.cisecurity.org/controls)
- [OWASP Security Operations](https://owasp.org/www-project-secure-ops/)
- [Azure Security Best Practices](https://learn.microsoft.com/azure/security/fundamentals/best-practices-and-patterns)
