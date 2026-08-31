// Base UI portals own their transition teardown. The pure entry lets each test
// unmount explicitly instead of registering a second global cleanup pass.
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Pagination,
	PaginationButton,
	PaginationItem,
	PaginationLink,
	PaginationList
} from "./breadcrumb-pagination";
import {
	CommandPalette,
	CommandPaletteBackdrop,
	CommandPaletteDescription,
	CommandPaletteInput,
	CommandPaletteItem,
	CommandPaletteList,
	CommandPalettePopup,
	CommandPalettePortal,
	CommandPaletteTitle,
	CommandPaletteTrigger,
	CommandPaletteViewport
} from "./command-palette";
import { Menubar, MenubarItem, MenubarMenu, MenubarPopup, MenubarPortal, MenubarPositioner, MenubarTrigger, Toolbar, ToolbarButton } from "./menubar-toolbar";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuPopup,
	NavigationMenuPortal,
	NavigationMenuPositioner,
	NavigationMenuTrigger,
	NavigationMenuViewport
} from "./navigation-menu";
import { DataTable, DataTableRegion, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./table-collection";

function MenubarFixture() {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);

	return (
		<Menubar modal={false}>
			<MenubarMenu open={open} triggerId="test-file-menu-trigger" onOpenChange={setOpen}>
				<MenubarTrigger ref={triggerRef} id="test-file-menu-trigger">
					File
				</MenubarTrigger>
				<MenubarPortal>
					<MenubarPositioner>
						<MenubarPopup
							finalFocus={() => {
								// JSDOM cannot reliably evaluate the visibility of a portalled trigger.
								triggerRef.current?.focus();
								return triggerRef.current;
							}}
							style={{ transition: "none" }}
						>
							<MenubarItem>New panel</MenubarItem>
							<MenubarItem>Open panel</MenubarItem>
						</MenubarPopup>
					</MenubarPositioner>
				</MenubarPortal>
			</MenubarMenu>
		</Menubar>
	);
}

describe("breadcrumb and pagination semantics", () => {
	it("names the breadcrumb landmark and marks only the current page", () => {
		const view = render(
			<Breadcrumb label="Machine location">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/systems">Systems</BreadcrumbLink>
						<BreadcrumbSeparator />
					</BreadcrumbItem>
					<BreadcrumbItem>
						<BreadcrumbPage>Cooling</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		);

		const navigation = screen.getByRole("navigation", { name: "Machine location" });
		expect(within(navigation).getByRole("link", { name: "Systems" })).toHaveAttribute("href", "/systems");
		expect(within(navigation).getByText("Cooling")).toHaveAttribute("aria-current", "page");
		view.unmount();
	});

	it("exposes the current page and prevents disabled pagination actions", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const view = render(
			<Pagination label="Records pages">
				<PaginationList>
					<PaginationItem>
						<PaginationLink href="/records?page=1" disabled onClick={onClick}>
							Previous
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationButton current>2</PaginationButton>
					</PaginationItem>
				</PaginationList>
			</Pagination>
		);

		const previous = screen.getByText("Previous");
		expect(previous).toHaveAttribute("aria-disabled", "true");
		expect(previous).toHaveAttribute("tabindex", "-1");
		expect(previous).not.toHaveAttribute("href");
		expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
		await user.click(previous);
		expect(onClick).not.toHaveBeenCalled();
		view.unmount();
	});
});

describe("Base UI navigation behavior", () => {
	it("moves focus across navigation triggers with arrow keys", async () => {
		const user = userEvent.setup();
		const view = render(
			<NavigationMenu>
				<NavigationMenuList>
					<NavigationMenuItem value="systems">
						<NavigationMenuTrigger>Systems</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/systems/power">Power</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
					<NavigationMenuItem value="records">
						<NavigationMenuTrigger>Records</NavigationMenuTrigger>
						<NavigationMenuContent>
							<NavigationMenuLink href="/records/log">Log</NavigationMenuLink>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
				<NavigationMenuPortal>
					<NavigationMenuPositioner>
						<NavigationMenuPopup>
							<NavigationMenuViewport />
						</NavigationMenuPopup>
					</NavigationMenuPositioner>
				</NavigationMenuPortal>
			</NavigationMenu>
		);

		await user.tab();
		expect(screen.getByRole("button", { name: "Systems" })).toHaveFocus();
		await user.keyboard("{ArrowRight}");
		expect(screen.getByRole("button", { name: "Records" })).toHaveFocus();
		view.unmount();
	});

	it("opens a menubar menu, navigates its items, and closes with Escape", () => {
		Reflect.set(globalThis, "BASE_UI_ANIMATIONS_DISABLED", true);
		const view = render(<MenubarFixture />);

		const trigger = screen.getByRole("menuitem", { name: "File" });
		fireEvent.click(trigger);
		const firstItem = screen.getByRole("menuitem", { name: "New panel" });
		expect(trigger).toHaveAttribute("aria-expanded", "true");
		firstItem.focus();
		expect(firstItem).toHaveFocus();
		fireEvent.keyDown(firstItem, { key: "ArrowDown" });
		const secondItem = screen.getByRole("menuitem", { name: "Open panel" });
		expect(secondItem).toHaveAttribute("data-highlighted");
		expect(secondItem).toHaveFocus();
		fireEvent.keyDown(secondItem, { key: "Escape" });
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(trigger).toHaveFocus();
		view.unmount();
		Reflect.deleteProperty(globalThis, "BASE_UI_ANIMATIONS_DISABLED");
	});

	it("uses toolbar roving focus instead of adding every control to the tab sequence", async () => {
		const view = render(
			<Toolbar aria-label="Drawing controls">
				<ToolbarButton>Move</ToolbarButton>
				<ToolbarButton>Rotate</ToolbarButton>
			</Toolbar>
		);

		const moveButton = screen.getByRole("button", { name: "Move" });
		moveButton.focus();
		expect(moveButton).toHaveFocus();
		fireEvent.keyDown(moveButton, { key: "ArrowRight" });
		await Promise.resolve();
		const rotateButton = screen.getByRole("button", { name: "Rotate" });
		expect(rotateButton).toHaveAttribute("tabindex", "0");
		expect(rotateButton).toHaveFocus();
		view.unmount();
	});
});

describe("table composition", () => {
	it("keeps native table, row, header, and cell semantics", () => {
		const view = render(
			<DataTable aria-labelledby="systems-title">
				<h2 id="systems-title">Systems</h2>
				<DataTableRegion label="System status records">
					<Table>
						<TableCaption>Live hardware telemetry</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead>Module</TableHead>
								<TableHead textAlign="end">Voltage</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>Drive</TableCell>
								<TableCell numeric textAlign="end">
									24.0 V
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</DataTableRegion>
			</DataTable>
		);

		const table = screen.getByRole("table", { name: "Live hardware telemetry" });
		expect(within(table).getAllByRole("columnheader")).toHaveLength(2);
		expect(within(table).getByRole("cell", { name: "Drive" })).toBeInTheDocument();
		expect(screen.getByRole("region", { name: "System status records" })).toContainElement(table);
		view.unmount();
	});
});

describe("command palette composition", () => {
	it("honors canceled open changes before updating uncontrolled state", async () => {
		const user = userEvent.setup();
		const view = render(
			<CommandPalette<string>
				onOpenChange={(_open, details) => {
					details.cancel();
				}}
			>
				<CommandPaletteTrigger>Open canceled palette</CommandPaletteTrigger>
				<CommandPalettePortal>
					<CommandPaletteViewport>
						<CommandPalettePopup>
							<CommandPaletteTitle>Canceled deck</CommandPaletteTitle>
							<CommandPaletteInput aria-label="Canceled search" />
						</CommandPalettePopup>
					</CommandPaletteViewport>
				</CommandPalettePortal>
			</CommandPalette>
		);

		const trigger = screen.getByRole("button", { name: "Open canceled palette" });
		await user.click(trigger);
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(screen.queryByRole("dialog", { name: "Canceled deck" })).not.toBeInTheDocument();
		view.unmount();
	});

	it("opens as a focus-trapped dialog and closes on Escape", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		const view = render(
			<CommandPalette<string> onOpenChange={onOpenChange}>
				<CommandPaletteTrigger>Open command palette</CommandPaletteTrigger>
				<CommandPalettePortal>
					<CommandPaletteBackdrop />
					<CommandPaletteViewport>
						<CommandPalettePopup>
							<CommandPaletteTitle>Command deck</CommandPaletteTitle>
							<CommandPaletteDescription>Choose an operation.</CommandPaletteDescription>
							<CommandPaletteInput aria-label="Search commands" />
							<CommandPaletteList>
								<CommandPaletteItem value="open-settings">Open settings</CommandPaletteItem>
							</CommandPaletteList>
						</CommandPalettePopup>
					</CommandPaletteViewport>
				</CommandPalettePortal>
			</CommandPalette>
		);

		await user.click(screen.getByRole("button", { name: "Open command palette" }));
		expect(await screen.findByRole("dialog", { name: "Command deck" })).toBeInTheDocument();
		expect(screen.getByRole("combobox", { name: "Search commands" })).toBeInTheDocument();
		await user.keyboard("{Escape}");
		await waitFor(() => expect(screen.getByRole("button", { name: "Open command palette" })).toHaveAttribute("aria-expanded", "false"));
		expect(onOpenChange.mock.lastCall?.[0]).toBe(false);
		view.unmount();
	});
});
