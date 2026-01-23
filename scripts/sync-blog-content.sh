#!/usr/bin/env bash
set -euo pipefail

CONTENT_DIR="src/content/blogs"
REPO_URL="https://github.com/cloud-neutral-workshop/knowledge.git"

# Ensure we're in the project root
cd "$(dirname "$0")/.."

if [ -d "${CONTENT_DIR}/.git" ]; then
  echo "Updating existing git repo in ${CONTENT_DIR}..."
  git -C "${CONTENT_DIR}" fetch --depth=1 origin main
  git -C "${CONTENT_DIR}" reset --hard origin/main
  git -C "${CONTENT_DIR}" clean -fdx
  exit 0
fi

echo "Syncing content from ${REPO_URL} to ${CONTENT_DIR}..."

TMP_DIR=$(mktemp -d)
trap 'rm -rf "${TMP_DIR}"' EXIT

git clone --depth=1 "${REPO_URL}" "${TMP_DIR}/repo"

mkdir -p "${CONTENT_DIR}"

# Remove existing content but keep the directory
# Find and delete all files and directories inside CONTENT_DIR, but ignore errors if empty
find "${CONTENT_DIR}" -mindepth 1 -delete 2>/dev/null || true

# Copy content from repo to content dir, excluding .git
tar -C "${TMP_DIR}/repo" --exclude='.git' -cf - . | tar -C "${CONTENT_DIR}" -xf -

echo "Content synced successfully."
