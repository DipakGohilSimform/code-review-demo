---
agent: agent
description: Refactor existing code to improve structure, performance, readability, and adherence to project conventions.
---

# Refactor Code

Improve existing code for better structure, performance, readability, and convention compliance.

## Input Required

- **File(s) to refactor**: Path to the file(s)
- **Focus area** (optional): `structure` | `performance` | `readability` | `conventions` | `all`

## Refactoring Checklist

### 1. TypeScript Quality

- [ ] Replace all `any` with proper types (`unknown`, generics, unions)
- [ ] Add explicit return types on exported functions/hooks
- [ ] Convert `as` assertions to `satisfies` where possible
- [ ] Replace enums with `as const` objects or union string literals
- [ ] Add missing prop interfaces
- [ ] Apply generic constraints where appropriate

### 2. Component Structure

- [ ] Extract large components into smaller, focused sub-components
- [ ] Move business logic from components into hooks
- [ ] Move business logic from pages into feature components
- [ ] Ensure single responsibility — one concern per component
- [ ] Convert anonymous components to named function declarations
- [ ] Add missing `className` prop support with `cn()`

### 3. Styling Compliance

- [ ] Replace arbitrary Tailwind values with standard utilities
- [ ] Replace hardcoded colors with semantic tokens
- [ ] Replace inline styles with Tailwind classes
- [ ] Replace template literal class concatenation with `cn()`
- [ ] Ensure mobile-first responsive ordering
- [ ] Remove `!important` overrides

### 4. shadcn/ui Migration

- [ ] Replace native `<button>` with shadcn `<Button>`
- [ ] Replace native `<input>` with shadcn `<Input>`
- [ ] Replace custom card implementations with shadcn `<Card>` compound pattern
- [ ] Import from barrel exports, not individual files

### 5. Architecture

- [ ] Fix imports to use `@/` path aliases
- [ ] Update barrel exports for new/renamed components
- [ ] Move misplaced files to correct directories
- [ ] Remove circular dependencies
- [ ] Remove dead code and unused imports

### 6. Performance

- [ ] Memoize expensive computations with `useMemo`
- [ ] Stabilize callbacks with `useCallback` for memoized children
- [ ] Add cleanup functions to `useEffect` with subscriptions
- [ ] Ensure stable `key` props on list items
- [ ] Verify no unnecessary re-renders from state placement

### 7. Accessibility

- [ ] Add `aria-label` to icon-only buttons
- [ ] Add `alt` text to images
- [ ] Ensure form inputs have labels
- [ ] Verify focus-visible styles present
- [ ] Add keyboard navigation where missing

## Output Format

For each change:

```
### Change: [Short description]

**Why**: [1 sentence justification]

**Before**:
[original code]

**After**:
[refactored code]
```

Then provide:

1. Complete refactored file(s)
2. Updated barrel exports if needed
3. Summary of all changes made

## Constraints

- Preserve existing functionality — refactoring must not change behavior
- Run `pnpm run type-check` after changes — must pass
- Follow all project conventions from instruction files
- Explain each change with a clear rationale
