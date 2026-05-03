# Dashboard-as-Code Template

Use this template to define a service observability dashboard as a versioned artifact. Store the resulting definition in the service repository under `dashboards/` and deploy it through the CI pipeline.

---

## Dashboard Metadata

Every dashboard definition must include this metadata block:

| Field | Value |
|---|---|
| **Title** | `<Service Name> — Overview` |
| **Description** | One sentence describing what this dashboard monitors |
| **Folder / Namespace** | `<e.g., services/checkout-api>` |
| **Version** | Semantic version (bump on significant structural changes) |
| **Owner** | Team or squad name |
| **Last updated** | ISO date (managed by CI on deploy) |
| **Backend** | `Grafana / Azure Monitor Workbook / Datadog / CloudWatch` |

---

## Required Panels

Every service dashboard **must** include these four panels (Google SRE four golden signals):

| Panel | Signal | Metric source | Visualization |
|---|---|---|---|
| Request Rate | Traffic | `http.server.request.count` rate per second | Time-series line graph |
| Error Rate | Errors | `http.server.error.count` / `http.server.request.count` as % | Time-series line graph |
| Latency (p50 / p95 / p99) | Latency | `http.server.request.duration` histogram percentiles | Time-series line graph |
| Saturation | Saturation | CPU utilization or active request count | Gauge or time-series |

---

## Dashboard Variables

Define these template variables so the dashboard works across all environments and instances:

| Variable name | Type | Values | Default |
|---|---|---|---|
| `environment` | Enum | `development`, `staging`, `production` | `production` |
| `service` | Query | All `service.name` values from metrics store | `<primary service>` |
| `interval` | Interval | `1m`, `5m`, `15m`, `1h` | `5m` |

---

## Grafana JSON Template

```json
{
  "title": "${SERVICE_NAME} — Overview",
  "description": "Four golden signals for ${SERVICE_NAME}",
  "uid": "${SERVICE_SLUG}-overview",
  "version": 1,
  "tags": ["service", "${SERVICE_SLUG}", "golden-signals"],
  "templating": {
    "list": [
      {
        "name": "environment",
        "type": "custom",
        "options": [
          { "text": "production", "value": "production" },
          { "text": "staging", "value": "staging" },
          { "text": "development", "value": "development" }
        ],
        "current": { "text": "production", "value": "production" }
      },
      {
        "name": "interval",
        "type": "interval",
        "options": ["1m", "5m", "15m", "1h"],
        "current": { "text": "5m", "value": "5m" }
      }
    ]
  },
  "panels": [
    {
      "title": "Request Rate (req/s)",
      "type": "timeseries",
      "targets": [
        {
          "expr": "rate(http_server_request_count_total{deployment_environment=\"$environment\", service=\"${SERVICE_NAME}\"}[$interval])",
          "legendFormat": "req/s"
        }
      ]
    },
    {
      "title": "Error Rate (%)",
      "type": "timeseries",
      "targets": [
        {
          "expr": "100 * rate(http_server_error_count_total{deployment_environment=\"$environment\", service=\"${SERVICE_NAME}\"}[$interval]) / rate(http_server_request_count_total{deployment_environment=\"$environment\", service=\"${SERVICE_NAME}\"}[$interval])",
          "legendFormat": "error %"
        }
      ]
    },
    {
      "title": "Latency Percentiles",
      "type": "timeseries",
      "targets": [
        {
          "expr": "histogram_quantile(0.50, rate(http_server_request_duration_seconds_bucket{deployment_environment=\"$environment\", service=\"${SERVICE_NAME}\"}[$interval]))",
          "legendFormat": "p50"
        },
        {
          "expr": "histogram_quantile(0.95, rate(http_server_request_duration_seconds_bucket{deployment_environment=\"$environment\", service=\"${SERVICE_NAME}\"}[$interval]))",
          "legendFormat": "p95"
        },
        {
          "expr": "histogram_quantile(0.99, rate(http_server_request_duration_seconds_bucket{deployment_environment=\"$environment\", service=\"${SERVICE_NAME}\"}[$interval]))",
          "legendFormat": "p99"
        }
      ]
    },
    {
      "title": "Saturation — CPU Utilization",
      "type": "gauge",
      "targets": [
        {
          "expr": "avg(process_cpu_utilization{deployment_environment=\"$environment\", service=\"${SERVICE_NAME}\"}) * 100",
          "legendFormat": "CPU %"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "max": 100,
          "thresholds": {
            "steps": [
              { "value": 0, "color": "green" },
              { "value": 70, "color": "yellow" },
              { "value": 90, "color": "red" }
            ]
          }
        }
      }
    }
  ]
}
```

Replace `${SERVICE_NAME}` and `${SERVICE_SLUG}` with your actual service values before committing.

---

## Azure Monitor Workbook ARM Template

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "microsoft.insights/workbooks",
      "apiVersion": "2022-04-01",
      "name": "[parameters('workbookId')]",
      "location": "[resourceGroup().location]",
      "kind": "shared",
      "properties": {
        "displayName": "[parameters('workbookDisplayName')]",
        "serializedData": "[variables('workbookContent')]",
        "version": "1.0",
        "sourceId": "[parameters('appInsightsResourceId')]",
        "category": "workbook"
      }
    }
  ],
  "parameters": {
    "workbookId": { "type": "string" },
    "workbookDisplayName": { "type": "string", "defaultValue": "Service Overview" },
    "appInsightsResourceId": { "type": "string" }
  }
}
```

Store workbook `serializedData` as a separate JSON file and reference it at deploy time.

---

## CI Deployment Step

Add this step to the service CI pipeline to deploy the dashboard on every merge to main:

```yaml
- name: Deploy Grafana Dashboard
  run: |
    curl -s -X POST \
      -H "Authorization: Bearer ${{ secrets.GRAFANA_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d @dashboards/overview.json \
      "${{ vars.GRAFANA_URL }}/api/dashboards/db"
```

---

## Dashboard Governance Checklist

- [ ] Dashboard title, description, and version present
- [ ] All four golden signal panels included
- [ ] Template variables for environment and interval defined
- [ ] Dashboard definition stored in `dashboards/` under version control
- [ ] Deployed via CI (not exported-and-committed from the UI)
- [ ] No hardcoded environment names in PromQL queries — use template variables
- [ ] Alert thresholds annotated on latency and error rate panels
- [ ] Dashboard reviewed and approved alongside the feature PR that introduced the metrics
