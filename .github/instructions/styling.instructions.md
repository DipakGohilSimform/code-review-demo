---
applyTo: "src/**/*.{tsx,css}"
---

# Styling Instructions — Tailwind CSS v4 + shadcn/ui

## Tailwind CSS v4 Rules

### Semantic Tokens Only

Always use semantic design tokens. Never hardcode colors or sizes.

```tsx
// CORRECT
<div className="bg-background text-foreground border-border" />
<p className="text-muted-foreground" />
<div className="bg-card text-card-foreground" />
<div className="bg-primary text-primary-foreground" />
<div className="bg-destructive text-destructive-foreground" />
<div className="bg-accent text-accent-foreground" />

// FORBIDDEN
<div className="bg-[#ffffff] text-[#333333]" />
<div className="bg-white text-gray-800" />
<div style={{ backgroundColor: "#fff" }} />
```

### No Arbitrary Values

Tailwind arbitrary values are banned. Use theme tokens or extend the theme configuration.

```tsx
// FORBIDDEN
<div className="w-[372px] h-[50px] text-[14px] mt-[23px]" />

// CORRECT — use standard spacing/sizing utilities
<div className="w-96 h-12 text-sm mt-6" />
```

### Dark Mode

Use semantic tokens with `dark:` variants. Semantic tokens auto-switch — only use `dark:` for overrides.

```tsx
// CORRECT — semantic tokens handle both modes automatically
<div className="bg-background text-foreground" />

// CORRECT — explicit override when needed
<div className="bg-card dark:bg-card" />
```

### Conditional Classes

Always use `cn()` from `@/lib/utils` for conditional class merging. Never use template literals.

```tsx
import { cn } from "@/lib/utils";

// CORRECT
<div className={cn("rounded-lg p-4", isActive && "ring-2 ring-ring", className)} />

// FORBIDDEN
<div className={`rounded-lg p-4 ${isActive ? "ring-2 ring-ring" : ""}`} />
```

### Responsive Design

Follow mobile-first order: base -> sm -> md -> lg -> xl -> 2xl

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
```

### Specificity

- No `!important` overrides — refactor to fix specificity
- `@apply` in CSS only for complex repeated patterns, not single utilities
- No inline `style={{}}` for values achievable with Tailwind

## shadcn/ui Rules

### Imports

Always import from the barrel export:

```tsx
// CORRECT
import { Button, Card, CardHeader, CardTitle } from "@/components/ui";

// FORBIDDEN
import { Button } from "@/components/ui/button";
```

### Compound Components

Follow shadcn's composition pattern:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Button Usage

Never use native `<button>`. Always use shadcn Button with proper variants:

```tsx
// CORRECT
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost" size="icon" aria-label="Close">
  <XIcon className="size-4" />
</Button>

// FORBIDDEN
<button onClick={handler}>Click</button>
<div onClick={handler} role="button">Click</div>
```

### CVA Variants

For custom component variants, use `cva` from `class-variance-authority`:

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant, className, children }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
```

### Accessibility on Styled Components

- `aria-label` on every icon-only button
- Focus-visible styles: never remove `outline` without adding `focus-visible:ring-*`
- Form inputs must have associated `<label>` or `aria-labelledby`
- Color contrast meets WCAG AA (4.5:1 for body text, 3:1 for large text)

## Component Placement

- shadcn primitives: `src/components/ui/`
- Custom shared components: `src/components/shared/`
- Feature-specific components: `src/features/{feature}/`
- Never put custom components in `src/components/ui/` — that directory is for shadcn only
