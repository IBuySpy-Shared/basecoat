---
name: e2e-testing
description: "Use when designing or implementing end-to-end tests with Playwright, Cypress, or Selenium. Covers critical-path selection, selector strategy, flakiness prevention, cross-browser configuration, and CI pipeline integration."
---

# E2E Testing Skill

Use this skill when a feature, release, or risk area needs structured end-to-end test coverage across real browser environments.

## When to Use

- Designing E2E test coverage for a new feature or critical user journey.
- Auditing an existing E2E suite for flakiness, selector brittleness, or coverage gaps.
- Configuring a cross-browser test matrix for a release gate.
- Integrating E2E tests into a CI/CD pipeline with parallel sharding and artefact collection.
- Selecting between Playwright, Cypress, and Selenium for a project.

## Workflow

1. Enumerate critical user journeys and classify by priority (P0/P1/P2).
2. Map each journey to a test scenario using the critical-path template.
3. Apply the selector strategy and flakiness prevention checklist.
4. Configure the browser matrix and environment variables.
5. Wire the test suite into CI using the pipeline template.
6. Score coverage against the E2E scorecard and file GitHub Issues for gaps.

## Selector Strategy

Prefer selectors in this order — most stable to least stable:

1. `data-testid` attribute: `[data-testid="submit-btn"]`
2. ARIA role + accessible name: `getByRole('button', { name: 'Submit' })`
3. Label text: `getByLabel('Email address')`
4. Placeholder text: `getByPlaceholder('Enter email')`
5. Text content (only for static, non-localized strings): `getByText('Confirm')`

**Never use:** CSS class selectors, XPath, or DOM structure-dependent selectors.

## Flakiness Prevention

| Root Cause | Prevention |
| --- | --- |
| Timing-dependent assertions | Replace `wait(ms)` with `waitForSelector` or `waitForResponse` |
| Shared mutable test state | Isolate each test with its own fixture or authenticated session |
| Third-party service variability | Stub external services with deterministic mocks |
| Race conditions in UI rendering | Assert on stable DOM states, not intermediate loading states |
| Network latency variance | Intercept and mock network requests in isolated tests |
| Flaky selectors | Use `data-testid`; never CSS class chains |

## Cross-Browser Matrix

Minimum release gate configuration:

```yaml
projects:
  - name: chromium
    use: { ...devices['Desktop Chrome'] }
  - name: firefox
    use: { ...devices['Desktop Firefox'] }
  - name: webkit
    use: { ...devices['Desktop Safari'] }
  - name: mobile-chrome
    use: { ...devices['Pixel 5'] }
```

## CI Pipeline Integration

```yaml
# Playwright shard example — adapt for Cypress or Selenium Grid
jobs:
  e2e:
    strategy:
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]
    steps:
      - run: npx playwright test --shard=${{ matrix.shard }}
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
```

## Guardrails

- Do not add E2E tests for behaviour that is already fully covered by deterministic unit or integration tests.
- Do not use E2E tests as the primary coverage mechanism for business logic — keep them focused on user journeys.
- Quarantine flaky tests immediately; never allow them to block the release gate without a tracking issue.
- Keep the smoke subset small (< 30 tests) and fast (< 5 minutes) to avoid blocking every PR.
- Never commit real user credentials or environment secrets into test files.

## Output Expectations

- Critical-path inventory with priority classification.
- Browser matrix configuration file.
- CI pipeline YAML snippet with shard configuration.
- Coverage scorecard with gap list.
- GitHub Issues filed for every identified gap or flaky test.

## Conventions

- The folder name matches the `name` field in frontmatter.
- `SKILL.md` is the entry point for this skill.
- Discovery keywords are in the `description` field.
