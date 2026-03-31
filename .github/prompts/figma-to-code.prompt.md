---
agent: agent
description: Convert a Figma design into pixel-perfect, responsive React code using shadcn/ui and Tailwind CSS v4 semantic tokens.
---

# Figma to Code

Convert a Figma design selection into production-ready React code that matches the project stack.

## Input Required

- **Figma URL or screenshot**: The design to implement
- **Component name**: PascalCase name for the output
- **Location**: Target directory in the project

## Instructions

### Step 1 — Analyze the Design

- Identify all UI elements (buttons, inputs, cards, text, icons, images)
- Map colors to semantic Tailwind tokens (`bg-background`, `text-foreground`, etc.)
- Identify layout patterns (grid, flex, spacing)
- Note responsive breakpoints needed
- Identify interactive states (hover, focus, active, disabled)

### Step 2 — Map to shadcn/ui Components

Map every design element to existing shadcn/ui primitives:

| Design Element | shadcn Component               |
| -------------- | ------------------------------ |
| Button         | `<Button variant="...">`       |
| Text input     | `<Input>`                      |
| Card/container | `<Card>` compound pattern      |
| Label          | `<Label>`                      |
| Table          | `<Table>` compound pattern     |
| Dialog/modal   | `<Dialog>`                     |
| Dropdown       | `<Select>` or `<DropdownMenu>` |
| Checkbox       | `<Checkbox>`                   |
| Toggle         | `<Switch>`                     |

### Step 3 — Implement

1. Create component with proper TypeScript typing
2. Use ONLY semantic Tailwind tokens for colors and spacing
3. Use `cn()` for conditional class merging
4. Follow mobile-first responsive design (`base → sm → md → lg → xl`)
5. Add accessibility attributes (`aria-label`, `role`, `alt`, etc.)
6. Use shadcn compound patterns for complex components

### Step 4 — Token Mapping

Convert Figma values to project tokens:

```
Figma #FFFFFF / white  → bg-background
Figma #000000 / black  → text-foreground
Figma #F5F5F5 / grey   → bg-muted
Figma #666666 / grey   → text-muted-foreground
Figma primary blue     → bg-primary / text-primary-foreground
Figma red / error      → bg-destructive / text-destructive-foreground
Figma border #E5E5E5   → border-border
Figma card background  → bg-card / text-card-foreground
```

Spacing: Convert pixel values to Tailwind spacing scale (4px = 1, 8px = 2, 16px = 4, 24px = 6, 32px = 8, etc.)

## Output Format

```
1. Component file with complete implementation
2. Updated barrel export
3. Token mapping notes (Figma value → Tailwind token)
4. Responsive breakpoint decisions
```

## Constraints

- No arbitrary Tailwind values — find the closest standard utility
- No hardcoded colors — always use semantic tokens
- No inline styles
- No native HTML elements where shadcn equivalents exist
- Must be responsive (mobile-first)
- Must include accessibility attributes
- Must pass `pnpm run type-check`
