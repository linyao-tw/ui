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
} from "@lyds/ui";
import { ArchiveIcon } from "@phosphor-icons/react/dist/csr/Archive";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { HouseIcon } from "@phosphor-icons/react/dist/csr/House";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Navigation/State Coverage",
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
		label: "Navigate",
		items: [
			{ label: "Open activity overview", shortcut: "G A", value: "activity" },
			{ label: "Open notification settings", shortcut: "G N", value: "notifications" }
		]
	},
	{
		label: "Workspace",
		items: [
			{ label: "Create a monitoring report", shortcut: "C R", value: "create-report" },
			{ disabled: true, label: "Archive protected workspace", shortcut: "A W", value: "archive-workspace" }
		]
	}
];

function MenubarSpecimen({ narrow = false }: { narrow?: boolean }) {
	const viewTriggerId = narrow ? "navigation-states-compact-view" : "navigation-states-view";

	return (
		<div style={{ inlineSize: narrow ? "min(100%, 20rem)" : "min(100%, 38rem)" }}>
			<Menubar aria-label="Workspace commands" orientation={narrow ? "vertical" : "horizontal"}>
				<MenubarMenu>
					<MenubarTrigger id={viewTriggerId}>{narrow ? "Workspace appearance and density" : "View"}</MenubarTrigger>
					<MenubarPortal>
						<MenubarPositioner>
							<MenubarPopup>
								<MenubarGroup>
									<MenubarGroupLabel>Panels</MenubarGroupLabel>
									<MenubarItem>Open activity panel</MenubarItem>
									<MenubarItem disabled>Open protected diagnostics</MenubarItem>
								</MenubarGroup>
								<MenubarSeparator />
								<MenubarCheckboxItem defaultChecked>
									<MenubarCheckboxItemIndicator />
									Show status details
								</MenubarCheckboxItem>
								<MenubarSeparator />
								<MenubarRadioGroup defaultValue="comfortable">
									<MenubarGroupLabel>Density</MenubarGroupLabel>
									<MenubarRadioItem value="comfortable">
										<MenubarRadioItemIndicator />
										Comfortable
									</MenubarRadioItem>
									<MenubarRadioItem value="compact">
										<MenubarRadioItemIndicator />
										Compact
									</MenubarRadioItem>
								</MenubarRadioGroup>
							</MenubarPopup>
						</MenubarPositioner>
					</MenubarPortal>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger>Help</MenubarTrigger>
					<MenubarPortal>
						<MenubarPositioner>
							<MenubarPopup>
								<MenubarItem>Keyboard shortcuts</MenubarItem>
								<MenubarItem>Accessibility guide</MenubarItem>
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
			<TabBar label="Workspace sections">
				<TabBarList style={narrow ? { overflowX: "auto", paddingBlockEnd: "var(--space-2)" } : undefined}>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#overview" selected>
							<TabBarIcon>
								<HouseIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>Overview</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#notifications">
							<TabBarIcon>
								<BellIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>Notification history and delivery status</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#archive" disabled>
							<TabBarIcon>
								<ArchiveIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>Archive</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
					<TabBarItem style={itemStyle}>
						<TabBarLink href="#settings">
							<TabBarIcon>
								<GearIcon aria-hidden="true" weight="bold" />
							</TabBarIcon>
							<TabBarLabel>Settings</TabBarLabel>
						</TabBarLink>
					</TabBarItem>
				</TabBarList>
			</TabBar>
		</div>
	);
}

function CommandPaletteSpecimen({ empty = false }: { empty?: boolean }) {
	return (
		<CommandPalette<CommandItem> autoHighlight defaultInputValue={empty ? "No matching operation" : undefined} defaultOpen itemToStringLabel={item => item.label} items={commandGroups}>
			<CommandPaletteTrigger>Open command palette</CommandPaletteTrigger>
			<CommandPalettePortal>
				<CommandPaletteBackdrop />
				<CommandPaletteViewport>
					<CommandPalettePopup>
						<CommandPaletteTitle>Workspace commands</CommandPaletteTitle>
						<CommandPaletteDescription>Filter by name, then use the arrow keys to choose an available operation.</CommandPaletteDescription>
						<CommandPaletteClose aria-label="Close command palette">
							<XIcon aria-hidden="true" weight="bold" />
						</CommandPaletteClose>
						<CommandPaletteInput aria-label="Filter workspace commands" />
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
						<CommandPaletteEmpty>No commands match the current filter.</CommandPaletteEmpty>
					</CommandPalettePopup>
				</CommandPaletteViewport>
			</CommandPalettePortal>
		</CommandPalette>
	);
}

export const MenubarStates: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">Open View to review grouped actions, a disabled command, checkbox state, radio selection, and keyboard-navigable sibling menus.</p>
			<MenubarSpecimen />
		</div>
	)
};

export const MenubarNarrowDark: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">A vertical menubar keeps long trigger labels usable in a narrow application rail; open the first trigger to inspect its full dark-theme menu.</p>
			<MenubarSpecimen narrow />
		</div>
	)
};

export const TabBarStates: Story = {
	render: () => <TabBarSpecimen />
};

export const TabBarNarrowDark: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">The constrained tab bar preserves selected, disabled, icon, and long-label states without removing destinations from their navigation landmark.</p>
			<TabBarSpecimen narrow />
		</div>
	)
};

export const HeaderLongNarrow: Story = {
	render: () => (
		<Header style={{ inlineSize: "min(100%, 24rem)" }}>
			<HeaderRail style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
				<HeaderBrand href="#workspace">LYDS operations workspace</HeaderBrand>
				<HeaderNav>
					<a href="#activity">Recent operational activity</a>
					<a href="#components">Component reference</a>
					<a href="#support">Support</a>
				</HeaderNav>
				<HeaderActions>
					<Button size="sm">Create monitoring report</Button>
				</HeaderActions>
			</HeaderRail>
		</Header>
	)
};

export const BreadcrumbAndPaginationEdges: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<Breadcrumb label="Long documentation location">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#home">Documentation</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbEllipsis aria-label="Four collapsed sections" />
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbPage>Notification delivery and escalation preferences</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="lyds-story-grid">
				<Pagination label="First result page">
					<PaginationList>
						<PaginationItem>
							<PaginationPrevious disabled />
						</PaginationItem>
						<PaginationItem>
							<PaginationButton current>1</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationButton>2</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationNext href="#page-2" />
						</PaginationItem>
					</PaginationList>
				</Pagination>
				<Pagination label="Last result page">
					<PaginationList>
						<PaginationItem>
							<PaginationPrevious href="#page-11" />
						</PaginationItem>
						<PaginationItem>
							<PaginationEllipsis />
						</PaginationItem>
						<PaginationItem>
							<PaginationButton>11</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationButton current>12</PaginationButton>
						</PaginationItem>
						<PaginationItem>
							<PaginationNext disabled />
						</PaginationItem>
					</PaginationList>
				</Pagination>
			</div>
		</div>
	)
};

export const ToolbarVertical: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Toolbar aria-label="Report editing tools" orientation="vertical">
				<ToolbarGroup aria-label="History">
					<ToolbarButton>Undo</ToolbarButton>
					<ToolbarButton>Redo</ToolbarButton>
				</ToolbarGroup>
				<ToolbarSeparator />
				<ToolbarInput aria-label="Report title" placeholder="Report title" />
				<ToolbarSeparator />
				<ToolbarLink href="#preview">Open preview</ToolbarLink>
				<ToolbarButton disabled>Publish protected report</ToolbarButton>
			</Toolbar>
			<p className="lyds-story-note">Tab enters the vertical toolbar once; Arrow Up and Arrow Down move its roving focus through buttons, input, link, and disabled state.</p>
		</div>
	)
};

export const CommandPaletteGrouped: Story = {
	render: () => <CommandPaletteSpecimen />
};

export const CommandPaletteNoResults: Story = {
	render: () => <CommandPaletteSpecimen empty />
};

export const CommandPaletteDark: Story = {
	globals: { theme: "dark" },
	render: () => <CommandPaletteSpecimen />
};
