# Re-Test Verification Checklist

Use this checklist to confirm that each finding from the penetration test has been fully remediated. Run this checklist after the developer marks a fix as complete and before closing the corresponding GitHub Issue.

---

## Checklist Metadata

| Field | Value |
|-------|-------|
| **Engagement** | _[name]_ |
| **Original Report Date** | _[YYYY-MM-DD]_ |
| **Re-test Date** | _[YYYY-MM-DD]_ |
| **Re-tester** | _[name or agent]_ |
| **Environment** | _[staging / production / dev]_ |

---

## Pre-Re-Test Verification

Before running any test cases, confirm:

| # | Item | Status |
|---|------|--------|
| 1 | Developer has marked the finding as fixed in the remediation tracker | ☐ |
| 2 | Fix has been deployed to the target environment | ☐ |
| 3 | Relevant GitHub Issue is in "Ready for Verification" state | ☐ |
| 4 | Original test credentials and access are still valid | ☐ |
| 5 | No active maintenance window that would mask the fix | ☐ |

---

## Finding Re-Test Records

Repeat this section for each finding being re-tested.

---

### Re-Test: PEN-YYYY-[NNN] — [Title]

| Field | Value |
|-------|-------|
| **Finding ID** | _PEN-YYYY-NNN_ |
| **Original Severity** | _Critical / High / Medium / Low_ |
| **GitHub Issue** | _[#number]_ |
| **Fix Description** | _[summary of change made]_ |
| **Fix Commit/PR** | _[link]_ |

#### Step 1 — Reproduce Original Attack

Re-run the exact reproduction steps from the original finding report.

| # | Reproduction Step | Expected (Pre-fix) Outcome | Actual Outcome | Pass / Fail |
|---|-------------------|---------------------------|----------------|------------|
| 1 | | Vulnerable response | | |
| 2 | | | | |
| 3 | | | | |

**Result:** ☐ Original attack succeeds (NOT fixed) · ☐ Original attack fails (fixed)

#### Step 2 — Verify Fix Effectiveness

Test additional vectors to confirm the fix is complete, not partial.

| # | Variant Test | Purpose | Outcome | Pass / Fail |
|---|--------------|---------|---------|------------|
| 1 | Alternate payload | Confirm bypass is not possible | | |
| 2 | Adjacent endpoint | Confirm fix is not endpoint-specific | | |
| 3 | Authenticated vs unauthenticated | Confirm authorization is consistent | | |

#### Step 3 — Regression Check

Confirm that the fix has not broken adjacent functionality.

| # | Regression Test | Expected Outcome | Actual Outcome | Pass / Fail |
|---|-----------------|-----------------|----------------|------------|
| 1 | Normal valid request to fixed endpoint | 200 / expected response | | |
| 2 | Authorization boundary (other user) | 403 Forbidden | | |
| 3 | Input validation (safe input) | Accepted normally | | |

#### Re-Test Verdict

| Verdict | Criteria |
|---------|---------|
| ✅ **Remediated** | All reproduction steps fail; fix variants pass; no regression |
| ⚠️ **Partially Fixed** | Original vector blocked but bypass still possible |
| ❌ **Not Fixed** | Original reproduction steps still succeed |
| 🔁 **New Finding** | Fix introduced a new vulnerability |

**Verdict:** _[✅ Remediated / ⚠️ Partially Fixed / ❌ Not Fixed / 🔁 New Finding]_

**Notes:** _[Any observations about the fix quality or residual concerns]_

**Action:** _[Close issue / Re-open issue / File new issue #NNN]_

---

_Copy the Finding Re-Test Record section for each finding being verified._

---

## Re-Test Summary

| Finding ID | Title | Severity | Verdict | Issue Action |
|------------|-------|----------|---------|-------------|
| | | | | |

**Overall re-test result:** ☐ All remediated · ☐ Partial — follow-up required · ☐ Not fixed — escalation required

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Re-tester | | | |
| Security Lead | | | |
| System Owner | | | |

---

## References

- [OWASP Testing Guide v4.2 — Reporting](https://owasp.org/www-project-web-security-testing-guide/v42/5-Reporting/)
- [PTES Post Exploitation — Cleanup and Reporting](http://www.pentest-standard.org/index.php/Post_Exploitation)
