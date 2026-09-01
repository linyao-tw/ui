import { Accordion, BottomSheet, Button, Collapsible, Drawer } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Overlays/Disclosure & Panels",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccordionSections: Story = {
	render: () => (
		<Accordion.Root defaultValue={["account"]} className="lyds-story-stack--narrow">
			<Accordion.Item value="account">
				<Accordion.Header>
					<Accordion.Trigger>Account details</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Update your profile, email address, and sign-in preferences.</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="notifications">
				<Accordion.Header>
					<Accordion.Trigger>Notifications</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Choose which updates you receive by email or in the application.</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="billing" disabled>
				<Accordion.Header>
					<Accordion.Trigger>Billing</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Billing settings are unavailable for this account.</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	)
};

export const CollapsibleDetails: Story = {
	render: () => (
		<Collapsible.Root className="lyds-story-stack--narrow">
			<Collapsible.Trigger>Additional information</Collapsible.Trigger>
			<Collapsible.Panel>
				<p>No additional issues were found during the last review.</p>
			</Collapsible.Panel>
		</Collapsible.Root>
	)
};

export const DrawerPanel: Story = {
	render: () => (
		<Drawer.Root>
			<Drawer.Trigger>Open profile drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Header>
							<Drawer.Title>Profile settings</Drawer.Title>
							<Drawer.Description>Review and update information shared with other members.</Drawer.Description>
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

export const BottomSheetPanel: Story = {
	render: () => (
		<BottomSheet.Root>
			<BottomSheet.Trigger>Open sharing options</BottomSheet.Trigger>
			<BottomSheet.Portal>
				<BottomSheet.Backdrop />
				<BottomSheet.Viewport>
					<BottomSheet.Popup>
						<BottomSheet.Handle />
						<BottomSheet.Header>
							<BottomSheet.Title>Share document</BottomSheet.Title>
							<BottomSheet.Description>Choose how you would like to share this document.</BottomSheet.Description>
						</BottomSheet.Header>
						<BottomSheet.Body>Quarterly planning notes</BottomSheet.Body>
						<BottomSheet.Footer className="lyds-story-row">
							<Button>Copy share link</Button>
							<BottomSheet.Close>Cancel</BottomSheet.Close>
						</BottomSheet.Footer>
					</BottomSheet.Popup>
				</BottomSheet.Viewport>
			</BottomSheet.Portal>
		</BottomSheet.Root>
	)
};
