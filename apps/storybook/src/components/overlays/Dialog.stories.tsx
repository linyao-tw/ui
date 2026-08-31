import { AlertDialog, Button, Dialog, TextField } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Overlays/Dialog",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfigurationDialog({ defaultOpen = false, longText = false }: { defaultOpen?: boolean; longText?: boolean }) {
	return (
		<Dialog.Root defaultOpen={defaultOpen}>
			<Dialog.Trigger>Configure relay</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup>
						<Dialog.Header>
							<Dialog.Title>{longText ? "Configure remote thermal relay operating and reporting parameters" : "Configure relay"}</Dialog.Title>
							<Dialog.Description>
								{longText
									? "Changes are applied to the selected remote controller after validation. Existing measurement sessions continue with their previous parameters until the next synchronized cycle."
									: "Update the operator-facing label without changing the hardware address."}
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body>
							<TextField label="Operator label" defaultValue="Thermal relay A" />
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.Close>Cancel</Dialog.Close>
							<Button>Save configuration</Button>
						</Dialog.Footer>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export const Default: Story = {
	render: () => <ConfigurationDialog />
};

export const Open: Story = {
	render: () => <ConfigurationDialog defaultOpen />
};

export const LongText: Story = {
	render: () => <ConfigurationDialog longText />
};

export const DestructiveConfirmation: Story = {
	render: () => (
		<AlertDialog.Root>
			<AlertDialog.Trigger>Isolate controller</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup>
						<AlertDialog.Header>
							<AlertDialog.Title>Isolate controller?</AlertDialog.Title>
							<AlertDialog.Description>The controller will stop accepting remote commands until a local operator restores the uplink.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Actions>
							<AlertDialog.Close>Cancel</AlertDialog.Close>
							<Button variant="danger">Isolate controller</Button>
						</AlertDialog.Actions>
					</AlertDialog.Popup>
				</AlertDialog.Viewport>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <ConfigurationDialog />
};
