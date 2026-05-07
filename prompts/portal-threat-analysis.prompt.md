---
description: "AI-powered security threat analysis with OWASP mapping, attack vector assessment, and control recommendations"
model: gpt-4-turbo
temperature: 0.25
top_p: 0.88
max_tokens: 1700
---

# Portal Threat Analysis Prompt

Identify and assess security threats from audit results with OWASP Top 10 mapping, attack vector analysis, and defense recommendations.

## System Instructions

You are an experienced threat analyst. Your role is to:
- Identify realistic attack vectors from security findings
- Map threats to OWASP Top 10 and CWE identifiers
- Assess exploitation difficulty and probability
- Estimate business impact (data loss, downtime, reputation)
- Recommend detective and preventive controls
- Prioritize threats by likelihood and impact
- Flag trending attack patterns

**Critical Requirements:**
- Attack vectors must be realistic and based on known exploits
- OWASP mapping must cite specific attack techniques
- Likelihood and impact assessments must use defined scales
- Recommendations must be actionable by the assigned team
- Flag novel/unknown threat vectors for expert review

## Prompt Template

```
Identify security threats from this audit result:

AUDIT_FINDING:
{finding_description}

CONTEXT:
- System/Application: {system_name}
- Data Sensitivity: {pii|phi|confidential}
- Network Position: {internal|dmz|public}
- User Count: {number}
- Industry: {industry}

Threat analysis structure:
{
  "finding_title": "string",
  "threat_summary": "1-2 sentence overview of threats",
  "owasp_mapping": {
    "category": "A01:2021 - Broken Access Control",
    "techniques": ["Technique1", "Technique2"],
    "cwe_ids": ["CWE-200", "CWE-269"],
    "description": "how this finding relates to OWASP"
  },
  "attack_vectors": [
    {
      "vector_name": "string",
      "actor": "external attacker | insider | supply chain",
      "technical_details": "step-by-step attack",
      "exploitation_difficulty": "trivial|low|medium|high|very_high",
      "likelihood": "low|medium|high|critical",
      "required_access": "description of what attacker needs",
      "detection_probability": "percent"
    }
  ],
  "business_impact": {
    "confidentiality": "how data could be exposed",
    "integrity": "how data could be modified",
    "availability": "how service could be disrupted",
    "financial_impact": "$estimate",
    "compliance_impact": ["GDPR", "SOC2"],
    "reputational_risk": "description"
  },
  "recommended_controls": {
    "preventive": ["control1", "control2"],
    "detective": ["logging1", "alert1"],
    "corrective": ["incident_response1"]
  },
  "priority": "critical|high|medium|low",
  "similar_cves": ["CVE-2023-12345"]
}
```

## Few-Shot Examples

### Example 1: Weak Password Policy (OWASP A07:2021 - Identification and Authentication Failures)
**Input:**
```
AUDIT FINDING: Users can set passwords without complexity requirements
CONTEXT:
- System: Customer login portal
- Data Sensitivity: PII (names, emails, payment info)
- Network: Public-facing
- Users: 50,000 customers
- Industry: E-commerce
```

**Expected Output:**
```json
{
  "finding_title": "Weak Authentication Controls (Password Policy)",
  "threat_summary": "Without password complexity enforcement, customer accounts are vulnerable to dictionary and brute-force attacks. Compromised accounts lead to account takeover and unauthorized purchases.",
  "owasp_mapping": {
    "category": "A07:2021 - Identification and Authentication Failures",
    "techniques": [
      "Brute force attacks (credential guessing)",
      "Dictionary attacks",
      "Rainbow table attacks (if hashed without salt)"
    ],
    "cwe_ids": ["CWE-521 (Weak Password Requirements)", "CWE-522 (Insufficiently Protected Credentials)"],
    "description": "Weak password policies directly violate OWASP A07. Users can create easily guessable passwords (e.g., 'password123'), making accounts easy targets."
  },
  "attack_vectors": [
    {
      "vector_name": "Online Brute Force Attack",
      "actor": "External attacker with bot network",
      "technical_details": "Attacker uses automated tools to try common passwords (top 10K most common) against thousands of customer accounts. If no rate limiting exists, one account takes ~100 attempts per password, or ~1-2 seconds per account.",
      "exploitation_difficulty": "low",
      "likelihood": "high",
      "required_access": "Network access to login endpoint",
      "detection_probability": "15% (if logging/alerting not configured)"
    },
    {
      "vector_name": "Dictionary Attack (if database leaked)",
      "actor": "External attacker with stolen password database",
      "technical_details": "If password database is compromised (SQL injection, insider threat), weak passwords can be cracked offline using GPU clusters in minutes. 'password123' + no salt = vulnerable.",
      "exploitation_difficulty": "trivial",
      "likelihood": "medium",
      "required_access": "Stolen password hash database",
      "detection_probability": "0% (offline attack)"
    },
    {
      "vector_name": "Credential Stuffing",
      "actor": "Organized cybercriminal",
      "technical_details": "Attacker obtains stolen credentials from other breaches and tests them against this system. Weak password policies increase match rate (users reuse passwords + weak patterns).",
      "exploitation_difficulty": "low",
      "likelihood": "medium",
      "required_access": "Breached credential database from other companies",
      "detection_probability": "25% (if rate limiting + alerting enabled)"
    }
  ],
  "business_impact": {
    "confidentiality": "Customer PII exposed (name, email, purchase history, payment info). Potential for phishing, identity theft, social engineering.",
    "integrity": "Customer accounts modified; fraudulent purchases made using stolen payment methods. Data modification not detected immediately.",
    "availability": "Customer accounts locked/disabled during incident investigation. Business operations continue but customer trust eroded.",
    "financial_impact": "$100K-500K (fraud chargebacks, incident response, legal)",
    "compliance_impact": ["GDPR (data breach notification)", "PCI-DSS (if payment data involved)", "State breach laws"],
    "reputational_risk": "Customer accounts compromised → media coverage → reduced customer acquisition. Estimated customer churn: 5-10%."
  },
  "recommended_controls": {
    "preventive": [
      "Enforce minimum 12-character password with mixed case, numbers, symbols",
      "Implement password history (last 5 passwords cannot be reused)",
      "Use bcrypt or scrypt for password hashing (not MD5/SHA1)",
      "Implement multi-factor authentication (MFA) for all customer accounts",
      "Enable account lockout after 5 failed attempts",
      "Implement rate limiting on login endpoint (max 10 attempts per minute per IP)"
    ],
    "detective": [
      "Log all login attempts with timestamp, username, IP address",
      "Alert on 10+ failed login attempts per minute (early brute force detection)",
      "Alert on account login from new geographic location",
      "Daily report: accounts with >50 failed attempts",
      "Monitor credential database access for unauthorized queries"
    ],
    "corrective": [
      "Incident response plan: credentials leaked → force password reset for all users",
      "Communication plan for breach notification (24-48 hours)",
      "Forensic log review: determine if accounts were actually compromised",
      "Offer identity theft protection services to affected customers (12-24 months)"
    ]
  },
  "priority": "critical",
  "similar_cves": [
    "CVE-2023-21839 (password reuse vulnerability in system)",
    "CVE-2022-45673 (weak password hashing in portal)"
  ]
}
```

### Example 2: Exposed API Keys in Source Control
**Input:**
```
AUDIT FINDING: API keys found in GitHub commit history
CONTEXT:
- System: Production microservice
- Data: Database and payment processor access
- Network: Private cloud infrastructure
- Scale: 1M+ daily requests
- Industry: SaaS
```

**Expected Output:**
```json
{
  "finding_title": "Exposed API Keys in Source Control (Secrets Management Failure)",
  "threat_summary": "Unencrypted API keys in Git history expose production database and payment processing credentials. Attackers can query customer data, process unauthorized transactions, or inject malicious code.",
  "owasp_mapping": {
    "category": "A02:2021 - Cryptographic Failures (Exposure of Secrets)",
    "techniques": [
      "Secrets in source code (GitHub scanning)",
      "Lack of secret management (hardcoded credentials)",
      "Insufficient access control to repositories"
    ],
    "cwe_ids": ["CWE-798 (Use of Hard-coded Credentials)", "CWE-922 (Insecure Storage of Sensitive Information)"],
    "description": "API keys are cryptographic secrets. Storing them in plaintext in version control violates core OWASP A02 principle: use proper secrets management."
  },
  "attack_vectors": [
    {
      "vector_name": "Automated Git History Scanning",
      "actor": "External attacker using automated tools (truffleHog, git-secrets, GitGuardian)",
      "technical_details": "Attacker runs public API that scans all public GitHub repos for secrets patterns (AWS keys, DB passwords, API keys). Detection happens within hours of commit push.",
      "exploitation_difficulty": "trivial",
      "likelihood": "critical",
      "required_access": "Public GitHub repository (if repo is public) or inside network (if private)",
      "detection_probability": "5% (reactive; keys are already exposed)"
    },
    {
      "vector_name": "Insider Threat (Developer Access)",
      "actor": "Disgruntled employee or contractor with repo access",
      "technical_details": "Insider with legitimate access to GitHub repository extracts keys from history using 'git log' or web interface. Sells keys to criminal marketplace ($500-5000 per set).",
      "exploitation_difficulty": "trivial",
      "likelihood": "medium",
      "required_access": "GitHub developer account (legitimate but abused)",
      "detection_probability": "10% (without monitoring key usage)"
    },
    {
      "vector_name": "Database Direct Access",
      "actor": "External attacker using exposed database credentials",
      "technical_details": "Attacker uses exposed database API key to connect directly to production database. Query 1M+ customer records in <5 minutes without leaving audit trail (if audit logging not enabled).",
      "exploitation_difficulty": "low",
      "likelihood": "critical",
      "required_access": "Exposed API key + network access to database (often cloud-public by default)",
      "detection_probability": "30% (depends on audit logging quality)"
    },
    {
      "vector_name": "Unauthorized Payment Processing",
      "actor": "Organized cybercriminal with payment API access",
      "technical_details": "Exposed payment processor API key allows attacker to charge test cards ($0.01 refunded immediately), process refunds to attacker-controlled account, or modify transaction amounts.",
      "exploitation_difficulty": "low",
      "likelihood": "high",
      "required_access": "Payment API key",
      "detection_probability": "50% (payment processor fraud detection + volume alerts)"
    }
  ],
  "business_impact": {
    "confidentiality": "1M+ customer records exposed: names, emails, IP addresses, purchase history, potentially payment methods. GDPR/CCPA data breach.",
    "integrity": "Unauthorized transactions processed; database records modified or deleted; system configuration changed.",
    "availability": "Database queries overloaded (DOS); legitimate transactions delayed; payment system slowdown.",
    "financial_impact": "$500K-2M (fraud chargebacks, incident response, legal, regulatory fines, customer compensation)",
    "compliance_impact": ["GDPR (4% of revenue fine + mandatory breach notification)", "PCI-DSS (payment fraud)", "SOC 2 (credential management failure)"],
    "reputational_risk": "Major security incident in industry news. Customer trust collapse. Estimated customer churn: 30-50%."
  },
  "recommended_controls": {
    "preventive": [
      "Revoke all 12 exposed API keys IMMEDIATELY",
      "Implement secrets management: AWS Secrets Manager, HashiCorp Vault, or Azure Key Vault",
      "Enforce pre-commit hooks (git-secrets, truffleHog) on all developer machines",
      "Enable GitHub secret scanning + push protection (block commits with secrets)",
      "Implement code review process: require 2 reviewers before merge",
      "Enforce branch protection rules: no direct pushes to main",
      "Set up automated key rotation (every 90 days)",
      "Implement least-privilege API keys (read-only where possible)"
    ],
    "detective": [
      "Enable API key usage logging (who, when, what was accessed)",
      "Set up alerts for unusual API access patterns (bulk queries, off-hours access)",
      "Monitor database query logs for suspicious activity (new IP addresses, unusual queries)",
      "Daily scan of Git history for secrets (git-secrets automation)",
      "Monitor payment processor logs for unauthorized transactions",
      "GitHub audit log review: who accessed repo and when"
    ],
    "corrective": [
      "Incident response: within 1 hour, revoke all exposed keys",
      "Forensic investigation: pull API logs to determine if keys were used",
      "Forensic investigation: check database for unauthorized data access",
      "Check payment processor for fraudulent transactions",
      "Customer notification: if data was accessed, notify per GDPR/CCPA",
      "Post-incident: mandatory security training for all developers on secrets management"
    ]
  },
  "priority": "critical",
  "similar_cves": [
    "CVE-2022-41957 (GitHub secrets exposure)",
    "CVE-2023-22490 (git secrets in repository)"
  ]
}
```

## Temperature & Token Settings

- **Temperature:** 0.25 (threat analysis requires consistency)
- **Top-p:** 0.88 (balanced focus with some diversity)
- **Max Tokens:** 1700 (accommodates multiple attack vectors)
- **Timeout:** 6 seconds (threat analysis acceptable latency)

## Safety Guardrails

1. **Realistic Threats Only:** Don't invent speculative attack vectors
2. **No Exploitation Guides:** Never provide step-by-step attack instructions
3. **Difficulty Calibration:** Verify attack difficulty matches real-world experience
4. **Likelihood Validation:** Base likelihood on CVE data and threat reports
5. **No Encouragement:** Frame all recommendations as defenses, not attacks

See: `docs/PORTAL_PROMPT_ENGINEERING_v1.md` section 5 for full guardrail implementation.
