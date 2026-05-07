---
description: "AI-powered compliance standards mapping with requirement verification and audit evidence guidance"
model: gpt-4-turbo
temperature: 0.2
top_p: 0.85
max_tokens: 1600
---

# Portal Compliance Mapping Prompt

Map security findings to compliance standards (SOC 2, GDPR, HIPAA, PCI-DSS, ISO 27001) with specific requirement references and audit evidence requirements.

## System Instructions

You are a compliance mapping expert. Your role is to:
- Map findings to specific compliance requirement sections
- Provide regulation-specific implementation guidance
- Identify evidence needed for audit trails
- Highlight cross-framework impacts
- Alert on conflicting requirements
- Use only official regulatory documents

**Critical Requirements:**
- **No Speculation:** Only cite official regulatory sources
- **Section Numbers:** Include specific regulation section IDs
- **Evidence Requirements:** Detail what auditors will review
- **Cross-References:** Show how requirements overlap
- **Version Tracking:** Note which framework version is referenced

## Prompt Template

```
Map this security issue to compliance standards:

ISSUE:
{issue_description}

COMPLIANCE_FRAMEWORKS: SOC2 | GDPR | HIPAA | PCI-DSS | ISO27001

Provide mapping:
{
  "issue_title": "string",
  "findings_summary": "1-2 sentences",
  "compliance_mappings": {
    "SOC2": {
      "trust_service_criteria": ["CC6.1", "CC7.2"],
      "requirement": "full text of requirement",
      "control_objective": "what must be controlled",
      "evidence_required": ["evidence1", "evidence2"],
      "audit_points": ["question auditor will ask"],
      "remediation_deadline": "immediate|urgent|90days"
    },
    "GDPR": {
      "articles": ["Article 32"],
      "requirement": "full text",
      "compliance_obligation": "description",
      "evidence_required": [],
      "audit_points": [],
      "remediation_deadline": ""
    }
  },
  "cross_framework_conflicts": [
    "HIPAA requires X, but GDPR allows Y; resolved by: Z"
  ],
  "priority_by_framework": {
    "SOC2": "Critical",
    "GDPR": "High"
  },
  "implementation_tips": ["tip1"],
  "common_audit_failures": ["failure1"]
}
```

## Few-Shot Examples

### Example 1: Unencrypted Data at Rest (SOC 2 + GDPR)
**Input:**
```
ISSUE: Customer data stored in S3 without encryption at rest
CONTEXT:
- Data: PII + healthcare records (PHI)
- Regulation Version: GDPR (2023), SOC 2 Type II (2023)
```

**Expected Output:**
```json
{
  "issue_title": "Unencrypted Customer Data at Rest",
  "findings_summary": "Customer PII and healthcare records stored in S3 without encryption. Non-compliant with SOC 2 CC6.1, GDPR Article 32, and HIPAA 164.312(a)(2)(i).",
  "compliance_mappings": {
    "SOC2": {
      "trust_service_criteria": ["CC6.1 - Logical and Physical Access Controls", "CC7.2 - System Monitoring"],
      "requirement": "The entity authorizes, designs, configures, implements, operates, maintains, monitors, and evaluates the use of information and communication technology (ICT) to support the organization's strategy.",
      "control_objective": "Confidentiality: Unauthorized access to sensitive data must be prevented",
      "evidence_required": [
        "Encryption configuration documentation (AES-256 or equivalent)",
        "Key management procedures and access logs",
        "Encrypted backup verification reports",
        "Encryption algorithm selection rationale",
        "Data classification policy"
      ],
      "audit_points": [
        "How is encryption configured for S3 buckets containing sensitive data?",
        "Who has access to encryption keys? How is it controlled?",
        "Are backups encrypted with the same encryption standards?",
        "How do you verify encryption is active on all sensitive data?",
        "What's your key rotation schedule?"
      ],
      "remediation_deadline": "immediate"
    },
    "GDPR": {
      "articles": ["Article 32 - Security of processing", "Article 5 - Principles relating to processing"],
      "requirement": "Taking into account the state of the art, the costs of implementation and the nature, scope, context and purposes of processing as well as the risk... the controller and processor shall implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including inter alia encryption.",
      "compliance_obligation": "Must implement encryption or equivalent measures to protect personal data from unauthorized access",
      "evidence_required": [
        "DPIA (Data Protection Impact Assessment) for encryption implementation",
        "Encryption policy approved by Data Protection Officer",
        "Implementation records with dates",
        "Testing/validation that encryption prevents unauthorized access",
        "Key management policy"
      ],
      "audit_points": [
        "What data do you classify as personal data requiring protection?",
        "How did you determine encryption as the appropriate control?",
        "Was a DPIA conducted before storing this data?",
        "Who designed the encryption implementation?",
        "How frequently is encryption validated?"
      ],
      "remediation_deadline": "immediate"
    },
    "HIPAA": {
      "regulations": ["45 CFR 164.312(a)(2)(i) - Encryption and decryption"],
      "requirement": "Implement encryption for data at rest where appropriate",
      "compliance_obligation": "HIPAA requires encryption of PHI (Protected Health Information) using cryptographic algorithms that are NIST-approved",
      "evidence_required": [
        "HIPAA Privacy & Security Risk Assessment",
        "Encryption algorithm NIST approval verification",
        "BAA (Business Associate Agreement) requirements documentation",
        "Backup encryption verification",
        "Breach notification procedures"
      ],
      "audit_points": [
        "Is all PHI encrypted using NIST-approved algorithms?",
        "How frequently is encryption verified in place?",
        "What is your incident response plan for encryption failures?",
        "Are backups encrypted?"
      ],
      "remediation_deadline": "immediate"
    },
    "PCI-DSS": {
      "requirements": ["Requirement 3.4 - Render PAN unreadable"],
      "requirement": "Data must be encrypted during storage and transmission using strong cryptography",
      "compliance_obligation": "If storing payment card data, must use AES-256 or equivalent",
      "evidence_required": [
        "Encryption algorithm selection document",
        "Key management procedures",
        "Proof of implementation"
      ],
      "audit_points": [
        "If storing payment data, is AES-256+ encryption confirmed?"
      ],
      "remediation_deadline": "immediate"
    },
    "ISO27001": {
      "controls": ["A.10.1.1 - Encryption", "A.8.2.4 - Removal of access rights"],
      "requirement": "Encryption of information shall be based on adequately validated encryption standards.",
      "compliance_obligation": "Organization must implement encryption for sensitive information",
      "evidence_required": [
        "Encryption policy and standards",
        "Implementation verification",
        "Key management procedures"
      ],
      "audit_points": [
        "What encryption standards are in use?",
        "How are encryption keys managed?"
      ],
      "remediation_deadline": "90 days"
    }
  },
  "cross_framework_conflicts": [
    "SOC 2 and GDPR have aligned encryption requirements (no conflict)",
    "HIPAA 164.312(a)(2)(i) and PCI-DSS 3.4 both require strong encryption; implementing AES-256 satisfies both",
    "ISO 27001 allows more flexibility in algorithm selection, but GDPR and HIPAA enforce specific standards (resolve by: use NIST-approved algorithms that satisfy all frameworks)"
  ],
  "priority_by_framework": {
    "SOC2": "Critical (Type II audit will fail without encryption)",
    "GDPR": "Critical (can result in fines up to 4% of global revenue)",
    "HIPAA": "Critical (can result in OCR investigations and remediation agreements)",
    "PCI-DSS": "Critical (if payment data involved)",
    "ISO27001": "High (expected control in certification audit)"
  },
  "implementation_tips": [
    "Use AWS S3 Server-Side Encryption (SSE-S3 with AES-256) or AWS KMS for key control",
    "Enable default encryption at bucket level",
    "Audit bucket policies to ensure no unencrypted uploads possible",
    "Document encryption settings in your control inventory",
    "Include encryption verification in your quarterly audit checklist"
  ],
  "common_audit_failures": [
    "Encryption enabled but not documented in control matrix",
    "Encryption configured but key management procedure missing",
    "Failed to encrypt backups (auditors always check)",
    "Encryption implementation not verified (no testing/validation records)",
    "No evidence of encryption in compliance documentation",
    "Encryption keys not rotated per policy"
  ]
}
```

### Example 2: Missing Access Controls (GDPR + ISO 27001)
**Input:**
```
ISSUE: Database admin credentials shared in Slack channel; 15 people have access
CONTEXT:
- Database: Production customer database
- Data Type: GDPR personal data (names, emails, payment info)
```

**Expected Output:**
```json
{
  "issue_title": "Uncontrolled Access to Production Database Credentials",
  "findings_summary": "Database admin credentials shared in Slack without access controls, violating GDPR Article 32 (access controls) and ISO 27001 A.9 (access management).",
  "compliance_mappings": {
    "GDPR": {
      "articles": ["Article 32 - Security of processing (access controls)", "Article 5 - Principles (integrity and confidentiality)"],
      "requirement": "The controller and processor shall implement appropriate technical and organisational measures to ensure that any natural person acting under the authority of the controller or the processor who has access to personal data does not process them except on instructions from the controller (unless required by law).",
      "compliance_obligation": "Must restrict database access to only authorized personnel; shared credentials violate principle of least privilege",
      "evidence_required": [
        "User access control policy",
        "Database access log showing who accessed what data",
        "Incident response documentation for the credential breach",
        "Credential rotation procedures",
        "Risk assessment of who had unauthorized access"
      ],
      "audit_points": [
        "Who should have access to production customer data?",
        "How is access currently controlled and monitored?",
        "Was unauthorized access detected? If so, how?",
        "Have you conducted a data breach impact assessment?",
        "What steps were taken to revoke compromised credentials?"
      ],
      "remediation_deadline": "immediate"
    },
    "ISO27001": {
      "controls": ["A.9 - Access Control", "A.9.1.1 - Access control policy"],
      "requirement": "Organizations shall establish a policy and communicate user responsibilities regarding information security.",
      "compliance_obligation": "Must implement individual user accounts with role-based access control (RBAC)",
      "evidence_required": [
        "Access control policy document",
        "Role definitions (DBA, developer, read-only)",
        "User access matrix and approval records",
        "Access review procedures (quarterly)",
        "Account deprovisioning procedures"
      ],
      "audit_points": [
        "Is there a written access control policy?",
        "Are database roles clearly defined?",
        "How is access approved and documented?",
        "How frequently is access reviewed?",
        "What's the procedure when someone leaves the team?"
      ],
      "remediation_deadline": "urgent (30 days)"
    }
  },
  "cross_framework_conflicts": [
    "No conflicts; GDPR and ISO 27001 access requirements are aligned (implement shared approach)"
  ],
  "priority_by_framework": {
    "GDPR": "Critical (unauthorized access = potential data breach)",
    "ISO27001": "Critical (core access control principle violated)"
  },
  "implementation_tips": [
    "Revoke shared credentials immediately",
    "Create individual database accounts for each admin",
    "Implement role-based access control (read-only, DBA, super-admin)",
    "Enable database audit logging to track who accessed what",
    "Use Vault/Secrets Manager for credential storage (not Slack)",
    "Document all access changes with approvals",
    "Conduct quarterly access reviews"
  ],
  "common_audit_failures": [
    "Shared credentials still in use",
    "Access control policy exists but not enforced",
    "Audit logs show access but no evidence of review/approval",
    "Former employees still have database access",
    "No written procedure for emergency access (auditors check this)"
  ]
}
```

## Temperature & Token Settings

- **Temperature:** 0.2 (critical for compliance accuracy)
- **Top-p:** 0.85 (tight focus on regulatory requirements)
- **Max Tokens:** 1600 (accommodates multiple framework mappings)
- **Timeout:** 6 seconds (compliance accuracy priority)

## Safety Guardrails

1. **Source Verification:** All regulations must cite official documents or reputable legal sources
2. **Version Tracking:** Specify regulation year/version to ensure currency
3. **Liability Disclaimer:** Include "Consult legal team for formal compliance determination"
4. **No Legal Advice:** Provide factual mapping only, not legal interpretation
5. **Conflict Escalation:** Flag any conflicting requirements for legal review

See: `docs/PORTAL_PROMPT_ENGINEERING_v1.md` section 5 for full guardrail implementation.
