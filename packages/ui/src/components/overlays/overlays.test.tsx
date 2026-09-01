import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Accordion, AlertDialog, BottomSheet, Collapsible, Dialog, Drawer, Popover, PreviewCard, Tabs, Tooltip } from ".";

class TestResizeObserver implements ResizeObserver {
	disconnect = vi.fn();
	observe = vi.fn();
	unobserve = vi.fn();
}

if (typeof globalThis.ResizeObserver === "undefined") {
	globalThis.ResizeObserver = TestResizeObserver;
}

afterEach(() => {
	cleanup();
});

describe("disclosure components", () => {
	it("supports manual tab activation and arrow-key focus movement", async () => {
		const user = userEvent.setup();

		render(
			<Tabs.Root defaultValue="status">
				<Tabs.List activateOnFocus={false} aria-label="System views">
					<Tabs.Tab value="status">Status</Tabs.Tab>
					<Tabs.Tab value="telemetry">Telemetry</Tabs.Tab>
					<Tabs.Tab value="logs">Logs</Tabs.Tab>
					<Tabs.Indicator />
				</Tabs.List>
				<Tabs.Panel value="status">Status panel</Tabs.Panel>
				<Tabs.Panel value="telemetry">Telemetry panel</Tabs.Panel>
				<Tabs.Panel value="logs">Logs panel</Tabs.Panel>
			</Tabs.Root>
		);

		const statusTab = screen.getByRole("tab", { name: "Status" });
		const telemetryTab = screen.getByRole("tab", { name: "Telemetry" });

		expect(statusTab).toHaveAttribute("aria-selected", "true");
		await user.tab();
		expect(statusTab).toHaveFocus();

		await user.keyboard("{ArrowRight}");
		expect(telemetryTab).toHaveFocus();
		expect(telemetryTab).toHaveAttribute("aria-selected", "false");

		await user.keyboard("{Enter}");
		expect(telemetryTab).toHaveAttribute("aria-selected", "true");
		expect(screen.getByRole("tabpanel")).toHaveTextContent("Telemetry panel");
	});

	it("opens accordion and collapsible panels without bypassing Base UI state", async () => {
		const user = userEvent.setup();

		render(
			<>
				<Accordion.Root>
					<Accordion.Item value="power">
						<Accordion.Header>
							<Accordion.Trigger>Power rail</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Panel>Nominal at 48 V</Accordion.Panel>
					</Accordion.Item>
				</Accordion.Root>
				<Collapsible.Root>
					<Collapsible.Trigger render={<button data-testid="custom-collapsible-trigger" type="button" />}>Diagnostics</Collapsible.Trigger>
					<Collapsible.Panel>All systems responsive</Collapsible.Panel>
				</Collapsible.Root>
			</>
		);

		expect(screen.queryByText("Nominal at 48 V")).not.toBeInTheDocument();
		expect(screen.queryByText("All systems responsive")).not.toBeInTheDocument();
		expect(screen.getByTestId("custom-collapsible-trigger")).toHaveClass("lyds-collapsible__trigger");

		await user.click(screen.getByRole("button", { name: "Power rail" }));
		expect(screen.getByRole("region", { name: "Power rail" })).toHaveTextContent("Nominal at 48 V");

		await user.click(screen.getByRole("button", { name: "Diagnostics" }));
		expect(screen.getByText("All systems responsive")).toBeVisible();
	});
});

describe("floating overlays", () => {
	it("opens a tooltip from keyboard focus", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();

		render(
			<Tooltip.Provider delay={0}>
				<Tooltip.Root onOpenChange={onOpenChange}>
					<Tooltip.Trigger>Signal health</Tooltip.Trigger>
				</Tooltip.Root>
			</Tooltip.Provider>
		);

		await user.tab();
		const trigger = screen.getByRole("button", { name: "Signal health" });
		expect(trigger).toHaveFocus();
		expect(trigger.getAttribute("aria-describedby")).toMatch(/^lyds-tooltip-/);
		expect(onOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: "trigger-focus" }));
	});

	it("preserves Popover callback details and PreviewCard link semantics", async () => {
		const user = userEvent.setup();
		const onPopoverOpenChange = vi.fn();

		render(
			<>
				<Popover.Root onOpenChange={onPopoverOpenChange}>
					<Popover.Trigger>Open status details</Popover.Trigger>
				</Popover.Root>
				<PreviewCard.Root>
					<PreviewCard.Trigger href="#node-12">Node 12</PreviewCard.Trigger>
				</PreviewCard.Root>
			</>
		);

		await user.click(screen.getByRole("button", { name: "Open status details" }));
		expect(onPopoverOpenChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: "trigger-press" }));

		await user.tab();
		expect(screen.getByRole("link", { name: "Node 12" })).toHaveFocus();
	});
});

describe("modal overlays", () => {
	it("closes a dialog with Escape and returns focus to its trigger", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		const insideActionRef = createRef<HTMLButtonElement>();

		render(
			<Dialog.Root onOpenChange={onOpenChange}>
				<Dialog.Trigger>Open diagnostics</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Backdrop />
					<Dialog.Popup initialFocus={insideActionRef}>
						<Dialog.Header>
							<Dialog.Title>Diagnostics</Dialog.Title>
							<Dialog.Description>Inspect the active channel.</Dialog.Description>
						</Dialog.Header>
						<Dialog.Body>
							<button ref={insideActionRef} type="button">
								Inside action
							</button>
						</Dialog.Body>
					</Dialog.Popup>
				</Dialog.Portal>
			</Dialog.Root>
		);

		const trigger = screen.getByRole("button", { name: "Open diagnostics" });
		trigger.focus();
		await user.keyboard("{Enter}");

		expect(screen.getByRole("dialog", { name: "Diagnostics" })).toHaveAttribute("data-open", "");
		expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Inside action" })).toHaveFocus();
		});

		await user.keyboard("{Escape}");
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
		expect(trigger).toHaveFocus();
		expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: "escape-key" }));
	});

	it("keeps an alert dialog open after an outside press", async () => {
		const user = userEvent.setup();

		render(
			<div data-testid="outside">
				<AlertDialog.Root>
					<AlertDialog.Trigger>Disconnect</AlertDialog.Trigger>
					<AlertDialog.Portal>
						<AlertDialog.Backdrop />
						<AlertDialog.Popup>
							<AlertDialog.Header>
								<AlertDialog.Title>Disconnect node?</AlertDialog.Title>
								<AlertDialog.Description>Active work will be interrupted.</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Actions>
								<AlertDialog.Close>Cancel</AlertDialog.Close>
								<button type="button">Confirm disconnect</button>
							</AlertDialog.Actions>
						</AlertDialog.Popup>
					</AlertDialog.Portal>
				</AlertDialog.Root>
			</div>
		);

		await user.click(screen.getByRole("button", { name: "Disconnect" }));
		const alertDialog = screen.getByRole("alertdialog", { name: "Disconnect node?" });

		fireEvent.pointerDown(document.body);
		fireEvent.mouseDown(document.body);
		fireEvent.click(document.body);

		expect(alertDialog).toHaveAttribute("data-open", "");
		expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
	});

	it("opens and closes the drawer shell", async () => {
		const user = userEvent.setup();

		render(
			<Drawer.Root>
				<Drawer.Trigger>Open panel</Drawer.Trigger>
				<Drawer.Portal>
					<Drawer.Backdrop />
					<Drawer.Viewport>
						<Drawer.Popup>
							<Drawer.Header>
								<Drawer.Title>Panel controls</Drawer.Title>
								<Drawer.Description>Adjust the machine state.</Drawer.Description>
							</Drawer.Header>
							<Drawer.Body>Control surface</Drawer.Body>
						</Drawer.Popup>
					</Drawer.Viewport>
				</Drawer.Portal>
			</Drawer.Root>
		);

		await user.click(screen.getByRole("button", { name: "Open panel" }));
		expect(screen.getByRole("dialog", { name: "Panel controls" })).toBeVisible();

		await user.click(screen.getByRole("button", { name: "Close drawer" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});

	it("opens and closes the bottom sheet shell", async () => {
		const user = userEvent.setup();

		render(
			<BottomSheet.Root>
				<BottomSheet.Trigger>Open sheet</BottomSheet.Trigger>
				<BottomSheet.Portal>
					<BottomSheet.Backdrop />
					<BottomSheet.Viewport>
						<BottomSheet.Popup>
							<BottomSheet.Handle />
							<BottomSheet.Header>
								<BottomSheet.Title>Sheet controls</BottomSheet.Title>
								<BottomSheet.Description>Adjust the machine state.</BottomSheet.Description>
							</BottomSheet.Header>
							<BottomSheet.Body>Control surface</BottomSheet.Body>
						</BottomSheet.Popup>
					</BottomSheet.Viewport>
				</BottomSheet.Portal>
			</BottomSheet.Root>
		);

		await user.click(screen.getByRole("button", { name: "Open sheet" }));
		expect(screen.getByRole("dialog", { name: "Sheet controls" })).toBeVisible();

		await user.click(screen.getByRole("button", { name: "Close bottom sheet" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});
	});
});
