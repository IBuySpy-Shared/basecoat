# Domain Glossary — [Bounded Context Name]

> This glossary captures the **ubiquitous language** of the [Bounded Context Name] bounded context.
> Every term here has a precise meaning within this context. The same word may mean something
> different in another bounded context — that is expected and intentional.
>
> Replace all bracketed placeholders with project-specific content.

## Overview

| Field | Value |
|---|---|
| **Bounded Context** | [Context name] |
| **Domain** | [Core domain / Subdomain name] |
| **Team owner** | [Team name] |
| **Last updated** | [YYYY-MM-DD] |

---

## Term Definitions

<!-- Add one entry per significant domain concept. Sort alphabetically. -->

### [Term Name]

| Field | Value |
|---|---|
| **Definition** | [Precise definition as understood by domain experts in this context] |
| **Type** | [Aggregate Root / Entity / Value Object / Domain Event / Command / Policy / Role / Process] |
| **Context scope** | [This context only — or note if shared via Published Language] |
| **Anti-patterns / Misuses** | [Common misinterpretations to avoid] |
| **Related terms** | [Links to other entries in this glossary] |
| **Examples** | [One or two concrete examples to clarify meaning] |

---

### [Another Term]

| Field | Value |
|---|---|
| **Definition** | [Precise definition] |
| **Type** | [type] |
| **Context scope** | [scope] |
| **Anti-patterns / Misuses** | [Anti-patterns] |
| **Related terms** | [Related terms] |
| **Examples** | [Examples] |

---

## Cross-Context Term Conflicts

> Document terms that have different meanings in different bounded contexts. This is not a problem to
> fix — it is a design reality. Awareness prevents integration bugs.

| Term | This Context ([Name]) | Other Context ([Name]) | Integration Notes |
|---|---|---|---|
| Order | A confirmed purchase with payment reserved | Any cart or wishlist item | ACL translates "Order" from [Other Context] into "PurchaseIntent" before entering this context |
| Customer | A registered account with billing address | Any website visitor | Only "Customer" in the strict sense enters this context |
| [Add more rows] | | | |

---

## Deprecated Terms

> Terms that were once used but have been replaced. Kept here to avoid re-introducing confusion.

| Deprecated Term | Replaced By | Reason | Date Deprecated |
|---|---|---|---|
| [Old term] | [New term] | [Why the old term was abandoned] | [YYYY-MM-DD] |

---

## Glossary Conventions

- Terms are defined as understood by **domain experts**, not by developers.
- Every aggregate root, entity, value object, domain event, and command must have an entry.
- When a term is ambiguous, add an **Anti-patterns / Misuses** entry immediately.
- Review this glossary at the start of each sprint and update when language shifts.
- Changes that rename a term require updating all code, tests, and documentation to match.

---

## Revision History

| Date | Author | Change |
|---|---|---|
| [YYYY-MM-DD] | [Name] | Initial draft |
