# Skill: Code Review

Structured, multi-dimensional code review checklist for React + TypeScript + Tailwind CSS v4 + shadcn/ui projects.

## Severity Levels

- **CRITICAL** — Must fix before merge. Blocks approval.
- **MAJOR** — Should fix before merge. May affect functionality, performance, or maintainability.
- **MINOR** — Non-blocking but should be addressed in follow-up.
- **SUGGESTION** — Optional improvement for better DX or future-proofing.

## Review Dimensions

### 1. TypeScript Quality

| Check               | Rule                                                |
| ------------------- | --------------------------------------------------- |
| No `any`            | Use `unknown`, generics, or union types             |
| No unsafe `as`      | Use `satisfies` or add justification comment        |
| Props typed         | All props use `interface` or `type`                 |
| Return types        | Exported functions/hooks have explicit return types |
| No enums            | Use `as const` objects or union string literals     |
| No `ts-ignore`      | Fix the type error properly                         |
| Generic constraints | `<T extends object>` not just `<T>`                 |
| Strict nulls        | No implicit nullable access                         |

### 2. React Patterns

| Check              | Rule                                                     |
| ------------------ | -------------------------------------------------------- |
| Pure components    | Side effects only in `useEffect`                         |
| Complete deps      | `useEffect`/`useMemo`/`useCallback` deps arrays complete |
| No stale closures  | State reads in effects are current                       |
| Effect cleanup     | Subscriptions/timers cleaned up                          |
| No async useEffect | Use inner async function pattern                         |
| Named components   | No anonymous components                                  |
| Stable keys        | Never `Math.random()` or array index for dynamic lists   |
| State colocation   | State at lowest needed level                             |
| Code splitting     | Route-level `React.lazy` + `Suspense`                    |

### 3. Tailwind CSS v4

| Check               | Rule                                                  |
| ------------------- | ----------------------------------------------------- |
| Semantic tokens     | `bg-background`, `text-foreground`, etc.              |
| No arbitrary values | No `w-[123px]`, `bg-[#fff]`, `text-[14px]`            |
| No hardcoded colors | Use design tokens only                                |
| `cn()` usage        | Conditional classes via `cn()`, not template literals |
| Mobile-first        | `base → sm → md → lg → xl` ordering                   |
| No `!important`     | Refactor specificity instead                          |
| No inline styles    | Use Tailwind classes                                  |
| dark: variants      | Semantic colors with `dark:` when overriding          |

### 4. shadcn/ui Compliance

| Check                 | Rule                                                |
| --------------------- | --------------------------------------------------- |
| Barrel imports        | Import from `@/components/ui`, not individual files |
| Compound patterns     | `Card > CardHeader > CardTitle` etc.                |
| No native buttons     | Use shadcn `<Button>` exclusively                   |
| No native inputs      | Use shadcn `<Input>` exclusively                    |
| CVA variants          | Custom variants follow CVA pattern                  |
| Radix props preserved | `aria-*`, `role`, `data-state` not removed          |
| Custom in shared/     | Custom components in `shared/`, not `ui/`           |

### 5. Architecture

| Check                | Rule                                                              |
| -------------------- | ----------------------------------------------------------------- |
| Naming conventions   | Folders: kebab-case, Components: PascalCase, Hooks: camelCase+use |
| Barrel exports       | Every folder has `index.ts`                                       |
| `@/` imports         | No relative `../..` for src files                                 |
| Default page exports | Pages export default (for `React.lazy`)                           |
| Feature isolation    | No cross-feature direct imports                                   |
| No business in pages | Delegate to hooks/services                                        |
| Route file `.tsx`    | `src/routes/index.tsx` must be `.tsx`                             |

### 6. ESLint & Style

| Check           | Rule                                       |
| --------------- | ------------------------------------------ |
| Zero errors     | No ESLint errors or warnings               |
| No unused vars  | `@typescript-eslint/no-unused-vars`        |
| No explicit any | `@typescript-eslint/no-explicit-any`       |
| No console.log  | Use logger utility                         |
| No dead code    | No commented-out blocks                    |
| Import order    | External → `@/` aliases → relative → types |

### 7. Performance

| Check                 | Rule                                                  |
| --------------------- | ----------------------------------------------------- |
| No wasted renders     | Parent state changes don't repaint unrelated children |
| Memoized computations | `useMemo` with correct deps for expensive work        |
| Stable handlers       | `useCallback` when passing to memoized children       |
| Stable keys           | Unique, stable `key` props on lists                   |
| Route splitting       | All routes use `React.lazy`                           |
| No memory leaks       | Event listeners/timers cleaned up                     |

### 8. Accessibility

| Check               | Rule                                            |
| ------------------- | ----------------------------------------------- |
| Keyboard navigation | All interactive elements reachable via keyboard |
| Icon button labels  | `aria-label` on icon-only buttons               |
| Form labels         | Every input has associated `<label>`            |
| Focus visible       | `focus-visible:ring-*` styles present           |
| Image alt text      | Meaningful `alt` or empty for decorative        |
| Color contrast      | WCAG AA minimum (4.5:1 body, 3:1 large)         |

### 9. Security

| Check                      | Rule                                    |
| -------------------------- | --------------------------------------- |
| No secrets in code         | API keys in `.env` only, not committed  |
| No dangerouslySetInnerHTML | If present, sanitize with DOMPurify     |
| No eval/new Function       | Forbidden entirely                      |
| Input sanitization         | User inputs sanitized before render/API |
| ESM only                   | No CommonJS `require()`                 |
| Env vars                   | `import.meta.env.VITE_*` only           |

## Output Format

```markdown
### Summary

> 2-3 line overall impression.

### Strengths

> Specific positives referencing actual code.

### Critical Issues

> Must fix. Before/after code examples.

### Major Issues

> Should fix. Code examples.

### Minor Issues

> Non-blocking. Quick fixes.

### Suggestions

> Optional improvements.

### Final Recommendation

> Approved | Approved with suggestions | Request Changes | Reject
```
