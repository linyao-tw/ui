import { Calendar, CalendarDate, CalendarDateTime, DateField, DateRangePicker, DateTimePicker, Time, TimeField, parseZonedDateTime } from "@linyao.tw/ui";
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
	title: "日期與時間/欄位狀態",
	component: DateField,
	parameters: {
		layout: "padded"
	}
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateFieldSizes: Story = {
	name: "日期欄位尺寸",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DateField label="小型日期欄位" defaultValue={defaultDate} locale="en-GB" size="sm" />
			<DateField label="中型日期欄位" defaultValue={defaultDate} locale="en-GB" size="md" />
			<DateField label="大型日期欄位" defaultValue={defaultDate} locale="en-GB" size="lg" />
		</div>
	)
};

export const DateFieldStates: Story = {
	name: "日期欄位狀態",
	render: () => (
		<div className="lyds-story-grid">
			<DateField label="已停用日期" defaultValue={defaultDate} disabled description="此欄位無法編輯。" />
			<DateField label="唯讀日期" defaultValue={defaultDate} readOnly description="此欄位只顯示目前值。" />
			<DateField label="必填日期" required invalid error="請輸入日期。" />
		</div>
	)
};

export const TimeFieldSizes: Story = {
	name: "時間欄位尺寸",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TimeField label="小型時間欄位" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} size="sm" />
			<TimeField label="中型時間欄位" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} size="md" />
			<TimeField label="大型時間欄位" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} size="lg" />
		</div>
	)
};

export const TimeFieldStates: Story = {
	name: "時間欄位狀態",
	render: () => (
		<div className="lyds-story-grid">
			<TimeField label="已停用時間" defaultValue={defaultTime} disabled granularity="second" />
			<TimeField label="唯讀時間" defaultValue={defaultTime} readOnly granularity="second" />
			<TimeField label="必填時間" required invalid error="請輸入時間。" />
		</div>
	)
};

export const DateTimePickerSizes: Story = {
	name: "日期時間選擇器尺寸",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<DateTimePicker label="小型日期時間選擇器" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} size="sm" />
			<DateTimePicker label="中型日期時間選擇器" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} size="md" />
			<DateTimePicker label="大型日期時間選擇器" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} size="lg" />
		</div>
	)
};

export const DateTimePickerStates: Story = {
	name: "日期時間選擇器狀態",
	render: () => (
		<div className="lyds-story-grid">
			<DateTimePicker label="已停用日期與時間" defaultValue={defaultDateTime} disabled granularity="second" description="此欄位無法編輯。" />
			<DateTimePicker label="唯讀日期與時間" defaultValue={defaultDateTime} readOnly granularity="second" description="此欄位只顯示目前值。" />
			<DateTimePicker label="必填日期與時間" required invalid error="請輸入日期與時間。" granularity="second" />
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
				<DateField label="受控日期" value={date} onValueChange={value => value && setDate(value)} locale="en-GB" />
				<TimeField label="受控時間" value={time} onValueChange={value => value && setTime(value)} locale="en-GB" hourCycle={24} granularity="second" />
				<DateTimePicker label="受控日期與時間" value={dateTime} onValueChange={value => value && setDateTime(value)} locale="en-GB" hourCycle={24} granularity="second" />
			</div>
			<p className="lyds-story-readout" aria-live="polite">
				日期：{date.toString()} · 時間：{time.toString()} · 日期與時間：{dateTime.toString()}
			</p>
		</div>
	);
}

export const ControlledValues: Story = {
	name: "受控值",
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
		await expect(canvasElement.querySelector(".lyds-story-readout")).toHaveTextContent("日期：2026-08-16 · 時間：15:30:45 · 日期與時間：2026-08-31T14:31:45");
	}
};

export const LocalesAndSeconds: Story = {
	name: "地區格式與秒數",
	render: () => (
		<div className="lyds-story-grid">
			<DateField label="繁體中文日期" defaultValue={defaultDate} locale="zh-TW" />
			<DateField label="英式英文日期" defaultValue={defaultDate} locale="en-GB" />
			<TimeField label="含秒數的 24 小時制時間" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<TimeField label="含秒數的 12 小時制時間" defaultValue={defaultTime} locale="en-US" hourCycle={12} granularity="second" />
			<DateTimePicker label="繁體中文日期與時間" defaultValue={defaultDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<DateTimePicker label="美式日期與時間" defaultValue={defaultDateTime} locale="en-US" hourCycle={12} granularity="second" />
		</div>
	)
};

export const ZonedDateTimes: Story = {
	name: "時區值",
	render: () => (
		<div className="lyds-story-grid">
			<DateField label="台北時區日期" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" description="保留原始 ZonedDateTime 與時區。" />
			<TimeField label="台北時區時間" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" description="顯示數值包含的時間與時區欄位。" />
			<DateTimePicker label="台北時區日期與時間" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" description="保留 Asia/Taipei 時區識別碼。" />
			<DateTimePicker label="紐約時區日期與時間" defaultValue={newYorkDateTime} locale="en-US" hourCycle={12} granularity="second" description="保留 America/New_York 時區識別碼。" />
		</div>
	)
};

export const ZonedDateTimesAtCompactWidths: Story = {
	name: "時區值窄寬版面",
	render: () => (
		<div className="lyds-story-stack">
			<section aria-labelledby="zoned-date-time-width-320" data-layout-width="320" style={{ display: "grid", gap: "var(--space-2)", inlineSize: "min(100%, 20rem)" }}>
				<p className="lyds-story-panel__heading" id="zoned-date-time-width-320">
					320 像素
				</p>
				<div className="lyds-story-stack">
					<DateField label="含時區日期" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
					<TimeField label="含時區時間" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
					<DateTimePicker label="含時區日期與時間" defaultValue={newYorkDateTime} locale="en-US" hourCycle={12} granularity="second" />
				</div>
			</section>
			<section aria-labelledby="zoned-date-time-width-390" data-layout-width="390" style={{ display: "grid", gap: "var(--space-2)", inlineSize: "min(100%, 24.375rem)" }}>
				<p className="lyds-story-panel__heading" id="zoned-date-time-width-390">
					390 像素
				</p>
				<div className="lyds-story-stack">
					<DateField label="含時區日期" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
					<TimeField label="含時區時間" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
					<DateTimePicker label="含時區日期與時間" defaultValue={newYorkDateTime} locale="en-US" hourCycle={12} granularity="second" />
				</div>
			</section>
		</div>
	),
	play: async ({ canvasElement }) => {
		for (const sample of canvasElement.querySelectorAll<HTMLElement>("[data-layout-width]")) {
			for (const control of sample.querySelectorAll<HTMLElement>(".lyds-date-input, .lyds-date-input-shell, .lyds-date-picker-group")) {
				await expect(control.scrollWidth).toBeLessThanOrEqual(control.clientWidth);
			}

			for (const timeZone of sample.querySelectorAll<HTMLElement>('.lyds-date-segment[data-type="timeZoneName"]')) {
				const bounds = timeZone.getBoundingClientRect();
				const controlBounds = timeZone.closest<HTMLElement>(".lyds-date-input")!.getBoundingClientRect();
				await expect(bounds.right).toBeLessThanOrEqual(controlBounds.right);
				await expect(bounds.left).toBeGreaterThanOrEqual(controlBounds.left);
			}
		}
	}
};

export const CalendarAndRangeStates: Story = {
	name: "行事曆與日期範圍狀態",
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">已停用行事曆</p>
				<Calendar aria-label="已停用行事曆" defaultValue={defaultDate} disabled locale="en-GB" firstDayOfWeek="mon" />
			</div>
			<div className="lyds-story-stack lyds-story-stack--narrow">
				<DateRangePicker label="已停用日期範圍" defaultValue={defaultRange} disabled description="此欄位無法編輯。" />
				<DateRangePicker label="唯讀日期範圍" defaultValue={defaultRange} readOnly description="此欄位只顯示目前值。" />
			</div>
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-grid">
			<DateField label="深色主題日期欄位" defaultValue={defaultDate} locale="zh-TW" />
			<TimeField label="深色主題時間欄位" defaultValue={defaultTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<DateTimePicker label="深色主題日期與時間" defaultValue={taipeiDateTime} locale="zh-TW" hourCycle={24} granularity="second" />
			<DateTimePicker label="深色主題錯誤狀態" required invalid error="請輸入日期與時間。" granularity="second" />
		</div>
	)
};
