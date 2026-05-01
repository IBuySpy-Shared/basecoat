# Base Coat Metrics MCP Server

An [MCP](https://modelcontextprotocol.io/) server that exposes Base Coat adoption
metrics to AI agents via the Model Context Protocol. Data is read from the live
GitHub Pages endpoint or a local directory override.

## Tools

| Tool | Description |
|---|---|
| `get-latest-metrics` | Current snapshot — Copilot usage, PR cycle times, CI rates, coverage |
| `get-history` | Historical snapshots for the last N weeks |
| `get-alerts` | Active degradation alerts (CI drops, cycle time spikes) |
| `get-repo-metrics` | Detailed metrics + trend for a single repository |

## Build

```bash
cd mcp/basecoat-metrics
npm install
npm run build
```

## VS Code / GitHub Copilot CLI Config

Add to your `.vscode/mcp.json` (or user-level MCP config):

```json
{
  "servers": {
    "basecoat-metrics": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/mcp/basecoat-metrics/dist/index.js"]
    }
  }
}
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `METRICS_BASE_URL` | GitHub Pages URL | Override the base URL for metrics JSON files |
| `METRICS_DIR` | *(none)* | Path to a local directory containing `latest.json`, `history.json`, `alerts.json` |

Set `METRICS_DIR` to `dashboard/metrics` when running locally against a freshly
collected metrics run.
