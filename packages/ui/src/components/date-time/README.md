# LYDS date and time architecture

Base UI does not expose public date or time primitives. This family therefore uses `react-aria-components` for segmented editing, calendar state, keyboard navigation, focus management, validation, and popover/dialog semantics, with `@internationalized/date` as the immutable value and calendar-arithmetic layer. Both dependencies are imported only through their public package exports. LYDS owns presentation; it does not replace React Aria behavior with custom event handlers.

## Value semantics

- `Calendar`, `DateField`, and `DatePicker` default to `CalendarDate`: a calendar date without a clock or time zone.
- `DateRangePicker` defaults to a range of `CalendarDate` values.
- `TimeField` and `TimePicker` default to `Time`: a wall-clock time without a date or time zone.
- `DateTimePicker<CalendarDateTime>` represents a wall-clock date and time.
- `DateTimePicker<ZonedDateTime>` represents a date and time in an explicit IANA time zone. LYDS never silently converts a `CalendarDateTime` to a `ZonedDateTime` or assumes a local time zone.

Use the exported `parseDate`, `parseTime`, `parseDateTime`, and `parseZonedDateTime` helpers to construct values. Controlled values use `value` and `onValueChange`; uncontrolled values use `defaultValue`. Picker disclosure uses `open`, `defaultOpen`, and `onOpenChange`.

## Locale and constraints

The optional `locale` prop is a BCP 47 locale and controls segment order, localized labels, numbering, weekday names, and the default hour cycle. When it is omitted, the nearest React Aria locale provider or the browser locale is used. Consumers may override `hourCycle`, `firstDayOfWeek`, and `granularity` without changing global application settings.

`minValue`, `maxValue`, and `isDateUnavailable` remain consumer-supplied constraints. `DateRangePicker` also forwards `allowsNonContiguousRanges`. The application remains responsible for business rules and final display formatting.

`TimePicker` intentionally uses the accessible segmented time-entry model rather than inventing a finite menu of times. This keeps seconds, locale-specific day periods, minimum/maximum values, and zoned values precise without shipping business-specific increments.
