import {
	CommandPalette,
	CommandPaletteBackdrop,
	CommandPaletteDescription,
	CommandPaletteEmpty,
	CommandPaletteInput,
	CommandPaletteItem,
	CommandPaletteItemIndicator,
	CommandPaletteList,
	CommandPalettePopup,
	CommandPalettePortal,
	CommandPaletteShortcut,
	CommandPaletteTitle,
	CommandPaletteTrigger,
	CommandPaletteViewport
} from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const commands = ["Open settings", "Create a new document", "Switch to dark theme", "Move selected item to archive"];

const meta = {
	title: "Components/Navigation/Command Palette",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Palette({ defaultOpen = false }: { defaultOpen?: boolean }) {
	return (
		<CommandPalette<string> defaultOpen={defaultOpen} items={commands}>
			<CommandPaletteTrigger>Open command menu</CommandPaletteTrigger>
			<CommandPalettePortal>
				<CommandPaletteBackdrop />
				<CommandPaletteViewport>
					<CommandPalettePopup>
						<CommandPaletteTitle>Command menu</CommandPaletteTitle>
						<CommandPaletteDescription>Search or use the arrow keys to choose an operation.</CommandPaletteDescription>
						<CommandPaletteInput aria-label="Search commands" />
						<CommandPaletteList>
							{(command: string, index: number) => (
								<CommandPaletteItem key={command} value={command}>
									<CommandPaletteItemIndicator />
									<span>{command}</span>
									<CommandPaletteShortcut>{index === 0 ? "↵" : `⌘${index}`}</CommandPaletteShortcut>
								</CommandPaletteItem>
							)}
						</CommandPaletteList>
						<CommandPaletteEmpty>No matching command</CommandPaletteEmpty>
					</CommandPalettePopup>
				</CommandPaletteViewport>
			</CommandPalettePortal>
		</CommandPalette>
	);
}

export const Default: Story = {
	render: () => <Palette />
};

export const Open: Story = {
	render: () => <Palette defaultOpen />
};
