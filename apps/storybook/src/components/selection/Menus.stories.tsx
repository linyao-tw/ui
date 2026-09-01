import { ContextMenu, DropdownMenu, MenuCheckboxItem, MenuCheckboxItemIndicator, MenuItem, MenuPopup, MenuPositioner, MenuSeparator, MenuTrigger } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/選擇/選單",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropdown: Story = {
	name: "下拉選單",
	render: () => (
		<DropdownMenu.Root>
			<MenuTrigger>操作</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<MenuItem>查看詳細資料</MenuItem>
						<MenuItem>複製項目</MenuItem>
						<MenuSeparator />
						<MenuCheckboxItem defaultChecked>
							<MenuCheckboxItemIndicator />
							顯示說明
						</MenuCheckboxItem>
						<MenuItem disabled>無法封存</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const Contextual: Story = {
	name: "快顯選單",
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger aria-haspopup="menu" className="lyds-story-context-area" role="button" tabIndex={0}>
				在此項目按滑鼠右鍵或 Shift+F10
			</ContextMenu.Trigger>
			<ContextMenu.Portal>
				<ContextMenu.Positioner>
					<ContextMenu.Popup>
						<ContextMenu.Item>查看詳細資料</ContextMenu.Item>
						<ContextMenu.Item>複製連結</ContextMenu.Item>
						<ContextMenu.Separator />
						<ContextMenu.Item>移至封存</ContextMenu.Item>
					</ContextMenu.Popup>
				</ContextMenu.Positioner>
			</ContextMenu.Portal>
		</ContextMenu.Root>
	)
};
