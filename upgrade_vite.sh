#!/usr/bin/env bash
set -euo pipefail

echo "== Quantum Charts: Upgrade Vite + toolchain =="

cd /home/user/OGAIQCHARTS

echo "[1/6] Node version check..."
NODE_VER=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
NODE_MINOR=$(echo "$NODE_VER" | cut -d. -f2)

echo "Node detected: v$NODE_VER"

echo "[2/6] Removing old caches/locks..."
rm -rf node_modules .vite node_modules/.vite dist build out .cache
rm -f package-lock.json pnpm-lock.yaml yarn.lock bun.lockb

echo "[3/6] Choosing Vite target..."
# Vite 6 requires Node 20.19+ (or 22.12+). If older, stay on Vite 5.
USE_VITE6=0
if [ "$NODE_MAJOR" -gt 20 ]; then USE_VITE6=1; fi
if [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -ge 19 ]; then USE_VITE6=1; fi

if [ "$USE_VITE6" -eq 1 ]; then
  echo "Node is new enough -> upgrading to latest Vite"
  npm install -D vite@latest @vitejs/plugin-react@latest typescript@latest
else
  echo "Node too old for Vite 6 -> upgrading to stable Vite 5"
  npm install -D vite@^5 @vitejs/plugin-react@^4 typescript@latest
fi

echo "[4/6] Updating common React deps..."
npm install react@latest react-dom@latest react-router-dom@latest lucide-react@latest axios@latest || true

echo "[5/6] Fresh install..."
npm install

echo "[6/6] Done. Start server with:"
echo "npm run dev -- --port 9002 --host 0.0.0.0"
