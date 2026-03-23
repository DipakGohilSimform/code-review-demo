# Design System - Dipak Gohil Dashboard

A comprehensive guide for design-to-code integration, component patterns, and design tokens for the React 19 + TypeScript + Tailwind CSS v4 application.

---

## 1. Project Overview

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Theme System**: Light/Dark mode with localStorage persistence
- **Routing**: React Router v7 with lazy-loaded routes
- **Structure**: Feature-based architecture with shared components

---

## 2. Design Tokens

### 2.1 Color System (oklch Color Space)

All colors use OK LCH (Oklch) color space for perceptually uniform color scales.

#### Light Mode (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `oklch(1 0 0)` | Page background |
| `foreground` | `oklch(0.145 0 0)` | Primary text |
| `card` | `oklch(1 0 0)` | Card backgrounds |
| `card-foreground` | `oklch(0.145 0 0)` | Card text |
| `primary` | `oklch(0.205 0 0)` | Main action color (dark) |
| `primary-foreground` | `oklch(0.985 0 0)` | Text on primary |
| `secondary` | `oklch(0.97 0 0)` | Secondary actions |
| `secondary-foreground` | `oklch(0.205 0 0)` | Text on secondary |
| `muted` | `oklch(0.97 0 0)` | Disabled/inactive elements |
| `muted-foreground` | `oklch(0.556 0 0)` | Muted text |
| `accent` | `oklch(0.97 0 0)` | Accent color |
| `accent-foreground` | `oklch(0.205 0 0)` | Text on accent |
| `destructive` | `oklch(0.577 0.245 27.325)` | Danger/error color (red) |
| `border` | `oklch(0.922 0 0)` | Border color |
| `input` | `oklch(0.922 0 0)` | Input field backgrounds |
| `ring` | `oklch(0.708 0 0)` | Focus ring color |

#### Dark Mode

All colors automatically inverse for dark mode via `.dark` class on `<html>`:
- Backgrounds become darker (`oklch(0.145 0 0)`)
- Text becomes lighter (`oklch(0.985 0 0)`)
- Borders adapt with opacity (`oklch(1 0 0 / 10%)`)

```css
/* Applied automatically when dark mode is enabled */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  /* ... etc */
}
```

### 2.2 Semantic Color Tokens

**Use semantic tokens, never hard-coded hex values:**

✅ Correct:
```tsx
<button className="bg-primary text-primary-foreground" />
<div className="bg-background border-border" />
```

❌ Wrong:
```tsx
<button className="bg-[#205]" /> {/* Avoid arbitrary values */}
<div className="bg-white" /> {/* Avoid hard values */}
```

### 2.3 Component-Specific Tokens

#### Table Tokens
- `table-header`: `#d1d2d5` (light), `oklch(0.25 0 0)` (dark)
- `table-text`: `#191e2e` (light), `oklch(0.985 0 0)` (dark)
- `table-stripe`: `#f6f8fa` (light), `oklch(0.205 0 0)` (dark)
- `table-border`: `#e8e9ea` (light), `oklch(1 0 0 / 10%)` (dark)
- `table-hover`: `#eef2f6` (light), `oklch(0.3 0 0)` (dark)

#### Tag/Badge Tokens
- `tag-success-bg`: `#dbf6cb` (light), `oklch(0.25 0.08 145)` (dark)
- `tag-success-border`: `#c7e9bd` (light), `oklch(0.3 0.08 145)` (dark)
- `tag-success-text`: `#17793f` (light), `oklch(0.75 0.15 145)` (dark)

#### Pagination Tokens
- `pagination-bg`: `#e2f0f5` (light), `oklch(0.269 0 0)` (dark)
- `pagination-active`: `#33c9fd` (light), `oklch(0.65 0.15 200)` (dark)
- `pagination-text`: `#047296` (light), `oklch(0.65 0.1 200)` (dark)

#### Chart Colors
5 chart colors for data visualization:
- `chart-1`: Orange-ish `oklch(0.646 0.222 41.116)` / `oklch(0.488 0.243 264.376)` (dark)
- `chart-2`: Blue `oklch(0.6 0.118 184.704)` / `oklch(0.696 0.17 162.48)` (dark)
- `chart-3`: Purple `oklch(0.398 0.07 227.392)` / `oklch(0.769 0.188 70.08)` (dark)
- `chart-4`: Lime `oklch(0.828 0.189 84.429)` / `oklch(0.627 0.265 303.9)` (dark)
- `chart-5`: Red `oklch(0.769 0.188 70.08)` / `oklch(0.645 0.246 16.439)` (dark)

### 2.4 Spacing Scale

Via Tailwind CSS, variables defined in `index.css`:

```css
--radius: 0.625rem;           /* 10px */
--radius-sm: calc(--radius - 4px);   /* 6px */
--radius-md: calc(--radius - 2px);   /* 8px */
--radius-lg: var(--radius);          /* 10px */
--radius-xl: calc(--radius + 4px);   /* 14px */
```

**Tailwind spacing scale (default):**
- `p-2`: 0.5rem (8px) — small padding
- `p-4`: 1rem (16px) — default padding
- `p-6`: 1.5rem (24px) — large padding
- `gap-2`, `gap-4`, `gap-6` — apply to flex/grid containers

### 2.5 Typography

**Font Stack:** Tailwind default (system fonts)

**Size Classes:**
- `text-xs`: 0.75rem (12px) — labels, badges
- `text-sm`: 0.875rem (14px) — body text, descriptions
- `text-base`: 1rem (16px) — default body
- `text-xl`: 1.25rem (20px) — card titles
- `text-2xl`: 1.5rem (24px) — section headers
- `text-3xl`: 1.875rem (30px) — page headers

**Font Weight:**
- `font-medium`: 500 — normal weight
- `font-semibold`: 600 — headers
- `font-bold`: 700 — emphasized text

---

## 3. Component Library

### 3.1 Exported Components

All components are **exported from barrel files** using path alias `@/`:

```typescript
// ✅ Correct imports
import { Button, Card } from "@/components";
import { LoginForm } from "@/features/auth";
import { DashboardOverview } from "@/features/dashboard";
```

#### UI Components (`@/components/ui/*`)

**shadcn/ui Generated:**
- `Button` — Action button with variants (default, destructive, outline, secondary, ghost, link)
- `Card`, `CardHeader`, `CardTitle`, `CardDescription` — Container component

**Custom UI:**
- `Table` — Data table component

#### Shared Components (`@/components/shared/*`)

- `Header` — Top navigation header
- `PageLoader` — Loading skeleton state
- `PageNotFound` — 404 error page
- `ErrorBoundary` — Error handling wrapper

#### Form Components (`@/components/forms/*`)

(Currently empty—add domain-specific forms here)

```typescript
// Example structure (when forms are added)
export { LoginForm } from "./LoginForm";
export { ProfileForm } from "./ProfileForm";
```

#### Feature Components (`@/features/{feature}/*`)

**Auth Feature:**
- `LoginForm` — Login form component

**Dashboard Feature:**
- `DashboardOverview` — Dashboard main layout
- `StatsCard` — Statistics card component
  - Props: `title`, `value`, `delta`, `deltaColor` ("green"|"red"|"muted"), `smallText`, `className`
- `RecentActivity` — Activity feed component
- `ProvidersTable` — Data table for providers

---

## 4. Component Patterns

### 4.1 Button Component

**Variants:**
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>
```

**Sizes:**
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### 4.2 Card Component

**Basic Card:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  {/* Content */}
</Card>
```

**StatsCard (Dashboard):**
```tsx
<StatsCard
  title="Total Users"
  value="2,543"
  delta="+12% from last month"
  deltaColor="green"
  className="p-6"
/>
```

**Color Indicators for Delta:**
- `green` → `text-green-600` (positive metrics)
- `red` → `text-red-600` (negative metrics)
- `muted` → `text-muted-foreground` (neutral)

### 4.3 DashboardOverview Layout

```tsx
<div className="space-y-6">
  {/* Header: Title + Button */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold">Dashboard Demo</h1>
      <p className="text-muted-foreground">Welcome back message</p>
    </div>
    <Button>Add New</Button>
  </div>

  {/* Stats Grid: 8 cards, 4 columns (lg), 2 columns (md) */}
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {/* StatsCard items */}
  </div>

  {/* Recent Activity: 2 columns (md) */}
  <div className="grid gap-4 md:grid-cols-2">
    {/* RecentActivity components */}
  </div>
</div>
```

### 4.4 RecentActivity Pattern

```tsx
<Card className="p-6">
  <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
  <div className="space-y-4">
    <div className="flex items-start gap-4">
      <div className="h-2 w-2 mt-2 rounded-full bg-primary" /> {/* Dot indicator */}
      <div className="flex-1">
        <p className="text-sm font-medium">Activity title</p>
        <p className="text-xs text-muted-foreground">2 hours ago</p>
      </div>
    </div>
  </div>
</Card>
```

---

## 5. Responsive Breakpoints

Tailwind CSS default breakpoints:

| Preset | Min Width | Class Prefix |
|--------|-----------|--------------|
| Mobile | None | (none) |
| Tablet | 768px | `md:` |
| Desktop | 1024px | `lg:` |
| Large Desktop | 1280px | `xl:` |

**Dashboard Grid Example:**
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {/* Mobile: 1 column (auto) */}
  {/* Tablet (768px+): 2 columns */}
  {/* Desktop (1024px+): 4 columns */}
</div>
```

---

## 6. Theme Implementation

### 6.1 Theme Provider Setup

Located at `src/lib/theme-provider.tsx`:

```typescript
export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme" }) {
  // Manages light/dark mode toggle
  // Persists to localStorage
  // Updates document.documentElement class
}
```

### 6.2 Using the Theme Hook

```typescript
import { useTheme } from "@/hooks/useTheme";

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

### 6.3 Theme Switching

**Automatically applied via `.dark` class:**

```html
<!-- Light mode (default) -->
<html>

<!-- Dark mode -->
<html class="dark">
```

All Tailwind `dark:` variants automatically activate.

---

## 7. File Structure & Organization

```
src/
├── components/              # Shared UI components
│   ├── ui/                 # shadcn/ui generated components
│   │   ├── button.tsx      # Button with variants (CVA)
│   │   ├── card.tsx        # Card container components
│   │   ├── Table.tsx       # Data table
│   │   └── index.ts        # Re-exports
│   ├── shared/             # Custom reusable components
│   │   ├── Header.tsx      # Top navigation
│   │   ├── PageLoader.tsx  # Loading state
│   │   ├── PageNotFound.tsx # 404 page
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts        # Re-exports
│   ├── forms/              # Domain-specific forms
│   │   └── index.ts        # (currently empty)
│   └── index.ts            # Main barrel export

├── features/               # Feature-based modules
│   ├── auth/              # Authentication feature
│   │   ├── LoginForm.tsx
│   │   └── index.ts       # Re-exports
│   ├── dashboard/         # Dashboard feature
│   │   ├── DashboardOverview.tsx
│   │   ├── StatsCard.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── ProvidersTable.tsx
│   │   └── index.ts       # Re-exports
│   
├── hooks/                 # Shared hooks
│   ├── useTheme.ts       # Theme toggle hook
│   └── index.ts          # Re-exports

├── lib/                  # Utilities & providers
│   ├── theme-provider.tsx # Theme context provider
│   └── utils.ts          # Helper functions (cn, etc.)

├── pages/                # Page components & layouts
│   ├── public/           # Public/auth routes
│   │   ├── authLayout.tsx
│   │   └── login/
│   │       └── index.tsx
│   └── private/          # Protected routes
│       ├── privateLayout.tsx
│       └── dashboard/
│           └── index.tsx

├── routes/               # Router configuration
│   └── index.tsx         # React Router definitions

├── index.css             # Tailwind + design tokens
├── main.tsx             # App entry point
└── App.tsx              # Root component
```

### 7.1 Export Conventions

**All components must be exported from barrel files:**

```typescript
// ✅ src/components/index.ts
export * from "./ui";
export * from "./shared";
export * from "./forms";

// ✅ src/features/dashboard/index.ts
export * from "./DashboardOverview";
export * from "./StatsCard";
export * from "./RecentActivity";
export * from "./ProvidersTable";
```

**Import using path aliases:**

```typescript
// ✅ Correct
import { Button, Card } from "@/components";
import { DashboardOverview, StatsCard } from "@/features/dashboard";

// ❌ Wrong
import Button from "../components/ui/button.tsx";
```

---

## 8. Code Quality & Standards

### 8.1 File Naming Conventions

| Type | Convention | Example. |
|------|-----------|----------|
| Folders | kebab-case | `dashboard-admin/` |
| Components | PascalCase | `DashboardOverview.tsx` |
| Hooks | camelCase + use | `useTheme.ts` |
| Services | camelCase + Service | `authService.ts` |
| Utils | camelCase | `dateFormatter.ts` |
| Types | camelCase + Types | `buttonTypes.ts` |
| Tests | ComponentName.test.tsx | `Button.test.tsx` |

### 8.2 Styling Rules

### NO CSS Modules

**DO:** Use Tailwind CSS utility classes
```tsx
✅ <button className="bg-primary text-primary-foreground rounded-md" />
```

**DON'T:** Create CSS Module files
```tsx
❌ import styles from './button.module.css';
   <button className={styles.btn} />
```

### NO Arbitrary Values

**DO:** Use semantic design tokens
```tsx
✅ <div className="bg-card border-border shadow-sm rounded-xl" />
```

**DON'T:** Use hard-coded values  
```tsx
❌ <div className="bg-[#ffffff] border-[#e5e5e5] rounded-[10px]" />
```

### 8.3 Build & Quality Scripts

```bash
pnpm dev              # Start dev server (Vite)
pnpm build            # Build production (tsc + vite build)
pnpm type-check       # Check TypeScript errors (tsc --noEmit)
pnpm lint:fix         # Fix ESLint issues (eslint . --fix)
pnpm format           # Format code (prettier)
pnpm format:check     # Check format without modifying
```

---

## 9. Integration Guide for Designers

### 9.1 Figma to Code Workflow

1. **Design in Figma** → Use semantic color tokens (from Design Tokens section)
2. **Reference Page** → Share component mockups in Figma
3. **Export Design Context** → Use Figma MCP tools to extract code snippets
4. **Adapt to codebase** → Match existing component patterns and naming
5. **Update Barrel Exports** → Add new components to feature `index.ts` files

### 9.2 Component Checklist

When adding a new component:

- [ ] File created in correct folder (e.g., `features/dashboard/MyComponent.tsx`)
- [ ] File name is PascalCase
- [ ] Component exported as default or named export
- [ ] Added to barrel export file (e.g., `features/dashboard/index.ts`)
- [ ] Uses semantic tokens (`bg-primary`, not `bg-[#205]`)
- [ ] Styled with Tailwind CSS, not CSS Modules
- [ ] Props typed with TypeScript
- [ ] Responsive breakpoints applied (`md:`, `lg:`)
- [ ] Dark mode support tested

### 9.3 Design System Updates

When modifying colors or tokens:

1. Update `/src/index.css` (all token definitions)
2. Test in both light and dark modes
3. Re-run `pnpm type-check`, `pnpm lint:fix`, `pnpm format`
4. Verify in dev server before committing

---

## 10. Feature Examples

### 10.1 Dashboard Feature

**Location:** `src/features/dashboard/`

**Components:**
- `DashboardOverview` — Main layout wrapper
- `StatsCard` — KPI display with delta indicators (green/red/muted)
- `RecentActivity` — Activity feed with timeline dots
- `ProvidersTable` — Data table for provider information

**Layout Pattern:**
```tsx
<DashboardOverview>
  {/* Responsive grid of StatsCards (4 col on lg, 2 col on md) */}
  {/* Grid of RecentActivity cards (2 col on md) */}
</DashboardOverview>
```

### 10.2 Auth Feature

**Location:** `src/features/auth/`

**Components:**
- `LoginForm` — Login form (email + password)

**Route:** `/auth/login` (public page using `authLayout.tsx`)

---

## 11. Accessibility & Performance

### 11.1 Semantic HTML

All components use semantic HTML:
- `<button>` for buttons (not `<div onClick>`)
- `<header>`, `<nav>` for navigation
- `<main>` for page content
- `<section>`, `<article>` for content sections

### 11.2 Focus & Keyboard

**Tailwind Ring on Focus:**
```tsx
className="focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
```

All interactive elements support:
- Keyboard focus (`Tab` navigation)
- Visual focus indicator (ring color)
- Aria attributes for screen readers

### 11.3 Color Contrast

All semantic colors meet WCAG AA contrast ratios:
- `foreground` on `background` ✓
- `primary-foreground` on `primary` ✓
- `muted-foreground` on `card` ✓

---

## 12. Resources & Links

- **Tailwind CSS v4 Docs**: https://tailwindcss.com
- **shadcn/ui Components**: https://ui.shadcn.com
- **OkLCH Color Space**: https://oklch.com
- **React Router v7**: https://reactrouter.com
- **TypeScript**: https://www.typescriptlang.org

---

## 13. Changelog

| Date | Change |
|------|--------|
| 2026-03-19 | Initial design system created with color tokens, components, and patterns |

---

**Last Updated:** March 19, 2026  
**Maintained By:** Design & Engineering Team
