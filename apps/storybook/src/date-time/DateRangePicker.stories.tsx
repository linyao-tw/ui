import { CalendarDate, DateRangePicker } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../components/story-layout.css";

const defaultRange = {
	start: new CalendarDate(2026, 8, 28),
	end: new CalendarDate(2026, 9, 3)
};

const meta = {
	title: "Date & Time/DateRangePicker",
	component: DateRangePicker,
	args: {
		label: "Reporting period",
		description: "Select an inclusive start and end date.",
		defaultValue: defaultRange,
		locale: "zh-TW"
	}
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
	args: { defaultOpen: true }
};

function ControlledRange() {
	const [value, setValue] = useState(defaultRange);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DateRangePicker label="Controlled capture period" value={value} onValueChange={next => next && setValue(next)} locale="en-GB" />
			<p className="lyds-story-readout" aria-live="polite">
				Selected range: {value.start.toString()} — {value.end.toString()}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	render: () => <ControlledRange />
};

export const ConstraintsAndInvalid: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<DateRangePicker
				label="Service window"
				defaultValue={defaultRange}
				minValue={new CalendarDate(2026, 8, 20)}
				maxValue={new CalendarDate(2026, 9, 18)}
				isDateUnavailable={date => date.day === 1 || date.day === 7}
				description="Unavailable dates are supplied by the consumer."
			/>
			<DateRangePicker label="Required reporting period" invalid required error="The selected range overlaps a closed reporting interval." />
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	args: { defaultOpen: true, defaultValue: defaultRange }
};
