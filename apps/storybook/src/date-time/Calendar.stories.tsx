import { Calendar, CalendarDate } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";

import "@/components/story-layout.css";

const initialDate = new CalendarDate(2026, 8, 31);

const meta = {
	title: "日期與時間/行事曆",
	component: Calendar,
	args: {
		defaultValue: initialDate,
		locale: "zh-TW"
	}
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "預設",
	play: async ({ canvasElement }) => {
		const selectedCell = canvasElement.querySelector<HTMLElement>('.lyds-calendar-cell[data-selected="true"]');
		await expect(selectedCell).not.toBeNull();

		const cellRect = selectedCell!.getBoundingClientRect();
		const contentRange = document.createRange();
		contentRange.selectNodeContents(selectedCell!);
		const contentRect = contentRange.getBoundingClientRect();
		const cellCenter = cellRect.top + cellRect.height / 2;
		const contentCenter = contentRect.top + contentRect.height / 2;

		await expect(Math.abs(cellCenter - contentCenter)).toBeLessThan(1);
	}
};

function ControlledCalendar() {
	const [value, setValue] = useState(initialDate);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Calendar value={value} onValueChange={next => setValue(next)} locale="en-GB" firstDayOfWeek="mon" />
			<p className="lyds-story-readout" aria-live="polite">
				已選日期：{value.toString()}
			</p>
		</div>
	);
}

export const ControlledSelection: Story = {
	name: "受控選取",
	render: () => <ControlledCalendar />
};

export const DateConstraints: Story = {
	name: "日期限制",
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">不可選日期</p>
				<Calendar
					defaultValue={initialDate}
					minValue={new CalendarDate(2026, 8, 20)}
					maxValue={new CalendarDate(2026, 9, 18)}
					isDateUnavailable={date => date.day === 5 || date.day === 12 || date.day === 19}
				/>
			</div>
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">唯讀行事曆</p>
				<Calendar defaultValue={initialDate} readOnly weekdayStyle="narrow" />
			</div>
		</div>
	)
};

export const LocalesAndWeekStarts: Story = {
	name: "地區格式與每週起始日",
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">繁體中文，週日起始</p>
				<Calendar defaultValue={initialDate} locale="zh-TW" firstDayOfWeek="sun" weekdayStyle="short" />
			</div>
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">英式英文，週一起始</p>
				<Calendar defaultValue={initialDate} locale="en-GB" firstDayOfWeek="mon" weekdayStyle="short" />
			</div>
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	args: { defaultValue: initialDate, locale: "zh-TW" }
};
