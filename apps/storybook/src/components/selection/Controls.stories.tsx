import { CheckboxGroup, CheckboxItem, Switch as LydsSwitch, RadioGroup, RadioItem, SegmentedControl, SegmentedControlItem, Slider, Toggle, ToggleGroup } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import "../story-layout.css";

function resolveBackgroundColor(container: HTMLElement, customProperty: string) {
	const probe = document.createElement("span");
	probe.style.backgroundColor = `var(${customProperty})`;
	container.append(probe);
	const color = getComputedStyle(probe).backgroundColor;
	probe.remove();
	return color;
}

const meta = {
	title: "元件/選擇/控制項",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {
	name: "核取方塊",
	render: () => (
		<CheckboxGroup aria-label="通知方式" defaultValue={["email", "in-app"]}>
			<CheckboxItem value="email" label="電子郵件通知" description="以電子郵件接收重要通知。" />
			<CheckboxItem value="in-app" label="應用程式內通知" description="在使用應用程式時顯示通知。" />
			<CheckboxItem value="sms" label="簡訊通知" description="此帳號無法使用。" disabled />
		</CheckboxGroup>
	)
};

export const CheckboxStates: Story = {
	name: "核取方塊狀態",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checked = canvas.getByRole("checkbox", { name: "已勾選" });
		const checkedColor = resolveBackgroundColor(canvasElement, "--control-primary");

		await expect(getComputedStyle(checked).backgroundColor).toBe(checkedColor);
		await userEvent.click(checked);
		await expect(checked).toHaveAttribute("data-unchecked");
	},
	render: () => (
		<div className="lyds-story-row">
			<CheckboxItem label="未勾選" />
			<CheckboxItem defaultChecked label="已勾選" />
			<CheckboxItem indeterminate label="部分勾選" />
			<CheckboxItem disabled label="停用且未勾選" />
			<CheckboxItem disabled defaultChecked label="停用且已勾選" />
		</div>
	)
};

export const Switch: Story = {
	name: "開關",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const checked = canvas.getByRole("switch", { name: "自動儲存變更" });
		const checkedColor = resolveBackgroundColor(canvasElement, "--control-primary");

		await expect(getComputedStyle(checked).backgroundColor).toBe(checkedColor);
		await userEvent.click(checked);
		await expect(checked).toHaveAttribute("data-unchecked");
	},
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<div className="lyds-story-row">
				<LydsSwitch aria-labelledby="manual-save-label" />
				<span id="manual-save-label">手動儲存變更</span>
			</div>
			<div className="lyds-story-row">
				<LydsSwitch defaultChecked aria-labelledby="automatic-regulation-label" />
				<span id="automatic-regulation-label">自動儲存變更</span>
			</div>
			<div className="lyds-story-row">
				<LydsSwitch aria-labelledby="emergency-uplink-label" disabled />
				<span id="emergency-uplink-label">無法使用離線存取</span>
			</div>
			<div className="lyds-story-row">
				<LydsSwitch defaultChecked aria-labelledby="disabled-checked-switch-label" disabled />
				<span id="disabled-checked-switch-label">已開啟且停用</span>
			</div>
		</div>
	)
};

export const DarkControlStates: Story = {
	name: "深色主題狀態",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<CheckboxItem label="未勾選" />
			<RadioGroup aria-label="深色主題單選狀態" defaultValue="selected">
				<RadioItem value="unselected" label="未選取" />
				<RadioItem value="selected" label="已選取" />
			</RadioGroup>
			<div className="lyds-story-row">
				<LydsSwitch aria-labelledby="dark-switch-label" />
				<span id="dark-switch-label">關閉</span>
			</div>
		</div>
	)
};

export const RadioChoices: Story = {
	name: "單選項目",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const radio of canvas.getAllByRole("radio")) {
			const item = radio.closest("label");
			await expect(item).not.toBeNull();
			const radioBounds = radio.getBoundingClientRect();
			const itemBounds = item!.getBoundingClientRect();
			await expect(Math.abs(radioBounds.top + radioBounds.height / 2 - (itemBounds.top + itemBounds.height / 2))).toBeLessThanOrEqual(1);
		}
	},
	render: () => (
		<RadioGroup aria-label="更新頻率" defaultValue="daily">
			<RadioItem value="weekly" label="每週" description="每週一提供摘要。" />
			<RadioItem value="daily" label="每日" description="每天提供摘要。" />
			<RadioItem value="realtime" label="即時" description="有變更時立即通知。" />
		</RadioGroup>
	)
};

export const SliderControl: Story = {
	name: "滑桿",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("slider", { name: "音量" });
		const track = input.parentElement?.parentElement;
		const indicator = track?.firstElementChild;

		await expect(track).not.toBeNull();
		await expect(indicator).not.toBeNull();
		await expect(getComputedStyle(track!).backgroundColor).toBe(resolveBackgroundColor(canvasElement, "--control-border-hover"));
		await expect(getComputedStyle(indicator!).backgroundColor).toBe(resolveBackgroundColor(canvasElement, "--control-selected"));
	},
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Slider aria-label="音量" defaultValue={64} min={0} max={100} showValue />
			<Slider aria-label="價格範圍" defaultValue={[18, 27]} min={0} max={50} showValue getAriaLabel={index => (index === 0 ? "最低價格" : "最高價格")} />
		</div>
	)
};

export const ToggleControls: Story = {
	name: "切換按鈕",
	render: () => (
		<div className="lyds-story-stack">
			<div className="lyds-story-row">
				<Toggle defaultPressed>預覽面板</Toggle>
				<Toggle variant="quiet">說明</Toggle>
				<Toggle disabled>封存項目</Toggle>
			</div>
			<ToggleGroup aria-label="檢視方式" defaultValue={["diagram"]}>
				<Toggle value="diagram">卡片</Toggle>
				<Toggle value="list">清單</Toggle>
				<Toggle value="history">時間軸</Toggle>
			</ToggleGroup>
		</div>
	)
};

export const Segmented: Story = {
	name: "分段控制項",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SegmentedControl aria-label="中型時間範圍" defaultValue="day" size="md">
				<SegmentedControlItem value="hour">1 小時</SegmentedControlItem>
				<SegmentedControlItem value="day">24 小時</SegmentedControlItem>
				<SegmentedControlItem value="week">7 天</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl aria-label="小型時間範圍" defaultValue="day" size="sm">
				<SegmentedControlItem value="hour">1 小時</SegmentedControlItem>
				<SegmentedControlItem value="day">24 小時</SegmentedControlItem>
				<SegmentedControlItem value="week">7 天</SegmentedControlItem>
			</SegmentedControl>
			<p className="lyds-story-note">使用方向鍵切換選項。篩選規則由應用程式處理。</p>
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<CheckboxItem defaultChecked label="電子郵件通知" />
			<div className="lyds-story-row">
				<LydsSwitch defaultChecked aria-labelledby="low-light-controls-label" />
				<span id="low-light-controls-label">深色主題</span>
			</div>
			<Slider aria-label="介面對比" defaultValue={38} showValue />
		</div>
	)
};
