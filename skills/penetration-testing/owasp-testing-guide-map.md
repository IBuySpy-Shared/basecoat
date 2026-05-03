# OWASP Testing Guide Map

Reference matrix mapping OWASP Testing Guide v4.2 test cases to their category, test ID, and execution status. Use this during the vulnerability testing phase to track coverage.

---

## Coverage Summary

| Category | Total Tests | Executed | Passed | Findings |
|----------|-------------|----------|--------|----------|
| OTG-INFO (Information Gathering) | 10 | | | |
| OTG-CONFIG (Configuration) | 12 | | | |
| OTG-IDENT (Identity Management) | 5 | | | |
| OTG-AUTHN (Authentication) | 10 | | | |
| OTG-AUTHZ (Authorization) | 4 | | | |
| OTG-SESS (Session Management) | 8 | | | |
| OTG-INPVAL (Input Validation) | 19 | | | |
| OTG-ERR (Error Handling) | 2 | | | |
| OTG-CRYPST (Cryptography) | 4 | | | |
| OTG-BUSLOGIC (Business Logic) | 9 | | | |
| OTG-CLIENT (Client-Side Testing) | 12 | | | |
| OTG-API (API Testing) | 6 | | | |
| **Total** | **101** | | | |

---

## OTG-INFO — Information Gathering

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-INFO-001 | Conduct Search Engine Discovery | ☐ Not Run | | |
| OTG-INFO-002 | Fingerprint Web Server | ☐ Not Run | | |
| OTG-INFO-003 | Review Webserver Metafiles | ☐ Not Run | | |
| OTG-INFO-004 | Enumerate Application on Web Server | ☐ Not Run | | |
| OTG-INFO-005 | Review Web Page Content | ☐ Not Run | | |
| OTG-INFO-006 | Identify Application Entry Points | ☐ Not Run | | |
| OTG-INFO-007 | Map Execution Paths Through Application | ☐ Not Run | | |
| OTG-INFO-008 | Fingerprint Web Application Framework | ☐ Not Run | | |
| OTG-INFO-009 | Fingerprint Web Application | ☐ Not Run | | |
| OTG-INFO-010 | Map Application Architecture | ☐ Not Run | | |

---

## OTG-CONFIG — Configuration and Deployment Management Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-CONFIG-001 | Test Network/Infrastructure Configuration | ☐ Not Run | | |
| OTG-CONFIG-002 | Test Application Platform Configuration | ☐ Not Run | | |
| OTG-CONFIG-003 | Test File Extension Handling | ☐ Not Run | | |
| OTG-CONFIG-004 | Review Old/Backup/Unreferenced Files | ☐ Not Run | | |
| OTG-CONFIG-005 | Enumerate Infrastructure and Application Admin Interfaces | ☐ Not Run | | |
| OTG-CONFIG-006 | Test HTTP Methods | ☐ Not Run | | |
| OTG-CONFIG-007 | Test HTTP Strict Transport Security | ☐ Not Run | | |
| OTG-CONFIG-008 | Test RIA Cross Domain Policy | ☐ Not Run | | |
| OTG-CONFIG-009 | Test File Permission | ☐ Not Run | | |
| OTG-CONFIG-010 | Test for Subdomain Takeover | ☐ Not Run | | |
| OTG-CONFIG-011 | Test Cloud Storage | ☐ Not Run | | |
| OTG-CONFIG-012 | Test for Content Security Policy | ☐ Not Run | | |

---

## OTG-IDENT — Identity Management Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-IDENT-001 | Test Role Definitions | ☐ Not Run | | |
| OTG-IDENT-002 | Test User Registration Process | ☐ Not Run | | |
| OTG-IDENT-003 | Test Account Provisioning Process | ☐ Not Run | | |
| OTG-IDENT-004 | Testing for Account Enumeration and Guessable User Account | ☐ Not Run | | |
| OTG-IDENT-005 | Testing for Weak or Unenforced Username Policy | ☐ Not Run | | |

---

## OTG-AUTHN — Authentication Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-AUTHN-001 | Testing for Credentials Transported over an Encrypted Channel | ☐ Not Run | | |
| OTG-AUTHN-002 | Testing for Default Credentials | ☐ Not Run | | |
| OTG-AUTHN-003 | Testing for Weak Lock Out Mechanism | ☐ Not Run | | |
| OTG-AUTHN-004 | Testing for Bypassing Authentication Schema | ☐ Not Run | | |
| OTG-AUTHN-005 | Testing for Vulnerable Remember Password | ☐ Not Run | | |
| OTG-AUTHN-006 | Testing for Browser Cache Weaknesses | ☐ Not Run | | |
| OTG-AUTHN-007 | Testing for Weak Password Policy | ☐ Not Run | | |
| OTG-AUTHN-008 | Testing for Weak Security Question/Answer | ☐ Not Run | | |
| OTG-AUTHN-009 | Testing for Weak Password Change or Reset Functionalities | ☐ Not Run | | |
| OTG-AUTHN-010 | Testing for Weaker Authentication in Alternative Channel | ☐ Not Run | | |

---

## OTG-AUTHZ — Authorization Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-AUTHZ-001 | Testing Directory Traversal/File Include | ☐ Not Run | | |
| OTG-AUTHZ-002 | Testing for Bypassing Authorization Schema | ☐ Not Run | | |
| OTG-AUTHZ-003 | Testing for Privilege Escalation | ☐ Not Run | | |
| OTG-AUTHZ-004 | Testing for Insecure Direct Object References (IDOR) | ☐ Not Run | | |

---

## OTG-SESS — Session Management Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-SESS-001 | Testing for Session Management Schema | ☐ Not Run | | |
| OTG-SESS-002 | Testing for Cookies Attributes | ☐ Not Run | | |
| OTG-SESS-003 | Testing for Session Fixation | ☐ Not Run | | |
| OTG-SESS-004 | Testing for Exposed Session Variables | ☐ Not Run | | |
| OTG-SESS-005 | Testing for Cross Site Request Forgery (CSRF) | ☐ Not Run | | |
| OTG-SESS-006 | Testing for Logout Functionality | ☐ Not Run | | |
| OTG-SESS-007 | Testing Session Timeout | ☐ Not Run | | |
| OTG-SESS-008 | Testing for Session Puzzling | ☐ Not Run | | |

---

## OTG-INPVAL — Input Validation Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-INPVAL-001 | Testing for Reflected Cross Site Scripting (XSS) | ☐ Not Run | | |
| OTG-INPVAL-002 | Testing for Stored Cross Site Scripting | ☐ Not Run | | |
| OTG-INPVAL-003 | Testing for HTTP Verb Tampering | ☐ Not Run | | |
| OTG-INPVAL-004 | Testing for HTTP Parameter Pollution | ☐ Not Run | | |
| OTG-INPVAL-005 | Testing for SQL Injection | ☐ Not Run | | |
| OTG-INPVAL-006 | Testing for LDAP Injection | ☐ Not Run | | |
| OTG-INPVAL-007 | Testing for XML Injection | ☐ Not Run | | |
| OTG-INPVAL-008 | Testing for SSI Injection | ☐ Not Run | | |
| OTG-INPVAL-009 | Testing for XPath Injection | ☐ Not Run | | |
| OTG-INPVAL-010 | Testing for IMAP/SMTP Injection | ☐ Not Run | | |
| OTG-INPVAL-011 | Testing for Code Injection | ☐ Not Run | | |
| OTG-INPVAL-012 | Testing for Command Injection (OS) | ☐ Not Run | | |
| OTG-INPVAL-013 | Testing for Buffer Overflow | ☐ Not Run | | |
| OTG-INPVAL-014 | Testing for Incubated Vulnerability | ☐ Not Run | | |
| OTG-INPVAL-015 | Testing for HTTP Splitting/Smuggling | ☐ Not Run | | |
| OTG-INPVAL-016 | Testing for HTTP Incoming Requests | ☐ Not Run | | |
| OTG-INPVAL-017 | Testing for Host Header Injection | ☐ Not Run | | |
| OTG-INPVAL-018 | Testing for Server-side Template Injection (SSTI) | ☐ Not Run | | |
| OTG-INPVAL-019 | Testing for Server-Side Request Forgery (SSRF) | ☐ Not Run | | |

---

## OTG-ERR — Error Handling

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-ERR-001 | Testing for Improper Error Handling | ☐ Not Run | | |
| OTG-ERR-002 | Testing for Stack Traces | ☐ Not Run | | |

---

## OTG-CRYPST — Cryptography Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-CRYPST-001 | Testing for Weak Transport Layer Security | ☐ Not Run | | |
| OTG-CRYPST-002 | Testing for Padding Oracle | ☐ Not Run | | |
| OTG-CRYPST-003 | Testing for Sensitive Information Sent via Unencrypted Channels | ☐ Not Run | | |
| OTG-CRYPST-004 | Testing for Weak Encryption | ☐ Not Run | | |

---

## OTG-BUSLOGIC — Business Logic Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-BUSLOGIC-001 | Test Business Logic Data Validation | ☐ Not Run | | |
| OTG-BUSLOGIC-002 | Test Ability to Forge Requests | ☐ Not Run | | |
| OTG-BUSLOGIC-003 | Test Integrity Checks | ☐ Not Run | | |
| OTG-BUSLOGIC-004 | Test for Process Timing | ☐ Not Run | | |
| OTG-BUSLOGIC-005 | Test Number of Times a Function Can Be Used Limits | ☐ Not Run | | |
| OTG-BUSLOGIC-006 | Testing for the Circumvention of Work Flows | ☐ Not Run | | |
| OTG-BUSLOGIC-007 | Test Defenses Against Application Mis-use | ☐ Not Run | | |
| OTG-BUSLOGIC-008 | Test Upload of Unexpected File Types | ☐ Not Run | | |
| OTG-BUSLOGIC-009 | Test Upload of Malicious Files | ☐ Not Run | | |

---

## OTG-CLIENT — Client-Side Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-CLIENT-001 | Testing for DOM-based Cross Site Scripting | ☐ Not Run | | |
| OTG-CLIENT-002 | Testing for JavaScript Execution | ☐ Not Run | | |
| OTG-CLIENT-003 | Testing for HTML Injection | ☐ Not Run | | |
| OTG-CLIENT-004 | Testing for Client Side URL Redirect | ☐ Not Run | | |
| OTG-CLIENT-005 | Testing for CSS Injection | ☐ Not Run | | |
| OTG-CLIENT-006 | Testing for Client Side Resource Manipulation | ☐ Not Run | | |
| OTG-CLIENT-007 | Test Cross Origin Resource Sharing | ☐ Not Run | | |
| OTG-CLIENT-008 | Testing for Cross Site Flashing | ☐ Not Run | | |
| OTG-CLIENT-009 | Testing for Clickjacking | ☐ Not Run | | |
| OTG-CLIENT-010 | Testing WebSockets | ☐ Not Run | | |
| OTG-CLIENT-011 | Test Web Messaging | ☐ Not Run | | |
| OTG-CLIENT-012 | Testing Browser Storage | ☐ Not Run | | |

---

## OTG-API — API Testing

| Test ID | Test Name | Status | Finding ID | Notes |
|---------|-----------|--------|------------|-------|
| OTG-API-001 | Testing GraphQL | ☐ Not Run | | |
| OTG-API-002 | Testing REST API Authorization | ☐ Not Run | | |
| OTG-API-003 | Testing for Mass Assignment | ☐ Not Run | | |
| OTG-API-004 | Testing Rate Limiting | ☐ Not Run | | |
| OTG-API-005 | Testing JWT Implementation | ☐ Not Run | | |
| OTG-API-006 | Testing OAuth 2.0 Misconfiguration | ☐ Not Run | | |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ☐ Not Run | Test not yet executed |
| ✅ Pass | Executed, no finding |
| ⚠️ Finding | Executed, vulnerability confirmed |
| N/A | Not applicable to this engagement |

---

## References

- [OWASP Web Security Testing Guide v4.2](https://owasp.org/www-project-web-security-testing-guide/v42/)
- [OWASP Testing Guide GitHub](https://github.com/OWASP/wstg)
