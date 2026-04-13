#!/usr/bin/env bash
set -euo pipefail

target_host="${TARGET_HOST:?TARGET_HOST is required}"
canonical_domain="${CANONICAL_DOMAIN:?CANONICAL_DOMAIN is required}"
served_domains="${SERVED_DOMAINS:?SERVED_DOMAINS is required}"
expected_image_ref="${EXPECTED_FRONTEND_IMAGE:?EXPECTED_FRONTEND_IMAGE is required}"
request_base_url="${REQUEST_BASE_URL:-http://127.0.0.1:3000}"

remote_args=(
  "$(printf '%q' "${canonical_domain}")"
  "$(printf '%q' "${served_domains}")"
  "$(printf '%q' "${expected_image_ref}")"
  "$(printf '%q' "${request_base_url}")"
)

ssh -o BatchMode=yes "root@${target_host}" "bash -s -- ${remote_args[*]}" \
  < scripts/github-actions/verify-frontend-release.sh
