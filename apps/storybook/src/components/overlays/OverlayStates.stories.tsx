import { Accordion, AlertDialog, BottomSheet, Button, Collapsible, Dialog, Drawer, Popover, Tabs, Tooltip } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../story-layout.css";

const meta = {
	title: "Components/Overlays/State Matrix",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SettingsAccordion({ values = [], multiple = false }: { values?: string[]; multiple?: boolean }) {
	return (
		<Accordion.Root defaultValue={values} multiple={multiple} className="lyds-story-stack--narrow">
			<Accordion.Item value="account">
				<Accordion.Header>
					<Accordion.Trigger>Account details</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Update your profile, email address, and sign-in preferences.</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="security">
				<Accordion.Header>
					<Accordion.Trigger>Security</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Review active sessions, recovery methods, and authentication policies.</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="billing" disabled>
				<Accordion.Header>
					<Accordion.Trigger>Billing</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Billing settings are unavailable for this account.</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	);
}

export const AccordionAllCollapsed: Story = {
	render: () => <SettingsAccordion />
};

export const AccordionMultipleOpen: Story = {
	render: () => <SettingsAccordion values={["account", "security"]} multiple />
};

export const AccordionLongContent: Story = {
	render: () => (
		<Accordion.Root defaultValue={["policy"]} className="lyds-story-stack--narrow">
			<Accordion.Item value="policy">
				<Accordion.Header>
					<Accordion.Trigger>Workspace retention and recovery policy</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>
					<div className="lyds-story-stack">
						<p>Workspace activity is retained for the period selected by the account owner. Existing exports remain available until their expiration date.</p>
						<p>Recovery requests require an administrator review and a second confirmation before archived records are restored.</p>
					</div>
				</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="notifications">
				<Accordion.Header>
					<Accordion.Trigger>Notification delivery</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Choose which operational updates should be delivered by email.</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	)
};

export const AccordionDark: Story = {
	globals: { theme: "dark" },
	render: () => <SettingsAccordion values={["security"]} />
};

export const CollapsibleOpen: Story = {
	render: () => (
		<Collapsible.Root defaultOpen className="lyds-story-stack--narrow">
			<Collapsible.Trigger>Additional information</Collapsible.Trigger>
			<Collapsible.Panel>No additional issues were found during the last review.</Collapsible.Panel>
		</Collapsible.Root>
	)
};

export const CollapsibleDisabled: Story = {
	render: () => (
		<Collapsible.Root defaultOpen disabled className="lyds-story-stack--narrow">
			<Collapsible.Trigger>Archived information</Collapsible.Trigger>
			<Collapsible.Panel>This information is visible but cannot be collapsed while the archive is being prepared.</Collapsible.Panel>
		</Collapsible.Root>
	)
};

function AccountTabs({ controlled = false, vertical = false }: { controlled?: boolean; vertical?: boolean }) {
	const [value, setValue] = useState("overview");
	const rootProps = controlled ? { value, onValueChange: (nextValue: string | number) => setValue(String(nextValue)) } : { defaultValue: "overview" };

	return (
		<Tabs.Root {...rootProps} orientation={vertical ? "vertical" : "horizontal"}>
			<Tabs.List aria-label="Account settings sections" activateOnFocus>
				<Tabs.Tab value="overview">Overview</Tabs.Tab>
				<Tabs.Tab value="members">Members</Tabs.Tab>
				<Tabs.Tab value="activity">Activity</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="overview">
				<div className="lyds-story-panel">Review workspace identity, ownership, and default sharing settings.</div>
			</Tabs.Panel>
			<Tabs.Panel value="members">
				<div className="lyds-story-panel">Twelve members currently have access to this workspace.</div>
			</Tabs.Panel>
			<Tabs.Panel value="activity">
				<div className="lyds-story-panel">Recent changes and sign-in activity appear here.</div>
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export const TabsVertical: Story = {
	render: () => <AccountTabs vertical />
};

export const TabsControlled: Story = {
	render: () => <AccountTabs controlled />
};

function OpenTooltip({ children, side = "top" }: { children: string; side?: "top" | "right" | "bottom" | "left" }) {
	return (
		<Tooltip.Root defaultOpen>
			<Tooltip.Trigger>{side.charAt(0).toUpperCase() + side.slice(1)}</Tooltip.Trigger>
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
	parameters: { layout: "centered" },
	render: () => (
		<Tooltip.Provider delay={0}>
			<OpenTooltip side="top">Changes are saved to this workspace after every required field has passed validation.</OpenTooltip>
		</Tooltip.Provider>
	)
};

export const TooltipPlacements: Story = {
	parameters: { layout: "fullscreen" },
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
				<OpenTooltip side="top">Top placement</OpenTooltip>
			</Tooltip.Provider>
			<Tooltip.Provider delay={0}>
				<OpenTooltip side="right">Right placement</OpenTooltip>
			</Tooltip.Provider>
			<Tooltip.Provider delay={0}>
				<OpenTooltip side="left">Left placement</OpenTooltip>
			</Tooltip.Provider>
			<Tooltip.Provider delay={0}>
				<OpenTooltip side="bottom">Bottom placement</OpenTooltip>
			</Tooltip.Provider>
		</div>
	)
};

export const TooltipDisabled: Story = {
	parameters: { layout: "centered" },
	render: () => (
		<Tooltip.Provider delay={0}>
			<Tooltip.Root>
				<Tooltip.Trigger disabled aria-disabled="true">
					Unavailable help
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Positioner side="top">
						<Tooltip.Popup>This tooltip remains closed while its trigger is disabled.</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	)
};

export const PopoverOpen: Story = {
	parameters: { layout: "centered" },
	render: () => (
		<Popover.Root defaultOpen>
			<Popover.Trigger>Member details</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner>
					<Popover.Popup>
						<Popover.Title>Alex Chen</Popover.Title>
						<Popover.Description>Editor · Joined 14 August 2026.</Popover.Description>
						<div className="lyds-story-row">
							<Button size="sm">View profile</Button>
							<Popover.Close>Close</Popover.Close>
						</div>
						<Popover.Arrow />
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	)
};

export const DialogLongOpen: Story = {
	parameters: { layout: "centered" },
	render: () => (
		<Dialog.Root defaultOpen>
			<Dialog.Trigger>Review workspace policy</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup hasCustomClose>
						<Dialog.Header>
							<Dialog.Title>Review workspace retention and recovery policy before applying changes</Dialog.Title>
							<Dialog.Description>Changes affect archived activity, existing exports, and future recovery requests for every member of this workspace.</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body className="lyds-story-stack">
							<p>Existing exports remain available until their current expiration date.</p>
							<p>New recovery requests require an administrator review and a second confirmation.</p>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.Close>Cancel</Dialog.Close>
							<Button>Apply policy</Button>
						</Dialog.Footer>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	)
};

export const AlertDialogOpen: Story = {
	parameters: { layout: "centered" },
	render: () => (
		<AlertDialog.Root defaultOpen>
			<AlertDialog.Trigger>Delete workspace</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup hasCustomClose>
						<AlertDialog.Header>
							<AlertDialog.Title>Delete workspace?</AlertDialog.Title>
							<AlertDialog.Description>This action permanently removes the workspace and its shared content.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Actions>
							<AlertDialog.Close>Cancel</AlertDialog.Close>
							<Button variant="danger">Delete workspace</Button>
						</AlertDialog.Actions>
					</AlertDialog.Popup>
				</AlertDialog.Viewport>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
};

export const DrawerOpen: Story = {
	parameters: { layout: "centered" },
	render: () => (
		<Drawer.Root defaultOpen>
			<Drawer.Trigger>Open profile drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Header>
							<Drawer.Title>Profile settings</Drawer.Title>
							<Drawer.Description>Review information shared with other members.</Drawer.Description>
						</Drawer.Header>
						<Drawer.Body className="lyds-story-stack">
							<p>Your profile is visible to members of three workspaces.</p>
							<Button>Open profile settings</Button>
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
			<BottomSheet.Trigger>Open sharing options</BottomSheet.Trigger>
			<BottomSheet.Portal>
				<BottomSheet.Backdrop />
				<BottomSheet.Viewport>
					<BottomSheet.Popup hasCustomClose style={narrow ? { maxWidth: "22rem", marginInline: "auto" } : undefined}>
						<BottomSheet.Handle />
						<BottomSheet.Header>
							<BottomSheet.Title>Share document</BottomSheet.Title>
							<BottomSheet.Description>Choose how you would like to share this document.</BottomSheet.Description>
						</BottomSheet.Header>
						<BottomSheet.Body>Quarterly planning notes</BottomSheet.Body>
						<BottomSheet.Footer>
							<Button>Copy share link</Button>
							<BottomSheet.Close>Cancel</BottomSheet.Close>
						</BottomSheet.Footer>
					</BottomSheet.Popup>
				</BottomSheet.Viewport>
			</BottomSheet.Portal>
		</BottomSheet.Root>
	);
}

export const BottomSheetOpen: Story = {
	parameters: { layout: "fullscreen" },
	render: () => <OpenBottomSheet />
};

export const BottomSheetDark: Story = {
	globals: { theme: "dark" },
	parameters: { layout: "fullscreen" },
	render: () => <OpenBottomSheet />
};

export const BottomSheetNarrow: Story = {
	parameters: { layout: "fullscreen" },
	render: () => <OpenBottomSheet narrow />
};
