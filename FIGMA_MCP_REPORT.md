# Figma MCP — Design System Integration Report

**Date:** March 20, 2026  
**Prepared by:** Dipak Gohil  
**Project:** SSU Front Three (session-demo)

---

## Summary

This report documents the outcome of an experiment to automate the creation of a **Design System page** in Figma (with the Button component and all its variants) using the **Figma MCP (Model Context Protocol)** tool via GitHub Copilot.

The request was to:

- Create a new Figma page named **"Design System"**
- Add the **Button component** with all variants (Primary, Secondary, Outlined, Ghost, Link, Destructive)
- Show all **states**: Enabled, Hover, Disabled
- Produce production-ready, reusable Figma components

---

## What Was Expected

| #   | Expectation                                                                                |
| --- | ------------------------------------------------------------------------------------------ |
| 1   | A new **page** named "Design System" inside the Figma file                                 |
| 2   | A proper Figma **Component** for `Button` with Auto Layout                                 |
| 3   | **Variants** for each visual style (Primary, Secondary, Outline, Ghost, Link, Destructive) |
| 4   | **States** as component properties (Enabled / Hover / Disabled)                            |
| 5   | Icon-only button variants (Filled, Bordered, Ghost)                                        |
| 6   | Reusable **design tokens** (colors, typography, spacing)                                   |
| 7   | Clean layer naming and grouping for handoff                                                |

---

## What Actually Happened

The Figma MCP tool does **not** natively create Figma components, pages, variants, or design tokens programmatically. Instead, the workflow it supports is:

1. A **React showcase page** (`ButtonShowcase.tsx`) was built locally at `/design-system/buttons` to visually display all button variants and states.
2. A **screenshot/static capture** of that rendered web page was pushed into the existing Figma file using the `html-to-design` capture script.
3. The result is a **flattened, static frame** in Figma — not a structured component with variants and Auto Layout.

### Key Limitations Encountered

| Limitation                       | Detail                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **No Figma page creation**       | The MCP API cannot create or rename Figma pages. "Design System" page was never created.                                  |
| **No native component creation** | The tool cannot generate Figma Components (master components with variant properties).                                    |
| **No variant/property support**  | Button states (Hover, Disabled) and variants are not expressed as Figma component properties — just static visual copies. |
| **No Auto Layout**               | Captured frames use absolute positioning from the DOM, not Figma Auto Layout.                                             |
| **No design tokens**             | Colors and spacing from Tailwind/CSS variables are not extracted as Figma Styles or Variables.                            |
| **Static capture only**          | The MCP renders the live browser DOM and takes a structural snapshot — equivalent to "import from browser".               |

---

## Root Cause

The **Figma MCP `html-to-design` capture** is fundamentally a **DOM-to-Figma converter**, not a design system builder. It:

- Traverses the rendered HTML/CSS in the browser
- Converts each DOM node into a Figma frame/shape
- Does **not** understand React component semantics or design system intent

Creating true Figma component variants with proper structure requires either:

- **Manual work** in Figma (designer creates and organizes components by hand)
- **Figma REST API** (programmatic creation of components, styles, and variables via the Figma write API — not available through the current MCP tool)
- **Figma Code Connect** (links existing Figma components to code, but requires those components to exist in Figma first)

---

## What Was Delivered

| Deliverable                                            | Status                                |
| ------------------------------------------------------ | ------------------------------------- |
| `ButtonShowcase.tsx` page with all variants and states | ✅ Done                               |
| Route `/design-system/buttons` in the app              | ✅ Done                               |
| Static Figma frame captured from the browser render    | ✅ Done (node added to existing file) |
| New "Design System" Figma page                         | ❌ Not created (MCP limitation)       |
| Proper Figma Button component with variant properties  | ❌ Not created (MCP limitation)       |
| Auto Layout, design tokens, reusable styles            | ❌ Not created (MCP limitation)       |

---

## Recommendation

To achieve a proper design system in Figma, one of the following paths is recommended:

### Option A — Manual (Fastest for a single component)

A designer manually creates the Button component in Figma using the captured frame as a visual reference, then sets up variants and Auto Layout.

### Option B — Figma REST API (Scalable)

Use the [Figma REST API](https://www.figma.com/developers/api) (`POST /files/:key/components`) to programmatically create components, set up variant properties, and define styles. This requires a **Figma Enterprise** plan and write API access.

### Option C — Design-First Workflow (Best Practice)

Follow a design-first approach:

1. Designer builds the component in Figma with proper variants
2. Developer implements it in code
3. **Code Connect** links the Figma component to the React component for handoff

---

## Conclusion

The Figma MCP tool is well-suited for **Figma → Code** workflows (reading designs and generating code). For the **Code → Figma** direction — especially for creating structured design system components with variants — the tool's current capability is limited to static visual capture. Proper design system creation in Figma still requires manual designer effort or the Figma write API.

---

_Report generated as part of the SSU Front Three design system integration session._
