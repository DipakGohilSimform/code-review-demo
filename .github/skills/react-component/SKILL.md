# Skill: React Component Patterns

Scalable, production-ready patterns for building React components in this project.

## Core Pattern — Feature Component

```tsx
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { FeatureItemProps } from "@/types/featureTypes";

interface FeatureCardProps {
  item: FeatureItemProps;
  onAction?: (id: string) => void;
  className?: string;
}

export function FeatureCard({ item, onAction, className }: FeatureCardProps): React.JSX.Element {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-card-foreground">{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  );
}
```

## Pattern — Compound Component

For complex components with multiple sections:

```tsx
import { cn } from "@/lib/utils";

interface WidgetRootProps {
  children: React.ReactNode;
  className?: string;
}

interface WidgetHeaderProps {
  title: string;
  action?: React.ReactNode;
}

interface WidgetContentProps {
  children: React.ReactNode;
}

function WidgetRoot({ children, className }: WidgetRootProps): React.JSX.Element {
  return <div className={cn("rounded-lg border border-border bg-card", className)}>{children}</div>;
}

function WidgetHeader({ title, action }: WidgetHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      {action}
    </div>
  );
}

function WidgetContent({ children }: WidgetContentProps): React.JSX.Element {
  return <div className="p-6">{children}</div>;
}

export const Widget = {
  Root: WidgetRoot,
  Header: WidgetHeader,
  Content: WidgetContent,
};
```

## Pattern — List with Stable Keys

```tsx
interface ListItem {
  id: string;
  label: string;
}

interface ItemListProps {
  items: readonly ListItem[];
  className?: string;
}

export function ItemList({ items, className }: ItemListProps): React.JSX.Element {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map(item => (
        <li key={item.id} className="rounded-md bg-muted p-3 text-foreground">
          {item.label}
        </li>
      ))}
    </ul>
  );
}
```

## Pattern — Controlled Form

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Label } from "@/components/ui";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps): React.JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
```

## Pattern — Custom Hook Extraction

```typescript
import { useState, useCallback } from "react";

interface UseToggleResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useToggle(initialState = false): UseToggleResult {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, open, close, toggle };
}
```

## Pattern — Variant Component with CVA

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        inactive: "bg-muted text-muted-foreground",
        error: "bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusVariants> {
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps): React.JSX.Element {
  return <span className={cn(statusVariants({ status }), className)}>{label}</span>;
}
```

## Rules

- Always accept `className` prop
- Always use `cn()` for class merging
- Always type props with `interface`
- Always use semantic Tailwind tokens
- Always use shadcn primitives over native HTML
- Always export from barrel `index.ts`
