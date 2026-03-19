#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="${1:-$(pwd)}"
cd "$ROOT_DIR"

required=(README.md CHANGELOG.md INVENTORY.md version.json sync.sh sync.ps1 instructions skills prompts agents)
for item in "${required[@]}"; do
  if [[ ! -e "$item" ]]; then
    echo "Missing required path: $item" >&2
    exit 1
  fi
done

while IFS= read -r file; do
  if [[ "$(sed -n '1p' "$file")" != "---" ]]; then
    echo "Missing frontmatter start in $file" >&2
    exit 1
  fi

  if ! sed -n '1,20p' "$file" | grep -qi '^description:'; then
    echo "Missing description in frontmatter for $file" >&2
    exit 1
  fi

  if [[ "$(basename "$file")" == "SKILL.md" ]] && ! sed -n '1,20p' "$file" | grep -qi '^name:'; then
    echo "Missing name in frontmatter for $file" >&2
    exit 1
  fi
done < <(find instructions prompts agents skills -type f \( -name '*.instructions.md' -o -name '*.prompt.md' -o -name '*.agent.md' -o -name 'SKILL.md' \) | sort)

echo "Base Coat validation passed"