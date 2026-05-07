#!/usr/bin/env bash

set -euo pipefail

BASECOAT_REPO="${1:-ivegamsft/basecoat}"
BASECOAT_VERSION="${2:-v0.4.3}"
KEEP_REPO="${KEEP_REPO:-0}"
TEMP_REPO="$(mktemp -d)"
DOWNLOAD_DIR="$TEMP_REPO/.basecoat-download"

cleanup() {
  if [[ "$KEEP_REPO" != "1" ]]; then
    rm -rf "$TEMP_REPO"
  fi
}
trap cleanup EXIT

for command in git gh tar sha256sum; do
  if ! command -v "$command" >/dev/null 2>&1; then
    echo "$command is required" >&2
    exit 1
  fi
done

assert_path_exists() {
  local path="$1"
  local message="$2"
  if [[ ! -e "$path" ]]; then
    echo "$message" >&2
    exit 1
  fi
}

mkdir -p "$TEMP_REPO/.github/workflows"
git init "$TEMP_REPO" >/dev/null

pushd "$TEMP_REPO" >/dev/null
git config user.name basecoat-consumer-test
git config user.email basecoat-consumer-test@example.com

cat > .github/base-coat.lock.json <<EOF
{
  "baseCoatRepo": "$BASECOAT_REPO",
  "version": "$BASECOAT_VERSION",
  "installPath": ".github/base-coat",
  "checksumRequired": true
}
EOF

mkdir -p "$DOWNLOAD_DIR"
GH_PAGER=cat gh release download "$BASECOAT_VERSION" --repo "$BASECOAT_REPO" --pattern 'base-coat-*.tar.gz' --pattern 'base-coat-*.zip' --pattern 'SHA256SUMS.txt' --dir "$DOWNLOAD_DIR"

assert_path_exists "$DOWNLOAD_DIR/SHA256SUMS.txt" "Checksum file missing from release download"
pushd "$DOWNLOAD_DIR" >/dev/null
sha256sum -c SHA256SUMS.txt
popd >/dev/null

archive="$(find "$DOWNLOAD_DIR" -name 'base-coat-*.tar.gz' | head -n 1)"
assert_path_exists "$archive" "Release archive not downloaded"

tar -xzf "$archive" -C "$TEMP_REPO"
assert_path_exists "$TEMP_REPO/base-coat" "Expected extracted base-coat folder not found"
mv "$TEMP_REPO/base-coat" "$TEMP_REPO/.github/base-coat"

for path in \
  "$TEMP_REPO/.github/base-coat/instructions" \
  "$TEMP_REPO/.github/base-coat/skills" \
  "$TEMP_REPO/.github/base-coat/prompts" \
  "$TEMP_REPO/.github/base-coat/agents" \
  "$TEMP_REPO/.github/base-coat/version.json"; do
  assert_path_exists "$path" "Installed baseline missing: $path"
done

bash "$TEMP_REPO/.github/base-coat/scripts/validate-basecoat.sh" "$TEMP_REPO/.github/base-coat"
echo "Consumer smoke test passed in $TEMP_REPO"
popd >/dev/null