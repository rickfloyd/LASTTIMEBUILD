#!/usr/bin/env bash
# firebase_nuke_reset.sh
# Hard-clean all build/runtime caches WITHOUT deleting your source code.
# Safe for Vite + Firebase Hosting projects.

set -euo pipefail

echo "== Quantum Charts: Firebase/Vite NUKE RESET =="
echo "Project dir: $(pwd)"
echo

echo "[1/8] Stopping any running dev servers..."
# try to stop politely, then force
pkill -f vite 2>/dev/null || true
pkill -f node 2>/dev/null || true

echo "[2/8] Removing node + Vite build caches..."
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml yarn.lock bun.lockb

# Vite / bundler caches
rm -rf .vite
rm -rf node_modules/.vite
rm -rf node_modules/.cache
rm -rf .cache
rm -rf .turbo
rm -rf dist build out .output

# Firebase local artifacts (NOT your firebase.json or .firebaserc)
rm -rf .firebase
rm -rf .firebaserc.bak firebase-debug.log

echo "[3/8] Clearing npm cache (safe)..."
npm cache clean --force || true

echo "[4/8] Reinstalling dependencies fresh..."
npm install

echo "[5/8] Verifying core deps exist..."
node -e "require('react'); require('react-dom'); console.log('react ok')"
node -e "try{require('react-router-dom');console.log('router ok')}catch(e){console.log('router missing')}"
node -e "try{require('lucide-react');console.log('lucide ok')}catch(e){console.log('lucide missing')}"
node -e "try{require('axios');console.log('axios ok')}catch(e){console.log('axios missing')}"
node -e "try{require('three');console.log('three ok')}catch(e){console.log('three missing')}"

echo "[6/8] Starting Vite on Firebase Studio port 9002..."
# Use your package.json dev script if present, else fallback to npx vite.
if node -e "const p=require('./package.json'); process.exit(!(p.scripts&&p.scripts.dev))"; then
  npm run dev -- --port 9002 --host 0.0.0.0
else
  npx vite --port 9002 --host 0.0.0.0
fi

echo "[7/8] If preview is still white:"
echo "  - Hard refresh preview: Ctrl+Shift+R"
echo "  - Make sure preview URL matches Vite Network URL (10.x.x.x:9002)"
echo "  - If using a service worker/PWA, unregister it in DevTools > Application > Service Workers"

echo "[8/8] Done."
