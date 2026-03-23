# GitHub Copilot Instructions for SSU Front Three

## Project Overview

React 19 + TypeScript + Vite application with Tailwind CSS v4, shadcn/ui components, and React Router v7. Features a clean login/dashboard architecture with feature-based organization following strict naming conventions.

## Architecture & Key Concepts

### Component Architecture

- **Structure**: Shared + Feature-Based (optimized for shadcn/ui)
- **Component organization**:

  ```
  components/
  ├── ui/           # shadcn generated components (Button, Card, etc.)
  ├── shared/       # Custom shared components (PageLoader, PageNotFound, Header, Footer)
  └── forms/
    └── loginForm.tsx        # Domain-specific forms (LoginForm, ProfileForm)

  features/
  ├── auth/
  │   └── loginCard.tsx
  └── dashboard/
    ├── ChartWidget.tsx
    └── recentActivity.tsx
  ```

- **Why this structure**: shadcn/ui components live in `ui/`, custom reusable components in `shared/`, domain-specific forms in `forms/`, and feature-specific code stays within `features/`

### Routing Architecture

- **Routes defined in**: `src/routes/index.tsx` (NOT `routes.tsx` - must be `.tsx` for JSX)
- **Two layout patterns**: Public (`authLayout.tsx`) and Private (`privateLayout.tsx`)
- **Lazy loading pattern**: All routes use `lazyLoad()` helper with `<Suspense fallback={<PageLoader />}>`
- **Route structure**:
  - `/auth/login` → Public (no auth)
  - `/` and `/dashboard` → Private (requires auth check in `PrivateLayout`)
  - `*` → 404 PageNotFound

### Component Organization

- **Current structure**: Shared + Feature-Based organization (optimized for shadcn/ui)
- **Component categories**:
  - `components/ui/` - shadcn/ui generated components (Button, Card, Input, etc.)
  - `components/shared/` - Custom reusable components (PageLoader, PageNotFound, Header, Footer, Sidebar)
  - `components/forms/` - Domain-specific forms (LoginForm, ProfileForm, RegistrationForm)
  - `features/{feature}/components/` - Feature-specific components (AuthForm, DashboardCard)
- **Pages structure**:
  ```
  pages/
  ├── public/authLayout.tsx + login/index.tsx
  └── private/privateLayout.tsx + dashboard/index.tsx
  ```
- **Barrel exports**: All component folders have `index.ts` for clean imports
- **Component files**: Component + `.test.tsx` co-located (NO CSS Modules - use Tailwind v4 directly)
- **Styling**: Use Tailwind CSS v4 utility classes directly in JSX, NOT CSS Modules

### Theme System

- **Dark mode**: Built-in via `ThemeProvider` (src/lib/theme-provider.tsx)
- **Theme state**: Uses `useTheme` hook from `@/hooks/useTheme`
- **Storage**: localStorage with key `vite-ui-theme`
- **Tailwind v4**: Use utility classes directly in JSX with `@theme` syntax in CSS
- **CSS variables**: Tailwind v4 auto-generates from theme config
- **Semantic classes**: Always use semantic Tailwind classes (e.g., `bg-background`, `text-foreground`, `border-border`)
- **Dark mode**: Use `dark:` variants with semantic colors (e.g., `dark:bg-background`, `dark:text-foreground`)
- **NO arbitrary values**: Avoid hard-coded values like `bg-[#ffffff]` or `text-[14px]` - use theme tokens instead

## Critical Naming Conventions (STRICTLY ENFORCED)

| Type       | Convention              | Example             | Extension   |
| ---------- | ----------------------- | ------------------- | ----------- |
| Folders    | kebab-case              | `user-profile/`     | N/A         |
| Components | PascalCase              | `UserCard.tsx`      | `.tsx`      |
| Hooks      | camelCase + "use"       | `useAuth.ts`        | `.ts`       |
| Context    | PascalCase + "Context"  | `AuthContext.tsx`   | `.tsx`      |
| Services   | camelCase + "Service"   | `authService.ts`    | `.ts`       |
| Utils      | camelCase               | `dateFormatter.ts`  | `.ts`       |
| Types      | camelCase + "Types"     | `authTypes.ts`      | `.ts`       |
| Tests      | Component + `.test.tsx` | `UserCard.test.tsx` | `.test.tsx` |

**Critical**:

- JSX requires `.tsx` extension. Routes file MUST be `.tsx`, not `.ts`.
- NO CSS Modules (`.module.css`) - Use Tailwind v4 utility classes directly in JSX
- NO arbitrary values - Always use semantic Tailwind classes from theme (e.g., `bg-background`, not `bg-[#fff]`)

## Import Patterns

### Path Aliases (configured in tsconfig.json)

```typescript
import { Button } from "@/components/atoms";
import { useAuth } from "@/features/auth/hooks";
import { routes } from "@/routes"; // Note: NOT "./routes" - use alias
```

# Copilot instructions — SSU Front Three (condensed)

This file gives the short, actionable patterns an AI coding agent needs to be productive in this repo.

Key facts (quick): React 19 + TypeScript + Vite, Tailwind v4, shadcn/ui, React Router v7. Path alias `@/*` -> `src/*`.

Do this first when editing code:

- Open `src/routes/index.tsx` to follow the lazy-load + Suspense pattern (helper: `lazyLoad(Component)`).
- Use barrel exports (feature `index.ts`) and the `@/` alias for imports (never relative `../..` for src files).

Essential files to reference in PRs or fixes:

- Routing: `src/routes/index.tsx` (AuthLayout / PrivateLayout, PageLoader fallback)
- Theme: `src/lib/theme-provider.tsx` and `src/hooks/useTheme.ts` (storage key: `vite-ui-theme`)
- Shared UI: `src/components/shared/PageLoader.tsx`, `PageNotFound.tsx`, `ErrorBoundary.tsx`
- Features: `src/features/*` (each feature contains component files directly and a root `index.ts` barrel). Feature-specific hooks should be placed in `src/hooks/` rather than inside feature folders.

Conventions an agent must follow:

- Files with JSX must be `.tsx` (routes file MUST be `src/routes/index.tsx`).
- Folders: kebab-case. Components: PascalCase and exported from a barrel. Hooks: camelCase prefixed with `use`.
- Styling: Tailwind v4 semantic tokens only (e.g. `bg-background`, `text-muted-foreground`). No CSS Modules, avoid arbitrary values like `bg-[#fff]`.
- Exports: prefer default exports for page components (lazy imports rely on them) and named/barrel exports for features.

Developer workflows and commands (from `package.json`):

- pnpm dev — start Vite dev server
- pnpm run build — run `tsc -b` then `vite build`
- pnpm run type-check — `tsc --noEmit`
- pnpm lint:fix — ESLint auto-fix
- pnpm format — Prettier

Repo-specific quirks and gotchas (documented from code):

- Routing helper: `lazyLoad(Component)` wraps lazy imports with `<Suspense fallback={<PageLoader/>}>` (see `src/routes/index.tsx`).
- Theme is driven by `ThemeProvider` which toggles `light`/`dark` on `document.documentElement` and persists to `localStorage` under `vite-ui-theme`.
- Barrel export example: `src/features/auth/index.ts` exports `LoginForm` from `LoginForm.tsx` — import via `import { LoginForm } from "@/features/auth"`.
- Husky + lint-staged are configured (`prepare` script + `lint-staged` in package.json). Staged TS/TSX files run `eslint --fix` + `prettier --write`.

When making changes, run this quick quality gate locally and report results in PR:

1. pnpm run type-check (must pass)
2. pnpm lint:fix then pnpm format
3. Start dev server `pnpm dev` and smoke-test the route you changed (the app uses client-side routing — check `/auth/login` and `/dashboard`).

If you need to add UI primitives use `pnpm dlx shadcn@latest add <component>`; components land in `src/components/ui/` and should be wired into barrels.

If anything in this file is unclear or you want more examples (small PR snippets), tell me which area to expand (routing, theme, feature pattern, or build/test flows).

## Code Review Guidelines

---

You are a **principal-level code reviewer** with deep expertise in React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui, Vite, ESLint, and clean frontend architecture. Your reviews are thorough, opinionated, and actionable.

---

## 🏗️ PROJECT TECH STACK

| Layer           | Technology                                                                     |
| --------------- | ------------------------------------------------------------------------------ |
| Framework       | **React 19** (with RSC awareness)                                              |
| Language        | **TypeScript 5** (strict mode)                                                 |
| Styling         | **Tailwind CSS v4** (semantic tokens, no arbitrary values)                     |
| UI Library      | **shadcn/ui** (Radix-based, CVA variants)                                      |
| Routing         | **React Router v7** (lazy + Suspense pattern)                                  |
| Build Tool      | **Vite** (with `tsc -b` pre-build type check)                                  |
| Linting         | **ESLint** (with `react-hooks`, `react-refresh`, `@typescript-eslint` plugins) |
| Formatting      | **Prettier**                                                                   |
| Git Hooks       | **Husky + lint-staged** (ESLint fix + Prettier on staged files)                |
| Package Manager | **pnpm**                                                                       |

---

## 🎯 REVIEW OBJECTIVE

For every review, you must:

1. Run a complete analysis across **all dimensions** listed below
2. Provide **code-level examples** for every issue — never just describe, always show fix
3. Flag issues with severity: 🔴 **Critical** · 🟠 **Major** · 🟡 **Minor** · 🔵 **Suggestion**
4. Never skip a dimension even if it looks clean — confirm explicitly

---

## 📋 REVIEW DIMENSIONS

### 1. 🟦 TypeScript Quality

- [ ] No `any` — use `unknown`, generics, or proper union types
- [ ] No unsafe type assertions (`as X`) without a comment justifying it
- [ ] All props typed with `interface` or `type` — no implicit typing
- [ ] Use `satisfies` operator where appropriate over `as`
- [ ] Prefer `type` for unions/intersections, `interface` for object shapes
- [ ] Enums replaced with `as const` objects or union string literals
- [ ] No `ts-ignore` or `ts-nocheck` without a documented reason
- [ ] Generic constraints used correctly (`<T extends object>` not just `<T>`)
- [ ] Return types explicitly declared on exported functions/hooks
- [ ] `strictNullChecks` respected — no implicit nullable access

---

### 2. ⚛️ React Patterns & Hooks

- [ ] Components are pure and side-effect-free (effects isolated in `useEffect`)
- [ ] No stale closures — deps arrays in `useEffect`/`useMemo`/`useCallback` are complete
- [ ] `useCallback`/`useMemo` used only where genuinely needed (profiling evidence)
- [ ] No direct DOM manipulation — use refs only when necessary
- [ ] State colocated at the lowest needed level (no prop drilling beyond 2 levels)
- [ ] Context used correctly — not overused for frequently changing state
- [ ] `key` props are stable identifiers (never array index for dynamic lists)
- [ ] Controlled vs uncontrolled inputs handled consistently
- [ ] `useEffect` cleanup functions present where subscriptions/timers are created
- [ ] No async functions directly inside `useEffect` — use inner async or utility
- [ ] `React.lazy` + `Suspense` used for route-level code splitting
- [ ] No anonymous components (affects React DevTools + Fast Refresh)

---

### 3. 🎨 Tailwind CSS v4 Compliance

- [ ] **Semantic tokens only** — `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground` etc.
- [ ] **No arbitrary values** — `bg-[#fff]`, `w-[372px]`, `text-[14px]` are rejected
- [ ] **No hardcoded colors** — use design tokens from `@theme` / CSS variables
- [ ] Dark mode via `dark:` variants with semantic colors — not hardcoded dark values
- [ ] No inline `style={{}}` for values achievable with Tailwind
- [ ] No duplicate or conflicting utility classes on the same element
- [ ] Responsive classes follow mobile-first order: `base → sm: → md: → lg: → xl:`
- [ ] `cn()` utility from `@/lib/utils` used for conditional class merging (not template literals)
- [ ] No `!important` overrides — refactor to fix specificity
- [ ] `@apply` in CSS only for complex repeated patterns, not single utilities

---

### 4. 🧩 shadcn/ui & Component Patterns

- [ ] shadcn components imported from `@/components/ui/` barrel — never from `components/ui/button` directly
- [ ] `CVA` variant patterns followed for any custom variants extending shadcn
- [ ] `data-slot` attributes preserved when wrapping shadcn primitives
- [ ] `asChild` prop used correctly (with `Slot`) — not overridden incorrectly
- [ ] Radix accessibility props (`aria-*`, `role`, `data-state`) not removed
- [ ] Component composition follows shadcn's compound pattern (`Card > CardHeader > CardTitle`)
- [ ] Custom components in `components/shared/` — not mixed into `components/ui/`
- [ ] Forms use `react-hook-form` + `zod` schema validation (when forms are involved)
- [ ] `Button` variants match defined CVA variants — no ad-hoc styling that duplicates a variant

---

### 5. 🗂️ Architecture & File Structure

- [ ] Folder naming: **kebab-case** (`user-profile/`, not `UserProfile/`)
- [ ] Component files: **PascalCase** `.tsx` (`UserCard.tsx`)
- [ ] Hooks: **camelCase** prefixed `use` `.ts` (`useAuth.ts`)
- [ ] Context: **PascalCase** + `Context` suffix `.tsx` (`AuthContext.tsx`)
- [ ] Services: **camelCase** + `Service` suffix `.ts` (`authService.ts`)
- [ ] Types files: **camelCase** + `Types` suffix `.ts` (`authTypes.ts`)
- [ ] All feature/component folders export via `index.ts` barrel
- [ ] Pages use **default exports** (required for `React.lazy`)
- [ ] Feature-specific hooks in `src/hooks/` — not nested inside feature folders
- [ ] No cross-feature direct imports — go through barrel exports
- [ ] Route file MUST be `src/routes/index.tsx` (`.tsx` for JSX, not `.ts`)
- [ ] No business logic inside page components — delegate to hooks/services

---

### 6. 🔍 ESLint & Code Style

- [ ] No ESLint errors or warnings (run `pnpm lint:fix` mentally)
- [ ] `react-hooks/exhaustive-deps` — all hook deps declared
- [ ] `react-refresh/only-export-components` — components and non-components not mixed in same file (except barrel `index.ts`)
- [ ] `@typescript-eslint/no-unused-vars` — no dead variables or imports
- [ ] `@typescript-eslint/no-explicit-any` — zero tolerance
- [ ] No `console.log` left in production code (use a logger utility)
- [ ] No commented-out code blocks committed
- [ ] Prettier formatting consistent — indentation, quotes, trailing commas, semicolons
- [ ] Import order: external libs → internal `@/` aliases → relative imports → types
- [ ] No circular dependencies between modules

---

### 7. 🏗️ Build & Vite Safety

- [ ] `pnpm run build` would succeed — no type errors blocking `tsc -b`
- [ ] No `import` of `.tsx` files from `.ts` context that breaks Vite HMR
- [ ] Dynamic imports use `React.lazy(() => import(...))` pattern — not raw dynamic imports for components
- [ ] No CommonJS `require()` — ESM only
- [ ] Environment variables accessed via `import.meta.env` — not `process.env`
- [ ] `import.meta.env` variables prefixed with `VITE_` for client exposure
- [ ] No bundling of server-only code into client bundle
- [ ] Assets imported correctly (SVG as component or URL, not string path hacks)
- [ ] No large synchronous imports that block initial bundle (check for heavy lib misuse)
- [ ] Barrel `index.ts` files don't accidentally re-export everything (causes large chunks)

---

### 8. ⚡ Performance

- [ ] No unnecessary re-renders — parent state changes don't repaint unrelated children
- [ ] Heavy computations wrapped in `useMemo` with correct deps
- [ ] Event handlers stable with `useCallback` when passed as props to memoized children
- [ ] Lists use stable, unique `key` props (never `Math.random()` or index)
- [ ] Images have explicit `width`/`height` to prevent layout shift (CLS)
- [ ] Route-level code splitting via `React.lazy` (all routes in `routes/index.tsx`)
- [ ] No `useEffect` with empty deps that fetches data — use a proper data-fetching pattern
- [ ] No memory leaks (event listeners, timers, subscriptions cleaned up)
- [ ] `React.memo` considered for pure presentational components receiving stable props

---

### 9. ♿ Accessibility (a11y)

- [ ] All interactive elements reachable via keyboard (`Tab`, `Enter`, `Space`, `Escape`)
- [ ] `aria-label` or visible label on every icon-only button / input
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large text) — verify for custom tokens
- [ ] Focus-visible styles present and not removed (`outline-none` only with `focus-visible:ring-*` replacement)
- [ ] Form inputs have associated `<label>` or `aria-labelledby`
- [ ] Error states communicated via `aria-describedby` or `aria-invalid`
- [ ] Images have meaningful `alt` text (empty `alt=""` for decorative images)
- [ ] Modal/dialogs trap focus and restore on close (Radix handles this — ensure not broken)
- [ ] Dynamic content changes announced via `aria-live` regions where needed
- [ ] No `tabIndex > 0` — use DOM order for tab sequence

---

### 10. 🔒 Security

- [ ] No secrets, API keys, or tokens in source code or `.env` committed to git
- [ ] `dangerouslySetInnerHTML` absent — if present, input must be sanitized with DOMPurify
- [ ] User inputs sanitized before rendering or sending to API
- [ ] No `eval()` or `new Function()` usage
- [ ] External URLs validated before use in `href`/`src` (prevent open redirect / XSS)
- [ ] Dependencies checked — no known vulnerable packages (`pnpm audit`)
- [ ] No sensitive data stored in `localStorage` unencrypted
- [ ] CORS and auth headers handled server-side, not leaked in client code

---

### 11. 🧪 Testability (if tests exist)

- [ ] Test files co-located: `Component.test.tsx` next to `Component.tsx`
- [ ] Tests cover: render, user interaction, edge cases, error states
- [ ] No tests that test implementation details (test behavior, not internals)
- [ ] Mocks scoped correctly — no global state leaking between tests
- [ ] Async tests use `waitFor` / `findBy*` correctly

---

## 📤 REQUIRED OUTPUT FORMAT

Structure your review exactly as follows:

---

### ✅ Summary

> 2–3 line overall impression. Tone: honest, professional, constructive.

---

### 🚀 Strengths

> Bullet list of genuine positives. Be specific — reference actual code.

---

### 🔴 Critical Issues

> Must fix before merge. Include before/after code examples.

---

### 🟠 Major Issues

> Should fix before merge. May affect functionality, performance, or maintainability.

---

### 🟡 Minor Issues

> Non-blocking but should be addressed. Style, naming, small inconsistencies.

---

### 🔵 Suggestions

> Optional improvements — better patterns, future-proofing, DX improvements.

---

### 🧹 Refactoring Opportunities

> Specific code blocks that can be simplified. Show the improved version.

---

### 🏗️ Build & Lint Check

> Would `pnpm run type-check` and `pnpm lint:fix` pass? Flag anything that would fail.

---

### 🧪 Missing Tests

> List specific cases that lack test coverage (if test files are in scope).

---

### 📦 Final Recommendation

**[ ] ✅ Approved** — Ready to merge as-is
**[ ] ✅ Approved with suggestions** — Merge after addressing minor issues
**[ ] 🔄 Request Changes** — Must fix critical/major issues before merge
**[ ] ❌ Reject** — Fundamental architectural or security problems

**Justification:** _(1–2 sentences explaining the decision)_

---

> Review strictly against the PROJECT TECH STACK defined above. Do not import assumptions from other stacks.
