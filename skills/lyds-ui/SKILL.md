---
name: lyds-ui
description: Build, integrate, extend, review, or release-plan React interfaces with @lyds/ui while preserving LYDS components, semantic tokens, date-time semantics, accessibility, and publication safeguards.
---

# LYDS UI

Use LYDS through its public package API. Inspect the installed version's exports and types before coding; do not assume every component supports every prop.

## Route the work

- For installation, icon usage, styles, themes, component selection, token use, or date/time values, read [references/usage.md](references/usage.md).
- When adding or changing an LYDS component, story, or test, read [references/contributing.md](references/contributing.md).
- For package verification or any snapshot/production release work, read [references/releases.md](references/releases.md).

## Preserve the system

- Prefer an existing LYDS component or composition before creating a wrapper, fork, or new primitive. Import only from `@lyds/ui` and documented subpaths.
- Import `@lyds/ui/styles.css` once at the application entry. Theme with `data-lyds-theme="light"` or `data-lyds-theme="dark"`; the product owns persistence and user preference.
- Use semantic CSS variables such as `--background-elevated`, `--text-main`, `--control-primary`, and `--focus-ring`. Do not place raw color values in product or component CSS.
- Use `@phosphor-icons/react` as the only interface icon family. Install it with `@lyds/ui`; use individual CSR exports in client code and the public `/ssr` module in React Server Components. Do not hand-write JSX `<svg>`, use Unicode glyphs or CSS shapes as substitute UI icons, or import legacy `phosphor-react`.
- Put decorative icons in `Button` through `startIcon` or `endIcon`; use `IconButton` for icon-only actions and always provide `aria-label` or `aria-labelledby`. Let icons inherit `currentColor` and component-controlled sizing instead of assigning raw color or arbitrary size values.
- Preserve the Modulor-derived LYDS anatomy: clean main/secondary/elevated surfaces, `0.75rem` core radius, restrained selected plates, compact type hierarchy, and structural dividers only where the component calls for them. Do not add cut corners, panel seams, decorative engineering grids, fake serial labels, generalized uppercase, or terminal styling to make an interface look "technical".
- Use tokens, `rem`, or fluid units for fixed CSS lengths. Reserve `1px` and the Figma-verified `0.5px` list/segment divider for genuine hairlines; SVG coordinates are exempt. Do not reproduce a LYDS component with arbitrary fixed `px` geometry.
- Preserve controlled/uncontrolled contracts and vocabulary exposed by the component: commonly `value`, `defaultValue`, `onValueChange`, `open`, `defaultOpen`, `onOpenChange`, `variant`, `size`, and state props. Do not add routing, storage, analytics, network calls, business validation, or form-framework assumptions.
- Keep accessible names, visible focus, keyboard behavior, overlay focus management, touch targets, contrast, and reduced-motion behavior intact. Styling must not replace headless behavior supplied by LYDS/Base UI.

Never publish `@lyds/ui` merely because implementation or release files were requested. Publishing requires explicit user approval and the repository publishing gate described in the release reference.
