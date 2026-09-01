import { Button, Popover, PreviewCard, Tooltip } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import "../story-layout.css";

const meta = {
	title: "元件/浮層/工具提示",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function HelpTooltip({ defaultOpen = false }: { defaultOpen?: boolean }) {
	return (
		<Tooltip.Provider delay={250}>
			<Tooltip.Root defaultOpen={defaultOpen}>
				<Tooltip.Trigger aria-label="格式說明">格式說明</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Positioner side="top">
						<Tooltip.Popup>
							支援 Markdown 格式
							<Tooltip.Arrow />
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}

export const Default: Story = {
	name: "預設",
	render: () => <HelpTooltip />
};

export const Open: Story = {
	name: "開啟",
	render: () => <HelpTooltip defaultOpen />
};

export const PopoverPanel: Story = {
	name: "彈出內容",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await userEvent.click(canvas.getByRole("button", { name: "成員資料" }));
		const description = await body.findByText("編輯者 · 2026 年 8 月 14 日加入");
		const actions = description.nextElementSibling;
		await expect(actions).not.toBeNull();
		if (actions instanceof HTMLElement) {
			await expect(Number.parseFloat(getComputedStyle(actions).marginBlockStart)).toBeGreaterThan(0);
		}
	},
	render: () => (
		<Popover.Root>
			<Popover.Trigger>成員資料</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner>
					<Popover.Popup>
						<Popover.Title>陳怡安</Popover.Title>
						<Popover.Description>編輯者 · 2026 年 8 月 14 日加入</Popover.Description>
						<div className="lyds-story-row">
							<Button size="sm">查看個人資料</Button>
							<Popover.Close>關閉</Popover.Close>
						</div>
						<Popover.Arrow />
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	)
};

export const Preview: Story = {
	name: "預覽卡片",
	render: () => (
		<PreviewCard.Root>
			<PreviewCard.Trigger href="#article">無障礙表單設計</PreviewCard.Trigger>
			<PreviewCard.Portal>
				<PreviewCard.Positioner>
					<PreviewCard.Popup>
						<strong>無障礙表單設計</strong>
						<p>說明標籤、錯誤訊息、焦點與鍵盤操作。</p>
						<PreviewCard.Arrow />
					</PreviewCard.Popup>
				</PreviewCard.Positioner>
			</PreviewCard.Portal>
		</PreviewCard.Root>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => <HelpTooltip defaultOpen />
};
