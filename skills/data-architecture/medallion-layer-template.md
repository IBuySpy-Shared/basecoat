# Medallion Layer Architecture Template

Use this template to define and document a medallion (bronze/silver/gold) data architecture.

## Domain Context

- **Domain Name**: _Name of the business or product domain (e.g., "Orders", "Inventory")_
- **Owner**: _Team or individual accountable for this domain's data_
- **Source Systems**: _List of upstream systems that feed data into this domain_
- **Consumers**: _Downstream systems, dashboards, or models that depend on gold-layer output_

## Bronze Layer (Raw / Staging)

| Property | Value |
|---|---|
| Purpose | Immutable raw ingestion from sources |
| Storage Location | `/mnt/data/bronze/<domain>/` |
| File Format | Parquet or JSON (source-native) |
| Partitioning Strategy | `_loaded_date` or source event date |
| Retention Policy | _90 days / 1 year / indefinite_ |
| Access Control | Restricted — data engineers only |
| Schema Enforcement | None — preserve source schema |

### Bronze Tables

| Table | Source System | Load Type | Frequency |
|---|---|---|---|
| `bronze.<domain>_events` | _Source name_ | Full / Incremental | _Hourly / Daily_ |

## Silver Layer (Cleaned / Standardized)

| Property | Value |
|---|---|
| Purpose | Validated, deduplicated, and standardized records |
| Storage Location | `/mnt/data/silver/<domain>/` |
| File Format | Delta Lake / Parquet |
| Partitioning Strategy | `year`, `month`, `day` |
| Retention Policy | _2 years / indefinite_ |
| Access Control | Data engineers and analysts |
| Schema Enforcement | Strict — column names, types, not-null constraints |

### Data Quality Rules

- [ ] Null checks on required fields (list fields)
- [ ] Uniqueness checks on primary keys
- [ ] Referential integrity between related tables
- [ ] Value range checks (e.g., `amount > 0`)
- [ ] Deduplication logic documented

### Silver Tables

| Table | Source (Bronze) | Key Transformations | SCD Type |
|---|---|---|---|
| `silver.<domain>_entities` | `bronze.<domain>_events` | _Normalize, validate_ | SCD1 / SCD2 |

## Gold Layer (Analytics / Applications)

| Property | Value |
|---|---|
| Purpose | Aggregated, business-ready metrics and views |
| Storage Location | `/mnt/data/gold/<domain>/` |
| File Format | Delta Lake / Materialized Views |
| Refresh Strategy | _Scheduled / Triggered / Incremental_ |
| Access Control | Analysts, BI tools, application service accounts |

### Gold Artifacts

| Artifact | Type | Purpose | Refresh Frequency |
|---|---|---|---|
| `gold.<domain>_daily_summary` | Aggregated Table | KPI reporting | Daily |
| `gold.<domain>_metrics` | Materialized View | Dashboard queries | Hourly |

## Lineage Map

```
[Source System] → bronze.<domain> → silver.<domain> → gold.<domain> → [Consumer]
```

Describe any intermediate transformation steps or external dependencies.

## Monitoring and Alerts

| Check | Threshold | Alert Channel |
|---|---|---|
| Bronze row count drop | < 80% of prior day | Slack `#data-alerts` |
| Silver null rate | > 5% on required fields | PagerDuty |
| Gold refresh failure | Any failure | On-call rotation |
| Pipeline duration | > 2× baseline | Slack `#data-alerts` |

## Governance

- **Data Classification**: _Public / Internal / Restricted / Confidential_
- **PII Fields**: _List any personally identifiable fields and masking strategy_
- **Audit Logging**: _Describe how access and mutations are logged_
- **Glossary Link**: _Link to the data dictionary or glossary entry for this domain_
