import { Calendar, CalendarDate } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../components/story-layout.css";

const initialDate = new CalendarDate(2026, 8, 31);

const meta = {
	title: "Date & Time/Calendar",
	component: Calendar,
	args: {
		defaultValue: initialDate,
		locale: "zh-TW"
	}
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function ControlledCalendar() {
	const [value, setValue] = useState(initialDate);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Calendar value={value} onValueChange={next => setValue(next)} locale="en-GB" firstDayOfWeek="mon" />
			<p className="lyds-story-readout" aria-live="polite">
				Selected date: {value.toString()}
			</p>
		</div>
	);
}

export const ControlledSelection: Story = {
	render: () => <ControlledCalendar />
};

export const DateConstraints: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">Consumer-provided unavailable dates</p>
				<Calendar
					defaultValue={initialDate}
					minValue={new CalendarDate(2026, 8, 20)}
					maxValue={new CalendarDate(2026, 9, 18)}
					isDateUnavailable={date => date.day === 5 || date.day === 12 || date.day === 19}
				/>
			</div>
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">Read-only calendar</p>
				<Calendar defaultValue={initialDate} readOnly weekdayStyle="narrow" />
			</div>
		</div>
	)
};

export const LocalesAndWeekStarts: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">Traditional Chinese, week starts Sunday</p>
				<Calendar defaultValue={initialDate} locale="zh-TW" firstDayOfWeek="sun" weekdayStyle="short" />
			</div>
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">English (UK), week starts Monday</p>
				<Calendar defaultValue={initialDate} locale="en-GB" firstDayOfWeek="mon" weekdayStyle="short" />
			</div>
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	args: { defaultValue: initialDate, locale: "zh-TW" }
};
