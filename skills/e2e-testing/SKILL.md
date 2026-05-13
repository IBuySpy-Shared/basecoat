---
name: e2e-testing
title: E2E Testing - Playwright, Cypress, and Cross-Browser Patterns
description: Use when designing or hardening production E2E tests with Playwright or Cypress, including flake reduction, CI strategy, and browser coverage
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  domain: testing
  maturity: production
  audience: [qa-engineer, developer, test-automation-engineer]
allowed-tools: [bash, node, python, docker]
---

## E2E Testing Skill

Use this skill to design reliable, maintainable end-to-end coverage for critical user journeys. It helps teams choose the right framework, define resilient selectors and waits, and connect browser tests to CI pipelines without creating brittle suites. The primary input is the application workflow you need to validate, along with environment details, browser targets, authentication constraints, and any mock or fixture requirements. The output should be a clear testing approach, representative test cases, and practical guidance that reduces flakes while preserving real product confidence. This skill also produces framework-specific examples that can be adapted quickly by engineering and QA teams.

## Quick Navigation

| Reference | Contents |
|---|---|
| [references/playwright-patterns.md](references/playwright-patterns.md) | Setup, test structure, waits, fixtures, mocking, accessibility, performance |
| [references/cypress-patterns.md](references/cypress-patterns.md) | Cypress config, test patterns, custom commands |
| [references/ci-integration.md](references/ci-integration.md) | CI matrix, flakiness prevention, test data management |

## When to Use

- When you need to choose between Playwright and Cypress for a new E2E suite
- When an existing browser test suite is flaky and needs smarter waits or better isolation
- When your input includes login flows, checkout journeys, admin workflows, or other high-value paths
- When CI runs need a browser matrix, retries, artifact capture, or parallel execution guidance
- When you need test data, mocking, accessibility checks, or cross-browser coverage planned together
- When the desired output is a test strategy, example spec, or implementation checklist for production use

## Framework Decision Guide

| Criterion | Playwright | Cypress |
|---|---|---|
| Browser support | Chromium, Firefox, WebKit | Chromium, Firefox, Electron |
| Language | JS/TS, Python, Java, C# | JS/TS only |
| Parallel execution | Native, multi-process | Paid feature (Cypress Cloud) |
| API mocking | `page.route()` | `cy.intercept()` |
| Component testing | Yes | Yes |
| **Best for** | Cross-browser, multi-language | JS-first teams, quick setup |

## Inputs and Outputs

Typical inputs include target environments, user roles, seed data, selectors, API dependencies, and pass-fail criteria for each scenario. Useful parameters may also include browser versions, viewport sizes, accessibility expectations, and whether the suite should stub network traffic or hit integrated backends. The expected output returns a recommended framework, suite structure, stability practices, and sample assertions. In delivery workflows, the skill can also produce example test files, CI job ideas, and a short risk list explaining what remains outside automated coverage.

## Example

```ts
import { test, expect } from '@playwright/test';

test('user can complete checkout with a mocked tax service', async ({ page }) => {
  await page.route('**/api/tax', async route => {
    await route.fulfill({ json: { totalTax: 12.34 } });
  });

  await page.goto('/shop');
  await page.getByTestId('product-card').first().click();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page.getByTestId('order-total')).toContainText('$');
  await expect(page).toHaveURL(/checkout/);
});
```

This example shows deterministic routing, stable locators, and assertions tied to user-visible output instead of internal implementation details. Adapt the same pattern for Cypress if the team is JavaScript-only and does not require WebKit coverage.

## Core Principles

1. **No magic sleeps** — use smart waits (`waitForSelector`, `cy.contains().should(...)`)
2. **Test IDs over CSS selectors** — `data-testid` attributes are the most robust locators
3. **Isolate tests** — each test creates its own data; no shared state between tests
4. **Mock external services** — never hit real third-party APIs in E2E tests
5. **Deterministic environments** — use Docker for consistent browser and app versions

Treat E2E coverage as a thin confidence layer over the most important journeys, not as a replacement for unit and integration tests. Focus on business-critical flows, keep state explicit, and capture artifacts that help debug failures quickly. Good suites produce actionable failures, predictable runtime, and trustworthy feedback for pull requests and release gates.
