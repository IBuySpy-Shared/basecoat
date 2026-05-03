---
description: "Patterns for deploying notebooks to Fabric via CI/CD, lakehouse integration, and resource management."
applyTo:
  - fabric
  - notebooks
  - lakehouse
  - medallion
---

# Microsoft Fabric Notebook Deployment

## Notebook Structure Patterns

### Medallion Layer Notebooks

- Bronze → Silver: cleaning notebooks (`nb_clean_*.ipynb`)
- Silver → Gold: feature engineering notebooks (`nb_features_*.ipynb`)
- Gold → Models: training notebooks (`nb_model_*.ipynb`)
- Exploration: EDA notebooks (`nb_eda_*.ipynb`)

### Naming Conventions

- Prefix with layer: `nb_clean_`, `nb_features_`, `nb_model_`, `nb_eda_`
- Suffix with domain/entity: `nb_clean_grammys`, `nb_features_temporal`

## Lakehouse Integration

### Reading from Bronze (Files)

```python
bronze_path = f"{notebookutils.lakehouse.getMountPoint('{lakehouse_name}')}/Files/bronze"
df = pd.read_csv(f"{bronze_path}/raw_data.csv")
```

### Writing to Silver/Gold (Delta Tables)

```python
spark_df = spark.createDataFrame(df)
spark_df.write.format("delta").mode("overwrite").saveAsTable("silver_clean_data")
```

### Reading from Silver/Gold (Delta Tables)

```python
df = spark.read.table("silver_clean_data").toPandas()
```

### Standard Table Naming

- Silver: `silver_{entity}_clean`
- Gold features: `gold_features_{domain}`
- Gold final: `gold_train`, `gold_test`, `gold_feature_matrix`

## Notebook Resource Management

### Module Imports via builtin/

```python
import sys
sys.path.insert(0, f"{notebookutils.nbResPath}/builtin/src")

from cleaning.grammys import standardize_grammys
from features.temporal import build_temporal_features
```

### Upload src/ to builtin/

### Option 1: Fabric Portal

1. Open notebook → Explorer → Resources → builtin/
2. Upload folder → select `src/`

### Option 2: VS Code Fabric Extension

1. Navigate to artifact folder: `{WorkspaceId}/SynapseNotebook/{ArtifactId}/`
2. Copy `src/` into `builtin/`
3. Publish notebook

## Automated Deployment via CI/CD

### GitHub Actions Workflow Pattern

```yaml
- name: Upload Notebooks to Fabric
  env:
    FABRIC_WORKSPACE_ID: ${{ vars.FABRIC_WORKSPACE_ID }}
    FABRIC_ACCESS_TOKEN: ${{ steps.fabric-token.outputs.token }}
  run: |
    $notebookContent = Get-Content "notebooks/nb_clean_data.ipynb" -Raw
    $body = @{
      displayName = "nb_clean_data"
      definition  = @{ parts = @(@{ path = "notebook-content.py"; payload = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($notebookContent)) }) }
    } | ConvertTo-Json -Depth 10
    $headers = @{ "Authorization" = "Bearer $env:FABRIC_ACCESS_TOKEN"; "Content-Type" = "application/json" }
    $uri = "https://api.fabric.microsoft.com/v1/workspaces/$env:FABRIC_WORKSPACE_ID/notebooks"
    Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $body
```

### Authentication Pattern

```yaml
- name: Azure Login (OIDC)
  uses: azure/login@v2
  with:
    client-id: ${{ vars.AZURE_CLIENT_ID }}
    tenant-id: ${{ vars.AZURE_TENANT_ID }}
    subscription-id: ${{ vars.AZURE_SUBSCRIPTION_ID }}

- name: Get Fabric API Access Token
  id: fabric-token
  run: |
    TOKEN=$(az account get-access-token \
      --resource "https://api.fabric.microsoft.com" \
      --query accessToken -o tsv)
    echo "token=$TOKEN" >> "$GITHUB_OUTPUT"
```

### Required GitHub Variables

- `FABRIC_WORKSPACE_ID` (GUID from workspace URL or MCP tool)
- `AZURE_CLIENT_ID` (service principal with OIDC)
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

## MCP Tool Fallback

When Fabric MCP publishing tools fail (`fabric_notebookCreateTool`, `fabric_notebookPublishTool`):

1. Use the Fabric Items REST API directly
2. Create a PowerShell script wrapper: `Upload-FabricNotebooksAPI.ps1`
3. Implement in the CI/CD workflow (see pattern above)

### Common MCP Tool Failures

- "No activate workspace" → workspace not selected in VS Code Fabric extension
- "Notebook not found" → notebook must exist remotely before publishing
- Fallback: Use REST API automation

## Execution Order Documentation

Always document notebook execution order in README:

| Order | Notebook | Layer | Writes |
| --- | --- | --- | --- |
| 1 | nb_eda_cross_domain | Exploration | — (read-only) |
| 2 | nb_clean_grammys | Bronze→Silver | silver_grammys_clean |
| 3 | nb_features_temporal | Silver→Gold | gold_features_temporal |

## Idempotency Requirements

- Safe to re-run without duplicates
- Use `.mode("overwrite")` for Delta table writes
- Clear cell outputs before committing
- Test full pipeline end-to-end locally before deployment

## Environment Configuration

### Fabric Capacity SKUs

- Dev: F2 (minimum for testing)
- Prod: F4+ (based on workload needs)

### Workspace Settings

- Enable Git integration for source control
- Attach default lakehouse to notebooks
- Configure compute settings per notebook or via Environment artifact

## Reference Implementations

See real-world examples:

- [AwardPredictor](https://github.com/IBuySpy-Dev/AwardPredictor) — 14 notebooks, medallion pipeline, CI/CD automation
