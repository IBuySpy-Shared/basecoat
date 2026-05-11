---
name: contract-testing
title: Contract Testing & Integration Patterns
description: "Use when implementing consumer-driven contracts, Pact verification, mutation testing, or integration test orchestration."
compatibility: ["agent:contract-testing"]
metadata:
  domain: testing
  maturity: production
  audience: [qa-engineer, developer, architect]
allowed-tools: [python, docker, bash, java, javascript]
---

## Contract Testing Skill

Use this skill when setting up consumer-driven contract tests, configuring Pact broker
workflows, implementing provider verification, or orchestrating integration test suites
with Docker Compose.

## When to Use

- Adding a new consumer that calls an existing API — define the contract first
- Verifying a provider change won't break existing consumers
- Setting up a Pact broker for contract storage and verification
- Orchestrating multi-service integration tests with Docker Compose
- Adding mutation testing gates to a CI pipeline
- Establishing deployment gates that block on contract verification failures

## Quick Start

1. Define consumer contracts using Pact — one per consumer/provider pair.
2. Write provider states for every contract interaction.
3. Run provider verification in CI against the Pact broker or local files.
4. Orchestrate full integration suites with Docker Compose.
5. Target >85% mutation score; block deployment if contract verification fails.

## Reference Files

| File | Contents |
|------|----------|
| [`references/pact-patterns.md`](references/pact-patterns.md) | Consumer contract definition, provider verification, provider states setup |
| [`references/e2e-orchestration.md`](references/e2e-orchestration.md) | Selenium E2E test, Docker Compose integration orchestration, mutation testing, report template |

## Example: Consumer Contract (JavaScript)

```javascript
const { PactV3 } = require("@pact-foundation/pact");

const provider = new PactV3({
  consumer: "OrderService",
  provider: "InventoryAPI",
});

describe("Inventory API contract", () => {
  it("returns stock level for a product", async () => {
    await provider
      .given("product ABC-123 exists")
      .uponReceiving("a request for stock level")
      .withRequest({ method: "GET", path: "/api/inventory/ABC-123" })
      .willRespondWith({
        status: 200,
        body: { productId: "ABC-123", quantity: 42 },
      });

    await provider.executeTest(async (mockServer) => {
      const res = await fetch(`${mockServer.url}/api/inventory/ABC-123`);
      const data = await res.json();
      expect(data.quantity).toBe(42);
    });
  });
});
```

The test produces a Pact contract file that the provider verifies in its own CI pipeline.
The contract input is the consumer's expected request; the output is the provider's
guaranteed response shape.

## Key Patterns

- **Consumer-driven**: consumer writes the contract; provider must satisfy it
- **Provider states**: setup endpoint (`/provider-states`) seeds DB before each interaction
- **Mutation gate**: >85% mutation score required before merging
- **Deployment gate**: 🔴 BLOCKED if any contract fails verification

## References

- [Pact Specification](https://pact.foundation/)
- [Consumer-Driven Contract Testing](https://martinfowler.com/articles/consumerDrivenContracts.html)
- [Mutation Testing Guidelines](https://en.wikipedia.org/wiki/Mutation_testing)
