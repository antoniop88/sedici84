#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Deploy nuxt-starter from $ROOT_DIR"

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "==> Pulling latest changes"
  git pull --ff-only
fi

echo "==> Installing dependencies"
corepack enable
pnpm install --frozen-lockfile

echo "==> Building production output"
export NITRO_PRESET="${NITRO_PRESET:-node-server}"
pnpm build

mkdir -p logs

if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe nuxt-starter >/dev/null 2>&1; then
    echo "==> Reloading PM2 process (zero-downtime)"
    pm2 reload ecosystem.config.cjs --update-env
  else
    echo "==> Starting PM2 process"
    pm2 start ecosystem.config.cjs
  fi
  pm2 save
else
  echo "PM2 not found. Start manually: node .output/server/index.mjs"
fi

echo "==> Deploy complete"
