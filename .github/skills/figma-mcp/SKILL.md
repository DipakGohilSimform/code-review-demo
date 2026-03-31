# Skill: Figma MCP — Design to Code

System for converting Figma designs into production-ready React code using the project's design system.

## Overview

This skill defines how to translate Figma design files into React components that use shadcn/ui primitives, Tailwind CSS v4 semantic tokens, and strict TypeScript typing.

## Token Mapping Table

Map Figma design values to project semantic tokens:

### Colors

| Figma Value           | Tailwind Token                               |
| --------------------- | -------------------------------------------- |
| White / #FFFFFF       | `bg-background`                              |
| Black / #000000       | `text-foreground`                            |
| Light grey / #F5F5F5  | `bg-muted`                                   |
| Medium grey / #666666 | `text-muted-foreground`                      |
| Primary blue          | `bg-primary` / `text-primary-foreground`     |
| Red / Error           | `bg-destructive` / `text-destructive`        |
| Border grey / #E5E5E5 | `border-border`                              |
| Card background       | `bg-card` / `text-card-foreground`           |
| Accent color          | `bg-accent` / `text-accent-foreground`       |
| Secondary             | `bg-secondary` / `text-secondary-foreground` |
| Input background      | `bg-input`                                   |
| Ring / focus          | `ring-ring`                                  |

### Spacing (Figma px -> Tailwind)

| Figma px | Tailwind | Class Example |
| -------- | -------- | ------------- |
| 2px      | 0.5      | `p-0.5`       |
| 4px      | 1        | `p-1`         |
| 8px      | 2        | `p-2`         |
| 12px     | 3        | `p-3`         |
| 16px     | 4        | `p-4`         |
| 20px     | 5        | `p-5`         |
| 24px     | 6        | `p-6`         |
| 32px     | 8        | `p-8`         |
| 40px     | 10       | `p-10`        |
| 48px     | 12       | `p-12`        |
| 64px     | 16       | `p-16`        |

### Typography

| Figma Style | Tailwind Classes                |
| ----------- | ------------------------------- |
| Heading 1   | `text-4xl font-bold`            |
| Heading 2   | `text-3xl font-semibold`        |
| Heading 3   | `text-2xl font-semibold`        |
| Heading 4   | `text-xl font-semibold`         |
| Body large  | `text-lg`                       |
| Body        | `text-base`                     |
| Body small  | `text-sm`                       |
| Caption     | `text-xs text-muted-foreground` |

### Border Radius

| Figma Value | Tailwind Class |
| ----------- | -------------- |
| 4px         | `rounded`      |
| 6px         | `rounded-md`   |
| 8px         | `rounded-lg`   |
| 12px        | `rounded-xl`   |
| 16px        | `rounded-2xl`  |
| Full/pill   | `rounded-full` |

## Component Mapping

| Figma Element       | React Implementation                                    |
| ------------------- | ------------------------------------------------------- |
| Button (filled)     | `<Button variant="default">`                            |
| Button (outlined)   | `<Button variant="outline">`                            |
| Button (text/ghost) | `<Button variant="ghost">`                              |
| Button (danger)     | `<Button variant="destructive">`                        |
| Icon button         | `<Button variant="ghost" size="icon" aria-label="...">` |
| Text input          | `<Input>` with `<Label>`                                |
| Card                | `<Card>` compound pattern                               |
| Table               | `<Table>` compound pattern                              |
| Dialog/Modal        | `<Dialog>` compound pattern                             |
| Dropdown            | `<Select>` or `<DropdownMenu>`                          |
| Checkbox            | `<Checkbox>` with `<Label>`                             |
| Toggle/Switch       | `<Switch>` with `<Label>`                               |
| Tabs                | `<Tabs>` compound pattern                               |
| Avatar              | `<Avatar>` compound pattern                             |
| Badge               | `<Badge>` with variants                                 |

## Conversion Workflow

### Step 1: Extract Design Context

- Use MCP `get_design_context` with fileKey and nodeId from the Figma URL
- Review the returned code, screenshot, and contextual hints

### Step 2: Map to Project Tokens

- Convert every color to a semantic token (never hardcode hex values)
- Convert spacing to Tailwind scale values (never use arbitrary `px` values)
- Map typography to standard Tailwind text utilities

### Step 3: Select Components

- Map every UI element to the closest shadcn/ui primitive
- Use compound component patterns for complex elements
- Check if existing project components already match the design

### Step 4: Implement

- Create typed React component following project conventions
- Use `cn()` for conditional class merging
- Add responsive breakpoints (mobile-first: base -> sm -> md -> lg -> xl)
- Add accessibility attributes

### Step 5: Verify

- Visual match against Figma screenshot
- Responsive behavior at all breakpoints
- Dark mode with semantic tokens
- Keyboard navigation works
- `pnpm run type-check` passes

## Rules

- NEVER use arbitrary Tailwind values — find the closest standard utility
- NEVER hardcode colors — always use semantic tokens
- NEVER use native HTML where shadcn equivalents exist
- ALWAYS include responsive design
- ALWAYS include accessibility attributes
- ALWAYS type all props
