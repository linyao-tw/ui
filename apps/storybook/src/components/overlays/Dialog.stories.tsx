import { AlertDialog, Button, Dialog, TextField } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import "../story-layout.css";

const meta = {
	title: "元件/浮層/對話框",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ConfigurationDialog({ defaultOpen = false, longText = false }: { defaultOpen?: boolean; longText?: boolean }) {
	return (
		<Dialog.Root defaultOpen={defaultOpen}>
			<Dialog.Trigger>編輯個人資料</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup>
						<Dialog.Header>
							<Dialog.Title>{longText ? "更新工作區成員可見的個人資料" : "編輯個人資料"}</Dialog.Title>
							<Dialog.Description>{longText ? "資料驗證通過後才會更新。更新完成前，既有活動與分享連結會沿用原本資料。" : "更新工作區成員看到的名稱。"}</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body>
							<TextField label="顯示名稱" defaultValue="陳怡安" />
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.Close render={<Button variant="secondary">取消</Button>}>取消</Dialog.Close>
							<Button>儲存</Button>
						</Dialog.Footer>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

export const Default: Story = {
	name: "預設",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);

		await userEvent.click(canvas.getByRole("button", { name: "編輯個人資料" }));
		const popup = await body.findByRole("dialog", { name: "編輯個人資料" });
		const backdrop = document.body.querySelector<HTMLElement>(".lyds-dialog__backdrop");
		await expect(backdrop).not.toBeNull();

		if (!backdrop) return;
		const popupStyle = getComputedStyle(popup);
		const backdropStyle = getComputedStyle(backdrop);
		await expect(popupStyle.transitionDuration).toBe(`${backdropStyle.transitionDuration}, ${backdropStyle.transitionDuration}`);
		await expect(popupStyle.transitionTimingFunction).toBe(`${backdropStyle.transitionTimingFunction}, ${backdropStyle.transitionTimingFunction}`);

		const cancelButton = body.getByRole("button", { name: "取消" });
		const saveButton = body.getByRole("button", { name: "儲存" });
		await expect(Math.abs(cancelButton.getBoundingClientRect().width - saveButton.getBoundingClientRect().width)).toBeLessThan(1);
		await expect(Math.abs(cancelButton.getBoundingClientRect().height - saveButton.getBoundingClientRect().height)).toBeLessThan(1);
	},
	render: () => <ConfigurationDialog />
};

export const Open: Story = {
	name: "開啟",
	render: () => <ConfigurationDialog defaultOpen />
};

export const LongText: Story = {
	name: "長文字",
	render: () => <ConfigurationDialog longText />
};

export const DestructiveConfirmation: Story = {
	name: "刪除確認",
	render: () => (
		<AlertDialog.Root>
			<AlertDialog.Trigger>刪除工作區</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup>
						<AlertDialog.Header>
							<AlertDialog.Title>刪除工作區？</AlertDialog.Title>
							<AlertDialog.Description>工作區及其中的分享內容將永久刪除。</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Actions>
							<AlertDialog.Close>取消</AlertDialog.Close>
							<Button variant="danger">刪除工作區</Button>
						</AlertDialog.Actions>
					</AlertDialog.Popup>
				</AlertDialog.Viewport>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => <ConfigurationDialog />
};
