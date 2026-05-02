#!/usr/bin/env bash

set -euo pipefail

SOURCE_REPO="${BASECOAT_REPO:-https://github.com/YOUR-ORG/basecoat.git}"
SOURCE_REF="${BASECOAT_REF:-main}"
TARGET_DIR="${BASECOAT_TARGET_DIR:-.github/base-coat}"

if ! command -v git >/dev/null 2>&1; then
  echo "git is required" >&2
  exit 1
fi

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  echo "Run this inside a git repository" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "Cloning $SOURCE_REPO#$SOURCE_REF"
git clone --depth 1 --branch "$SOURCE_REF" "$SOURCE_REPO" "$TMP_DIR/source" >/dev/null 2>&1

mkdir -p "$REPO_ROOT/$TARGET_DIR"

for item in README.md CHANGELOG.md INVENTORY.md version.json basecoat-metadata.json instructions skills prompts agents docs; do
  rm -rf "$REPO_ROOT/$TARGET_DIR/$item"
  cp -R "$TMP_DIR/source/$item" "$REPO_ROOT/$TARGET_DIR/$item"
done

# Remove agent taxonomy subdirs from staging — they contain only index
# READMEs with relative links that break outside the source repo
for tax_dir in models orchestrator tasks types; do
  rm -rf "$REPO_ROOT/$TARGET_DIR/agents/$tax_dir"
done

# Copy Copilot-discoverable directories to their standard paths
# Only copy flat agent/instruction/prompt/skill files — not taxonomy subdirs
mkdir -p "$REPO_ROOT/.github"
for copilot_dir in instructions prompts skills; do
  if [[ -d "$REPO_ROOT/$TARGET_DIR/$copilot_dir" ]]; then
    rm -rf "$REPO_ROOT/.github/$copilot_dir"
    cp -R "$REPO_ROOT/$TARGET_DIR/$copilot_dir" "$REPO_ROOT/.github/$copilot_dir"
  fi
done

# Also copy skills to .agents/skills/ for cross-client interop (Agent Skills spec)
if [[ -d "$REPO_ROOT/$TARGET_DIR/skills" ]]; then
  mkdir -p "$REPO_ROOT/.agents"
  rm -rf "$REPO_ROOT/.agents/skills"
  cp -R "$REPO_ROOT/$TARGET_DIR/skills" "$REPO_ROOT/.agents/skills"
fi

# Agents: copy only *.agent.md files (skip taxonomy subdirs like models/, tasks/, types/)
if [[ -d "$REPO_ROOT/$TARGET_DIR/agents" ]]; then
  rm -rf "$REPO_ROOT/.github/agents"
  mkdir -p "$REPO_ROOT/.github/agents"
  find "$REPO_ROOT/$TARGET_DIR/agents" -maxdepth 1 -name '*.agent.md' -exec cp {} "$REPO_ROOT/.github/agents/" \;
fi

echo "Base Coat synced into $TARGET_DIR"