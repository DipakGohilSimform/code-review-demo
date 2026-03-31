---
applyTo: "**"
---

# Global Instructions

These rules apply to ALL files in the project. No exceptions.

## Tech Stack

- React 19 + TypeScript 5 (strict mode)
- Tailwind CSS v4 (semantic tokens only)
- shadcn/ui (Radix-based, CVA variants)
- React Router v7 (lazy + Suspense)
- Vite (ESM only)
- ESLint + Prettier
- pnpm package manager

## Absolute Prohibitions

1. **No `any` type** — use `unknown`, generics, or proper union types
2. **No inline styles** — use Tailwind utility classes exclusively
3. **No Tailwind arbitrary values** — `bg-[#fff]`, `w-[123px]`, `text-[14px]` are forbidden
4. **No CSS Modules** — Tailwind v4 utility classes only
5. **No native HTML buttons** — use shadcn `<Button>` from `@/components/ui`
6. **No native HTML inputs** — use shadcn `<Input>` from `@/components/ui`
7. **No `ts-ignore` or `ts-nocheck`** — fix the type error properly
8. **No `console.log` in production code** — use a logger utility
9. **No commented-out code blocks** — delete dead code
10. **No `eval()` or `new Function()`** — security risk
11. **No CommonJS `require()`** — ESM `import` only
12. **No `process.env`** — use `import.meta.env` with `VITE_` prefix
13. **No secrets or API keys in source code**

## Required Patterns

1. **Path aliases** — always use `@/` imports (never relative `../..` for src files)
2. **Barrel exports** — every component/feature folder must have an `index.ts`
3. **`cn()` utility** — use `cn()` from `@/lib/utils` for conditional class merging
4. **Semantic Tailwind tokens** — `bg-background`, `text-foreground`, `border-border`, etc.
5. **Explicit return types** — all exported functions and hooks must declare return types
6. **Dark mode** — use `dark:` variants with semantic colors

## Naming Conventions

| Type       | Convention             | Example             | Extension   |
| ---------- | ---------------------- | ------------------- | ----------- |
| Folders    | kebab-case             | `user-profile/`     | N/A         |
| Components | PascalCase             | `UserCard.tsx`      | `.tsx`      |
| Hooks      | camelCase + `use`      | `useAuth.ts`        | `.ts`       |
| Context    | PascalCase + `Context` | `AuthContext.tsx`   | `.tsx`      |
| Services   | camelCase + `Service`  | `authService.ts`    | `.ts`       |
| Utils      | camelCase              | `dateFormatter.ts`  | `.ts`       |
| Types      | camelCase + `Types`    | `authTypes.ts`      | `.ts`       |
| Tests      | Same as source + test  | `UserCard.test.tsx` | `.test.tsx` |

## Import Order

```typescript
// 1. External libraries
import { useState } from "react";

// 2. Internal aliases (@/)
import { Button } from "@/components/ui";

// 3. Relative imports
import { localHelper } from "./helpers";

// 4. Type-only imports
import type { UserProps } from "@/types/userTypes";
```

## Quality Gate

Every change must pass:

1. `pnpm run type-check` — zero type errors
2. `pnpm lint:fix` — zero ESLint errors
3. `pnpm format` — consistent formatting
