#!/usr/bin/env bash
set -euo pipefail

CONTENT_DIR="src/content"
REPO_URL="https://github.com/photo-workspace/content.onwalk.net.git"

if [ -d "${CONTENT_DIR}/.git" ]; then
  git -C "${CONTENT_DIR}" fetch --depth=1 origin main
  git -C "${CONTENT_DIR}" reset --hard origin/main
  git -C "${CONTENT_DIR}" clean -fdx
  exit 0
fi

if [ -d "${CONTENT_DIR}" ]; then
  if [ -z "$(ls -A "${CONTENT_DIR}" 2>/dev/null)" ]; then
    rmdir "${CONTENT_DIR}"
  else
    TMP_DIR=$(mktemp -d)
    trap 'rm -rf "${TMP_DIR}"' EXIT
    git clone --depth=1 "${REPO_URL}" "${TMP_DIR}/repo"
    mkdir -p "${CONTENT_DIR}"
    rm -rf "${CONTENT_DIR:?}/"* "${CONTENT_DIR:?}"/.[!.]* "${CONTENT_DIR:?}"/..?* 2>/dev/null || true
    tar -C "${TMP_DIR}/repo" -cf - . | tar -C "${CONTENT_DIR}" -xf -
    exit 0
  fi
fi

git clone --depth=1 "${REPO_URL}" "${CONTENT_DIR}"
