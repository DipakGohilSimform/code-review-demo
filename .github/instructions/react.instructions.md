---
applyTo: "src/**/*.{ts,tsx}"
---

# React & TypeScript Instructions

Rules for all React components, hooks, and TypeScript files.

## Component Rules

### Structure

- Functional components only — no class components
- Components must be pure — side effects isolated in `useEffect`
- No anonymous components — always use named function declarations or named const
- One component per file (except small compound sub-components)

### Props

- Type all props with `interface` for object shapes
- Use `type` for unions and intersections
- Always provide a `className?: string` prop on visual components
- Use `React.JSX.Element` as return type for components

### Template

```tsx
import { cn } from "@/lib/utils";
import type { ComponentNameProps } from "./componentTypes";

interface ComponentNameProps {
  title: string;
  variant?: "default" | "outline";
  className?: string;
}

export function ComponentName({
  title,
  variant = "default",
  className,
}: ComponentNameProps): React.JSX.Element {
  return <div className={cn("rounded-lg bg-card p-4", className)}>{title}</div>;
}
```

## Hook Rules

### Structure

- File name: camelCase prefixed with `use` (e.g., `useAuth.ts`)
- All hooks live in `src/hooks/` — never inside feature folders
- Always declare explicit return types
- Document parameters and return values with JSDoc

### Patterns

- Complete dependency arrays — no missing deps
- No async functions directly inside `useEffect` — use inner async pattern
- Cleanup subscriptions and timers in `useEffect` return
- Use `useCallback` only when passing handlers to memoized children
- Use `useMemo` only for genuinely expensive computations

### Template

```typescript
import { useState, useEffect, useCallback } from "react";

interface UseDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useData<T>(url: string): UseDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData(): Promise<void> {
      try {
        setIsLoading(true);
        const response = await fetch(url, { signal: controller.signal });
        const json = (await response.json()) as T;
        setData(json);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    void fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, isLoading, error };
}
```

## TypeScript Rules

- No `any` — use `unknown`, generics, or union types
- No unsafe `as X` assertions without justification comment
- Use `satisfies` over `as` where possible
- Use `as const` objects or union string literals instead of `enum`
- Generics should have constraints (`<T extends object>`, not just `<T>`)
- Respect `strictNullChecks` — no implicit nullable access
- Prefer `type` for computed/union types, `interface` for extendable shapes

## State Management

- Colocate state at the lowest needed level
- No prop drilling beyond 2 levels — use Context or composition
- Context is for infrequently changing values — not rapid state updates
- For forms, use `react-hook-form` + `zod` schema validation

## Error Handling

- Wrap lazy routes in `<ErrorBoundary>` (from `@/components/shared`)
- API calls must have try/catch with typed error handling
- Never swallow errors silently — log or display to user
- Use `error` boundaries at route level, not component level

## Routing

- All routes defined in `src/routes/index.tsx`
- All page components use default exports (required for `React.lazy`)
- Use `lazyLoad()` helper that wraps with `<Suspense fallback={<PageLoader />}>`
- Two layout patterns: `AuthLayout` (public) and `PrivateLayout` (protected)
