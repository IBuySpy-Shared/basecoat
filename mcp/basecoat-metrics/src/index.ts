#!/usr/bin/env node
/**
 * Base Coat Metrics MCP Server
 *
 * Exposes Base Coat adoption metrics to AI agents via the Model Context Protocol.
 * Reads from the live GitHub Pages endpoints or a local METRICS_DIR override.
 *
 * Tools:
 *   get-latest-metrics  — Current snapshot (all repos or one repo)
 *   get-history         — Historical snapshots (last N weeks)
 *   get-alerts          — Active degradation alerts
 *   get-repo-metrics    — Detailed metrics for a single repo
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PAGES_BASE =
  process.env.METRICS_BASE_URL ??
  "https://ibuyspy-shared.github.io/basecoat/metrics";

const METRICS_DIR = process.env.METRICS_DIR ?? null;

// ---------------------------------------------------------------------------
// Data fetching helpers
// ---------------------------------------------------------------------------

async function fetchMetrics(file: string): Promise<unknown> {
  if (METRICS_DIR) {
    const local = join(METRICS_DIR, file);
    if (existsSync(local)) {
      const raw = await readFile(local, "utf-8");
      return JSON.parse(raw);
    }
  }
  const url = `${PAGES_BASE}/${file}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

type MetricsSnapshot = {
  collected_at: string;
  organization: string;
  copilot: Record<string, unknown>;
  repos: Record<string, RepoMetrics>;
};

type RepoMetrics = {
  pull_requests: Record<string, unknown>;
  ci: Record<string, unknown>;
  issues: Record<string, unknown>;
  basecoat_coverage: Record<string, unknown>;
};

type Alert = {
  type: string;
  severity: string;
  message: string;
  repo?: string;
};

async function getLatest(): Promise<MetricsSnapshot> {
  return fetchMetrics("latest.json") as Promise<MetricsSnapshot>;
}

async function getHistory(): Promise<MetricsSnapshot[]> {
  return fetchMetrics("history.json") as Promise<MetricsSnapshot[]>;
}

async function getAlerts(): Promise<Alert[]> {
  return fetchMetrics("alerts.json") as Promise<Alert[]>;
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "basecoat-metrics",
  version: "1.0.0",
});

// ── Tool: get-latest-metrics ────────────────────────────────────────────────

server.tool(
  "get-latest-metrics",
  "Returns the most recent Base Coat adoption metrics snapshot. " +
    "Includes Copilot usage, PR cycle times, CI success rates, issue resolution times, " +
    "and Base Coat coverage percentage for all monitored repositories. " +
    "Use repo parameter to narrow to a single repository.",
  {
    repo: z
      .string()
      .optional()
      .describe(
        "Optional: filter to a single repo in 'org/repo' format. " +
          "Returns all repos if omitted."
      ),
  },
  async ({ repo }) => {
    const latest = await getLatest();
    const result: Record<string, unknown> = {
      collected_at: latest.collected_at,
      organization: latest.organization,
      copilot: latest.copilot,
    };

    if (repo) {
      const found = latest.repos[repo];
      if (!found) {
        const available = Object.keys(latest.repos).join(", ");
        return {
          content: [
            {
              type: "text" as const,
              text: `Repository '${repo}' not found. Available: ${available}`,
            },
          ],
        };
      }
      result.repos = { [repo]: found };
    } else {
      result.repos = latest.repos;
    }

    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  }
);

// ── Tool: get-history ───────────────────────────────────────────────────────

server.tool(
  "get-history",
  "Returns historical adoption metrics snapshots collected weekly. " +
    "Use weeks parameter to control how many historical points to return (default 4, max 52). " +
    "Useful for trend analysis and spotting regressions over time.",
  {
    weeks: z
      .number()
      .int()
      .min(1)
      .max(52)
      .default(4)
      .describe("Number of historical weeks to return (1–52, default 4)."),
    repo: z
      .string()
      .optional()
      .describe(
        "Optional: filter repo metrics in each snapshot to a single 'org/repo'."
      ),
  },
  async ({ weeks, repo }) => {
    const history = await getHistory();
    const slice = history.slice(-weeks);

    const result = slice.map((snap) => {
      const entry: Record<string, unknown> = {
        collected_at: snap.collected_at,
        organization: snap.organization,
      };
      if (repo) {
        entry.repos = snap.repos[repo]
          ? { [repo]: snap.repos[repo] }
          : {};
      } else {
        entry.repos = snap.repos;
      }
      return entry;
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            { points: result.length, history: result },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ── Tool: get-alerts ────────────────────────────────────────────────────────

server.tool(
  "get-alerts",
  "Returns active degradation alerts detected in the latest metrics run. " +
    "Alerts are generated when CI success rate drops >15%, PR cycle time increases >50%, " +
    "or Copilot acceptance rate drops >10%. An empty array means no regressions detected.",
  {
    severity: z
      .enum(["warning", "info", "all"])
      .default("all")
      .describe("Filter by severity: 'warning', 'info', or 'all' (default)."),
  },
  async ({ severity }) => {
    const alerts = await getAlerts();
    const filtered =
      severity === "all"
        ? alerts
        : alerts.filter((a) => a.severity === severity);

    const summary =
      filtered.length === 0
        ? "No active degradation alerts."
        : `${filtered.length} alert(s) detected.`;

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ summary, alerts: filtered }, null, 2),
        },
      ],
    };
  }
);

// ── Tool: get-repo-metrics ──────────────────────────────────────────────────

server.tool(
  "get-repo-metrics",
  "Returns detailed metrics for a single repository including PR velocity, " +
    "CI success rate, issue resolution time, and Base Coat asset coverage. " +
    "Also includes trend data from the last N weeks to show direction of change.",
  {
    repo: z
      .string()
      .describe("Repository in 'org/repo' format (e.g. 'IBuySpy-Shared/basecoat')."),
    trend_weeks: z
      .number()
      .int()
      .min(1)
      .max(12)
      .default(4)
      .describe("Number of historical weeks to include for trend analysis (default 4)."),
  },
  async ({ repo, trend_weeks }) => {
    const [latest, history] = await Promise.all([getLatest(), getHistory()]);

    const current = latest.repos[repo];
    if (!current) {
      const available = Object.keys(latest.repos).join(", ");
      return {
        content: [
          {
            type: "text" as const,
            text: `Repository '${repo}' not found. Available: ${available}`,
          },
        ],
      };
    }

    const trend = history
      .slice(-trend_weeks)
      .map((snap) => ({
        collected_at: snap.collected_at,
        metrics: snap.repos[repo] ?? null,
      }))
      .filter((e) => e.metrics !== null);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              repo,
              as_of: latest.collected_at,
              current,
              trend,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("basecoat-metrics-mcp failed to start:", err);
  process.exit(1);
});
