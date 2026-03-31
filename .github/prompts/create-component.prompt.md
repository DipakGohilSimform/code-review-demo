---
agent: agent
description: Generate a new React component following project conventions with types, barrel export, and accessibility.
---

# Create Component

Generate a production-ready React component following project architecture and conventions.

## Input Required

- **Component name**: PascalCase (e.g., `UserCard`)
- **Location**: Where it belongs (`features/{name}/`, `components/shared/`, or `components/forms/`)
- **Props**: Key properties the component needs
- **Variants**: Any visual variants (optional)

## Instructions

1. **Create the component file** (`{ComponentName}.tsx`):
   - Functional component with explicit return type `React.JSX.Element`
   - All props typed with `interface`
   - Accept `className?: string` prop
   - Use `cn()` from `@/lib/utils` for class merging
   - Use semantic Tailwind tokens only (`bg-background`, `text-foreground`, etc.)
   - Use shadcn/ui primitives (`Button`, `Card`, `Input`) — never native HTML
   - Include `aria-label` on icon-only buttons
   - Include `role` and keyboard handlers where needed

2. **Create or update types** (if complex props):
   - Add to `src/types/{feature}Types.ts`
   - Use `interface` for object shapes, `type` for unions

3. **Update barrel export** (`index.ts`):
   - Add named export to the folder's `index.ts`

4. **Follow naming conventions**:
   - File: PascalCase `.tsx`
   - Folder: kebab-case
   - Props interface: `{ComponentName}Props`

## Output Format

```
1. Folder structure showing new/modified files
2. Complete component code
3. Updated barrel export
4. Brief explanation (2-3 sentences)
```

## Example

For a `StatsCard` in `features/dashboard/`:

```tsx
// src/features/dashboard/StatsCard.tsx
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend = "neutral",
  className,
}: StatsCardProps): React.JSX.Element {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">{value}</div>
        {description && (
          <p
            className={cn(
              "text-xs",
              trend === "up" && "text-green-600 dark:text-green-400",
              trend === "down" && "text-destructive",
              trend === "neutral" && "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

```typescript
// src/features/dashboard/index.ts
export { StatsCard } from "./StatsCard";
```

## Constraints

- No `any` type
- No inline styles
- No arbitrary Tailwind values
- No native `<button>` or `<input>` — use shadcn
- Must include `className` prop
- Must use `cn()` for conditional classes
- Must have explicit return type
