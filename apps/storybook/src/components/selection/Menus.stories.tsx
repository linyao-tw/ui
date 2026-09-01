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
			<MenuTrigger>Actions</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<MenuItem>Open details</MenuItem>
						<MenuItem>Duplicate item</MenuItem>
						<MenuSeparator />
						<MenuCheckboxItem defaultChecked>
							<MenuCheckboxItemIndicator />
							Show descriptions
						</MenuCheckboxItem>
						<MenuItem disabled>Archive unavailable</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const Contextual: Story = {
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger aria-haspopup="menu" className="lyds-story-context-area" role="button" tabIndex={0}>
				Right-click or press Shift+F10 on this item
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Positioner>
					<ContextMenu.Popup>
						<ContextMenu.Item>Open details</ContextMenu.Item>
						<ContextMenu.Item>Copy link</ContextMenu.Item>
						<ContextMenu.Separator />
						<ContextMenu.Item>Move to archive</ContextMenu.Item>
					</ContextMenu.Popup>
				</ContextMenu.Positioner>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	)
};
