#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${WEB_SITE_MCP_ACCESS_TOKEN:-}" ]]; then
  echo "WEB_SITE_MCP_ACCESS_TOKEN is required for meta-index MCP server." >&2
  exit 1
fi

npm run prebuild
npm run build

npm run mcp:server:meta-index &
MCP_PID=$!

cleanup() {
  if kill -0 "$MCP_PID" 2>/dev/null; then
    kill "$MCP_PID"
  fi
}

trap cleanup EXIT

npm run start
