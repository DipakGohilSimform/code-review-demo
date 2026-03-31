---
applyTo: "src/**"
---

# Architecture Instructions

Rules for project structure, file organization, and module boundaries.

## Directory Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui generated components ONLY
│   ├── shared/          # Custom reusable components (Header, Footer, PageLoader, ErrorBoundary)
│   └── forms/           # Domain-specific form components
├── features/
│   ├── auth/            # Auth feature (LoginForm, etc.)
│   ├── dashboard/       # Dashboard feature (StatsCard, RecentActivity, etc.)
│   └── {feature-name}/  # New features follow this pattern
├── hooks/               # ALL hooks (including feature-specific)
├── lib/                 # Utilities (theme-provider.tsx, utils.ts)
├── pages/
│   ├── public/          # authLayout.tsx + public page folders
│   └── private/         # privateLayout.tsx + protected page folders
├── routes/              # index.tsx — single route declaration file
├── services/            # API services ({name}Service.ts)
└── types/               # Shared type definitions ({name}Types.ts)
```

## Module Boundaries

### Feature Isolation

- Each feature folder is self-contained with components and a barrel `index.ts`
- Features MUST NOT import directly from other features — go through barrel exports
- Feature-specific hooks go in `src/hooks/`, NOT inside feature folders
- Feature-specific types go in `src/types/`, NOT inside feature folders

### Barrel Exports

Every component/feature folder MUST have an `index.ts` that re-exports public API:

```typescript
// src/features/auth/index.ts
export { LoginForm } from "./LoginForm";
```

```typescript
// src/components/ui/index.ts
export { Button, buttonVariants } from "./button";
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";
export { Input } from "./input";
export { Label } from "./label";
```

### Import Rules

- Always use `@/` path alias — never relative `../..` for anything in `src/`
- Relative imports allowed only within the same directory or immediate children
- Import from barrel exports, not individual files

```typescript
// CORRECT
import { Button } from "@/components/ui";
import { LoginForm } from "@/features/auth";
import { useAuth } from "@/hooks";

// FORBIDDEN
import { Button } from "@/components/ui/button";
import { LoginForm } from "../../features/auth/LoginForm";
```

## Page Components

### Rules

- Page components use **default exports** (required for `React.lazy`)
- Pages contain NO business logic — delegate to hooks and services
- Pages compose feature components and shared components
- Each page folder has an `index.tsx` as the entry point

### Template

```tsx
// src/pages/private/dashboard/index.tsx
import { DashboardOverview, StatsCard } from "@/features/dashboard";
import { Header } from "@/components/shared";

export default function DashboardPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 space-y-6 p-6">
        <DashboardOverview />
        <StatsCard />
      </main>
    </div>
  );
}
```

## Routing

### Single Route File

All routes are declared in `src/routes/index.tsx`. This file MUST be `.tsx` (contains JSX).

### Lazy Loading

All page imports use the `lazyLoad()` helper:

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
```

### Layout Patterns

- `AuthLayout` — wraps public routes (login, register, about)
- `PrivateLayout` — wraps protected routes (dashboard, settings), includes auth check

## Services

### Structure

- File name: camelCase + `Service` suffix (e.g., `authService.ts`)
- Services handle API calls and data transformation
- Services return typed data — never `any`
- Use `fetch` with proper error handling and AbortController

### Template

```typescript
// src/services/authService.ts
import type { LoginCredentials, AuthResponse } from "@/types/authTypes";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  return response.json() as Promise<AuthResponse>;
}
```

## Build & Vite

- ESM only — no CommonJS `require()`
- Environment variables: `import.meta.env.VITE_*`
- Dynamic imports: `React.lazy(() => import(...))` pattern only
- Assets: import SVGs correctly (as component or URL)
- Barrel exports must be selective — avoid re-exporting everything to prevent chunk bloat
