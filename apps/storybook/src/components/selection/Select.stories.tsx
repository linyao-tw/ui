import { Autocomplete, Combobox, Select } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../story-layout.css";

const sites = [
	{ value: "north", label: "台北辦公室", description: "台北 · 開放中" },
	{ value: "harbor", label: "高雄辦公室", description: "高雄 · 限時開放" },
	{ value: "archive", label: "已封存工作區", description: "唯讀", disabled: true },
	{ value: "field", label: "名稱較長的區域辦公室選項", description: "遠端團隊" }
] as const;

const meta = {
	title: "元件/選擇/選擇器",
	component: Select<string>,
	args: {
		"aria-label": "辦公室",
		className: "lyds-story-control",
		options: sites,
		placeholder: "選擇辦公室"
	}
} satisfies Meta<typeof Select<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "預設" };

export const Disabled: Story = {
	name: "停用",
	args: { disabled: true, defaultValue: "north" }
};

export const Invalid: Story = {
	name: "無效",
	args: { invalid: true, placeholder: "請選擇辦公室" }
};

function ControlledSelectDemo() {
	const [value, setValue] = useState<string | null>("north");

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Select<string> aria-label="目前辦公室" className="lyds-story-control" options={sites} value={value} onValueChange={next => setValue(next)} />
			<p className="lyds-story-readout" aria-live="polite">
				目前選項：{sites.find(site => site.value === value)?.label ?? "未選擇"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	name: "受控值",
	render: () => <ControlledSelectDemo />
};

export const SearchableSelection: Story = {
	name: "可搜尋選擇器",
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">組合方塊</p>
				<Combobox<string> aria-label="搜尋辦公室" className="lyds-story-control" options={sites} placeholder="輸入辦公室名稱" />
			</div>
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">自動完成</p>
				<Autocomplete<string> aria-label="辦公室名稱" className="lyds-story-control" options={sites} placeholder="輸入辦公室名稱" />
			</div>
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	args: { defaultValue: "harbor" }
};
