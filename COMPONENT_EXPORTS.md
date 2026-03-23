# Component Export Map

Complete reference for all exported components and their locations.

## Core Exports

### 1. UI Components (`@/components`)

```typescript
import { Button, Card, CardHeader, CardTitle, CardDescription, Table } from "@/components";
```

| Component | Location | Export Type | Variants/Props |
|-----------|----------|-------------|---|
| `Button` | `src/components/ui/button.tsx` | Named | variant, size, asChild |
| `Card` | `src/components/ui/card.tsx` | Named | className |
| `CardHeader` | `src/components/ui/card.tsx` | Named | className |
| `CardTitle` | `src/components/ui/card.tsx` | Named | className |
| `CardDescription` | `src/components/ui/card.tsx` | Named | className |
| `Table` | `src/components/ui/Table.tsx` | Named | - |

### 2. Shared Components (`@/components`)

```typescript
import { Header, PageLoader, PageNotFound, ErrorBoundary } from "@/components";
```

| Component | Location | Export Type | Purpose |
|-----------|----------|-------------|---------|
| `Header` | `src/components/shared/Header.tsx` | Default | Top navigation |
| `PageLoader` | `src/components/shared/PageLoader.tsx` | Named | Loading state |
| `PageNotFound` | `src/components/shared/PageNotFound.tsx` | Named | 404 error page |
| `ErrorBoundary` | `src/components/shared/ErrorBoundary.tsx` | Named | Error handling |

### 3. Feature: Auth (`@/features/auth`)

```typescript
import { LoginForm } from "@/features/auth";
```

| Component | Location | Export Type | Props |
|-----------|----------|-------------|-------|
| `LoginForm` | `src/features/auth/LoginForm.tsx` | Named | - |

### 4. Feature: Dashboard (`@/features/dashboard`)

```typescript
import { 
  DashboardOverview, 
  StatsCard, 
  RecentActivity, 
  ProvidersTable 
} from "@/features/dashboard";
```

| Component | Location | Export Type | Props |
|-----------|----------|-------------|-------|
| `DashboardOverview` | `src/features/dashboard/DashboardOverview.tsx` | Named/Default | - |
| `StatsCard` | `src/features/dashboard/StatsCard.tsx` | Named/Default | title, value, delta, deltaColor, smallText, className |
| `RecentActivity` | `src/features/dashboard/RecentActivity.tsx` | Named/Default | - |
| `ProvidersTable` | `src/features/dashboard/ProvidersTable.tsx` | Named/Default | - |

## Barrel Export Chain

```
@/components
├── @/components/ui (button, card, Table)
├── @/components/shared (Header, PageLoader, PageNotFound, ErrorBoundary)
└── @/components/forms (empty, reserved for future forms)

@/features/auth
└── LoginForm

@/features/dashboard
├── DashboardOverview
├── StatsCard
├── RecentActivity
└── ProvidersTable
```

## Usage Examples

```typescript
// ✅ All from main components export
import { Button, Card, Header, PageLoader } from "@/components";

// ✅ Feature-specific
import { LoginForm } from "@/features/auth";
import { DashboardOverview, StatsCard } from "@/features/dashboard";

// ✅ Hooks
import { useTheme } from "@/hooks";

// ❌ Don't do relative imports
import Button from "../ui/button.tsx";  // Wrong!
```

## Adding New Components

1. Create component file: `src/features/feature-name/MyComponent.tsx`
2. Export in barrel: Add to `src/features/feature-name/index.ts`
   ```typescript
   export * from "./MyComponent";
   ```
3. Import via path alias: `import { MyComponent } from "@/features/feature-name"`

---

**Last Updated:** March 19, 2026
