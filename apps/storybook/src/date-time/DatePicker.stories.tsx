import { CalendarDate, CalendarDateTime, DateField, DatePicker, DateTimePicker } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../components/story-layout.css";

const defaultDate = new CalendarDate(2026, 8, 31);

const meta = {
	title: "Date & Time/DatePicker",
	component: DatePicker,
	args: {
		label: "Service date",
		description: "Choose the next on-site service window.",
		defaultValue: defaultDate,
		locale: "zh-TW"
	}
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
	args: { open: true }
};

function ControlledPicker() {
	const [value, setValue] = useState<CalendarDate | null>(defaultDate);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DatePicker label="Controlled inspection date" value={value} onValueChange={setValue} locale="en-GB" firstDayOfWeek="mon" />
			<p className="lyds-story-readout" aria-live="polite">
				Selected date: {value?.toString() ?? "Not set"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	render: () => <ControlledPicker />
};

export const FieldStates: Story = {
	render: () => (
		<div className="lyds-story-form">
			<DatePicker
				label="Required inspection"
				required
				invalid
				error="Choose a date inside the active service period."
				minValue={new CalendarDate(2026, 8, 20)}
				maxValue={new CalendarDate(2026, 9, 18)}
			/>
			<DatePicker label="Provisioned date" defaultValue={defaultDate} disabled description="Managed by central scheduling." />
			<DateField label="Date-only field" defaultValue={defaultDate} description="Segmented keyboard input without a calendar popover." />
			<DateField label="Read-only field" defaultValue={defaultDate} readOnly locale="en-US" />
		</div>
	)
};

export const DateTime: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<DateTimePicker
				label="Wall-clock maintenance"
				defaultValue={new CalendarDateTime(2026, 8, 31, 14, 30)}
				locale="zh-TW"
				hourCycle={24}
				granularity="minute"
				description="CalendarDateTime represents a wall-clock value without silently assigning a time zone."
			/>
			<DateTimePicker label="US locale" defaultValue={new CalendarDateTime(2026, 8, 31, 14, 30)} locale="en-US" hourCycle={12} granularity="minute" />
		</div>
	)
};

export const LongText: Story = {
	render: () => (
		<DatePicker
			label="The planned publication date for a document with an unusually long translated title"
			description="Long localized supporting copy wraps independently while the date segments retain their predictable keyboard and screen-reader behavior."
			defaultValue={defaultDate}
		/>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	args: { open: true, locale: "zh-TW", defaultValue: defaultDate }
};
