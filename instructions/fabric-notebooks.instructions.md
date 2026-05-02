---
description: "Use when deploying and managing Microsoft Fabric notebooks in production. Covers medallion architecture (bronze/silver/gold), lakehouse integration, builtin module patterns, CI/CD automation, and MCP tool fallback strategies for data workflows."
applyTo: "*.ipynb, **/fabric/**, **/lakehouse/**"
compatibility: ["VS Code", "Cursor", "Windsurf", "Claude Code"]
metadata:
  category: "Data Engineering"
  tags: ["fabric", "notebooks", "lakehouse", "medallion", "etl", "data-pipeline"]
allowed-tools: ["python", "spark", "pyspark", "git"]
---

# Microsoft Fabric Notebook Deployment

Use this instruction when building, testing, and deploying data notebooks in Microsoft Fabric environments. Covers the medallion medallion (multi-tier) data architecture, lakehouse read/write patterns, Python module discovery in Fabric notebooks, CI/CD automation via GitHub Actions, and MCP tool fallback strategies for development environments.

---

## Medallion Architecture (Bronze/Silver/Gold)

The medallion architecture organizes data processing into three tiers of increasing refinement:

### Bronze Tier (Raw Ingestion)

**Purpose:** Store raw, unmodified data from source systems.

**Patterns:**
- Load raw files (CSV, Parquet, JSON) from external sources
- Minimal transformations (column renames, type detection)
- Full data lineage tracking (source, timestamp, version)
- Partitioning by ingestion date for incremental loads

**Notebook Pattern:**
```python
# bronze/ingest_customers.py
from pyspark.sql import SparkSession
from datetime import datetime
import os

spark = SparkSession.builder.appName("bronze_ingest").getOrCreate()

# Read from external storage
df = spark.read.option("inferSchema", "true").csv(
    "/sources/customers_export.csv"
)

# Add lineage metadata
df = df.withColumn("_ingest_date", lit(datetime.now()))
df = df.withColumn("_source_system", lit("salesforce"))
df = df.withColumn("_version", lit("1.0"))

# Partition and write to Fabric Lakehouse
lakehouse_path = "/lakehouse/files/bronze/customers"
df.write.mode("append").partitionBy("_ingest_date").parquet(lakehouse_path)

print(f"Loaded {df.count()} records to {lakehouse_path}")
```

### Silver Tier (Cleansed & Standardized)

**Purpose:** Apply business rules, remove duplicates, standardize formats.

**Patterns:**
- Data quality validation (null checks, type validation, referential integrity)
- Dimension/fact table separation
- Slowly Changing Dimensions (SCD) handling
- Join with reference data
- Aggregation for analytical queries

**Notebook Pattern:**
```python
# silver/transform_customers.py
from pyspark.sql.functions import *
from pyspark.sql.types import *
from datetime import datetime

# Read from bronze
bronze_path = "/lakehouse/files/bronze/customers"
df_raw = spark.read.parquet(bronze_path)

# Data quality checks
quality_rules = {
    "customer_id": lambda c: c.isNotNull(),
    "email": lambda c: c.rlike(r"^[\w\.-]+@[\w\.-]+\.\w+$"),
    "created_at": lambda c: c.cast(TimestampType()).isNotNull(),
}

# Apply validation
for col, rule in quality_rules.items():
    df_raw = df_raw.filter(rule(col(col)))

# Remove duplicates (keep latest)
df_dedup = df_raw.withColumn(
    "row_num", row_number().over(Window.partitionBy("customer_id").orderBy(desc("_ingest_date")))
).filter(col("row_num") == 1).drop("row_num")

# Standardize and enrich
df_silver = (
    df_dedup
    .withColumn("email_lower", lower(col("email")))
    .withColumn("customer_segment", 
               when(col("lifetime_value") > 10000, "Premium")
               .when(col("lifetime_value") > 1000, "Standard")
               .otherwise("Basic"))
    .withColumn("_transformed_date", current_timestamp())
)

# Write to silver tier
silver_path = "/lakehouse/files/silver/customers"
df_silver.write.mode("overwrite").parquet(silver_path)

print(f"Transformed {df_silver.count()} records to silver")
```

### Gold Tier (Business Analytics)

**Purpose:** Expose aggregated, business-ready datasets for analytics and dashboards.

**Patterns:**
- Pre-aggregated metrics (daily, weekly, monthly)
- One entity per table (customers, orders, products)
- Conformed dimensions
- Star schema for analytics tools

**Notebook Pattern:**
```python
# gold/customer_metrics.py
from pyspark.sql.functions import *
from pyspark.sql.window import Window

# Read from silver
silver_path = "/lakehouse/files/silver/customers"
df = spark.read.parquet(silver_path)

# Aggregate to customer metrics
customer_metrics = (
    df
    .groupBy("customer_id", "customer_segment")
    .agg(
        count("*").alias("transaction_count"),
        sum("purchase_amount").alias("total_spending"),
        avg("purchase_amount").alias("avg_order_value"),
        max("_transformed_date").alias("last_purchase_date")
    )
    .withColumn("days_since_purchase", 
               datediff(current_date(), col("last_purchase_date")))
    .filter(col("days_since_purchase") < 365)  # Active customers only
)

# Write to gold tier
gold_path = "/lakehouse/files/gold/customer_metrics"
customer_metrics.write.mode("overwrite").parquet(gold_path)

# Also create a view for SQL queries
customer_metrics.write.mode("overwrite").option("path", gold_path).saveAsTable("customer_metrics")

print(f"Created {customer_metrics.count()} customer records in gold tier")
```

---

## Lakehouse Integration

### Reading from Lakehouse

**Using Spark DataFrame API:**
```python
# Read Parquet from lakehouse
df = spark.read.parquet("/lakehouse/files/path/to/data")

# Read Delta table (transactional)
df = spark.read.format("delta").load("/lakehouse/tables/my_table")

# Read CSV with schema inference
df = spark.read.option("inferSchema", "true").csv("/lakehouse/files/data.csv")

# Read specific partitions
df = spark.read.parquet("/lakehouse/files/data").filter(col("year") == 2024)
```

**Using Pandas (smaller datasets):**
```python
import pandas as pd
import pyarrow.parquet as pq

# Read Parquet with Pandas
df_pandas = pd.read_parquet("/lakehouse/files/data.parquet")

# Or use PyArrow for column selection
table = pq.read_table("/lakehouse/files/data.parquet", columns=["id", "name"])
df_pandas = table.to_pandas()
```

### Writing to Lakehouse

**Write Parquet (columnar, compressed):**
```python
# Append to existing data
df.write.mode("append").parquet("/lakehouse/files/data/new_batch")

# Overwrite (replace entire dataset)
df.write.mode("overwrite").parquet("/lakehouse/files/data/full_refresh")

# Partition for query performance
df.write.mode("append").partitionBy("year", "month").parquet("/lakehouse/files/data")
```

**Write Delta (transactional, with versioning):**
```python
# Create or update Delta table
df.write.mode("overwrite").format("delta").mode("overwrite").option(
    "path", "/lakehouse/tables/my_table"
).saveAsTable("my_table")

# Append to Delta (atomic)
df.write.mode("append").format("delta").save("/lakehouse/tables/my_table")

# Upsert (merge) data
from delta.tables import DeltaTable

target = DeltaTable.forPath(spark, "/lakehouse/tables/my_table")
target.alias("target").merge(
    df.alias("source"),
    "target.id = source.id"
).whenMatchedUpdateAll().whenNotMatchedInsertAll().execute()
```

---

## Builtin Module Patterns

### Referencing the Builtin Module

Microsoft Fabric provides the `builtin` module for accessing Fabric-specific utilities:

```python
from builtin.notebookutils import mssparkutils

# Access workspace utilities
ws = mssparkutils.notebook.getContext().notebookPath
print(f"Current notebook: {ws}")

# Read secrets from Key Vault
secret_value = mssparkutils.credentials.getSecret("KeyVaultName", "SecretKey")

# List files in lakehouse
files = mssparkutils.fs.ls("/lakehouse/files/")
for file in files:
    print(f"{file.name} ({file.size} bytes)")

# Run another notebook
mssparkutils.notebook.run("/path/to/other_notebook", 60)  # 60s timeout
```

### Common Builtin Patterns

**Lakehouse Access:**
```python
# Get lakehouse workspace identifier
workspace_id = mssparkutils.notebook.getContext().workspaceId
workspace_name = mssparkutils.notebook.getContext().workspaceName
```

**Credential Management:**
```python
# Use AAD token for API calls
token = mssparkutils.credentials.getToken("https://graph.microsoft.com")

# Pass to requests library
import requests
headers = {"Authorization": f"Bearer {token}"}
response = requests.get("https://graph.microsoft.com/v1.0/me", headers=headers)
```

**Exit Early:**
```python
# Stop notebook execution
mssparkutils.notebook.exit(f"Error: {error_message}")
```

---

## CI/CD Automation via GitHub Actions

### Notebook Validation Pipeline

**`.github/workflows/fabric-validate.yml`:**
```yaml
name: Validate Fabric Notebooks

on:
  pull_request:
    paths:
      - 'fabric/**/*.ipynb'
      - '.github/workflows/fabric-validate.yml'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install dependencies
        run: |
          pip install -q nbformat jsonschema pyspark

      - name: Validate notebook format
        run: |
          for notebook in fabric/**/*.ipynb; do
            python -m nbformat --version
            nbformat.validate(open("$notebook").read())
            echo "✓ $notebook"
          done

      - name: Lint Python cells
        run: |
          pip install -q flake8
          # Extract Python from notebooks
          jupyter nbconvert --to script --stdout fabric/**/*.ipynb | flake8 - --max-line-length=120 --ignore=E501,F405

      - name: Check for security issues
        run: |
          pip install -q bandit
          jupyter nbconvert --to script --stdout fabric/**/*.ipynb | bandit - --skip B101
```

### Deploy Notebooks to Fabric

**`.github/workflows/fabric-deploy.yml`:**
```yaml
name: Deploy Fabric Notebooks

on:
  push:
    branches: [main]
    paths:
      - 'fabric/**/*.ipynb'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install Fabric SDK
        run: |
          pip install -q fabric-utils

      - name: Authenticate to Fabric
        run: |
          # Use service principal or AAD token
          export FABRIC_TENANT_ID="${{ secrets.FABRIC_TENANT_ID }}"
          export FABRIC_CLIENT_ID="${{ secrets.FABRIC_CLIENT_ID }}"
          export FABRIC_CLIENT_SECRET="${{ secrets.FABRIC_CLIENT_SECRET }}"

      - name: Upload notebooks to Fabric
        run: |
          python scripts/deploy_notebooks.py \
            --workspace-id "${{ secrets.FABRIC_WORKSPACE_ID }}" \
            --notebook-dir fabric/

      - name: Run validation notebook
        run: |
          python scripts/run_fabric_notebook.py \
            --workspace-id "${{ secrets.FABRIC_WORKSPACE_ID }}" \
            --notebook-name "fabric/validate_schema"
```

**`scripts/deploy_notebooks.py`:**
```python
import argparse
from fabric.rest_client import FabricClient
import json
import os

def deploy_notebooks(workspace_id, notebook_dir):
    client = FabricClient(
        tenant_id=os.getenv("FABRIC_TENANT_ID"),
        client_id=os.getenv("FABRIC_CLIENT_ID"),
        client_secret=os.getenv("FABRIC_CLIENT_SECRET")
    )

    for root, dirs, files in os.walk(notebook_dir):
        for file in files:
            if file.endswith(".ipynb"):
                path = os.path.join(root, file)
                name = path.replace(".ipynb", "").replace("/", "_")

                with open(path) as f:
                    notebook_content = json.load(f)

                client.notebooks.create_or_update(
                    workspace_id=workspace_id,
                    name=name,
                    definition=notebook_content
                )
                print(f"✓ Deployed {name}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--workspace-id", required=True)
    parser.add_argument("--notebook-dir", required=True)
    args = parser.parse_args()

    deploy_notebooks(args.workspace_id, args.notebook_dir)
```

---

## MCP Tool Fallback Strategy

When Fabric-specific utilities (e.g., `builtin.notebookutils`) are unavailable, fall back to standard Python libraries:

**Credential Fallback:**
```python
def get_secret(vault_name, secret_key):
    try:
        from builtin.notebookutils import mssparkutils
        return mssparkutils.credentials.getSecret(vault_name, secret_key)
    except ImportError:
        # Fallback: read from environment or local .env
        import os
        return os.getenv(f"{vault_name}_{secret_key}", "")
```

**Lakehouse Fallback:**
```python
def read_lakehouse_file(path):
    try:
        # Fabric Spark read
        return spark.read.parquet(path)
    except Exception:
        # Fallback: use local storage or cloud SDK
        import pandas as pd
        return pd.read_parquet(f"./local_fallback/{path}")
```

**Notebook Execution Fallback:**
```python
def run_transformation(notebook_path):
    try:
        from builtin.notebookutils import mssparkutils
        mssparkutils.notebook.run(notebook_path, 60)
    except (ImportError, Exception):
        # Fallback: load and execute notebook locally
        with open(notebook_path.replace("/", "_") + ".py") as f:
            exec(f.read())
```

---

## Troubleshooting

### Common Issues

**Issue: `ImportError: No module named 'builtin'`**
- **Cause:** Running notebook outside Fabric environment
- **Fix:** Use the MCP fallback pattern above; implement local testing with mocks

**Issue: `FileNotFoundError` when reading from `/lakehouse/files/`**
- **Cause:** Path is relative to notebook location, not absolute
- **Fix:** Use absolute paths: `/lakehouse/files/bronze/customers` or build relative path using `mssparkutils.notebook.getContext().notebookPath`

**Issue: Memory error on large Parquet reads**
- **Cause:** Loading entire dataset into memory
- **Fix:** Use Spark DataFrame API (lazy evaluation) instead of Pandas; filter before converting to Pandas

**Issue: Delta table merge fails with "not a valid table"**
- **Cause:** Table doesn't exist yet
- **Fix:** Create table first with `spark.createOrReplaceTempView()` or initialize with an empty write

---

## Best Practices

- ✅ Partition data by date for faster queries and incremental loads
- ✅ Use Delta format for transactional guarantees (ACID compliance)
- ✅ Implement schema validation in silver tier
- ✅ Monitor notebook execution time and memory usage in Fabric UI
- ✅ Version control notebook scripts separately from outputs
- ✅ Use secrets management (Key Vault) for credentials
- ✅ Document data lineage (source, transformations, dependencies)
- ❌ Don't store credentials in notebooks
- ❌ Don't mix business logic and data engineering in one notebook
- ❌ Don't rely on Fabric UI-only configurations; automate via API
