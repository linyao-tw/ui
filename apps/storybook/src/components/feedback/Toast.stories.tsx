import { Button, createToastManager, ToastProvider, type ToastManager } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo } from "react";

import "../story-layout.css";

const meta = {
	title: "Components/Feedback/Toast",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastDemo({ automatic = false }: { automatic?: boolean }) {
	const manager: ToastManager = useMemo(() => createToastManager(), []);

	const addToast = (status: "neutral" | "info" | "success" | "warning" | "danger") => {
		manager.add({
			data: { status },
			description: status === "danger" ? "The changes could not be saved. Check your connection and try again." : "The latest changes are now available to everyone in the workspace.",
			title: status === "danger" ? "Save failed" : `${status[0]?.toUpperCase()}${status.slice(1)} notification`,
			timeout: 7000
		});
	};

	return (
		<ToastProvider toastManager={manager} timeout={automatic ? 7000 : 0}>
			<div className="lyds-story-stack">
				<p className="lyds-story-note">Toasts are manager-driven so products can trigger them without embedding application state in the visual component.</p>
				<div className="lyds-story-row">
					<Button onClick={() => addToast("success")}>Show success toast</Button>
					<Button variant="secondary" onClick={() => addToast("info")}>
						Show information toast
					</Button>
					<Button variant="secondary" onClick={() => addToast("warning")}>
						Show warning toast
					</Button>
					<Button variant="danger" onClick={() => addToast("danger")}>
						Show error toast
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
			description: "The latest changes are now available to everyone in the workspace.",
			title: "Configuration saved",
			timeout: 0
		});
	}, [manager]);

	return (
		<ToastProvider toastManager={manager} timeout={0}>
			<p className="lyds-story-note">A persistent review state for color, spacing, announcement content, and the dismiss control.</p>
		</ToastProvider>
	);
}

export const Default: Story = {
	render: () => <VisibleToast />
};

export const Interactive: Story = {
	render: () => <ToastDemo />
};

export const AutoDismiss: Story = {
	render: () => <ToastDemo automatic />
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <ToastDemo />
};
