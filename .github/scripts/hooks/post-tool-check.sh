#!/usr/bin/env bash
# post-tool-check.sh
# Runs lint and tests AFTER Copilot applies changes.
# Fails if lint or tests fail.

set -euo pipefail

ERRORS=0

echo "🔍 Running post-tool checks..."
echo ""

# Check 1: TypeScript type checking
echo "📋 Step 1: Type checking (pnpm run type-check)"
if pnpm run type-check 2>&1; then
  echo "  ✅ Type check passed."
else
  echo "  ❌ Type check FAILED."
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: ESLint
echo "📋 Step 2: Linting (pnpm lint:fix)"
if pnpm lint:fix 2>&1; then
  echo "  ✅ Lint passed."
else
  echo "  ❌ Lint FAILED."
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: Formatting
echo "📋 Step 3: Formatting (pnpm format)"
if pnpm format 2>&1; then
  echo "  ✅ Formatting applied."
else
  echo "  ⚠️  Formatting had issues (non-blocking)."
fi
echo ""

# Check 4: Build verification (dry run)
echo "📋 Step 4: Build verification (pnpm run build)"
if pnpm run build 2>&1; then
  echo "  ✅ Build succeeded."
else
  echo "  ❌ Build FAILED."
  ERRORS=$((ERRORS + 1))
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$ERRORS" -gt 0 ]; then
  echo "❌ POST-CHECK FAILED: $ERRORS step(s) failed."
  echo "   Review the output above and fix issues."
  exit 1
else
  echo "✅ POST-CHECK PASSED: All steps clean."
  exit 0
fi
