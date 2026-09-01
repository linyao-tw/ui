// Base UI Portal 自行處理轉場清理。使用 `pure` 入口可讓每個測試明確卸載，
// 不必註冊第二次全域清理。
import { fireEvent, render, screen, within } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
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
import { CommandPalette, CommandPaletteInput, CommandPalettePopup, CommandPalettePortal, CommandPaletteTitle, CommandPaletteTrigger, CommandPaletteViewport } from "./command-palette";
import { Toolbar, ToolbarButton } from "./menubar-toolbar";
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

		const previous = screen.getByRole("link", { name: "Previous" });
		expect(previous).toHaveAttribute("aria-disabled", "true");
		expect(previous).toHaveAttribute("role", "link");
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
		expect(trigger).toHaveClass("lyds-command-palette__trigger");
		await user.click(trigger);
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(screen.queryByRole("dialog", { name: "Canceled deck" })).not.toBeInTheDocument();
		view.unmount();
	});
});
