---
name: docs-site
description: "Scaffold a MkDocs Material documentation site with GitHub Pages deployment, navigation, and starter content for a repository. USE FOR: create a docs site for this repo, set up MkDocs Material, publish documentation to GitHub Pages, generate getting-started docs with diagrams, add docs CI workflow. DO NOT USE FOR: writing a single inline code comment, building an app frontend, creating product marketing landing pages."
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  category: "Documentation"
  tags: ["mkdocs", "documentation", "github-pages", "mermaid"]
  maturity: "production"
  audience: ["developers", "tech-writers"]
allowed-tools: ["bash", "git", "grep", "find"]
---

# Docs Site

Scaffold a MkDocs Material documentation site for any GitHub repository.
Generates `mkdocs.yml`, a landing page, a getting-started guide, a CI deploy
workflow, and optional Mermaid architecture diagrams — all ready to publish to
GitHub Pages.

## Triggers

Invoke this skill when the user asks to:

- "create a docs site / documentation site"
- "set up MkDocs" / "add MkDocs Material"
- "publish docs to GitHub Pages"
- "generate documentation for this repo"
- "add a getting-started page"
- "scaffold docs with diagrams"

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `site_name` | ✅ | — | Display name for the site |
| `site_url` | ✅ | — | GitHub Pages URL |
| `repo_url` | ✅ | — | Source repository URL |
| `docs_structure` | ✅ | — | Description of existing docs folders and key files |
| `install_pattern` | ✅ | — | How users install/sync the tool |
| `asset_types` | ❌ | none | Asset types to catalog (e.g. agents, skills, instructions) |
| `theme_color` | ❌ | indigo | MkDocs Material primary/accent color |
| `nav_style` | ❌ | tabs | Navigation style: tabs or sidebar |
| `exclude_from_package` | ❌ | mkdocs.yml | Files to exclude from consumer distribution |

## Workflow

### 1. Analyze docs structure

Examine `docs_structure` to identify:

- Top-level folders → nav sections
- Key files: README, CHANGELOG, CONTRIBUTING
- Ecosystem signals (PowerShell scripts, Python packages, npm modules) that inform
  the getting-started tab order

### 2. Generate `mkdocs.yml`

Produce a Material-theme config using `theme_color` and `nav_style` with:

- Mermaid superfences (`pymdownx.superfences` + `mermaid` custom fence)
- `search`, `content.code.copy`, and `content.tabs.link` features
- Nav auto-built from the analyzed structure
- `site_name`, `site_url`, and `repo_url` wired from inputs

```yaml
site_name: "<site_name>"
site_url: "<site_url>"
repo_url: "<repo_url>"
theme:
  name: material
  palette:
    primary: "<theme_color>"
    accent: "<theme_color>"
  features:
    - navigation.tabs        # or navigation.sections for sidebar
    - content.code.copy
    - content.tabs.link
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  - pymdownx.tabbed:
      alternate_style: true
plugins:
  - search
nav:
  - Home: index.md
  - Getting Started: getting-started.md
  # <additional sections from docs_structure>
```

### 3. Generate `docs/index.md`

Landing page containing:

- One-paragraph description of the repository
- A generic Mermaid system-context flowchart (caller customizable)
- A quick-links table pointing to Getting Started and key reference pages

```markdown
# <site_name>

<one-paragraph description>

## Architecture

\`\`\`mermaid
flowchart TD
    User -->|uses| Repo["<site_name>"]
    Repo --> Docs["Documentation"]
    Repo --> CI["CI / CD"]
\`\`\`

## Quick Links

| Page | Description |
|------|-------------|
| [Getting Started](getting-started.md) | Install and first steps |
```

### 4. Generate `docs/getting-started.md`

Tabbed installation guide using `pymdownx.tabbed`, ordered by ecosystem signals:

```markdown
# Getting Started

## Installation

=== "PowerShell"
    \`\`\`powershell
    <install_pattern for PowerShell>
    \`\`\`

=== "Shell"
    \`\`\`bash
    <install_pattern for Shell>
    \`\`\`

=== "npm"
    \`\`\`bash
    npm install <package>
    \`\`\`

=== "pip"
    \`\`\`bash
    pip install <package>
    \`\`\`

## Verify

<verification command or step>

## Next Steps

- [Reference →](reference/index.md)
```

Only include tabs relevant to the detected ecosystem.

### 5. Generate `.github/workflows/docs.yml`

CI workflow that deploys on push to `main` when `docs/**` or `mkdocs.yml` changes:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths:
      - "docs/**"
      - "mkdocs.yml"

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force --no-history
```

### 6. Generate `docs/reference/asset-catalog.md` (optional)

Only generated when `asset_types` is provided. For each asset type:

- Read frontmatter `description` fields from all matching files
- Group entries by category or type
- All links must use absolute GitHub URLs (never relative markdown paths)

```markdown
# Asset Catalog

## Agents

| Name | Description |
|------|-------------|
| [my-agent](<repo_url>/blob/main/agents/my-agent.agent.md) | … |
```

### 7. Check package exclusions

If the repository contains `scripts/package-basecoat.ps1` or a similar packaging
script, add `mkdocs.yml` to its exclusion list so the build config is not synced
to consumers. If the script cannot be auto-patched, emit a warning:

> ⚠️ Add `mkdocs.yml` to the exclusion list in `<packaging-script>` manually —
> build configuration should not be distributed to consumers.

## Output

Structured summary of all generated files, followed by next steps:

```text
Generated files:
  mkdocs.yml
  docs/index.md
  docs/getting-started.md
  .github/workflows/docs.yml
  docs/reference/asset-catalog.md  (if asset_types provided)

Next steps:
  git add mkdocs.yml docs/ .github/workflows/docs.yml
  git commit -m "docs: scaffold MkDocs Material site"
  git push

Site URL: <site_url>

Package exclusion: mkdocs.yml added to <packaging-script> ✅
  (or ⚠️ warning if manual action required)
```

## Examples

### Python library

```yaml
site_name: "Mylib"
site_url: "https://myorg.github.io/mylib/"
repo_url: "https://github.com/myorg/mylib"
docs_structure: "docs/ contains index.md, api/, and CHANGELOG.md; src/ is the package root"
install_pattern: "pip install mylib"
theme_color: "teal"
nav_style: "sidebar"
```

Generates a sidebar-nav site with pip install tab and a `docs/reference/` API
section derived from the `api/` folder.

### BaseCoat-style agent repository

```yaml
site_name: "BaseCoat"
site_url: "https://myorg.github.io/basecoat/"
repo_url: "https://github.com/myorg/basecoat"
docs_structure: "agents/, skills/, instructions/, prompts/ at root; docs/ has overview.md"
install_pattern: "pwsh scripts/sync-basecoat.ps1 -Repo myorg/basecoat"
asset_types: "agents, skills, instructions"
theme_color: "indigo"
nav_style: "tabs"
exclude_from_package: "mkdocs.yml"
```

Generates a tabbed site, a PowerShell-first getting-started guide, an asset
catalog for agents/skills/instructions, and patches `scripts/package-basecoat.ps1`
to exclude `mkdocs.yml`.

## Anti-patterns

- Do not generate domain-specific C4 diagrams — keep diagrams generic so the
  caller can customize them without regenerating the whole scaffold.
- Do not hardcode org or repo names in generated files — derive everything from
  `repo_url` and other inputs only.
- Do not use relative markdown links in the asset catalog — always use absolute
  GitHub URLs so links remain valid regardless of where the page is served from.
- Do not sync `mkdocs.yml` to consumers — it is a build configuration file, not
  guidance content. Always add it to the package exclusion list.
- Do not use PowerShell `Set-Content` for file writes — it introduces CRLF line
  endings that corrupt MkDocs YAML parsing. Use `Out-File -Encoding utf8` or
  redirect operators instead.
