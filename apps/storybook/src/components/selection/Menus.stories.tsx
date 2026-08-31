import { ContextMenu, DropdownMenu, MenuCheckboxItem, MenuCheckboxItemIndicator, MenuItem, MenuPopup, MenuPositioner, MenuSeparator, MenuTrigger } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Selection/Menus",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropdown: Story = {
	render: () => (
		<DropdownMenu.Root>
			<MenuTrigger>System menu</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<MenuItem>Open diagnostics</MenuItem>
						<MenuItem>Duplicate panel</MenuItem>
						<MenuSeparator />
						<MenuCheckboxItem defaultChecked>
							<MenuCheckboxItemIndicator>✓</MenuCheckboxItemIndicator>
							Show technical labels
						</MenuCheckboxItem>
						<MenuItem disabled>Firmware update unavailable</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const Contextual: Story = {
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="lyds-story-context-area">Right-click or press Shift+F10 on this equipment plate</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Positioner>
					<ContextMenu.Popup>
						<ContextMenu.Item>Inspect channel</ContextMenu.Item>
						<ContextMenu.Item>Copy serial number</ContextMenu.Item>
						<ContextMenu.Separator />
						<ContextMenu.Item>Isolate module</ContextMenu.Item>
					</ContextMenu.Popup>
				</ContextMenu.Positioner>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	)
};
