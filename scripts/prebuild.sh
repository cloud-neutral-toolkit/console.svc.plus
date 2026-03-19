#!/usr/bin/env bash
set -euo pipefail

# Prebuild script for console.svc.plus
# This script runs all necessary preparation steps before building the application

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/.."

echo "======================================"
echo "Starting prebuild process..."
echo "======================================"

# Step 1: Sync documentation from service repositories
echo ""
echo "[1/2] Generating static content..."
npx tsx scripts/generate-content.ts

# Step 2: Build contentlayer
echo ""
echo "[2/2] Building contentlayer..."
node scripts/build-contentlayer.mjs

echo ""
echo "======================================"
echo "Prebuild complete!"
echo "======================================"
