import { CalendarDate, CalendarDateTime, DateField, DatePicker, DateTimePicker } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../components/story-layout.css";

const defaultDate = new CalendarDate(2026, 8, 31);

const meta = {
	title: "日期與時間/日期選擇器",
	component: DatePicker,
	args: {
		label: "日期",
		description: "選擇日期。",
		defaultValue: defaultDate,
		locale: "zh-TW"
	}
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "預設" };

export const Open: Story = {
	name: "展開",
	args: { defaultOpen: true }
};

function ControlledPicker() {
	const [value, setValue] = useState<CalendarDate | null>(defaultDate);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DatePicker label="受控日期" value={value} onValueChange={setValue} locale="en-GB" firstDayOfWeek="mon" />
			<p className="lyds-story-readout" aria-live="polite">
				已選日期：{value?.toString() ?? "未設定"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	name: "受控值",
	render: () => <ControlledPicker />
};

export const FieldStates: Story = {
	name: "欄位狀態",
	render: () => (
		<div className="lyds-story-form">
			<DatePicker label="必填日期" required invalid error="請選擇允許的日期。" minValue={new CalendarDate(2026, 8, 20)} maxValue={new CalendarDate(2026, 9, 18)} />
			<DatePicker label="已停用日期" defaultValue={defaultDate} disabled description="此欄位無法編輯。" />
			<DateField label="日期欄位" defaultValue={defaultDate} description="使用鍵盤分段輸入日期。" />
			<DateField label="唯讀日期" defaultValue={defaultDate} readOnly locale="en-US" />
		</div>
	)
};

export const DateTime: Story = {
	name: "日期與時間",
	render: () => (
		<div className="lyds-story-grid">
			<DateTimePicker label="無時區日期與時間" defaultValue={new CalendarDateTime(2026, 8, 31, 14, 30)} locale="zh-TW" hourCycle={24} granularity="minute" description="此值不包含時區。" />
			<DateTimePicker label="美式日期與時間" defaultValue={new CalendarDateTime(2026, 8, 31, 14, 30)} locale="en-US" hourCycle={12} granularity="minute" />
		</div>
	)
};

export const LongText: Story = {
	name: "長文字",
	render: () => <DatePicker label="具有較長標題且需要完整換行顯示的文件預定發布日期" description="標題與說明文字會換行，日期欄位維持可操作。" defaultValue={defaultDate} />
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	args: { defaultOpen: true, locale: "zh-TW", defaultValue: defaultDate }
};
