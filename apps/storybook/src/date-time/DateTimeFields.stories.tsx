import { Calendar, CalendarDate, CalendarDateTime, DateField, DateRangePicker, DateTimePicker, Time, TimeField, parseZonedDateTime } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent } from "storybook/test";

import "../components/story-layout.css";

const defaultDate = new CalendarDate(2026, 8, 31);
const defaultTime = new Time(14, 30, 45);
const defaultDateTime = new CalendarDateTime(2026, 8, 31, 14, 30, 45);
const defaultRange = {
	start: new CalendarDate(2026, 8, 28),
	end: new CalendarDate(2026, 9, 3)
};

const taipeiDateTime = parseZonedDateTime("2026-08-31T14:30:45[Asia/Taipei]");
const newYorkDateTime = parseZonedDateTime("2026-08-31T14:30:45[America/New_York]");

const meta = {
	title: "Date & Time/DateTimeFields",
	component: DateField,
	parameters: {
		layout: "padded"
	}
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateFieldSizes: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DateField label="Small inspection date" defaultValue={defaultDate} locale="en-GB" size="sm" />
			<DateField label="Medium inspection date" defaultValue={defaultDate} locale="en-GB" size="md" />
			<DateField label="Large inspection date" defaultValue={defaultDate} locale="en-GB" size="lg" />
		</div>
	)
};

export const DateFieldStates: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<DateField label="Managed date" defaultValue={defaultDate} disabled description="This value is synchronized by the service." />
			<DateField label="Published date" defaultValue={defaultDate} readOnly description="Read-only values remain available to assistive technology." />
			<DateField label="Required audit date" required invalid error="Enter the audit completion date." />
		</div>
	)
};

export const TimeFieldSizes: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TimeField label="Small start time" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} size="sm" />
			<TimeField label="Medium start time" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} size="md" />
			<TimeField label="Large start time" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} size="lg" />
		</div>
	)
};

export const TimeFieldStates: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<TimeField label="Synchronized time" defaultValue={defaultTime} disabled granularity="second" />
			<TimeField label="Recorded time" defaultValue={defaultTime} readOnly granularity="second" />
			<TimeField label="Required activation time" required invalid error="Enter an activation time." />
		</div>
	)
};

export const DateTimePickerSizes: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DateTimePicker label="Small maintenance window" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} size="sm" />
			<DateTimePicker label="Medium maintenance window" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} size="md" />
			<DateTimePicker label="Large maintenance window" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} size="lg" />
		</div>
	)
};

export const DateTimePickerStates: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<DateTimePicker label="Synchronized schedule" defaultValue={defaultDateTime} disabled granularity="second" description="The operations service owns this schedule." />
			<DateTimePicker label="Recorded schedule" defaultValue={defaultDateTime} readOnly granularity="second" description="This exact wall-clock value is retained for reference." />
			<DateTimePicker label="Required maintenance schedule" required invalid error="Enter both the maintenance date and time." granularity="second" />
		</div>
	)
};

function ControlledFieldsExample() {
	const [date, setDate] = useState(new CalendarDate(2026, 8, 15));
	const [time, setTime] = useState(defaultTime);
	const [dateTime, setDateTime] = useState(defaultDateTime);

	return (
		<div className="lyds-story-stack">
			<div className="lyds-story-grid">
				<DateField label="Controlled date" value={date} onValueChange={value => value && setDate(value)} locale="en-GB" />
				<TimeField label="Controlled time" value={time} onValueChange={value => value && setTime(value)} locale="en-GB" hourCycle={24} granularity="second" />
				<DateTimePicker label="Controlled date and time" value={dateTime} onValueChange={value => value && setDateTime(value)} locale="en-GB" hourCycle={24} granularity="second" />
			</div>
			<p className="lyds-story-readout" aria-live="polite">
				Date: {date.toString()} · Time: {time.toString()} · Date and time: {dateTime.toString()}
			</p>
		</div>
	);
}

export const ControlledValues: Story = {
	render: () => <ControlledFieldsExample />,
	play: async ({ canvasElement }) => {
		const daySegment = canvasElement.querySelector<HTMLElement>('.lyds-date-field:first-child .lyds-date-segment[data-type="day"]');
		const hourSegment = canvasElement.querySelector<HTMLElement>('.lyds-time-field:not(.lyds-date-picker) .lyds-date-segment[data-type="hour"]');
		const minuteSegment = canvasElement.querySelector<HTMLElement>('.lyds-date-time-picker .lyds-date-segment[data-type="minute"]');
		await expect(daySegment).not.toBeNull();
		await expect(hourSegment).not.toBeNull();
		await expect(minuteSegment).not.toBeNull();
		await userEvent.click(daySegment!);
		await userEvent.keyboard("{ArrowUp}");
		await userEvent.click(hourSegment!);
		await userEvent.keyboard("{ArrowUp}");
		await userEvent.click(minuteSegment!);
		await userEvent.keyboard("{ArrowUp}");
		await expect(canvasElement.querySelector(".lyds-story-readout")).toHaveTextContent("Date: 2026-08-16 · Time: 15:30:45 · Date and time: 2026-08-31T14:31:45");
	}
};

export const LocalesAndSeconds: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<DateField label="Traditional Chinese date" defaultValue={defaultDate} locale="zh-TW" />
			<DateField label="British English date" defaultValue={defaultDate} locale="en-GB" />
			<TimeField label="24-hour time with seconds" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<TimeField label="12-hour time with seconds" defaultValue={defaultTime} locale="en-US" hourCycle={12} granularity="second" />
			<DateTimePicker label="Traditional Chinese date and time" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<DateTimePicker label="US date and time" defaultValue={defaultDateTime} locale="en-US" hourCycle={12} granularity="second" />
		</div>
	)
};

export const ZonedDateTimes: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<DateField
				label="Taipei zoned field value"
				defaultValue={taipeiDateTime}
				locale="zh-TW"
				hourCycle={24}
				granularity="second"
				description="DateField preserves the supplied ZonedDateTime value without assigning another zone."
			/>
			<TimeField
				label="Taipei zoned time value"
				defaultValue={taipeiDateTime}
				locale="zh-TW"
				hourCycle={24}
				granularity="second"
				description="TimeField exposes the time and zone segments carried by the value."
			/>
			<DateTimePicker
				label="Taipei operations schedule"
				defaultValue={taipeiDateTime}
				locale="zh-TW"
				hourCycle={24}
				granularity="second"
				description="The value retains the Asia/Taipei time-zone identifier."
			/>
			<DateTimePicker
				label="New York operations schedule"
				defaultValue={newYorkDateTime}
				locale="en-US"
				hourCycle={12}
				granularity="second"
				description="The value retains the America/New_York time-zone identifier."
			/>
		</div>
	)
};

export const CalendarAndRangeStates: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">Disabled calendar</p>
				<Calendar aria-label="Disabled maintenance calendar" defaultValue={defaultDate} disabled locale="en-GB" firstDayOfWeek="mon" />
			</div>
			<div className="lyds-story-stack lyds-story-stack--narrow">
				<DateRangePicker label="Disabled reporting period" defaultValue={defaultRange} disabled description="The reporting service owns this period." />
				<DateRangePicker label="Read-only reporting period" defaultValue={defaultRange} readOnly description="The selected dates remain available for review." />
			</div>
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-grid">
			<DateField label="Dark date field" defaultValue={defaultDate} locale="zh-TW" />
			<TimeField label="Dark time field" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<DateTimePicker label="Dark date and time" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<DateTimePicker label="Dark invalid schedule" required invalid error="Enter a date and time." granularity="second" />
		</div>
	)
};
