import { Time, TimeField, TimePicker } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../components/story-layout.css";

const defaultTime = new Time(14, 30);

const meta = {
	title: "Date & Time/TimePicker",
	component: TimePicker,
	args: {
		label: "Service time",
		description: "Use arrow keys to adjust the focused segment.",
		defaultValue: defaultTime,
		locale: "zh-TW",
		hourCycle: 24,
		granularity: "minute"
	}
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function ControlledTime() {
	const [value, setValue] = useState<Time | null>(defaultTime);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TimePicker label="Controlled activation time" value={value} onValueChange={setValue} locale="en-GB" hourCycle={24} />
			<p className="lyds-story-readout" aria-live="polite">
				TIME / {value?.toString() ?? "UNSET"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	render: () => <ControlledTime />
};

export const ClockFormats: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<TimePicker label="24-hour operator view" defaultValue={new Time(21, 5)} locale="zh-TW" hourCycle={24} />
			<TimePicker label="12-hour operator view" defaultValue={new Time(21, 5)} locale="en-US" hourCycle={12} />
			<TimeField label="Segmented field" defaultValue={new Time(8, 14, 32)} granularity="second" description="TimeField omits the picker affordance while keeping locale-aware segments." />
			<TimePicker label="Read-only synchronized time" defaultValue={new Time(6, 45)} readOnly />
		</div>
	)
};

export const ConstraintsAndInvalid: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<TimePicker label="Shift handoff" defaultValue={defaultTime} minValue={new Time(8)} maxValue={new Time(18)} description="Allowed range: 08:00–18:00." />
			<TimePicker label="Activation time" invalid required error="Choose a time inside the scheduled maintenance window." />
			<TimePicker label="Remote synchronized time" defaultValue={new Time(14, 30)} disabled description="Controlled by the remote controller." />
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	args: { defaultValue: new Time(23, 48), locale: "zh-TW", hourCycle: 24 }
};
