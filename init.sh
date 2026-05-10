#!/usr/bin/env bash
# H-Orchestra harness gatekeeper.
# Exit 0 = safe to proceed. Non-zero = stop and fix.
# Hooks (PostToolUse, Stop) invoke this script with output redirected to
# /tmp/harness_init.log. Run manually with `./init.sh` to see colored output.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

LOG_FILE="/tmp/harness_init.log"
TS="$(date '+%Y-%m-%d %H:%M:%S')"
EXIT_CODE=0

# --- helpers ----------------------------------------------------------------

is_tty() { [ -t 1 ]; }
if is_tty; then
  C_RED=$'\e[31m'; C_GRN=$'\e[32m'; C_YLW=$'\e[33m'; C_DIM=$'\e[2m'; C_RST=$'\e[0m'
else
  C_RED=""; C_GRN=""; C_YLW=""; C_DIM=""; C_RST=""
fi

ok()   { echo "${C_GRN}[OK]${C_RST}   $*"; }
warn() { echo "${C_YLW}[WARN]${C_RST} $*"; }
fail() { echo "${C_RED}[FAIL]${C_RST} $*"; EXIT_CODE=1; }
info() { echo "${C_DIM}[..]${C_RST}   $*"; }

# --- 1. Node version --------------------------------------------------------

if ! command -v node >/dev/null 2>&1; then
  fail "node not found on PATH"
else
  NODE_VER="$(node --version | sed 's/^v//')"
  NODE_MAJOR="$(echo "$NODE_VER" | cut -d. -f1)"
  NODE_MINOR="$(echo "$NODE_VER" | cut -d. -f2)"
  if [ "$NODE_MAJOR" -gt 20 ] || { [ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -ge 11 ]; }; then
    ok "node $NODE_VER (>= 20.11)"
  else
    fail "node $NODE_VER is below required >= 20.11"
  fi
fi

# --- 2. pnpm available ------------------------------------------------------

if ! command -v pnpm >/dev/null 2>&1; then
  fail "pnpm not found on PATH (try: npm install -g pnpm@9 or corepack enable)"
else
  ok "pnpm $(pnpm --version)"
fi

# --- 3. Required harness files exist ---------------------------------------

REQUIRED_FILES=(
  "CLAUDE.md"
  "AGENTS.md"
  "CHECKPOINTS.md"
  "feature_list.json"
  "progress/current.md"
  "progress/history.md"
  "docs/architecture.md"
  "docs/conventions.md"
  "docs/verification.md"
  ".claude/agents/leader.md"
  ".claude/agents/implementer.md"
  ".claude/agents/reviewer.md"
)

for f in "${REQUIRED_FILES[@]}"; do
  if [ -f "$f" ]; then
    ok "file: $f"
  else
    fail "missing required file: $f"
  fi
done

# --- 4. feature_list.json validity -----------------------------------------

if [ -f "feature_list.json" ]; then
  if VALIDATION="$(node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('feature_list.json', 'utf8'));
    if (!Array.isArray(data.features)) throw new Error('features is not an array');
    const valid = new Set(['pending','in_progress','done','blocked']);
    const inProgress = [];
    for (const f of data.features) {
      if (!f.id) throw new Error('feature missing id');
      if (!valid.has(f.status)) throw new Error('bad status on '+f.id+': '+f.status);
      if (f.status === 'in_progress') inProgress.push(f.id);
    }
    if (inProgress.length > 1) throw new Error('multiple in_progress: '+inProgress.join(','));
    process.stdout.write(JSON.stringify({total: data.features.length, inProgress: inProgress[0] || null}));
  " 2>&1)"; then
    TOTAL="$(echo "$VALIDATION" | node -e "process.stdout.write(JSON.parse(require('fs').readFileSync(0,'utf8')).total.toString())")"
    IN_PROG="$(echo "$VALIDATION" | node -e "let d=JSON.parse(require('fs').readFileSync(0,'utf8')); process.stdout.write(d.inProgress || 'none')")"
    ok "feature_list.json valid ($TOTAL features, in_progress=$IN_PROG)"
  else
    fail "feature_list.json invalid: $VALIDATION"
  fi
fi

# --- 5. Optional typecheck --------------------------------------------------

if [ -z "${SKIP_TYPECHECK:-}" ] && [ -f "package.json" ]; then
  if grep -q '"typecheck"' package.json; then
    info "running pnpm typecheck (set SKIP_TYPECHECK=1 to skip)"
    if pnpm -s typecheck >/tmp/harness-typecheck.log 2>&1; then
      ok "pnpm typecheck"
    else
      fail "pnpm typecheck failed (see /tmp/harness-typecheck.log)"
    fi
  fi
fi

# --- 6. Optional tests ------------------------------------------------------

if [ -z "${SKIP_TESTS:-}" ] && [ -f "package.json" ]; then
  if grep -q '"test"' package.json; then
    info "running pnpm test (set SKIP_TESTS=1 to skip)"
    if pnpm -s test >/tmp/harness-test.log 2>&1; then
      ok "pnpm test"
    else
      fail "pnpm test failed (see /tmp/harness-test.log)"
    fi
  fi
fi

# --- 7. Summary -------------------------------------------------------------

echo
if [ $EXIT_CODE -eq 0 ]; then
  echo "${C_GRN}[OK] Harness ready${C_RST}"
  printf '%s [OK] init.sh exit 0\n' "$TS" >> "$LOG_FILE"
else
  echo "${C_RED}[FAIL] Harness not ready — fix errors above${C_RST}"
  printf '%s [FAIL] init.sh exit %d\n' "$TS" "$EXIT_CODE" >> "$LOG_FILE"
fi

exit $EXIT_CODE
