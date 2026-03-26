---
applyTo: "src/components/**/*.tsx"
---

## Frontend Guidelines (React + TS + Tailwind + shadcn)

- Use React functional components only
- Use TypeScript with strict typing (avoid any)
- Use Tailwind CSS (no inline styles)
- Use shadcn/ui components wherever possible
- Follow accessibility best practices (aria labels, semantic HTML)

## Component Structure

- All components should be created inside the `ui` folder
- Keep components reusable and modular
- Follow consistent naming conventions

## Exports

- Always export components from `index.ts` file

Example:
export _ from './button';
export _ from './card';
