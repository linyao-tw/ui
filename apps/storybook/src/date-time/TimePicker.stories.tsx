import { Time, TimeField, TimePicker } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import "../components/story-layout.css";

const defaultTime = new Time(14, 30);

const meta = {
	title: "日期與時間/時間選擇器",
	component: TimePicker,
	args: {
		label: "時間",
		description: "使用方向鍵調整目前欄位。",
		defaultValue: defaultTime,
		locale: "zh-TW",
		hourCycle: 24,
		granularity: "minute"
	}
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	name: "預設",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getAllByRole("spinbutton")[0]!);

		const shell = canvasElement.querySelector<HTMLElement>(".lyds-date-input-shell");
		const nestedInput = canvasElement.querySelector<HTMLElement>(".lyds-date-input-shell > .lyds-date-input");
		await expect(shell).not.toBeNull();
		await expect(nestedInput).not.toBeNull();
		const shellFocusLayers = getComputedStyle(shell!).boxShadow.match(/0px 0px 0px/g) ?? [];
		await expect(shellFocusLayers).toHaveLength(1);
		await expect(getComputedStyle(nestedInput!).boxShadow).toBe("none");
	}
};

function ControlledTime() {
	const [value, setValue] = useState<Time | null>(defaultTime);

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TimePicker label="受控時間" value={value} onValueChange={setValue} locale="en-GB" hourCycle={24} />
			<p className="lyds-story-readout" aria-live="polite">
				已選時間：{value?.toString() ?? "未設定"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	name: "受控值",
	render: () => <ControlledTime />
};

export const ClockFormats: Story = {
	name: "時間格式",
	render: () => (
		<div className="lyds-story-grid">
			<TimePicker label="24 小時制" defaultValue={new Time(21, 5)} locale="zh-TW" hourCycle={24} />
			<TimePicker label="12 小時制" defaultValue={new Time(21, 5)} locale="en-US" hourCycle={12} />
			<TimeField label="時間欄位" defaultValue={new Time(8, 14, 32)} granularity="second" description="不顯示選擇器按鈕，仍依地區格式顯示欄位。" />
			<TimePicker label="唯讀時間" defaultValue={new Time(6, 45)} readOnly />
		</div>
	)
};

export const ConstraintsAndInvalid: Story = {
	name: "限制與錯誤",
	render: () => (
		<div className="lyds-story-grid">
			<TimePicker label="可選時間範圍" defaultValue={defaultTime} minValue={new Time(8)} maxValue={new Time(18)} description="可選範圍：08:00–18:00。" />
			<TimePicker label="必填時間" invalid required error="請選擇允許範圍內的時間。" />
			<TimePicker label="已停用時間" defaultValue={new Time(14, 30)} disabled description="此欄位無法編輯。" />
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	args: { defaultValue: new Time(23, 48), locale: "zh-TW", hourCycle: 24 }
};
