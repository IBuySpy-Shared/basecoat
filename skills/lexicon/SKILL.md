---

name: lexicon
description: "Use when defining or auditing a project's vocabulary, taxonomy, ontology, and brand voice so docs, agents, and prompts use consistent canonical terms. USE FOR: create project lexicon file, audit docs for terminology drift, define naming taxonomy for assets, detect off-brand tone or vibe mismatches, standardize canonical product terms. DO NOT USE FOR: copyediting grammar only, generating logos or visuals, source code refactoring unrelated to language."
compatibility:
  editors:
    - vscode
  platforms:
    - github
metadata:
  category: "Design & Governance"
  tags: ["taxonomy", "vocabulary", "ontology", "brand-voice", "audit", "naming", "consistency"]
  maturity: "production"
  audience: ["tech-writers", "architects", "platform-teams", "developers"]
allowed-tools: ["bash", "git", "grep", "find"]
---

# Lexicon Skill

Use this skill when defining how a project speaks — the words it uses, how it classifies things,
how concepts relate to each other, and the tone it strikes — and when auditing whether existing
content actually follows those definitions.

This is not a style guide. It is a **semantic foundation**: the shared vocabulary that makes
documentation, agents, instructions, and prompts coherent across an entire system.

---

## Two Modes

### Define mode — establish the lexicon

Run once (or after major scope changes) to capture:

- **Vocabulary** — canonical term registry: the right word, its definition, and what not to call it
- **Taxonomy** — classification hierarchy: how assets and concepts are grouped and why
- **Ontology** — concept map: relationships between terms (X is a type of Y; X depends on Z)
- **Theme and vibe** — tone of voice, personality words, anti-references

Output is written to `.lexicon.md` in the project root, structured for both human reading
and audit tooling.

**Invoke:**

```text
Use the lexicon skill in define mode. Scan the project and establish the vocabulary,
taxonomy, ontology, and brand voice. Persist to .lexicon.md.
```

### Audit mode — check for drift

Run periodically (or before releases) to detect:

- **Vocabulary violations** — wrong spelling, deprecated term, or synonym used where canonical is required
- **Taxonomy drift** — assets classified inconsistently across files
- **Ontology gaps** — concepts referenced but not defined; orphaned terms
- **Vibe mismatches** — tone that contradicts the brand voice (too formal, too casual, wrong register)
- **Naming inconsistencies** — same concept called different things in different files

Output is a findings report with severity (Critical / High / Medium / Low) and file references.

**Invoke:**

```text
Use the lexicon skill in audit mode. Load .lexicon.md and scan all docs and assets
for vocabulary drift, taxonomy inconsistencies, and tone violations. Report findings
by severity with file references.
```

---

## When to Use

**Define mode:**

- Starting a new project and establishing its identity
- After rebranding, renaming, or a major scope change
- When multiple authors are working on the same system and speaking differently
- Before a public launch where coherence matters

**Audit mode:**

- Before any public release
- After merging large documentation PRs
- When contributors report confusion about what terms mean
- As part of a quality gate (run alongside linting and link checking)
- After discovering inconsistencies (e.g., three spellings of one product name)

---

## Workflow: Define Mode

### Step 1 — Explore

Before asking any questions, scan the project autonomously:

- **README and docs**: what words are used to describe the project? What terms are introduced?
- **Asset frontmatter**: what names, categories, and descriptions exist? Are they consistent?
- **Existing glossaries or style guides**: any prior vocabulary work to build on?
- **Navigation and headings**: what classification structure does the project use?
- **Anti-patterns already present**: inconsistent spellings, synonym drift, vague category names

Record what is clear and what is ambiguous before proceeding.

### Step 2 — Clarify the gaps

Ask only what cannot be inferred from the codebase:

**Vocabulary:**

- Is there an official name (single canonical spelling) vs. informal variants in use?
- Are there terms that should never appear in output (deprecated, off-brand, incorrect)?
- Any terms specific to this domain that need explicit definition?

**Taxonomy:**

- How should assets/concepts be grouped at the top level?
- Are there sub-categories? What is the nesting depth?
- Are any categories temporary (sprint-specific) vs. permanent?

**Ontology:**

- Which concepts depend on which? (e.g., "a skill is used by an agent")
- Are there inheritance relationships? (e.g., "a task agent is a type of agent")
- Are there exclusion relationships? (e.g., "instructions are not skills")

**Theme and vibe:**

- Describe the project's personality in 3 words.
- What should it explicitly NOT sound like? (anti-references)
- Formal or conversational? Dense or accessible? Technical or domain-agnostic?
- Any metaphors or analogies that anchor the brand — and any to avoid?

### Step 3 — Write `.lexicon.md`

Synthesize exploration findings and answers into the template below.
If `.lexicon.md` already exists, update each section in place.

See [`lexicon-template.md`](lexicon-template.md) for the full file format.

---

## Workflow: Audit Mode

### Step 1 — Load `.lexicon.md`

If `.lexicon.md` does not exist, run define mode first. Do not proceed without it.

### Step 2 — Scan for violations

Use the [`audit-checklist.md`](audit-checklist.md) as your structured checklist.
For each check, grep the relevant file set and record violations with file and line number.

**Vocabulary checks:**

- Grep for deprecated terms and synonyms listed in the vocabulary registry
- Flag any use of a synonym where the canonical term should appear
- Flag any capitalization variant that contradicts the canonical spelling

**Taxonomy checks:**

- Compare category labels in asset frontmatter to the taxonomy defined in `.lexicon.md`
- Flag assets with no category or with a category not in the registry
- Flag assets whose category doesn't match their content

**Ontology checks:**

- Search for references to concepts not defined in the ontology
- Flag relationships implied in content that contradict the ontology
  (e.g., a skill described as "an agent")

**Theme/vibe checks:**

- Scan headings and lead sentences for tone markers
- Flag document-level tone mismatches (e.g., a casual opener in a formal governance doc)
- Flag anti-vocabulary usage

### Step 3 — Report

Use the findings format from [`audit-checklist.md`](audit-checklist.md).
Group by severity. Include file path and line number for every finding.
End with a summary count: `N Critical, N High, N Medium, N Low`.

---

## Templates in This Skill

| Template | Purpose |
|---|---|
| [`lexicon-template.md`](lexicon-template.md) | Canonical `.lexicon.md` structure — vocabulary, taxonomy, ontology, vibe |
| [`audit-checklist.md`](audit-checklist.md) | Structured audit checklist with severity definitions and output format |

---

## Agent Pairing

This skill is designed to be used alongside:

- **`guidance-reviewer`** — Reviews instructions and agent files for consistency;
  use the lexicon audit output to focus its attention
- **`tech-writer`** — Uses the vocabulary and tone sections to write coherent docs
- **`agent-designer`** — Uses the taxonomy and ontology to place new agents
  in the right category with consistent naming
- **`guidance-author`** — Uses vocabulary registry to avoid deprecated terms
  when authoring new instructions

---

## BaseCoat Reference Lexicon

BaseCoat's own `.lexicon.md` is the canonical example of this skill applied to itself.
It defines the vocabulary, taxonomy, ontology, and vibe for all BaseCoat assets.

Key entries:

| Term | Canonical form | Do not use |
|---|---|---|
| Product name (prose) | **BaseCoat** | Base Coat, base-coat, basecoat |
| Repo identifier | **basecoat** | Base Coat, BaseCoat, base-coat |
| Install path only | **base-coat** | All other contexts |
| Asset group | **agents**, **skills**, **instructions**, **prompts** | modules, plugins, extensions |
| Adopting a repo | **sync** | install, deploy, bootstrap (informal only) |
| Team that reviews memory | **steward** | admin, moderator, owner |

Personality words: **precise · pragmatic · enterprise-grade**

Anti-references: paint/chemistry product feel, startup hype, academic formality
