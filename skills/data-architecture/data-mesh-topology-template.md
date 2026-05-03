# Data Mesh Topology Template

Use this template to design a data mesh for an organization. Complete one instance of the Domain section for each domain.

## Platform Capability (Central)

| Capability | Tool / Service | Responsible Team |
|---|---|---|
| Storage infrastructure | Azure Data Lake / S3 | Platform |
| Compute infrastructure | Databricks / Synapse | Platform |
| Metadata catalog | Azure Purview / DataHub | Platform |
| Policy enforcement | Column-level access control | Platform |
| Data product registry | Internal catalog API | Platform |
| Observability | Pipeline metrics, alerts | Platform |

## Governance Council

- **Data Owner Representatives**: One delegate per domain
- **Platform Engineering**: Responsible for shared infrastructure
- **Security/Compliance**: Responsible for classification and access policies
- **Meeting cadence**: Bi-weekly for policy changes; async for data product approvals

## Domain: \<Domain Name\>

### Team and Ownership

| Field | Value |
|---|---|
| Domain name | _e.g., "Orders", "Customer Identity"_ |
| Owning team | _Team name_ |
| Domain lead | _Individual name_ |
| On-call rotation | _Link to on-call schedule_ |

### Data Products

| Product Name | Description | Interface | SLA | Classification |
|---|---|---|---|---|
| `<domain>.customer_profiles` | Cleaned customer records | Delta table | 99.5%, refreshed daily | Restricted (PII) |
| `<domain>.order_summary` | Aggregated order metrics | SQL View | 99.9%, refreshed hourly | Internal |

### Data Product Contract Template

```yaml
name: <domain>.<product_name>
version: "1.0.0"
owner: <team>@example.com

schema:
  - field: id
    type: STRING
    nullable: false
    description: Unique identifier
  - field: created_at
    type: TIMESTAMP
    nullable: false
    description: Record creation time

sla:
  freshness: 1h          # Maximum acceptable data age
  availability: 99.5%    # Uptime commitment
  latency_p95: 200ms     # Query latency target

access:
  classification: internal   # public | internal | restricted | confidential
  request_process: GitHub issue with label 'data-access-request'

changelog:
  - version: "1.0.0"
    date: YYYY-MM-DD
    changes: Initial release
```

### Federated Governance Rules

- The domain team owns schema changes and must maintain backward compatibility for one major version.
- Breaking schema changes require a 30-day deprecation notice to all registered consumers.
- PII fields must be masked or tokenized before publishing to consumers outside the owning domain.
- Quality SLA breaches must be communicated to consumers within 15 minutes of detection.

## Inter-Domain Data Flow

```
[Domain A] ──publishes──► data-product-a ──consumed-by──► [Domain B pipeline]
[Domain B] ──publishes──► data-product-b ──consumed-by──► [Analytics Platform]
```

Describe cross-domain dependencies and the approved access method for each link.
