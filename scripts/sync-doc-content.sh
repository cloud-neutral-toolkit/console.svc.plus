#!/usr/bin/env bash
set -euo pipefail

CONTENT_DIR="src/content/doc"
REPO_URL="https://github.com/cloud-neutral-workshop/knowledge.git"
SOURCE_PATH="docs"

# Ensure we're in the project root
cd "$(dirname "$0")/.."

if [ -d "${CONTENT_DIR}/.git" ]; then
  echo "Updating existing git repo in ${CONTENT_DIR}..."
  git -C "${CONTENT_DIR}" fetch --depth=1 origin main
  git -C "${CONTENT_DIR}" reset --hard origin/main
  git -C "${CONTENT_DIR}" clean -fdx
  exit 0
fi

echo "Syncing docs content from ${REPO_URL}/${SOURCE_PATH} to ${CONTENT_DIR}..."

TMP_DIR=$(mktemp -d)
trap 'rm -rf "${TMP_DIR}"' EXIT

git clone --depth=1 "${REPO_URL}" "${TMP_DIR}/repo"

mkdir -p "${CONTENT_DIR}"

# Remove existing content but keep the directory
# Find and delete all files and directories inside CONTENT_DIR, but ignore errors if empty
find "${CONTENT_DIR}" -mindepth 1 -delete 2>/dev/null || true

# Copy only the docs/ directory from repo to content dir, excluding .git
if [ -d "${TMP_DIR}/repo/${SOURCE_PATH}" ]; then
  tar -C "${TMP_DIR}/repo/${SOURCE_PATH}" --exclude='.git' -cf - . | tar -C "${CONTENT_DIR}" -xf -
  echo "Docs content synced successfully from ${SOURCE_PATH}/"
else
  echo "Warning: ${SOURCE_PATH}/ directory not found in repository"
  exit 1
fi
