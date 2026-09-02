import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	CommandPalette,
	CommandPaletteBackdrop,
	CommandPaletteClose,
	CommandPaletteDescription,
	CommandPaletteEmpty,
	CommandPaletteGroup,
	CommandPaletteGroupLabel,
	CommandPaletteInput,
	CommandPaletteItem,
	CommandPaletteItemIndicator,
	CommandPaletteList,
	CommandPalettePopup,
	CommandPalettePortal,
	CommandPaletteShortcut,
	CommandPaletteTitle,
	CommandPaletteTrigger,
	CommandPaletteViewport,
	Header,
	HeaderActions,
	HeaderBrand,
	HeaderNav,
	HeaderRail,
	Menubar,
	MenubarCheckboxItem,
	MenubarCheckboxItemIndicator,
	MenubarGroup,
	MenubarGroupLabel,
	MenubarItem,
	MenubarMenu,
	MenubarPopup,
	MenubarPortal,
	MenubarPositioner,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarRadioItemIndicator,
	MenubarSeparator,
	MenubarTrigger,
	Pagination,
	PaginationButton,
	PaginationEllipsis,
	PaginationItem,
	PaginationList,
	PaginationNext,
	PaginationPrevious,
	TabBar,
	TabBarIcon,
	TabBarItem,
	TabBarLabel,
	TabBarLink,
	TabBarList,
	Toolbar,
	ToolbarButton,
	ToolbarGroup,
	ToolbarInput,
	ToolbarLink,
	ToolbarSeparator
} from "@linyao.tw/ui";
import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import "../story-layout.css";

const meta = {
	title: "元件/導覽/狀態",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface CommandItem {
	disabled?: boolean;
	label: string;
	shortcut: string;
	value: string;
}

interface CommandGroup {
	items: readonly CommandItem[];
	label: string;
}

const commandGroups: readonly CommandGroup[] = [
	{
		label: "導覽",
		items: [
			{ label: "開啟活動總覽", shortcut: "⌘1", value: "activity" },
			{ label: "開啟通知設定", shortcut: "⌘2", value: "notifications" }
		]
	},
	{
		label: "工作區",
		items: [
			{ label: "建立監控報表", shortcut: "⌘3", value: "create-report" },
			{ disabled: true, label: "封存受保護的工作區", shortcut: "⌘4", value: "archive-workspace" }
		]
	}
];

function MenubarSpecimen({ narrow = false }: { narrow?: boolean }) {
	const viewTriggerId = narrow ? "navigation-states-compact-view" : "navigation-states-view";

	return (
		<div style={{ inlineSize: narrow ? "min(100%, 20rem)" : "min(100%, 38rem)" }}>
			<Menubar aria-label="工作區指令" orientation={narrow ? "vertical" : "horizontal"}>
				<MenubarMenu>
					<MenubarTrigger id={viewTriggerId}>{narrow ? "工作區顯示與密度" : "檢視"}</MenubarTrigger>
					<MenubarPortal>
						<MenubarPositioner>
							<MenubarPopup>
								<MenubarGroup>
									<MenubarGroupLabel>面板</MenubarGroupLabel>
									<MenubarItem>開啟活動面板</MenubarItem>
									<MenubarItem disabled>開啟受保護的診斷資料</MenubarItem>
								</MenubarGroup>
								<MenubarSeparator />
								<MenubarCheckboxItem defaultChecked>
									<MenubarCheckboxItemIndicator />
									顯示狀態詳細資料
								</MenubarCheckboxItem>
								<MenubarSeparator />
								<MenubarRadioGroup defaultValue="comfortable">
									<MenubarGroupLabel>密度</MenubarGroupLabel>
									<MenubarRadioItem value="comfortable">
										<MenubarRadioItemIndicator />
										寬鬆
									</MenubarRadioItem>
									<MenubarRadioItem value="compact">
										<MenubarRadioItemIndicator />
										緊密
									</MenubarRadioItem>
								</MenubarRadioGroup>
							</MenubarPopup>
						</MenubarPositioner>
					</MenubarPortal>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>說明</MenubarTrigger>
					<MenubarPortal>
						<MenubarPositioner>
							<MenubarPopup>
								<MenubarItem>鍵盤快速鍵</MenubarItem>
								<MenubarItem>無障礙指南</MenubarItem>
							</MenubarPopup>
						</MenubarPositioner>
					</MenubarPortal>
				</MenubarMenu>
			</Menubar>
		</div>
	);
}

function TabBarSpecimen({ narrow = false }: { narrow?: boolean }) {
	const itemStyle = narrow ? { flex: "0 0 auto" } : undefined;

	return (
		<div style={{ inlineSize: narrow ? "min(100%, 21rem)" : "min(100%, 52rem)" }}>
			<TabBar label="工作區區段">
				<TabBarList style={narrow ? { overflowX: "auto", paddingBlockEnd: "var(--space-2)" } : undefined}>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#overview" selected>
							<TabBarIcon>
								<HouseIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>總覽</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#notifications">
							<TabBarIcon>
								<BellIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>通知紀錄與寄送狀態</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#archive" disabled>
							<TabBarIcon>
								<ArchiveIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>封存</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#settings">
							<TabBarIcon>
								<GearIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>設定</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
				</TabBarList>
			</TabBar>
		</div>
	);
}

function CommandPaletteSpecimen({ empty = false }: { empty?: boolean }) {
	return (
		<CommandPalette<CommandItem> autoHighlight defaultInputValue={empty ? "沒有相符的指令" : undefined} defaultOpen itemToStringLabel={item => item.label} items={commandGroups}>
			<CommandPaletteTrigger>開啟指令選單</CommandPaletteTrigger>
			<CommandPalettePortal>
				<CommandPaletteBackdrop />
				<CommandPaletteViewport>
					<CommandPalettePopup>
						<CommandPaletteTitle>工作區指令</CommandPaletteTitle>
						<CommandPaletteDescription>輸入名稱篩選，再使用方向鍵選擇。</CommandPaletteDescription>
						<CommandPaletteClose aria-label="關閉指令選單">
							<XIcon aria-hidden="true" weight="bold" />
						</CommandPaletteClose>
						<CommandPaletteInput aria-label="篩選工作區指令" />
						<CommandPaletteList>
							{item => {
								const group = item as CommandGroup;

								return (
									<CommandPaletteGroup key={group.label} items={group.items}>
										<CommandPaletteGroupLabel>{group.label}</CommandPaletteGroupLabel>
										{group.items.map(command => (
											<CommandPaletteItem key={command.value} disabled={command.disabled} value={command}>
												<CommandPaletteItemIndicator />
												<span>{command.label}</span>
												<CommandPaletteShortcut>{command.shortcut}</CommandPaletteShortcut>
											</CommandPaletteItem>
										))}
									</CommandPaletteGroup>
								);
							}}
						</CommandPaletteList>
						<CommandPaletteEmpty>找不到指令。</CommandPaletteEmpty>
					</CommandPalettePopup>
				</CommandPaletteViewport>
			</CommandPalettePortal>
		</CommandPalette>
	);
}

export const MenubarStates: Story = {
	name: "選單列狀態",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		const trigger = canvas.getByRole("menuitem", { name: "檢視" });

		trigger.focus();
		await userEvent.keyboard("{ArrowDown}");
		await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "true"));
		const firstItem = await body.findByRole("menuitem", { name: "開啟活動面板" });
		await expect(firstItem).toHaveFocus();
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
		await waitFor(() => expect(trigger).toHaveFocus());
	},
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">開啟「檢視」可查看群組、停用、核取與單選狀態。</p>
			<MenubarSpecimen />
		</div>
	)
};

export const MenubarNarrowDark: Story = {
	name: "窄版深色選單列",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">垂直選單列適用於窄版面。開啟第一個選單可查看完整內容。</p>
			<MenubarSpecimen narrow />
		</div>
	)
};

export const TabBarStates: Story = {
	name: "分頁列狀態",
	render: () => <TabBarSpecimen />
};

export const TabBarNarrowDark: Story = {
	name: "窄版深色分頁列",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">窄版分頁列包含選取、停用、圖示與長標籤狀態。</p>
			<TabBarSpecimen narrow />
		</div>
	)
};

export const HeaderLongNarrow: Story = {
	name: "窄版頁首",
	render: () => (
		<Header style={{ inlineSize: "min(100%, 24rem)" }}>
			<HeaderRail style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
				<HeaderBrand href="#workspace">Linyao Design System</HeaderBrand>
				<HeaderNav>
					<a href="#activity">最近活動</a>
					<a href="#components">元件參考</a>
					<a href="#support">支援</a>
				</HeaderNav>
				<HeaderActions>
					<Button size="sm">建立監控報表</Button>
				</HeaderActions>
			</HeaderRail>
		</Header>
	)
};

export const BreadcrumbAndPaginationEdges: Story = {
	name: "麵包屑與分頁邊界",
	render: () => (
		<div className="lyds-story-stack">
			<Breadcrumb label="文件位置">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#home">文件</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbEllipsis aria-label="已收合四個區段" />
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbPage>通知寄送與升級設定</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="lyds-story-grid">
				<Pagination label="第一頁搜尋結果">
					<PaginationList>
						<PaginationItem>
							<PaginationPrevious disabled aria-label="上一頁" />
						</PaginationItem>
						<PaginationItem>
							<PaginationButton current>1</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationButton>2</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis aria-label="更多頁面" />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#page-2" aria-label="下一頁" />
						</PaginationItem>
					</PaginationList>
				</Pagination>
				<Pagination label="最後一頁搜尋結果">
					<PaginationList>
						<PaginationItem>
							<PaginationPrevious href="#page-11" aria-label="上一頁" />
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis aria-label="更多頁面" />
						</PaginationItem>
						<PaginationItem>
							<PaginationButton>11</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationButton current>12</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext disabled aria-label="下一頁" />
						</PaginationItem>
					</PaginationList>
				</Pagination>
			</div>
		</div>
	)
};

export const ToolbarVertical: Story = {
	name: "垂直工具列",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Toolbar aria-label="報表編輯工具" orientation="vertical">
				<ToolbarGroup aria-label="編輯紀錄">
					<ToolbarButton>復原</ToolbarButton>
					<ToolbarButton>重做</ToolbarButton>
				</ToolbarGroup>
				<ToolbarSeparator />
				<ToolbarInput aria-label="報表標題" placeholder="報表標題" />
				<ToolbarSeparator />
				<ToolbarLink href="#preview">開啟預覽</ToolbarLink>
				<ToolbarButton disabled>發布受保護的報表</ToolbarButton>
			</Toolbar>
			<p className="lyds-story-note">按 Tab 進入工具列，再使用上、下方向鍵移動。</p>
		</div>
	)
};

export const CommandPaletteGrouped: Story = {
	name: "群組指令選單",
	render: () => <CommandPaletteSpecimen />
};

export const CommandPaletteNoResults: Story = {
	name: "指令選單無結果",
	render: () => <CommandPaletteSpecimen empty />
};

export const CommandPaletteDark: Story = {
	name: "深色指令選單",
	globals: { theme: "dark" },
	render: () => <CommandPaletteSpecimen />
};
