import { CalendarDate, DateRangePicker } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";

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

export const CompactWidths: Story = {
	name: "窄寬版面",
	render: () => (
		<div className="lyds-story-stack">
			<section aria-labelledby="date-range-width-320" data-layout-width="320" style={{ display: "grid", gap: "var(--space-2)", inlineSize: "min(100%, 20rem)" }}>
				<p className="lyds-story-panel__heading" id="date-range-width-320">
					320 像素
				</p>
				<DateRangePicker label="日期範圍" defaultValue={defaultRange} locale="zh-TW" />
			</section>
			<section aria-labelledby="date-range-width-390" data-layout-width="390" style={{ display: "grid", gap: "var(--space-2)", inlineSize: "min(100%, 24.375rem)" }}>
				<p className="lyds-story-panel__heading" id="date-range-width-390">
					390 像素
				</p>
				<DateRangePicker label="日期範圍" defaultValue={defaultRange} locale="zh-TW" />
			</section>
		</div>
	),
	play: async ({ canvasElement }) => {
		for (const sample of canvasElement.querySelectorAll<HTMLElement>("[data-layout-width]")) {
			const group = sample.querySelector<HTMLElement>(".lyds-date-picker-group");
			const inputs = sample.querySelectorAll<HTMLElement>(".lyds-date-picker-group > .lyds-date-input");
			await expect(group).not.toBeNull();
			await expect(inputs).toHaveLength(2);
			await expect(group!.scrollWidth).toBeLessThanOrEqual(group!.clientWidth);
			for (const input of inputs) {
				await expect(getComputedStyle(input).borderInlineStartWidth).toBe("0px");
				await expect(getComputedStyle(input).boxShadow).toBe("none");
			}
		}
	}
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	args: { defaultOpen: true, defaultValue: defaultRange }
};
