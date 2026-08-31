# Extending LYDS

## Decide whether a new component belongs

Inventory `packages/ui/src/index.ts`, existing component sources, public declarations, tests, and Storybook first. Prefer composition when existing LYDS parts already provide the semantics. Add a primitive only for reusable application-agnostic behavior; do not move business data, routing, persistence, analytics, filtering, or validation policy into the library.

Use Base UI as the primary behavior/accessibility layer when it provides the primitive. Date/time controls may use the repository's existing internationalized date and React Aria logic. Do not add another styled component system or duplicate keyboard, focus, selection, or dismissal logic already supplied by those libraries. Justify any new nontrivial runtime dependency.

## Component contract

- Export precise props and forward the appropriate ref.
- Support controlled and uncontrolled state where the behavior has state. Follow the established names: `value`/`defaultValue`/`onValueChange` and `open`/`defaultOpen`/`onOpenChange`.
- Reuse the library vocabulary (`variant`, `size`, `orientation`, `disabled`, `readOnly`, `required`, `invalid`, `loading`) when semantically applicable.
- Preserve `className`, `style`, children, and documented render/composition APIs without exposing private visual machinery.
- Expose public modules from the package entry point; do not require consumers or Storybook to import internals.
- Keep every component tree-shakeable and ensure CSS remains covered by the package stylesheet and `sideEffects` metadata.

Style states from the primitive's supported state/data attributes. Cover default, hover, pressed, focus-visible, selected/checked/open, disabled, read-only, loading, and invalid states where relevant. Every color—including borders, focus rings, shadows, overlays, and disabled/status colors—must resolve through semantic tokens. Use tokens or `rem` for fixed lengths; `1px` and the Figma-verified `0.5px` structural divider are reserved for true hairlines, and SVG coordinate values are exempt. Use only tokenized durations and easing, and preserve the reduced-motion overrides.

For visual work, inspect the corresponding visible Modulor Figma specimen/component set before inventing geometry. Match verified anatomy, sizes, radii, padding, type hierarchy and variant organization; remap physical colors through LYDS semantic tokens. If no corresponding specimen is available, extend the same clean surface language. Do not infer hidden-master values, and do not add cut corners, inset seams, fake technical labels, decorative grids or generalized uppercase as a substitute for reference evidence.

## Stories

Add the component to the appropriate Storybook category and import it from `@lyds/ui`, exercising the real public API. Include the states that materially apply: variants, sizes, disabled, loading, invalid, long content, light/dark, and realistic composition. Add interaction play functions for keyboard or overlay behavior when useful. Stories should reveal behavior and layout failures rather than act as decorative screenshots.

## Behavioral and accessibility tests

Use the repository's existing Vitest, Testing Library, user-event, and accessibility tooling. Prefer observable behavior over snapshots. Test the applicable invariants:

- render and ref behavior;
- controlled and uncontrolled updates;
- keyboard selection/navigation and focus order;
- Escape dismissal, focus trap, and return focus for overlays;
- accessible name, roles, descriptions, invalid and disabled semantics;
- date boundaries, range selection, locale-dependent presentation, and time-zone value preservation;
- automated axe checks plus focused manual assertions;
- reduced-motion behavior where it is observable.

Do not remove native focus outlines without an equivalent visible focus treatment. Decorative details must not obscure text, state, target size, or contrast.

## Validate from the repository root

Run focused tests during iteration, then the shared gates before handoff:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build:package
pnpm build:storybook
pnpm pack:check
```

Inspect the generated package/tarball when package exports, declarations, or CSS change. Confirm a consumer can import components from `@lyds/ui` and styles from `@lyds/ui/styles.css`; do not expose internal source files.
