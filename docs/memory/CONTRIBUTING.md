# Contributing Learnings to Basecoat Memory

This guide explains how repos that use basecoat guidance can contribute
learnings back for the steward team to review and promote into shared memory.

## Quick Start

1. Add the `basecoat-enabled` topic to your repo
2. Label any issue or PR `learning`, `retrospective`, or `decision`
3. The weekly sweep picks it up automatically

For deliberate, structured submissions skip to [Active Push](#active-push).

## How It Works

```text
Consumer repo (basecoat-enabled)
  │
  ├─ labels issue/PR: "learning"        ← passive signal
  ├─ runs submit-learning.ps1           ← active push
  │
  ▼
basecoat-memory/sweep-candidates/YYYY-MM-DD.md   ← PR opened for review
  │
  ▼
Memory steward reviews → promotes to memories/{domain}/{subject}.md
  │
  ▼
Weekly sync distributes to all basecoat-enabled repos (hot-index.md)
```

## Enlisting Your Repo

Add the GitHub topic to your repo:

```sh
gh api repos/{org}/{repo}/topics --method PUT --field names[]=basecoat-enabled
```

The sweep runs every Monday at 06:00 UTC. Your repo is included automatically
on the next run.

## Passive Signals (Label-Based)

Any merged PR or closed issue with a learning label is swept as a candidate.

Default labels: `learning`, `retrospective`, `decision`

Create the label in your repo once:

```sh
gh label create learning   --color 0075ca --description "Candidate for basecoat memory"
gh label create retrospective --color e4e669 --description "Sprint retrospective finding"
gh label create decision   --color d93f0b --description "Architecture or process decision"
```

Then apply the label when closing issues or merging PRs that contain reusable
patterns or decisions.

## Configuring the Sweep

Place a `.basecoat.yml` at your repo root to customize sweep behavior.
Copy `.basecoat.yml.example` from the basecoat repo as a starting point:

```sh
curl -fsSL https://raw.githubusercontent.com/IBuySpy-Shared/basecoat/main/.basecoat.yml.example \
  -o .basecoat.yml
```

Key settings:

| Key | Default | Purpose |
|---|---|---|
| `learning_labels` | `[learning, retrospective, decision]` | Labels that trigger sweep |
| `days_back` | `30` | How far back the sweep looks |
| `team` | *(empty)* | Team name included in candidate metadata |
| `contact` | *(empty)* | GitHub handle for follow-up |
| `domain` | *(empty)* | Hint for which memory domain to target |

## Active Push

Use `submit-learning.ps1` to submit a structured learning immediately,
without waiting for the next weekly sweep.

### Prerequisites

- `gh` CLI authenticated with access to write to `basecoat-memory`
- `MEMORY_REPO_TOKEN` environment variable set to a fine-grained PAT with
  Contents (R/W) and Pull Requests (R/W) on `{org}/basecoat-memory`

### Usage

```powershell
# Download the script
curl -fsSL https://raw.githubusercontent.com/IBuySpy-Shared/basecoat/main/scripts/submit-learning.ps1 \
  -o scripts/submit-learning.ps1

# Submit a learning
pwsh scripts/submit-learning.ps1 `
  -Subject   "ci:copilot-agent-prs-need-approval" `
  -Fact      "Copilot agent PRs have action_required CI until a maintainer pushes an empty commit." `
  -Evidence  "https://github.com/myorg/myrepo/pull/42" `
  -Domain    "ci" `
  -Source    "myorg/myrepo"
```

### Parameters

| Parameter | Required | Description |
|---|---|---|
| `-Subject` | Yes | `domain:key` namespace (e.g., `ci:agent-pr-approval`) |
| `-Fact` | Yes | One-sentence pattern (≤ 300 chars) |
| `-Evidence` | Yes | URL to the PR, issue, or CHANGELOG that evidences this |
| `-Domain` | Yes | One of: `ci`, `git`, `authoring`, `process`, `security`, `portal`, `testing`, `governance`, `memory`, `infra` |
| `-Source` | Yes | `org/repo` of the contributing repo |
| `-Team` | No | Team name for context |
| `-Contact` | No | GitHub handle for follow-up |
| `-DryRun` | No | Print candidate without writing |
| `-OpenPR` | No | Open a PR in `basecoat-memory` immediately |

## What Makes a Good Learning

The steward team evaluates candidates against a four-point scope policy:

| Criterion | Question |
|---|---|
| **Repo-scoped** | Does it apply to this type of repo broadly, not just your internal project? |
| **Generic** | Free of product names, internal system names, or org-specific tooling? |
| **Durable** | Has it held true across ≥ 3 sprints or ≥ 2 similar incidents? |
| **Actionable** | Would another team change their behavior based on this? |

All four must be **yes** for a candidate to be promoted to shared memory.

### Examples

**Good candidate:**

> "Squash-merged PRs don't appear in `git branch --merged`; use
> `gh pr list --state all --head <branch>` to verify merge status."

**Rejected (too project-specific):**

> "Our internal deploy script requires DEPLOY_KEY to be set in GitHub secrets."

## Feedback Loop

Once a candidate is promoted to `basecoat-memory`, it flows back to all
`basecoat-enabled` repos via the weekly hot-index sync. Your team benefits
directly from other teams' learnings.

Promotion status is visible in the `basecoat-memory` repo PRs. The steward
team may comment on your submitted PR for clarification before promoting.

## References

- `scripts/submit-learning.ps1` — active push script
- `.basecoat.yml.example` — sweep configuration template
- `docs/memory/PROCESS.md` — full memory lifecycle overview
- `scripts/sweep-enterprise-memory.ps1` — passive sweep implementation
- `.github/workflows/memory-sweep.yml` — weekly sweep workflow
