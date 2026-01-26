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
echo "[1/4] Syncing documentation content..."
bash scripts/sync-doc-content.sh

# Step 2: Sync blog content
echo ""
echo "[2/4] Syncing blog content..."
bash scripts/sync-blog-content.sh

# Step 3: Generate static content (homepage, products)
echo ""
echo "[3/4] Generating static content..."
npx tsx scripts/generate-content.ts

# Step 4: Build contentlayer
echo ""
echo "[4/4] Building contentlayer..."
node scripts/build-contentlayer.mjs

echo ""
echo "======================================"
echo "Prebuild complete!"
echo "======================================"
