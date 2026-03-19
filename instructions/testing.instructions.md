---
description: "Use when adding, updating, or reviewing tests. Covers common testing best practices for regression protection, determinism, and change validation."
applyTo: "**/*"
---

# Testing Standards

Use this instruction when adding or modifying tests, or when validating risky changes.

## Expectations

- Test behavior, not implementation trivia.
- Add the smallest set of tests that protects against the real regression.
- Prefer deterministic tests with explicit fixtures and clear failure messages.
- Cover boundary conditions and error paths when the change affects them.
- If tests cannot be run, state that clearly and explain why.
- Prefer narrow, high-value tests over broad brittle suites.
- When fixing a bug, add a test that fails before the fix when feasible.

## Positive Test Guidance

- Add positive-path tests that prove expected behavior under valid inputs and normal conditions.
- Confirm the main success path returns the expected result, state change, or output.
- Include at least one realistic end-to-end happy path when integration behavior changes.

## Negative Test Guidance

- Add negative-path tests that prove invalid inputs and failure conditions are handled safely.
- Verify error messages, status codes, and fallback behavior are explicit and stable.
- Cover authorization failures, validation failures, dependency failures, and timeout paths when relevant.
- Ensure failures do not leak secrets, PII, or internal-only diagnostic details.

## Minimum Validation Checklist

- Existing tests relevant to the change still pass.
- New or changed behavior is exercised.
- Manual verification steps are noted when automation is missing.
- The test names make the protected behavior obvious.
- Positive and negative scenarios are both represented for changed behavior.
