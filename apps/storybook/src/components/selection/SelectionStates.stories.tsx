import {
	Autocomplete,
	CheckboxItem,
	Combobox,
	ContextMenu,
	DropdownMenu,
	MenuCheckboxItem,
	MenuCheckboxItemIndicator,
	MenuItem,
	MenuLinkItem,
	MenuPopup,
	MenuPositioner,
	MenuRadioItem,
	MenuRadioItemIndicator,
	MenuSeparator,
	MenuSubmenuTrigger,
	MenuTrigger,
	RadioGroup,
	RadioItem,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	Slider,
	Switch,
	Toggle,
	ToggleGroup
} from "@lyds/ui";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import "../story-layout.css";

const offices = [
	{ value: "north", label: "台北辦公室", description: "台北 · 開放中" },
	{ value: "harbor", label: "高雄辦公室", description: "高雄 · 限時開放" },
	{ value: "archive", label: "已封存工作區", description: "唯讀", disabled: true }
] as const;

const meta = {
	title: "元件/選擇/狀態",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnlyAndDisabledControls: Story = {
	name: "唯讀與停用",
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">核取方塊</h3>
				<CheckboxItem defaultChecked readOnly label="唯讀選項" description="此值無法變更。" />
				<CheckboxItem disabled label="停用選項" description="此選項無法使用。" />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">開關</h3>
				<div className="lyds-story-row">
					<Switch defaultChecked readOnly aria-labelledby="state-matrix-readonly-switch" />
					<span id="state-matrix-readonly-switch">唯讀開關</span>
				</div>
				<div className="lyds-story-row">
					<Switch disabled aria-labelledby="state-matrix-disabled-switch" />
					<span id="state-matrix-disabled-switch">停用開關</span>
				</div>
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">單選群組</h3>
				<RadioGroup readOnly aria-label="唯讀寄送頻率" defaultValue="daily">
					<RadioItem value="daily" label="每日摘要" />
					<RadioItem value="weekly" label="每週摘要" />
				</RadioGroup>
				<RadioGroup disabled aria-label="停用的寄送頻率" defaultValue="weekly">
					<RadioItem value="daily" label="每日" />
					<RadioItem value="weekly" label="每週" />
				</RadioGroup>
			</section>
		</div>
	)
};

export const SliderStates: Story = {
	name: "滑桿狀態",
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">停用的水平滑桿</h3>
				<Slider disabled aria-label="鎖定的輸出值" defaultValue={72} showValue />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">垂直滑桿</h3>
				<Slider aria-label="垂直輸出值" defaultValue={48} orientation="vertical" showValue />
			</section>
		</div>
	)
};

function ControlledGroupsDemo() {
	const [views, setViews] = useState<string[]>(["cards"]);
	const [period, setPeriod] = useState<string | null>("day");

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<div className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">受控切換群組</h3>
				<ToggleGroup aria-label="受控檢視方式" multiple={false} value={views} onValueChange={next => setViews(next)}>
					<Toggle value="cards">卡片</Toggle>
					<Toggle value="list">清單</Toggle>
					<Toggle value="timeline">時間軸</Toggle>
				</ToggleGroup>
				<p className="lyds-story-readout" aria-live="polite">
					目前檢視：{views[0] === "cards" ? "卡片" : views[0] === "list" ? "清單" : views[0] === "timeline" ? "時間軸" : "未選擇"}
				</p>
			</div>
			<div className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">受控分段控制項</h3>
				<SegmentedControl aria-label="受控時間範圍" value={period} onValueChange={next => setPeriod(next)}>
					<SegmentedControlItem value="hour">1 小時</SegmentedControlItem>
					<SegmentedControlItem value="day">24 小時</SegmentedControlItem>
					<SegmentedControlItem value="week">7 天</SegmentedControlItem>
				</SegmentedControl>
				<p className="lyds-story-readout" aria-live="polite">
					目前範圍：{period === "hour" ? "1 小時" : period === "day" ? "24 小時" : period === "week" ? "7 天" : "未選擇"}
				</p>
			</div>
		</div>
	);
}

export const ControlledGroups: Story = {
	name: "受控群組",
	render: () => <ControlledGroupsDemo />
};

export const DisabledGroups: Story = {
	name: "停用群組",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<ToggleGroup disabled aria-label="停用的檢視方式" defaultValue={["cards"]}>
				<Toggle value="cards">卡片</Toggle>
				<Toggle value="list">清單</Toggle>
				<Toggle value="timeline">時間軸</Toggle>
			</ToggleGroup>
			<SegmentedControl disabled aria-label="停用的時間範圍" defaultValue="day">
				<SegmentedControlItem value="hour">1 小時</SegmentedControlItem>
				<SegmentedControlItem value="day">24 小時</SegmentedControlItem>
				<SegmentedControlItem value="week">7 天</SegmentedControlItem>
			</SegmentedControl>
		</div>
	)
};

export const SelectOpen: Story = {
	name: "展開的選擇器",
	render: () => <Select<string> defaultOpen aria-label="展開的辦公室選擇器" className="lyds-story-control" defaultValue="north" options={offices} />
};

export const SelectReadOnly: Story = {
	name: "唯讀選擇器",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Select<string> readOnly aria-describedby="state-matrix-readonly-select-note" aria-label="唯讀辦公室" className="lyds-story-control" defaultValue="north" options={offices} />
			<p className="lyds-story-note" id="state-matrix-readonly-select-note">
				此選項可取得焦點，但無法變更。
			</p>
		</div>
	)
};

export const SearchableFieldStates: Story = {
	name: "搜尋欄位狀態",
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">無效的組合方塊</h3>
				<Combobox<string> invalid aria-describedby="state-matrix-combobox-error" aria-label="必填的辦公室搜尋" className="lyds-story-control" options={offices} placeholder="搜尋辦公室" />
				<p className="lyds-story-note" id="state-matrix-combobox-error">
					請選擇可用的辦公室。
				</p>
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">停用的組合方塊</h3>
				<Combobox<string> disabled aria-label="停用的辦公室搜尋" className="lyds-story-control" defaultValue="north" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">唯讀組合方塊</h3>
				<Combobox<string> readOnly aria-label="唯讀辦公室搜尋" className="lyds-story-control" defaultValue="harbor" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">無效的自動完成欄位</h3>
				<Autocomplete<string> invalid aria-describedby="state-matrix-autocomplete-error" aria-label="必填的辦公室名稱" className="lyds-story-control" options={offices} placeholder="輸入辦公室名稱" />
				<p className="lyds-story-note" id="state-matrix-autocomplete-error">
					請輸入有效的辦公室名稱。
				</p>
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">停用的自動完成欄位</h3>
				<Autocomplete<string> disabled aria-label="停用的辦公室名稱" className="lyds-story-control" defaultValue="台北辦公室" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">唯讀自動完成欄位</h3>
				<Autocomplete<string> readOnly aria-label="唯讀辦公室名稱" className="lyds-story-control" defaultValue="高雄辦公室" options={offices} />
			</section>
		</div>
	)
};

export const ComboboxEmpty: Story = {
	name: "組合方塊無結果",
	render: () => (
		<Combobox<string>
			defaultOpen
			aria-label="沒有結果的辦公室搜尋"
			className="lyds-story-control"
			defaultInputValue="沒有相符的辦公室"
			emptyMessage="找不到辦公室"
			filteredItems={[]}
			options={offices}
		/>
	)
};

export const AutocompleteEmpty: Story = {
	name: "自動完成無建議",
	render: () => (
		<Autocomplete<string>
			defaultOpen
			aria-label="沒有建議的辦公室名稱"
			className="lyds-story-control"
			defaultValue="沒有相符的辦公室"
			emptyMessage="沒有可用的建議"
			filteredItems={[]}
			options={offices}
		/>
	)
};

export const SearchableDarkTheme: Story = {
	name: "深色主題搜尋欄位",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">組合方塊</h3>
				<Combobox<string> aria-label="深色主題辦公室搜尋" className="lyds-story-control" defaultValue="north" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">自動完成</h3>
				<Autocomplete<string> aria-label="深色主題辦公室名稱" className="lyds-story-control" defaultValue="台北辦公室" options={offices} />
			</section>
		</div>
	)
};

export const MenuOpenWithRadioAndLink: Story = {
	name: "展開的選單",
	render: () => (
		<DropdownMenu.Root defaultOpen>
			<MenuTrigger>檢視設定</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<DropdownMenu.RadioGroup defaultValue="comfortable">
							<MenuRadioItem value="compact">
								<MenuRadioItemIndicator />
								緊密
							</MenuRadioItem>
							<MenuRadioItem value="comfortable">
								<MenuRadioItemIndicator />
								寬鬆
							</MenuRadioItem>
						</DropdownMenu.RadioGroup>
						<MenuSeparator />
						<MenuLinkItem href="#selection-state-details">查看狀態詳細資料</MenuLinkItem>
						<MenuItem disabled>無法使用</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const MenuDisabledTrigger: Story = {
	name: "停用的選單按鈕",
	render: () => (
		<DropdownMenu.Root disabled>
			<MenuTrigger>無法使用的操作</MenuTrigger>
		</DropdownMenu.Root>
	)
};

export const MenuSubmenu: Story = {
	name: "子選單",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await canvas.findByRole("button", { name: "分享" });
		const submenuTrigger = await body.findByRole("menuitem", { name: "傳送至" });
		submenuTrigger.focus();
		await userEvent.keyboard("{ArrowRight}");
		await body.findByRole("menuitem", { name: "設計審查" });

		const parentMenu = body.getByRole("menuitem", { name: "複製連結" }).closest('[role="menu"]');
		await expect(parentMenu?.querySelector("span[aria-owns]")).toHaveAttribute("role", "group");
	},
	render: () => (
		<DropdownMenu.Root defaultOpen>
			<MenuTrigger>分享</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<MenuItem>複製連結</MenuItem>
						<DropdownMenu.SubmenuRoot>
							<MenuSubmenuTrigger>
								傳送至
								<CaretRightIcon aria-hidden="true" weight="bold" />
							</MenuSubmenuTrigger>
							<DropdownMenu.Portal>
								<MenuPositioner align="start" side="right">
									<MenuPopup>
										<MenuItem>設計審查</MenuItem>
										<MenuItem>工程審查</MenuItem>
									</MenuPopup>
								</MenuPositioner>
							</DropdownMenu.Portal>
						</DropdownMenu.SubmenuRoot>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const MenuDarkTheme: Story = {
	name: "深色主題選單",
	globals: { theme: "dark" },
	render: () => (
		<DropdownMenu.Root defaultOpen>
			<MenuTrigger>深色主題選單</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<MenuItem>查看詳細資料</MenuItem>
						<MenuCheckboxItem defaultChecked>
							<MenuCheckboxItemIndicator />
							顯示說明
						</MenuCheckboxItem>
						<MenuItem disabled>無法使用</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const ContextMenuKeyboard: Story = {
	name: "快顯選單鍵盤操作",
	render: () => (
		<div className="lyds-story-stack">
			<ContextMenu.Root>
				<ContextMenu.Trigger className="lyds-story-context-area" tabIndex={0}>
					報表項目
				</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenu.Positioner>
						<ContextMenu.Popup>
							<ContextMenu.Item>開啟報表</ContextMenu.Item>
							<ContextMenu.Item>複製報表連結</ContextMenu.Item>
							<ContextMenu.Separator />
							<ContextMenu.Item>封存報表</ContextMenu.Item>
						</ContextMenu.Popup>
					</ContextMenu.Positioner>
				</ContextMenu.Portal>
			</ContextMenu.Root>
			<p className="lyds-story-note">按 Tab 移至項目，再按 Shift+F10 或快顯選單鍵。使用方向鍵移動，按 Escape 關閉。</p>
		</div>
	)
};
