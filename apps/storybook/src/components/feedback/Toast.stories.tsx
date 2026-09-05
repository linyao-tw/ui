import { Button, createToastManager, ToastProvider, type ToastManager } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo } from "react";
import { expect, within } from "storybook/test";

import "@/components/story-layout.css";

const meta = {
	title: "元件/回饋/通知",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo({ automatic = false }: { automatic?: boolean }) {
	const manager: ToastManager = useMemo(() => createToastManager(), []);

	const addToast = (status: "neutral" | "info" | "success" | "warning" | "danger") => {
		const titles = {
			neutral: "一般通知",
			info: "資訊通知",
			success: "儲存成功",
			warning: "警告通知",
			danger: "儲存失敗"
		} as const;

		manager.add({
			data: { status },
			description: status === "danger" ? "無法儲存變更，請檢查網路連線後重試。" : "變更已儲存。",
			title: titles[status],
			timeout: 7000
		});
	};

	return (
		<ToastProvider toastManager={manager} timeout={automatic ? 7000 : 0}>
			<div className="lyds-story-stack">
				<p className="lyds-story-note">按下按鈕可顯示不同狀態的通知。</p>
				<div className="lyds-story-row">
					<Button onClick={() => addToast("success")}>顯示成功通知</Button>
					<Button variant="secondary" onClick={() => addToast("info")}>
						顯示資訊通知
					</Button>
					<Button variant="secondary" onClick={() => addToast("warning")}>
						顯示警告通知
					</Button>
					<Button variant="danger" onClick={() => addToast("danger")}>
						顯示錯誤通知
					</Button>
				</div>
			</div>
		</ToastProvider>
	);
}

function VisibleToast() {
	const manager: ToastManager = useMemo(() => createToastManager(), []);

	useEffect(() => {
		manager.add({
			id: "storybook-visible-toast",
			data: { status: "success" },
			description: "變更已儲存。",
			title: "設定已儲存",
			timeout: 0
		});
	}, [manager]);

	return (
		<ToastProvider toastManager={manager} timeout={0}>
			<p className="lyds-story-note">顯示通知的顏色、間距、內容與關閉按鈕。</p>
		</ToastProvider>
	);
}

export const Default: Story = {
	name: "預設",
	play: async () => {
		const body = within(document.body);
		const title = await body.findByText("設定已儲存");
		const toast = title.closest<HTMLElement>('[data-status="success"]');
		const signal = toast?.firstElementChild as HTMLElement | null;
		await expect(toast).not.toBeNull();
		await expect(signal).not.toBeNull();
		const titleBounds = title.getBoundingClientRect();
		const signalBounds = signal!.getBoundingClientRect();
		await expect(Math.abs(titleBounds.top + titleBounds.height / 2 - (signalBounds.top + signalBounds.height / 2))).toBeLessThanOrEqual(1);
	},
	render: () => <VisibleToast />
};

export const Interactive: Story = {
	name: "互動",
	render: () => <ToastDemo />
};

export const AutoDismiss: Story = {
	name: "自動關閉",
	render: () => <ToastDemo automatic />
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => <ToastDemo />
};
