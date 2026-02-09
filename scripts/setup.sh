#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  setup.sh <repo_name_or_dir> [--repo <git_url>] [--ref <git_ref>] [--dir <path>]

Examples:
  # Recommended (remote install):
  # curl -fsSL "https://raw.githubusercontent.com/cloud-neutral-toolkit/console.svc.plus/main/scripts/setup.sh?$(date +%s)" | bash -s -- console.svc.plus
  #
  # Local file:
  # bash scripts/setup.sh console.svc.plus

Notes:
  - This script clones the repo (if missing), installs dependencies, and prints next steps.
  - No secrets are written. If .env does not exist, it will copy .env.example -> .env.
EOF
}

log() {
  printf '[setup] %s\n' "$*"
}

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log "missing required command: $1"
    exit 1
  fi
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" || "${1:-}" == "" ]]; then
  usage
  exit 0
fi

NAME="$1"
shift

REPO_URL=""
REF="main"
DIR="$NAME"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      REPO_URL="${2:-}"; shift 2 ;;
    --ref)
      REF="${2:-}"; shift 2 ;;
    --dir)
      DIR="${2:-}"; shift 2 ;;
    *)
      log "unknown arg: $1"
      usage
      exit 2
      ;;
  esac
done

if [[ -z "${REPO_URL}" ]]; then
  REPO_URL="https://github.com/cloud-neutral-toolkit/${NAME}.git"
fi

need_cmd bash
need_cmd git
need_cmd curl

if [[ -e "${DIR}" && ! -d "${DIR}" ]]; then
  log "path exists and is not a directory: ${DIR}"
  exit 2
fi

if [[ ! -d "${DIR}" ]]; then
  log "cloning ${REPO_URL} (ref=${REF}) -> ${DIR}"
  git clone --depth 1 --branch "${REF}" "${REPO_URL}" "${DIR}"
else
  if [[ -d "${DIR}/.git" ]]; then
    log "repo directory already exists: ${DIR} (will not change branches automatically)"
  else
    log "directory already exists but is not a git repo: ${DIR}"
    exit 2
  fi
fi

cd "${DIR}"

if [[ -f ".nvmrc" ]]; then
  NODE_REQ="$(cat .nvmrc | tr -d ' \t\r\n')"
  if [[ -n "${NODE_REQ}" ]]; then
    log "Node.js required (from .nvmrc): ${NODE_REQ}"
  fi
fi

if ! command -v node >/dev/null 2>&1; then
  log "node is not installed. Install Node.js first, then re-run:"
  log "  bash scripts/setup.sh ${NAME} --dir ${DIR}"
  exit 1
fi

if command -v corepack >/dev/null 2>&1; then
  log "enabling corepack (yarn)"
  corepack enable >/dev/null 2>&1 || true
fi

if ! command -v yarn >/dev/null 2>&1; then
  log "yarn is not available. If you have corepack, try:"
  log "  corepack enable"
  log "Or install yarn, then re-run."
  exit 1
fi

log "installing dependencies (yarn install)"
yarn install

if [[ ! -f ".env" && -f ".env.example" ]]; then
  log "creating .env from .env.example (no secrets included)"
  cp .env.example .env
fi

log "setup complete"
log "next:"
log "  cd ${DIR}"
log "  yarn dev"

