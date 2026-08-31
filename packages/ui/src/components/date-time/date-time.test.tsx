import { parseDate, parseDateTime, parseTime, parseZonedDateTime, type CalendarDate } from "@internationalized/date";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Calendar } from "./calendar";
import { DateField } from "./date-field";
import { DatePicker, DateTimePicker } from "./date-picker";
import { DateRangePicker } from "./date-range-picker";
import { TimeField, TimePicker } from "./time-field";

beforeAll(() => {
	Object.defineProperty(Element.prototype, "scrollIntoView", {
		configurable: true,
		value: vi.fn()
	});

	if (!("ResizeObserver" in globalThis)) {
		Object.defineProperty(globalThis, "ResizeObserver", {
			configurable: true,
			value: class ResizeObserver {
				observe() {}
				unobserve() {}
				disconnect() {}
			}
		});
	}
});

describe("Calendar", () => {
	it("keeps React Aria keyboard navigation and emits a controlled value", async () => {
		const user = userEvent.setup();
		const values: CalendarDate[] = [];

		render(<Calendar aria-label="Maintenance date" locale="en-US" value={parseDate("2026-08-15")} defaultFocusedValue={parseDate("2026-08-15")} onValueChange={value => values.push(value)} />);

		const selectedCell = document.querySelector<HTMLElement>('.lyds-calendar-cell[data-selected="true"]');
		expect(selectedCell).not.toBeNull();
		await user.click(selectedCell!);
		values.length = 0;
		await user.keyboard("{ArrowRight}{Enter}");

		expect(values).toHaveLength(1);
		expect(values[0]?.toString()).toBe("2026-08-16");
	});

	it("distinguishes out-of-range and consumer-unavailable dates", () => {
		const { container } = render(
			<Calendar
				aria-label="Service window"
				locale="en-US"
				defaultFocusedValue={parseDate("2026-08-15")}
				minValue={parseDate("2026-08-10")}
				maxValue={parseDate("2026-08-20")}
				isDateUnavailable={date => date.day === 16}
			/>
		);

		const unavailable = container.querySelector<HTMLElement>(".lyds-calendar-cell[data-unavailable]");
		expect(unavailable).toHaveTextContent("16");
		expect(container.querySelectorAll(".lyds-calendar-cell[data-disabled]").length).toBeGreaterThan(0);
	});
});

describe("segmented fields", () => {
	it("uses locale-sensitive date segment order and supports controlled keyboard editing", async () => {
		const user = userEvent.setup();
		const values: Array<CalendarDate | null> = [];
		const { container, rerender } = render(<DateField label="Inspection" locale="en-US" value={parseDate("2026-08-15")} onValueChange={value => values.push(value)} />);

		const enTypes = Array.from(container.querySelectorAll<HTMLElement>(".lyds-date-segment")).map(segment => segment.dataset.type);
		expect(enTypes.filter(type => type !== "literal").slice(0, 3)).toEqual(["month", "day", "year"]);

		const day = container.querySelector<HTMLElement>('.lyds-date-segment[data-type="day"]');
		expect(day).not.toBeNull();
		await user.click(day!);
		await user.keyboard("{ArrowUp}");
		expect(values.at(-1)?.toString()).toBe("2026-08-16");

		rerender(<DateField label="Prüfung" locale="de-DE" value={parseDate("2026-08-15")} />);
		const deTypes = Array.from(container.querySelectorAll<HTMLElement>(".lyds-date-segment")).map(segment => segment.dataset.type);
		expect(deTypes.filter(type => type !== "literal").slice(0, 3)).toEqual(["day", "month", "year"]);
	});

	it("lets locale choose the clock while honoring an explicit hour cycle", () => {
		const { container, rerender } = render(<TimeField label="Start" locale="en-US" value={parseTime("13:45")} hourCycle={12} />);
		expect(container.querySelector('.lyds-date-segment[data-type="dayPeriod"]')).not.toBeNull();

		rerender(<TimePicker label="Beginn" locale="de-DE" value={parseTime("13:45")} hourCycle={24} />);
		expect(container.querySelector('.lyds-date-segment[data-type="dayPeriod"]')).toBeNull();
		expect(container.querySelector(".lyds-date-input-affordance")).not.toBeNull();
	});
});

describe("pickers", () => {
	it("forwards first-day-of-week overrides to both popover calendars", async () => {
		const datePicker = render(<DatePicker label="Deployment" locale="en-US" value={parseDate("2026-08-15")} firstDayOfWeek="mon" open />);
		const dateDialog = await screen.findByRole("dialog");
		expect(Array.from(dateDialog.querySelectorAll(".lyds-calendar-weekday"), cell => cell.textContent)).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
		datePicker.unmount();

		render(<DateRangePicker label="Maintenance window" locale="en-US" placeholderValue={parseDate("2026-08-12")} firstDayOfWeek="sat" open />);
		const rangeDialog = await screen.findByRole("dialog");
		expect(Array.from(rangeDialog.querySelectorAll(".lyds-calendar-weekday"), cell => cell.textContent)).toEqual(["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]);
	});

	it("honors controlled open state without replacing React Aria overlay semantics", async () => {
		const onOpenChange = vi.fn();
		render(<DatePicker label="Deployment" locale="en-US" value={parseDate("2026-08-15")} open onOpenChange={onOpenChange} />);

		expect(await screen.findByRole("dialog")).toBeInTheDocument();
		fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
		await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
	});

	it("selects a contiguous range and preserves start/end form fields", async () => {
		const user = userEvent.setup();
		const values: Array<{ start: CalendarDate; end: CalendarDate } | null> = [];
		render(
			<DateRangePicker
				label="Maintenance window"
				locale="en-US"
				defaultOpen
				placeholderValue={parseDate("2026-08-12")}
				shouldCloseOnSelect={false}
				startName="window-start"
				endName="window-end"
				onValueChange={value => values.push(value)}
			/>
		);

		const dialog = await screen.findByRole("dialog");
		const grid = within(dialog).getByRole("grid");
		const day16 = within(grid).getByText("16").closest<HTMLElement>(".lyds-calendar-cell");
		const day18 = within(grid).getByText("18").closest<HTMLElement>(".lyds-calendar-cell");
		expect(day16).not.toBeNull();
		expect(day18).not.toBeNull();
		await user.click(day16!);
		await user.click(day18!);

		expect(values.at(-1)?.start.toString()).toBe("2026-08-16");
		expect(values.at(-1)?.end.toString()).toBe("2026-08-18");
		expect(document.querySelector('input[name="window-start"]')).not.toBeNull();
		expect(document.querySelector('input[name="window-end"]')).not.toBeNull();
	});

	it("keeps wall-clock and zoned date-time values distinct", () => {
		const wallTime = parseDateTime("2026-08-15T13:45");
		const zonedTime = parseZonedDateTime("2026-08-15T13:45[America/Los_Angeles]");
		const { container, rerender } = render(<DateTimePicker label="Local schedule" locale="en-US" value={wallTime} />);
		expect(container.querySelector('.lyds-date-segment[data-type="hour"]')).not.toBeNull();
		expect(container.querySelector('.lyds-date-segment[data-type="timeZoneName"]')).toBeNull();

		rerender(<DateTimePicker label="Operations schedule" locale="en-US" value={zonedTime} />);
		expect(container.querySelector('.lyds-date-segment[data-type="timeZoneName"]')).not.toBeNull();
	});
});
