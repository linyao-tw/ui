import {
	CommandPalette,
	CommandPaletteBackdrop,
	CommandPaletteClose,
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
} from "@linyao.tw/ui";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";

import "../story-layout.css";

const commands = ["開啟設定", "建立文件", "切換為深色主題", "封存選取項目"];

const meta = {
	title: "元件/導覽/指令選單",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Palette({ defaultOpen = false, defaultValue }: { defaultOpen?: boolean; defaultValue?: string }) {
	return (
		<CommandPalette<string> autoHighlight defaultOpen={defaultOpen} defaultValue={defaultValue} items={commands}>
			<CommandPaletteTrigger>開啟指令選單</CommandPaletteTrigger>
			<CommandPalettePortal>
				<CommandPaletteBackdrop />
				<CommandPaletteViewport>
					<CommandPalettePopup>
						<CommandPaletteTitle>指令選單</CommandPaletteTitle>
						<CommandPaletteDescription>搜尋指令，或使用方向鍵選擇。</CommandPaletteDescription>
						<CommandPaletteClose aria-label="關閉指令選單">
							<XIcon aria-hidden="true" weight="bold" />
						</CommandPaletteClose>
						<CommandPaletteInput aria-label="搜尋指令" />
						<CommandPaletteList>
							{(command: string, index: number) => (
								<CommandPaletteItem key={command} value={command}>
									<CommandPaletteItemIndicator />
									<span>{command}</span>
									<CommandPaletteShortcut>{index === 0 ? "↵" : `⌘${index}`}</CommandPaletteShortcut>
								</CommandPaletteItem>
							)}
						</CommandPaletteList>
						<CommandPaletteEmpty>找不到指令</CommandPaletteEmpty>
					</CommandPalettePopup>
				</CommandPaletteViewport>
			</CommandPalettePortal>
		</CommandPalette>
	);
}

export const Default: Story = {
	name: "預設",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		const trigger = canvas.getByRole("button", { name: "開啟指令選單" });

		await userEvent.click(trigger);
		const dialog = await body.findByRole("dialog", { name: "指令選單" });
		await waitFor(() => expect(dialog).toBeVisible());
		await waitFor(() => expect(body.getByRole("combobox", { name: "搜尋指令" })).toHaveFocus());
		await userEvent.click(body.getByRole("button", { name: "關閉指令選單" }));
		await waitFor(() => expect(trigger).toHaveFocus());
	},
	render: () => <Palette />
};

export const Open: Story = {
	name: "展開",
	play: async () => {
		const body = within(document.body);
		const selected = await body.findByRole("option", { name: /開啟設定/ });
		const unselected = await body.findByRole("option", { name: /建立文件/ });
		await expect(selected).toHaveAttribute("aria-selected", "true");
		await expect(selected.querySelector(".lyds-command-palette__indicator svg")).toHaveAttribute("aria-hidden", "true");
		await expect(getComputedStyle(selected).color).not.toBe(getComputedStyle(unselected).color);
	},
	render: () => <Palette defaultOpen defaultValue="開啟設定" />
};
