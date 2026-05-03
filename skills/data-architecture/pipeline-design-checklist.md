# ETL/ELT Pipeline Design Checklist

Use this checklist when designing, reviewing, or deploying a data pipeline.

## Source Connectivity

- [ ] Data source credentials stored in secrets manager (not source code)
- [ ] Connection pooling or rate limiting configured to avoid overloading source
- [ ] Source schema change detection strategy defined (schema drift alerts)
- [ ] Incremental extraction logic defined (watermark column, CDC, or snapshot)
- [ ] Source SLA documented — expected delivery window and acceptable lag

## Transformation Rules

- [ ] Business rules documented in code and reviewed by a domain expert
- [ ] Transformation logic is idempotent (re-running does not corrupt state)
- [ ] Slowly changing dimensions (SCD) handled explicitly (SCD1 vs SCD2)
- [ ] Data type coercions and encoding issues addressed (dates, Unicode, decimals)
- [ ] NULL handling strategy documented for every field

## Data Quality Gates

- [ ] Row count validation between source and target after each stage
- [ ] Null rate check on required fields (threshold defined per field)
- [ ] Uniqueness constraint validation on natural or surrogate keys
- [ ] Referential integrity checks between related tables
- [ ] Outlier and range checks for numeric fields
- [ ] Schema validation (column names, types, order) enforced at load time
- [ ] Quality gate failures stop the pipeline and trigger an alert — no silent failures

## Orchestration

- [ ] Pipeline is idempotent — can be re-run for any date partition safely
- [ ] Dependencies between pipelines declared explicitly in the orchestrator
- [ ] Backfill capability tested for at least 90 days of history
- [ ] Retry logic configured with exponential back-off (max 3 retries)
- [ ] Timeout limits set to prevent runaway jobs

## Monitoring and Observability

- [ ] Pipeline run duration tracked and alerted on anomalous increase
- [ ] Row counts per stage emitted as metrics
- [ ] Data freshness SLA monitored (alert if gold layer exceeds expected age)
- [ ] Failure alerting routed to on-call or team channel
- [ ] Lineage metadata written to catalog on each successful run

## Data Mesh Considerations

- [ ] Pipeline owned by a single domain team
- [ ] Output data product has a published contract (schema + SLA)
- [ ] Consumers access the output through the published interface, not internal tables
- [ ] Breaking contract changes follow a deprecation process
