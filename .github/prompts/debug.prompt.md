---
agent: agent
description: Systematically diagnose and fix bugs, type errors, runtime errors, and build failures in the project.
---

# Debug Code

Systematically find and fix issues in the codebase.

## Input Required

- **Error description**: What's happening (error message, unexpected behavior, build failure)
- **File(s) affected**: Path to relevant files (or "unknown" to search)
- **Steps to reproduce** (if available): How to trigger the issue

## Debugging Process

### Step 1 — Classify the Error

| Error Type      | Diagnostic Approach                           |
| --------------- | --------------------------------------------- |
| Type error      | Run `pnpm run type-check`, read TSC output    |
| ESLint error    | Run `pnpm lint:fix`, check rule violations    |
| Build failure   | Run `pnpm run build`, check Vite + TSC output |
| Runtime error   | Check browser console, trace component tree   |
| Rendering issue | Inspect component props, state, and effects   |
| Routing issue   | Check `src/routes/index.tsx` and layouts      |
| Styling issue   | Verify Tailwind tokens and `cn()` usage       |

### Step 2 — Root Cause Analysis

1. **Read the error message carefully** — most errors tell you exactly what's wrong
2. **Trace the data flow** — follow props/state from source to render
3. **Check common pitfalls**:
   - Missing dependency in `useEffect`/`useMemo`/`useCallback`
   - Stale closure over state variable
   - Missing barrel export
   - Wrong import path (relative vs `@/` alias)
   - Missing default export on page component (breaks `React.lazy`)
   - Wrong file extension (`.ts` instead of `.tsx` for JSX)
   - `process.env` instead of `import.meta.env`

### Step 3 — Apply Fix

Follow these rules when fixing:

- Fix the root cause, not the symptom
- Don't add `ts-ignore` or `any` to silence type errors
- Don't add `eslint-disable` comments
- Maintain all project conventions (naming, imports, styling)
- Add proper error handling if the bug was caused by missing error handling
- If fixing a hook dependency, verify no infinite loop is introduced

### Step 4 — Verify

After applying the fix:

1. `pnpm run type-check` — must pass
2. `pnpm lint:fix` — must pass
3. Confirm the original error is resolved
4. Check for regressions in related components

## Common Fixes Reference

### Type Errors

```typescript
// Problem: Type 'string | undefined' is not assignable to type 'string'
// Fix: Add nullish coalescing or optional chaining
const name = user?.name ?? "Unknown";
```

### Missing Export

```typescript
// Problem: Module '"@/features/auth"' has no exported member 'LoginForm'
// Fix: Update barrel export
// src/features/auth/index.ts
export { LoginForm } from "./LoginForm";
```

### Stale Closure

```typescript
// Problem: useEffect reads stale state
// Fix: Add state to dependency array
useEffect(() => {
  fetchData(currentPage);
}, [currentPage]); // currentPage was missing from deps
```

### Build Failure — Wrong Extension

```typescript
// Problem: JSX in .ts file
// Fix: Rename file from .ts to .tsx
// routes/index.ts → routes/index.tsx
```

### Runtime — Lazy Load Failure

```typescript
// Problem: React.lazy expects default export
// Fix: Add default export to page component
export default function DashboardPage(): React.JSX.Element { ... }
```

## Output Format

```
### Diagnosis
[What the error is and why it happens]

### Root Cause
[The specific code causing the issue]

### Fix
[Complete corrected code]

### Verification
[Commands to run to verify the fix]
```

## Constraints

- Never silence errors with `any`, `ts-ignore`, or `eslint-disable`
- Always fix root cause, not symptoms
- Maintain all project conventions
- Verify fix passes type-check and lint
