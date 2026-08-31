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
			<Dialog.Trigger>Edit profile</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup>
						<Dialog.Header>
							<Dialog.Title>{longText ? "Update profile information shown to everyone in the workspace" : "Edit profile"}</Dialog.Title>
							<Dialog.Description>
								{longText
									? "Changes are applied after validation. Existing activity and shared links continue to use the previous information until the update is complete."
									: "Update the name shown to other members of the workspace."}
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body>
							<TextField label="Display name" defaultValue="Alex Chen" />
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.Close>Cancel</Dialog.Close>
							<Button>Save profile</Button>
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
			<AlertDialog.Trigger>Delete workspace</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup>
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

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <ConfigurationDialog />
};
