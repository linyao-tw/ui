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

const commands = ["開啟設定", "建立文件", "切換為深色主題", "封存選取項目"];

const meta = {
	title: "元件/導覽/指令選單",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Palette({ defaultOpen = false }: { defaultOpen?: boolean }) {
	return (
		<CommandPalette<string> defaultOpen={defaultOpen} items={commands}>
			<CommandPaletteTrigger>開啟指令選單</CommandPaletteTrigger>
			<CommandPalettePortal>
				<CommandPaletteBackdrop />
				<CommandPaletteViewport>
					<CommandPalettePopup>
						<CommandPaletteTitle>指令選單</CommandPaletteTitle>
						<CommandPaletteDescription>搜尋指令，或使用方向鍵選擇。</CommandPaletteDescription>
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
	render: () => <Palette />
};

export const Open: Story = {
	name: "展開",
	render: () => <Palette defaultOpen />
};
