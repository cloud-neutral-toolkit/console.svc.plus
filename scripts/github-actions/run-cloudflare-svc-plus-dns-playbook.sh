#!/usr/bin/env bash
set -euo pipefail

target_host="${TARGET_HOST:?TARGET_HOST is required}"
run_apply="${RUN_APPLY:?RUN_APPLY is required}"

ansible_args=(
  -i inventory.ini
  update_cloudflare_svc_plus_dns.yml
  -e "{\"cloudflare_dns_source_hosts\":[\"${target_host}\"]}"
  -e "CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is required}"
  -e "CLOUDFLARE_DNS_API_TOKEN=${CLOUDFLARE_DNS_API_TOKEN:?CLOUDFLARE_DNS_API_TOKEN is required}"
)

if [[ "${run_apply}" != "true" ]]; then
  ansible_args=(-C "${ansible_args[@]}")
fi

ansible-playbook "${ansible_args[@]}"
