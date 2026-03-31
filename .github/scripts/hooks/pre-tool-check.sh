#!/usr/bin/env bash
# pre-tool-check.sh
# Validates code quality BEFORE Copilot applies changes.
# Blocks the operation if violations are found.

set -euo pipefail

ERRORS=0
FILES_TO_CHECK=""

# Collect staged files or changed files (tsx/ts only)
if git diff --cached --name-only 2>/dev/null | grep -qE '\.(tsx?|ts)$'; then
  FILES_TO_CHECK=$(git diff --cached --name-only | grep -E '\.(tsx?|ts)$')
elif [ -n "${CHANGED_FILES:-}" ]; then
  FILES_TO_CHECK="$CHANGED_FILES"
else
  FILES_TO_CHECK=$(find src -name '*.tsx' -o -name '*.ts' 2>/dev/null || true)
fi

if [ -z "$FILES_TO_CHECK" ]; then
  echo "✅ No TypeScript files to check."
  exit 0
fi

echo "🔍 Running pre-tool checks..."
echo ""

# Check 1: No inline styles (style={{}})
echo "📋 Check 1: Inline styles"
INLINE_STYLES=$(echo "$FILES_TO_CHECK" | xargs grep -rn 'style={{' 2>/dev/null || true)
if [ -n "$INLINE_STYLES" ]; then
  echo "❌ BLOCKED: Inline styles detected. Use Tailwind utility classes instead."
  echo "$INLINE_STYLES"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ No inline styles found."
fi

# Check 2: No Tailwind arbitrary values
echo "📋 Check 2: Tailwind arbitrary values"
ARBITRARY_VALUES=$(echo "$FILES_TO_CHECK" | xargs grep -rnE '(className|class)=.*\[#[0-9a-fA-F]+\]|w-\[[0-9]+px\]|h-\[[0-9]+px\]|text-\[[0-9]+px\]|m[tblrxy]?-\[[0-9]+px\]|p[tblrxy]?-\[[0-9]+px\]|bg-\[#' 2>/dev/null || true)
if [ -n "$ARBITRARY_VALUES" ]; then
  echo "❌ BLOCKED: Tailwind arbitrary values detected. Use semantic tokens or standard utilities."
  echo "$ARBITRARY_VALUES"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ No arbitrary values found."
fi

# Check 3: No native <button> elements (must use shadcn Button)
echo "📋 Check 3: Native <button> elements"
NATIVE_BUTTONS=$(echo "$FILES_TO_CHECK" | xargs grep -rnE '<button[\s>]' 2>/dev/null | grep -v 'node_modules' | grep -v '.test.' | grep -v 'components/ui/button' || true)
if [ -n "$NATIVE_BUTTONS" ]; then
  echo "❌ BLOCKED: Native <button> detected. Use shadcn <Button> from @/components/ui."
  echo "$NATIVE_BUTTONS"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ No native <button> elements found."
fi

# Check 4: No 'any' type usage
echo "📋 Check 4: TypeScript 'any' type"
ANY_TYPES=$(echo "$FILES_TO_CHECK" | xargs grep -rnE ':\s*any\b|<any>|as\s+any' 2>/dev/null | grep -v 'node_modules' | grep -v '.d.ts' || true)
if [ -n "$ANY_TYPES" ]; then
  echo "❌ BLOCKED: 'any' type detected. Use unknown, generics, or proper union types."
  echo "$ANY_TYPES"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ No 'any' types found."
fi

# Check 5: No console.log in production code
echo "📋 Check 5: console.log statements"
CONSOLE_LOGS=$(echo "$FILES_TO_CHECK" | xargs grep -rn 'console\.log' 2>/dev/null | grep -v 'node_modules' | grep -v '.test.' || true)
if [ -n "$CONSOLE_LOGS" ]; then
  echo "⚠️  WARNING: console.log detected. Use a logger utility for production code."
  echo "$CONSOLE_LOGS"
  echo ""
fi

# Check 6: No ts-ignore or ts-nocheck
echo "📋 Check 6: TypeScript suppressions"
TS_IGNORE=$(echo "$FILES_TO_CHECK" | xargs grep -rnE '@ts-ignore|@ts-nocheck' 2>/dev/null | grep -v 'node_modules' || true)
if [ -n "$TS_IGNORE" ]; then
  echo "❌ BLOCKED: @ts-ignore/@ts-nocheck detected. Fix the type error properly."
  echo "$TS_IGNORE"
  echo ""
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ No TypeScript suppressions found."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$ERRORS" -gt 0 ]; then
  echo "❌ PRE-CHECK FAILED: $ERRORS violation(s) found."
  echo "   Fix all issues before proceeding."
  exit 1
else
  echo "✅ PRE-CHECK PASSED: All checks clean."
  exit 0
fi
