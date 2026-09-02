import { ContextMenu, DropdownMenu, MenuCheckboxItem, MenuCheckboxItemIndicator, MenuItem, MenuPopup, MenuPositioner, MenuSeparator, MenuTrigger } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import "../story-layout.css";

const meta = {
	title: "元件/選擇/選單",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropdown: Story = {
	name: "下拉選單",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await userEvent.click(canvas.getByRole("button", { name: "操作" }));

		await expect(getComputedStyle(await body.findByRole("menuitem", { name: "查看詳細資料" })).cursor).toBe("pointer");
		await expect(getComputedStyle(body.getByRole("menuitem", { name: "無法封存" })).cursor).toBe("not-allowed");
		await expect(body.getByRole("menuitemcheckbox", { name: "顯示說明" })).toHaveAttribute("aria-checked", "true");
	},
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		const target = canvas.getByText("在此項目按滑鼠右鍵或 Shift+F10");
		target.focus();
		await userEvent.pointer([{ keys: "[MouseRight]", target }]);
		await expect(getComputedStyle(await body.findByRole("menuitem", { name: "查看詳細資料" })).cursor).toBe("pointer");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(target).toHaveFocus());
	},
	render: () => (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="lyds-story-context-area" tabIndex={0}>
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
