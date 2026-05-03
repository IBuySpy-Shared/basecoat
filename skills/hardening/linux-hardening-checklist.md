# Linux Hardening Checklist

**Benchmark:** CIS Linux Benchmark / DISA STIG (select applicable)
**Reviewer:**
**Date:**
**Host / Image:**
**OS and version:**

## Scoring Key

- ✅ Pass — control is satisfied
- ❌ Fail (L1) — CIS Level 1 / CAT I: blocking finding
- ⚠️ Fail (L2) — CIS Level 2 / CAT II: advisory finding
- N/A — not applicable

---

## SSH Hardening

| ID | Control | Status | Notes |
|---|---|---|---|
| SSH-1 | `PermitRootLogin no` is set in `/etc/ssh/sshd_config` | | |
| SSH-2 | `PasswordAuthentication no` is set (key-based auth only) | | |
| SSH-3 | `PermitEmptyPasswords no` is set | | |
| SSH-4 | SSH Protocol version 2 only (`Protocol 2`) | | |
| SSH-5 | Allowed ciphers are restricted (no arcfour, 3DES, blowfish) | | |
| SSH-6 | Allowed MACs are restricted (no MD5, SHA1 HMACs) | | |
| SSH-7 | `MaxAuthTries` is set to 4 or fewer | | |
| SSH-8 | `LoginGraceTime` is set to 60 or fewer | | |
| SSH-9 | SSH banner is configured (`/etc/issue.net`) | | |
| SSH-10 | SSH access is restricted via `AllowUsers` or `AllowGroups` | | |

## Kernel and sysctl Hardening

| ID | Control | Status | Notes |
|---|---|---|---|
| SYS-1 | `net.ipv4.ip_forward = 0` (unless host is a router/load balancer) | | |
| SYS-2 | `net.ipv4.conf.all.accept_redirects = 0` | | |
| SYS-3 | `net.ipv4.conf.all.send_redirects = 0` | | |
| SYS-4 | `net.ipv4.tcp_syncookies = 1` (SYN flood protection) | | |
| SYS-5 | `net.ipv4.conf.all.rp_filter = 1` (reverse path filtering) | | |
| SYS-6 | `kernel.randomize_va_space = 2` (ASLR enabled) | | |
| SYS-7 | `fs.suid_dumpable = 0` (SUID core dumps disabled) | | |
| SYS-8 | `kernel.dmesg_restrict = 1` | | |
| SYS-9 | IPv6 is disabled if not used (`net.ipv6.conf.all.disable_ipv6 = 1`) | | |

## User and Access Control

| ID | Control | Status | Notes |
|---|---|---|---|
| USR-1 | Root account password is locked (no direct root login) | | |
| USR-2 | All accounts have passwords (no blank passwords) | | |
| USR-3 | Password complexity policy is enforced (PAM / `pwquality`) | | |
| USR-4 | Password expiry is configured (90 days or as required) | | |
| USR-5 | `sudo` is configured with least privilege (`/etc/sudoers`) | | |
| USR-6 | `NOPASSWD` sudo entries are documented exceptions | | |
| USR-7 | Inactive accounts are disabled or removed | | |
| USR-8 | `umask` is set to 027 or more restrictive | | |

## Auditing and Logging

| ID | Control | Status | Notes |
|---|---|---|---|
| AUD-1 | `auditd` is installed and running | | |
| AUD-2 | `auditd` rules capture privileged command execution | | |
| AUD-3 | `auditd` rules capture file access modifications to `/etc/passwd`, `/etc/shadow` | | |
| AUD-4 | `auditd` rules capture login events and authentication failures | | |
| AUD-5 | Audit logs are sent to a centralized log management system | | |
| AUD-6 | `rsyslog` or `journald` forwarding is configured | | |
| AUD-7 | Log retention meets compliance requirements (90+ days) | | |

## Services and Packages

| ID | Control | Status | Notes |
|---|---|---|---|
| SVC-1 | Unnecessary services are disabled and removed (telnet, rsh, rlogin, ftp) | | |
| SVC-2 | Firewall (iptables / nftables / firewalld) is running and configured | | |
| SVC-3 | Only required ports are open; default-deny egress is configured | | |
| SVC-4 | Package manager is configured to use trusted, authenticated repositories | | |
| SVC-5 | Automatic security updates are enabled (or a patching policy is enforced) | | |
| SVC-6 | `xinetd` and legacy services are removed | | |

## File System and Permissions

| ID | Control | Status | Notes |
|---|---|---|---|
| FS-1 | `/tmp` is mounted with `noexec,nosuid,nodev` | | |
| FS-2 | `/var/tmp` is mounted with `noexec,nosuid,nodev` | | |
| FS-3 | Sticky bit is set on all world-writable directories | | |
| FS-4 | No world-writable files exist outside of designated directories | | |
| FS-5 | SUID/SGID files are reviewed and documented | | |

## Summary

| Category | Pass | Fail | N/A | Score |
|---|---|---|---|---|
| SSH | | | | % |
| sysctl | | | | % |
| Users | | | | % |
| Auditing | | | | % |
| Services | | | | % |
| File System | | | | % |
| Overall | | | | % |

## Critical Findings Requiring Immediate Action (L1 Fails)

| ID | Control | Recommended Fix |
|---|---|---|
| | | |
