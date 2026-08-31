# Consuming LYDS

## Install this agent skill

The repository folder itself follows the current Agent Skills convention: `lyds-ui/SKILL.md` is the entry point, with optional `agents/`, `references/`, and `scripts/` alongside it. From the repository root, preview the safe install destination and then apply it explicitly:

```sh
./skills/lyds-ui/scripts/install.sh
./skills/lyds-ui/scripts/install.sh --apply
```

The helper targets `$CODEX_HOME/skills` when `CODEX_HOME` is set, otherwise `$HOME/.codex/skills`. For another compatible skills root, pass `--target-root DIRECTORY`. It never overwrites an existing `lyds-ui` skill; inspect or remove/rename that existing installation yourself before retrying.

## Detect and install

Inspect the consumer before changing dependencies:

```sh
rg -n --glob 'package.json' --glob '!node_modules/**' '"@lyds/ui"' .
pnpm list @lyds/ui --depth 0
```

In a workspace, scope the query and installation to the consuming package when possible:

```sh
pnpm --filter '<consumer-package>' list @lyds/ui --depth 0
pnpm --filter '<consumer-package>' add @lyds/ui
```

For another package in the same pnpm workspace, use its workspace version instead of the npm registry:

```sh
pnpm --filter '<consumer-package>' add '@lyds/ui@workspace:*'
```

Do not reinstall or change a compatible existing version without a reason. Inspect the installed package's `exports`, declarations, and Storybook before using an unfamiliar component. Never import `src/`, `dist/`, or another private implementation path.

## Styles and themes

Import the package stylesheet once in the application entry or framework-level layout:

```tsx
import "@lyds/ui/styles.css";
```

The root defaults to the light token values. Set the theme explicitly on the document root or on an isolated subtree:

```tsx
<main data-lyds-theme={theme === "dark" ? "dark" : "light"}>{children}</main>
```

Use `document.documentElement.dataset.lydsTheme` when the whole document should switch. Prefer document-root theming when dialogs, menus, or tooltips portal into `body`; a scoped theme must also contain or theme the portal destination. The application—not LYDS—decides how to derive, persist, or synchronize the preference.

Semantic variables are the customization boundary:

```css
.account-panel {
	--account-panel-background: var(--background-elevated);
	--account-panel-border: var(--divider-main);

	padding: var(--space-4);
	color: var(--text-main);
	background: var(--account-panel-background);
	border: 1px solid var(--account-panel-border);
}
```

Use the variables shipped by the installed version. Category/role/state names serialize deterministically from design-token names: `Text/Always_White` becomes `--text-always-white`. Product aliases may point to LYDS semantic tokens; do not redefine palette values or put hex, rgb, hsl, oklch, named colors, or color-bearing shadows in component CSS.

Use LYDS spacing, typography, control, radius, elevation, and motion tokens where available. Otherwise use `rem` for fixed lengths and appropriate fluid units (`%`, `fr`, viewport units, unitless line-height). Only genuine ornamental hairlines may use `1px`.

## Select and compose components

1. Check the public exports/types and the matching Storybook category.
2. Choose the component that already owns the needed semantics and keyboard behavior.
3. Compose documented parts for complex overlays, menus, tables, or collections.
4. Add product layout around the component with `className`, `style`, children, or documented render APIs.
5. Create a new LYDS primitive only when the behavior is reusable across products and existing composition cannot express it.

Match each component's declared API instead of normalizing props in an application wrapper. Prefer LYDS names (`variant`, `size`, `orientation`, `disabled`, `loading`, `invalid`) where exposed. Preserve forwarded refs, accessible labels, and controlled/uncontrolled behavior. A product owns data fetching, routing, sorting, filtering, validation policy, analytics, and storage.

## Date and time values

LYDS date/time controls use structured internationalized values, not ambiguous strings or JavaScript `Date` objects. Inspect the installed declarations for the exact accepted type:

- `CalendarDate` represents a calendar date without a time or time zone.
- `Time` represents a wall-clock time without a date or time zone.
- `CalendarDateTime` represents a calendar date and wall-clock time without a time zone.
- `ZonedDateTime` carries a named time zone and an exact offset/instant.

Use `DatePicker` for a date, `DateRangePicker` for a range, `TimePicker`/`TimeField` for a time, and `DateTimePicker` for a date plus time. Pass the same value kind through `value`/`defaultValue`, `onValueChange`, `minValue`, and `maxValue`. Do not silently convert between kinds.

```tsx
import { CalendarDate } from "@internationalized/date";
import { DatePicker } from "@lyds/ui";

const minimum = new CalendarDate(2026, 1, 1);

<DatePicker label="Deployment date" locale={locale} value={date} minValue={minimum} onValueChange={setDate} />;
```

If the public LYDS API does not re-export constructors/parsers, add `@internationalized/date` as a direct consumer dependency before importing it. Do not rely on transitive dependency hoisting.

Locale controls presentation, segment order, names, and numbering; it does not assign a time zone. Pass a consumer-selected BCP 47 locale and use `firstDayOfWeek`, `hourCycle`, granularity, or disabled-date predicates only where the installed component declares them. For a time-zone-aware `DateTimePicker`, create/parse a `ZonedDateTime` at the application boundary and keep its zone explicit. For a wall-clock appointment whose zone is decided later, use `CalendarDateTime`. Never hard-code a global locale, date format, 12/24-hour cycle, or time zone inside a reusable component.
