# Skill: Performance Optimization

Patterns and strategies for optimizing React application performance in this project.

## Rendering Optimization

### Prevent Unnecessary Re-renders

**Problem**: Parent state changes cause all children to re-render.

**Solution**: Use `React.memo` for pure presentational components:

```tsx
import { memo } from "react";

interface StatDisplayProps {
  label: string;
  value: string | number;
}

export const StatDisplay = memo(function StatDisplay({
  label,
  value,
}: StatDisplayProps): React.JSX.Element {
  return (
    <div className="rounded-md bg-muted p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
});
```

### Stabilize Event Handlers

**Problem**: New function reference on every render breaks `React.memo`.

**Solution**: Use `useCallback` for handlers passed to memoized children:

```typescript
import { useCallback } from "react";

export function useItemActions(onUpdate: (id: string) => void) {
  const handleEdit = useCallback(
    (id: string) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  const handleDelete = useCallback((id: string) => {
    // deletion logic
  }, []);

  return { handleEdit, handleDelete } as const;
}
```

### Memoize Expensive Computations

**Problem**: Expensive filtering/sorting runs on every render.

**Solution**: Use `useMemo` with correct dependencies:

```typescript
import { useMemo } from "react";

interface DataItem {
  id: string;
  category: string;
  value: number;
}

export function useFilteredData(items: readonly DataItem[], category: string): readonly DataItem[] {
  return useMemo(
    () => items.filter(item => item.category === category).sort((a, b) => b.value - a.value),
    [items, category]
  );
}
```

## Code Splitting

### Route-Level Splitting (Required)

All routes must use `React.lazy` with `Suspense`:

```tsx
import { lazy, Suspense } from "react";
import { PageLoader } from "@/components/shared";

function lazyLoad(importFn: () => Promise<{ default: React.ComponentType }>): React.JSX.Element {
  const LazyComponent = lazy(importFn);
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent />
    </Suspense>
  );
}

// Usage in routes
const dashboardRoute = lazyLoad(() => import("@/pages/private/dashboard"));
const loginRoute = lazyLoad(() => import("@/pages/public/login"));
```

### Component-Level Splitting (When Needed)

For heavy components not visible on initial render:

```tsx
import { lazy, Suspense } from "react";

const HeavyChart = lazy(() => import("@/features/dashboard/HeavyChart"));

export function DashboardView(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}
```

## Bundle Size

### Barrel Export Discipline

Avoid re-exporting everything — only export what's used:

```typescript
// GOOD — selective exports
export { Button, buttonVariants } from "./button";
export { Card, CardHeader, CardTitle, CardContent } from "./card";

// BAD — wildcard re-exports pull in everything
export * from "./button";
export * from "./card";
export * from "./dialog"; // Dialog may not be needed everywhere
```

### Import Only What You Need

```typescript
// GOOD — tree-shakeable
import { format, parseISO } from "date-fns";

// BAD — imports entire library
import * as dateFns from "date-fns";
```

## Memory Leak Prevention

### Effect Cleanup

Always clean up subscriptions, timers, and event listeners:

```typescript
import { useEffect } from "react";

export function useEventListener(eventName: string, handler: (event: Event) => void): void {
  useEffect(() => {
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, handler]);
}
```

### AbortController for Fetch

```typescript
import { useState, useEffect } from "react";

export function useFetch<T>(url: string): { data: T | null; isLoading: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData(): Promise<void> {
      try {
        const response = await fetch(url, { signal: controller.signal });
        const json = (await response.json()) as T;
        setData(json);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Fetch failed:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    void fetchData();
    return () => controller.abort();
  }, [url]);

  return { data, isLoading };
}
```

## List Rendering

### Stable Keys

```tsx
// GOOD — stable unique identifier
{
  items.map(item => <ListItem key={item.id} data={item} />);
}

// BAD — index as key for dynamic lists
{
  items.map((item, index) => <ListItem key={index} data={item} />);
}

// BAD — random key
{
  items.map(item => <ListItem key={Math.random()} data={item} />);
}
```

### Virtualization for Large Lists

For lists with 100+ items, consider virtualization:

```tsx
// Use @tanstack/react-virtual or react-window for large datasets
// Only render visible items to reduce DOM nodes
```

## Image Optimization

### Prevent Layout Shift

Always specify dimensions:

```tsx
<img
  src={imageUrl}
  alt="User avatar"
  width={48}
  height={48}
  className="size-12 rounded-full object-cover"
  loading="lazy"
/>
```

## Performance Checklist

- [ ] No unnecessary re-renders (verify with React DevTools Profiler)
- [ ] `useMemo` for expensive computations with correct deps
- [ ] `useCallback` for handlers passed to `React.memo` children
- [ ] Stable, unique `key` props on all lists
- [ ] Route-level code splitting via `React.lazy`
- [ ] No memory leaks (effects clean up properly)
- [ ] Bundle size checked (no accidental large imports)
- [ ] Images have explicit dimensions
- [ ] Selective barrel exports (no wildcard re-exports of heavy modules)
