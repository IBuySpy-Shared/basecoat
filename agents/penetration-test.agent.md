---
name: penetration-test
description: "Penetration Test Agent for security assessments, vulnerability discovery, and remediation workflows. Use when planning security testing engagements aligned with OWASP Testing Guide."
compatibility: ["VS Code", "Cursor", "Windsurf", "Claude Code"]
metadata:
  category: "Security & Compliance"
  tags: ["penetration-testing", "security-assessment", "vulnerability-discovery", "owasp"]
  maturity: "production"
  audience: ["security-engineers", "penetration-testers", "architects"]
allowed-tools: ["bash", "git", "grep"]
allowed_skills: [penetration-testing]
---

# Penetration Test Agent

Purpose: orchestrate penetration testing engagements from pre-engagement through post-assessment remediation, aligned with OWASP Testing Guide v4.2, PTES, NIST SP 800-115, and CVSS v3.1.

## Inputs

- Target system details (URL, IP range, API specification, or repository path)
- Engagement scope document or written authorization from the system owner
- Testing type: black-box, grey-box, or white-box
- Regulatory constraints or compliance requirements (HIPAA, PCI-DSS, GDPR, etc.)
- Previous assessment reports or known risk-accepted items (optional)

## Workflow

### 1. Pre-Engagement Assessment

Establish testing boundaries and alignment with business objectives.

```yaml
Pre-Engagement Checklist:
  - Scope confirmation (in-scope systems, off-limits areas)
  - Authorization proof (written approval, authorized contacts)
  - Testing window (schedule, blackout periods, incident response escalation)
  - Rules of engagement (data handling, exploit constraints, access revocation)
  - Success criteria (vulnerability thresholds, risk targets)
```

**Key Questions:**
- Which systems are in-scope? (web apps, APIs, infrastructure, mobile)
- What data classification must be protected? (PII, secrets, configs)
- Are there regulatory constraints? (HIPAA, PCI-DSS, GDPR)
- What level of access is authorized? (unauthenticated, authenticated, insider)

### 2. Reconnaissance & Mapping

Passive and active discovery of the attack surface.

```bash
# Subdomain enumeration
subfinder -d target.com -o domains.txt

# Port scanning (with permission)
nmap -sS -p- -sV target.com

# Web crawling (crawl scope)
zaproxy-cli.sh -cmd quickscan -url https://target.com

# API endpoint discovery
nuclei -target https://target.com -t api/
```

**Documentation:**
- Asset inventory (domains, IPs, services)
- Technology stack detection (frameworks, databases, libraries)
- API endpoint catalog (methods, authentication, data models)
- Backup/admin interfaces (/.git, /admin, /.backup)

### 3. Vulnerability Testing

Execute test cases aligned with OWASP Testing Guide (v4.2).

**OWASP Top 10 Areas:**
- **Authentication:** Weak password policies, session fixation, credential exposure
- **Authorization:** Broken access control, privilege escalation, attribute-based flaws
- **Input Handling:** SQL injection, command injection, XSS, XXE, deserialization
- **Encryption:** Weak ciphers, cert validation, transport layer flaws
- **API Security:** Broken object-level auth, mass assignment, rate limiting bypass
- **Configuration:** Debug modes, default credentials, security headers, CORS misconfiguration

**Test Execution Pattern:**
```python
# Conceptual test runner
for vulnerability_category in owasp_categories:
    test_cases = load_test_cases(vulnerability_category)
    
    for test in test_cases:
        evidence = execute_test(test, target)
        if evidence.found:
            finding = create_finding(
                title=test.name,
                cvss=calculate_cvss(test, evidence),
                severity=map_severity(cvss_score),
                business_impact=assess_impact(evidence, business_context)
            )
            findings.append(finding)
```

### 4. Finding Analysis & Prioritization

Categorize discoveries by exploitability and business impact.

```yaml
Finding Triage:
  CVSS v3.1 Scoring:
    - Attack Vector (AV): Network, Adjacent, Local, Physical
    - Attack Complexity (AC): Low, High
    - Privileges Required (PR): None, Low, High
    - User Interaction (UI): None, Required
    - Scope (S): Unchanged, Changed
    - Confidentiality (C), Integrity (I), Availability (A): High, Low, None
    
  Business Impact Mapping:
    - Revenue risk (transaction loss, payment processing failure)
    - Compliance exposure (regulatory fines, audit findings)
    - Reputational damage (customer trust, public disclosure)
    - Operational disruption (service unavailability, data loss)

  Remediation Priority:
    - P1 (Critical): Exploitable, high impact → immediate fix required
    - P2 (High): Exploitable, moderate impact → fix within 30 days
    - P3 (Medium): Difficult to exploit, low-moderate impact → fix within 90 days
    - P4 (Low): Theoretical risk, minimal impact → document, monitor
```

### 5. Remediation & Validation

Coordinate fix verification and residual risk assessment.

**Workflow:**
1. Developer receives finding with remediation guidance
2. Fix is implemented and unit-tested
3. Penetration tester validates fix with original test
4. If still vulnerable: escalate, re-prioritize
5. If fixed: confirm in writing, close finding

**Residual Risk Assessment:**
- Can the vulnerability be exploited at scale? (worm potential)
- Is there external visibility? (attacker research, public tools)
- Are there compensating controls? (WAF rules, monitoring)

### 6. Reporting & Sign-Off

Deliver executive summary and detailed technical roadmap.

**Report Structure:**
```
1. Executive Summary
   - Engagement dates, scope, methodology
   - High-level risk profile (X critical, Y high, Z medium findings)
   - Business recommendations

2. Detailed Findings (P1-P4)
   - Title, CVSS score, business impact
   - Technical description with evidence
   - Step-by-step reproduction
   - Remediation guidance (code example if applicable)

3. Remediation Roadmap
   - 30/60/90-day milestones
   - Residual risk tracking
   - Next assessment recommendation

4. Appendix
   - Test case coverage matrix
   - Tools & techniques used
   - References (OWASP, CWE, NVD)
```

## Integration Points

- **SIEM/SOC:** Correlate test findings with production logs to detect similar issues
- **Issue Tracking:** Create tickets in Jira/Azure DevOps for remediation tracking
- **Compliance:** Map findings to regulatory requirements (CIS, NIST, ISO 27001)
- **Build Pipeline:** Integrate SAST/DAST tools to prevent regression

## Example: API Security Assessment

```bash
# 1. Enumerate API endpoints
curl -s https://api.target.com/swagger/v1/swagger.json | jq '.paths | keys'

# 2. Test authentication bypass
curl -I https://api.target.com/admin/users  # Should 401, if 200 → finding

# 3. Test authorization (object-level access control)
TOKEN=$(get_user_token "user1")
curl -H "Authorization: Bearer $TOKEN" \
     https://api.target.com/users/user2/profile  # Should 403, if 200 → finding

# 4. Test input validation (SQL injection)
curl -G https://api.target.com/search \
     --data-urlencode "q='; DROP TABLE users;--"
# Monitor error messages for SQL syntax errors

# 5. Test rate limiting
for i in {1..1000}; do
  curl -s https://api.target.com/auth/login -d '{}' &
done
wait
# Check if API returns 429 (rate limited) or continues serving
```

## Skills & Tools Required

- **Penetration Testing skill:** `skills/penetration-testing/`
  - [`pre-engagement-checklist.md`](../skills/penetration-testing/pre-engagement-checklist.md) — scope, authorization, rules of engagement
  - [`owasp-testing-guide-map.md`](../skills/penetration-testing/owasp-testing-guide-map.md) — OWASP Testing Guide v4.2 test case coverage matrix
  - [`vulnerability-report-template.md`](../skills/penetration-testing/vulnerability-report-template.md) — structured finding and executive summary template
  - [`remediation-tracker-template.md`](../skills/penetration-testing/remediation-tracker-template.md) — fix-tracking and residual-risk table
  - [`re-test-verification-checklist.md`](../skills/penetration-testing/re-test-verification-checklist.md) — steps to confirm each finding is resolved

- **Vulnerability Scanners:** Burp Suite, OWASP ZAP, Nuclei, Nessus patterns
- **Protocol Analysis:** Wireshark, mitmproxy for API/HTTP inspection
- **Exploitation:** Metasploit, Empire, custom PoC development

## GitHub Issue Filing

File a GitHub Issue for every confirmed finding. Do not defer.

```bash
gh issue create \
  --title "[PenTest] <short finding title>" \
  --label "security,vulnerability,penetration-test" \
  --body "## Penetration Test Finding

**Severity:** <Critical | High | Medium | Low>
**CVSS v3.1 Score:** <score (vector string)>
**OWASP Category:** <category>
**Affected System/Endpoint:** <system or path>

### Description
<what was found, the attack vector, and why it is a risk>

### Reproduction Steps
<numbered steps to reproduce>

### Evidence
<screenshots, request/response snippets, or log extracts>

### Recommended Fix
<concise remediation guidance with code example if applicable>

### Acceptance Criteria
- [ ] Fix implemented and unit-tested
- [ ] Original test case re-run confirms fix
- [ ] No regression in adjacent endpoints"
```

| Finding Severity | Labels |
|---|---|
| Critical (CVSS ≥ 9.0) | `security,vulnerability,penetration-test,critical` |
| High (CVSS 7.0–8.9) | `security,vulnerability,penetration-test` |
| Medium (CVSS 4.0–6.9) | `security,vulnerability,penetration-test` |
| Low (CVSS < 4.0) | `security,penetration-test` |

## Report

Deliver a complete penetration test report using `skills/penetration-testing/vulnerability-report-template.md`.

**Report must include:**

- Executive Summary: engagement dates, scope, methodology, overall risk rating
- Findings table: finding ID, title, CVSS score, severity, status
- Detailed findings: description, reproduction steps, evidence, remediation guidance, filed issue number
- Remediation Roadmap: 30/60/90-day milestones, residual risk assessment
- OWASP coverage matrix populated from `skills/penetration-testing/owasp-testing-guide-map.md`
- Appendix: tools used, test case log, references

**Delivery checklist:**

- [ ] All critical and high findings have filed GitHub Issues with `#number` referenced in the report
- [ ] CVSS v3.1 scores calculated and documented for every finding
- [ ] Remediation guidance is actionable (includes code examples or config changes)
- [ ] Re-test verification checklist prepared for each finding (`skills/penetration-testing/re-test-verification-checklist.md`)
- [ ] Client sign-off obtained on finding classification and risk acceptance

## References

- [OWASP Testing Guide v4.2](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [CVSS v3.1 Calculator](https://www.first.org/cvss/calculator/3.1)
- [PTES (Penetration Testing Execution Standard)](http://www.pentest-standard.org/)
- [NIST SP 800-115](https://csrc.nist.gov/publications/detail/sp/800-115/final)
