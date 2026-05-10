#!/usr/bin/env bash
set -euo pipefail

echo "=== H-Orchestra Init ==="

# --- Harness structure check ---
HARNESS_OK=1
for f in \
  "AGENTS.md" \
  "CHECKPOINTS.md" \
  "progress/current.md" \
  "progress/history.md" \
  "docs/architecture.md" \
  "docs/conventions.md" \
  "docs/verification.md" \
  ".claude/agents/leader.md" \
  ".claude/agents/implementer.md" \
  ".claude/agents/reviewer.md"
do
  if [ ! -f "$f" ]; then
    echo "ERROR: Missing harness file: $f"
    HARNESS_OK=0
  fi
done
if [ "$HARNESS_OK" -eq 0 ]; then
  exit 1
fi
echo "Harness structure ✓"

# --- Node version check ---
NODE_MAJOR=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "ERROR: Node.js >= 20 required (found $(node --version))"
  exit 1
fi
echo "Node $(node --version) ✓"

# --- pnpm check ---
if ! command -v pnpm &> /dev/null; then
  echo "pnpm not found — installing via npm..."
  npm install -g pnpm
fi
echo "pnpm $(pnpm --version) ✓"

# --- Install dependencies ---
echo ""
echo "Installing workspace dependencies..."
pnpm install --frozen-lockfile

# --- Build shared package (backend + frontend both depend on it) ---
echo ""
echo "Building @h-orchestra/shared..."
pnpm --filter @h-orchestra/shared build

# --- Type-check all packages ---
echo ""
echo "Type-checking all packages..."
pnpm typecheck

# --- Production build smoke test ---
echo ""
echo "Running production build..."
pnpm build

echo ""
echo "=== Init complete ==="
echo "Dev:        MOUNT_PATH=/path/to/repo pnpm dev"
echo "Production: REPO_PATH=/path/to/repo docker compose up"
