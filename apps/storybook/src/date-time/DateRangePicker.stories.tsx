import { CalendarDate, DateRangePicker } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../components/story-layout.css";

const defaultRange = {
	start: new CalendarDate(2026, 8, 28),
	end: new CalendarDate(2026, 9, 3)
};

const meta = {
	title: "日期與時間/日期範圍選擇器",
	component: DateRangePicker,
	args: {
		label: "日期範圍",
		description: "選擇開始與結束日期。",
		defaultValue: defaultRange,
		locale: "zh-TW"
	}
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "預設" };

export const Open: Story = {
	name: "展開",
	args: { defaultOpen: true }
};

function ControlledRange() {
	const [value, setValue] = useState(defaultRange);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DateRangePicker label="受控日期範圍" value={value} onValueChange={next => next && setValue(next)} locale="en-GB" />
			<p className="lyds-story-readout" aria-live="polite">
				已選範圍：{value.start.toString()} — {value.end.toString()}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	name: "受控值",
	render: () => <ControlledRange />
};

export const ConstraintsAndInvalid: Story = {
	name: "限制與錯誤",
	render: () => (
		<div className="lyds-story-grid">
			<DateRangePicker
				label="可選日期範圍"
				defaultValue={defaultRange}
				minValue={new CalendarDate(2026, 8, 20)}
				maxValue={new CalendarDate(2026, 9, 18)}
				isDateUnavailable={date => date.day === 1 || date.day === 7}
				description="不可選日期由使用端提供。"
			/>
			<DateRangePicker label="必填日期範圍" invalid required error="所選範圍包含不可選日期。" />
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	args: { defaultOpen: true, defaultValue: defaultRange }
};
