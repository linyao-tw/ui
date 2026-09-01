import { Accordion, AlertDialog, BottomSheet, Button, Collapsible, Dialog, Drawer, Popover, Tabs, Tooltip } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import "../story-layout.css";

const meta = {
	title: "元件/浮層/狀態",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SettingsAccordion({ values = [], multiple = false }: { values?: string[]; multiple?: boolean }) {
	return (
		<Accordion.Root defaultValue={values} multiple={multiple} className="lyds-story-stack--narrow">
			<Accordion.Item value="account">
				<Accordion.Header>
					<Accordion.Trigger>帳號資料</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>更新個人資料、電子郵件地址與登入設定。</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="security">
				<Accordion.Header>
					<Accordion.Trigger>安全性</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>查看使用中的工作階段、復原方式與驗證原則。</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="billing" disabled>
				<Accordion.Header>
					<Accordion.Trigger>帳務</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>此帳號無法使用帳務設定。</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	);
}

export const AccordionAllCollapsed: Story = {
	name: "手風琴：全部收合",
	render: () => <SettingsAccordion />
};

export const AccordionMultipleOpen: Story = {
	name: "手風琴：多個展開",
	render: () => <SettingsAccordion values={["account", "security"]} multiple />
};

export const AccordionLongContent: Story = {
	name: "手風琴：長內容",
	render: () => (
		<Accordion.Root defaultValue={["policy"]} className="lyds-story-stack--narrow">
			<Accordion.Item value="policy">
				<Accordion.Header>
					<Accordion.Trigger>工作區資料保留與復原原則</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<div className="lyds-story-stack">
						<p>工作區活動會依帳號擁有者設定的期限保留。既有匯出檔案在到期前仍可使用。</p>
						<p>封存資料必須經過管理員審核與再次確認後才能復原。</p>
					</div>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="notifications">
				<Accordion.Header>
					<Accordion.Trigger>通知傳送方式</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>選擇要透過電子郵件接收的更新通知。</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	)
};

export const AccordionDark: Story = {
	name: "手風琴：深色主題",
	globals: { theme: "dark" },
	render: () => <SettingsAccordion values={["security"]} />
};

export const CollapsibleOpen: Story = {
	name: "可收合內容：展開",
	render: () => (
		<Collapsible.Root defaultOpen className="lyds-story-stack--narrow">
			<Collapsible.Trigger>其他資訊</Collapsible.Trigger>
			<Collapsible.Panel>上次檢查沒有發現其他問題。</Collapsible.Panel>
		</Collapsible.Root>
	)
};

export const CollapsibleDisabled: Story = {
	name: "可收合內容：停用",
	render: () => (
		<Collapsible.Root defaultOpen disabled className="lyds-story-stack--narrow">
			<Collapsible.Trigger>封存資料</Collapsible.Trigger>
			<Collapsible.Panel>封存資料準備期間無法收合此內容。</Collapsible.Panel>
		</Collapsible.Root>
	)
};

function AccountTabs({ controlled = false, vertical = false }: { controlled?: boolean; vertical?: boolean }) {
	const [value, setValue] = useState("overview");
	const rootProps = controlled ? { value, onValueChange: (nextValue: string | number) => setValue(String(nextValue)) } : { defaultValue: "overview" };

	return (
		<Tabs.Root {...rootProps} orientation={vertical ? "vertical" : "horizontal"}>
			<Tabs.List aria-label="帳號設定分類" activateOnFocus>
				<Tabs.Tab value="overview">總覽</Tabs.Tab>
				<Tabs.Tab value="members">成員</Tabs.Tab>
				<Tabs.Tab value="activity">活動</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="overview">
				<div className="lyds-story-panel">查看工作區識別資料、擁有者與預設分享設定。</div>
			</Tabs.Panel>
			<Tabs.Panel value="members">
				<div className="lyds-story-panel">目前有 12 位成員可以存取此工作區。</div>
			</Tabs.Panel>
			<Tabs.Panel value="activity">
				<div className="lyds-story-panel">近期變更與登入活動會顯示在這裡。</div>
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export const TabsVertical: Story = {
	name: "分頁：垂直",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const membersTab = canvas.getByRole("tab", { name: "成員" });
		const overviewTab = canvas.getByRole("tab", { name: "總覽" });

		await userEvent.hover(membersTab);
		await expect(getComputedStyle(membersTab).borderRadius).toBe(getComputedStyle(overviewTab).borderRadius);
		await expect(getComputedStyle(membersTab).paddingInlineStart).toBe(getComputedStyle(membersTab).paddingInlineEnd);

		await userEvent.click(membersTab);
		await expect(canvas.getAllByRole("tabpanel")).toHaveLength(1);
		await expect(canvas.getByRole("tabpanel")).toHaveTextContent("目前有 12 位成員");
		await expect(getComputedStyle(canvas.getByRole("tabpanel")).transitionDuration).toBe("0s");

		await userEvent.keyboard("{ArrowDown}");
		const activityTab = canvas.getByRole("tab", { name: "活動" });
		await expect(activityTab).toHaveFocus();
		await expect(activityTab.matches(":focus-visible")).toBe(true);
		await expect(getComputedStyle(activityTab).outlineStyle).not.toBe("none");
	},
	render: () => <AccountTabs vertical />
};

export const TabsControlled: Story = {
	name: "分頁：受控",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const activityTab = canvas.getByRole("tab", { name: "活動" });

		await userEvent.click(activityTab);
		await expect(activityTab).toHaveAttribute("aria-selected", "true");
		await expect(canvas.getAllByRole("tabpanel")).toHaveLength(1);
		await expect(canvas.getByRole("tabpanel")).toHaveTextContent("近期變更與登入活動");
	},
	render: () => <AccountTabs controlled />
};

function OpenTooltip({ children, side = "top" }: { children: string; side?: "top" | "right" | "bottom" | "left" }) {
	const sideLabels = { top: "上方", right: "右側", bottom: "下方", left: "左側" } as const;

	return (
		<Tooltip.Root defaultOpen>
			<Tooltip.Trigger>{sideLabels[side]}</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Positioner side={side}>
					<Tooltip.Popup>
						{children}
						<Tooltip.Arrow />
					</Tooltip.Popup>
				</Tooltip.Positioner>
			</Tooltip.Portal>
		</Tooltip.Root>
	);
}

export const TooltipLongText: Story = {
	name: "工具提示：長文字",
	parameters: { layout: "centered" },
	render: () => (
		<Tooltip.Provider delay={0}>
			<OpenTooltip side="top">所有必填欄位通過驗證後，變更會儲存至此工作區。</OpenTooltip>
		</Tooltip.Provider>
	)
};

export const TooltipPlacements: Story = {
	name: "工具提示：位置",
	parameters: { layout: "fullscreen" },
	play: async () => {
		const body = within(document.body);
		const tooltips = await body.findAllByRole("tooltip");
		await expect(tooltips).toHaveLength(4);

		for (const side of ["top", "right", "bottom", "left"] as const) {
			const popup = tooltips.find(candidate => candidate.dataset.side === side);
			await expect(popup).toBeDefined();
			const arrow = popup?.querySelector<HTMLElement>(`.lyds-tooltip__arrow[data-side="${side}"]`);
			await expect(arrow).not.toBeNull();

			if (!popup || !arrow) continue;
			const popupRect = popup.getBoundingClientRect();
			const arrowRect = arrow.getBoundingClientRect();
			const arrowStyle = getComputedStyle(arrow);
			await expect(arrowStyle.backgroundColor).toBe(getComputedStyle(popup).backgroundColor);

			if (side === "top") {
				await expect(arrowRect.top).toBeLessThan(popupRect.bottom);
				await expect(arrowRect.bottom).toBeGreaterThan(popupRect.bottom);
				await expect(arrowStyle.borderBottomWidth).not.toBe("0px");
			} else if (side === "right") {
				await expect(arrowRect.left).toBeLessThan(popupRect.left);
				await expect(arrowRect.right).toBeGreaterThan(popupRect.left);
				await expect(arrowStyle.borderLeftWidth).not.toBe("0px");
			} else if (side === "bottom") {
				await expect(arrowRect.top).toBeLessThan(popupRect.top);
				await expect(arrowRect.bottom).toBeGreaterThan(popupRect.top);
				await expect(arrowStyle.borderTopWidth).not.toBe("0px");
			} else {
				await expect(arrowRect.left).toBeLessThan(popupRect.right);
				await expect(arrowRect.right).toBeGreaterThan(popupRect.right);
				await expect(arrowStyle.borderRightWidth).not.toBe("0px");
			}
		}
	},
	render: () => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
				gap: "8rem",
				maxWidth: "48rem",
				margin: "0 auto",
				padding: "8rem"
			}}
		>
			<Tooltip.Provider delay={0}>
				<OpenTooltip side="top">顯示於上方</OpenTooltip>
			</Tooltip.Provider>
			<Tooltip.Provider delay={0}>
				<OpenTooltip side="right">顯示於右側</OpenTooltip>
			</Tooltip.Provider>
			<Tooltip.Provider delay={0}>
				<OpenTooltip side="left">顯示於左側</OpenTooltip>
			</Tooltip.Provider>
			<Tooltip.Provider delay={0}>
				<OpenTooltip side="bottom">顯示於下方</OpenTooltip>
			</Tooltip.Provider>
		</div>
	)
};

export const TooltipDisabled: Story = {
	name: "工具提示：停用",
	parameters: { layout: "centered" },
	render: () => (
		<Tooltip.Provider delay={0}>
			<Tooltip.Root>
				<Tooltip.Trigger disabled aria-disabled="true">
					無法使用的說明
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Positioner side="top">
						<Tooltip.Popup>觸發按鈕停用時不會開啟工具提示。</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	)
};

export const PopoverOpen: Story = {
	name: "彈出內容：開啟",
	parameters: { layout: "centered" },
	render: () => (
		<Popover.Root defaultOpen>
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

export const DialogLongOpen: Story = {
	name: "對話框：長內容",
	parameters: { layout: "centered" },
	render: () => (
		<Dialog.Root defaultOpen>
			<Dialog.Trigger>查看工作區原則</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup hasCustomClose>
						<Dialog.Header>
							<Dialog.Title>工作區資料保留與復原原則</Dialog.Title>
							<Dialog.Description>變更會影響所有成員的封存活動、既有匯出檔案與後續復原要求。</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body className="lyds-story-stack">
							<p>既有匯出檔案在到期前仍可使用。</p>
							<p>新的復原要求必須經過管理員審核與再次確認。</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.Close>取消</Dialog.Close>
							<Button>套用原則</Button>
						</Dialog.Footer>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	)
};

export const AlertDialogOpen: Story = {
	name: "警示對話框：開啟",
	parameters: { layout: "centered" },
	render: () => (
		<AlertDialog.Root defaultOpen>
			<AlertDialog.Trigger>刪除工作區</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup hasCustomClose>
						<AlertDialog.Header>
							<AlertDialog.Title>刪除工作區？</AlertDialog.Title>
							<AlertDialog.Description>工作區及其中的分享內容將永久刪除。</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Actions>
							<AlertDialog.Close>取消</AlertDialog.Close>
							<Button variant="danger">刪除工作區</Button>
						</AlertDialog.Actions>
					</AlertDialog.Popup>
				</AlertDialog.Viewport>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
};

export const DrawerOpen: Story = {
	name: "抽屜：開啟",
	parameters: { layout: "centered" },
	render: () => (
		<Drawer.Root defaultOpen>
			<Drawer.Trigger>開啟個人資料</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Header>
							<Drawer.Title>個人資料設定</Drawer.Title>
							<Drawer.Description>查看與其他成員分享的資料。</Drawer.Description>
						</Drawer.Header>
						<Drawer.Body className="lyds-story-stack">
							<p>三個工作區的成員可以查看你的個人資料。</p>
							<Button>前往個人資料設定</Button>
						</Drawer.Body>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	)
};

function OpenBottomSheet({ narrow = false }: { narrow?: boolean }) {
	return (
		<BottomSheet.Root defaultOpen>
			<BottomSheet.Trigger>開啟分享選項</BottomSheet.Trigger>
			<BottomSheet.Portal>
				<BottomSheet.Backdrop />
				<BottomSheet.Viewport>
					<BottomSheet.Popup hasCustomClose style={narrow ? { maxWidth: "22rem", marginInline: "auto" } : undefined}>
						<BottomSheet.Handle />
						<BottomSheet.Header>
							<BottomSheet.Title>分享文件</BottomSheet.Title>
							<BottomSheet.Description>選擇文件的分享方式。</BottomSheet.Description>
						</BottomSheet.Header>
						<BottomSheet.Body>季度規劃筆記</BottomSheet.Body>
						<BottomSheet.Footer>
							<Button>複製分享連結</Button>
							<BottomSheet.Close>取消</BottomSheet.Close>
						</BottomSheet.Footer>
					</BottomSheet.Popup>
				</BottomSheet.Viewport>
			</BottomSheet.Portal>
		</BottomSheet.Root>
	);
}

export const BottomSheetOpen: Story = {
	name: "底部面板：開啟",
	parameters: { layout: "fullscreen" },
	render: () => <OpenBottomSheet />,
	play: async () => {
		const body = within(document.body);
		const primaryAction = await body.findByRole("button", { name: "複製分享連結" });
		const cancelAction = body.getByRole("button", { name: "取消" });
		const primaryHeight = primaryAction.getBoundingClientRect().height;
		const cancelHeight = cancelAction.getBoundingClientRect().height;

		await expect(cancelHeight).toBe(primaryHeight);
		await expect(cancelHeight).toBeGreaterThanOrEqual(56);
	}
};

export const BottomSheetDark: Story = {
	name: "底部面板：深色主題",
	globals: { theme: "dark" },
	parameters: { layout: "fullscreen" },
	render: () => <OpenBottomSheet />
};

export const BottomSheetNarrow: Story = {
	name: "底部面板：窄螢幕",
	parameters: { layout: "fullscreen" },
	render: () => <OpenBottomSheet narrow />
};
