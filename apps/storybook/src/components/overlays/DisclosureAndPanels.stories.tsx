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
		<Accordion.Root className="lyds-story-stack lyds-story-stack--narrow">
			<Accordion.Item value="power">
				<Accordion.Header>
					<Accordion.Trigger>Power distribution</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Primary rail is stable at 24.8 V. Auxiliary rail is available but idle.</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="thermal">
				<Accordion.Header>
					<Accordion.Trigger>Thermal regulation</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>Automatic fan control is maintaining 38.2 °C at the controller surface.</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="legacy" disabled>
				<Accordion.Header>
					<Accordion.Trigger>Legacy bus</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>This controller does not expose a legacy bus.</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	)
};

export const CollapsibleDiagnostics: Story = {
	render: () => (
		<Collapsible.Root className="lyds-story-stack lyds-story-stack--narrow">
			<Collapsible.Trigger>Advanced diagnostics</Collapsible.Trigger>
			<Collapsible.Panel>
				<p className="lyds-story-readout">BUS 04 / CRC 0000 / UPTIME 218:04:19</p>
			</Collapsible.Panel>
		</Collapsible.Root>
	)
};

export const DrawerPanel: Story = {
	render: () => (
		<Drawer.Root>
			<Drawer.Trigger>Open equipment drawer</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Header>
							<Drawer.Title>Equipment controls</Drawer.Title>
							<Drawer.Description>Quick controls for the selected thermal relay.</Drawer.Description>
						</Drawer.Header>
						<Drawer.Body className="lyds-story-stack">
							<p>Channel XR-071 is online and accepting remote commands.</p>
							<Button>Open full diagnostics</Button>
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
			<BottomSheet.Trigger>Open mobile action sheet</BottomSheet.Trigger>
			<BottomSheet.Portal>
				<BottomSheet.Backdrop />
				<BottomSheet.Viewport>
					<BottomSheet.Popup>
						<BottomSheet.Handle />
						<BottomSheet.Header>
							<BottomSheet.Title>Capture options</BottomSheet.Title>
							<BottomSheet.Description>Choose one immediate action for this diagnostic capture.</BottomSheet.Description>
						</BottomSheet.Header>
						<BottomSheet.Body>Capture 2026-08-31 / Relay XR-071</BottomSheet.Body>
						<BottomSheet.Footer className="lyds-story-row">
							<Button>Export capture</Button>
							<BottomSheet.Close>Cancel</BottomSheet.Close>
						</BottomSheet.Footer>
					</BottomSheet.Popup>
				</BottomSheet.Viewport>
			</BottomSheet.Portal>
		</BottomSheet.Root>
	)
};
