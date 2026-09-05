import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { DotsThreeIcon } from "@phosphor-icons/react/dist/csr/DotsThree";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import * as React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardBody, CardFooter, CardHeader, CardTitle } from "./card";
import { IconButton } from "./icon-button";
import { Link } from "./link";
import { ListCell, ListCellAction, ListCellContent, ListCellDescription, ListCellLeading, ListCellMetadata, ListCellTitle, ListCellTrailing } from "./list-cell";
import { SectionHeading } from "./section-heading";
import { Separator } from "./separator";

beforeAll(() => {
	if (!window.PointerEvent) {
		Object.defineProperty(window, "PointerEvent", { configurable: true, value: MouseEvent });
	}
});

describe("foundation actions", () => {
	it("forwards button refs and invokes an enabled action", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const ref = React.createRef<HTMLElement>();

		render(
			<Button ref={ref} onClick={onClick} startIcon={<PlusIcon weight="bold" />} endIcon={<ArrowRightIcon weight="bold" />}>
				Create record
			</Button>
		);

		const button = screen.getByRole("button", { name: "Create record" });
		expect(ref.current).toBe(button);
		expect(button.querySelectorAll(".lyds-button__icon > svg")).toHaveLength(2);
		await user.click(button);
		expect(onClick).toHaveBeenCalledOnce();
	});

	it("makes a loading button busy and non-interactive without changing its name", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<Button loading startIcon={<PlusIcon weight="bold" />} endIcon={<ArrowRightIcon weight="bold" />} onClick={onClick}>
				Calibrating
			</Button>
		);

		const button = screen.getByRole("button", { name: "Calibrating" });
		expect(button).toHaveAttribute("aria-disabled", "true");
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button).toHaveAttribute("tabindex", "0");
		expect(button.querySelectorAll(".lyds-button__icon")).toHaveLength(0);
		expect(button.querySelector(".lyds-button__spinner")).not.toBeNull();
		await user.click(button);
		expect(onClick).not.toHaveBeenCalled();
	});

	it("supports Base UI render composition while preserving button semantics", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<Button render={<span />} nativeButton={false} onClick={onClick}>
				Open records
			</Button>
		);

		const button = screen.getByRole("button", { name: "Open records" });
		expect(button.tagName).toBe("SPAN");
		expect(button).toHaveAttribute("tabindex", "0");
		button.focus();
		await user.keyboard("{Enter}");
		await user.keyboard(" ");
		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it("requires and exposes an accessible icon-button name", () => {
		render(
			<IconButton aria-label="Close panel">
				<XIcon weight="bold" />
			</IconButton>
		);
		expect(screen.getByRole("button", { name: "Close panel" })).toBeVisible();
		const button = screen.getByRole("button", { name: "Close panel" });
		expect(button.querySelector(".lyds-button__label > svg")).not.toBeNull();
		expect(button.querySelector(".lyds-icon-button__icon")).toBeNull();
	});

	it("replaces an icon with the loading indicator without changing its name", () => {
		render(
			<IconButton aria-label="Save panel" loading>
				<DotsThreeIcon weight="bold" />
			</IconButton>
		);

		const button = screen.getByRole("button", { name: "Save panel" });
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button.querySelector(".lyds-button__spinner")).not.toBeNull();
		expect(button.querySelector(".lyds-icon-button__icon")).toBeNull();
		expect(button.querySelector("svg")).toBeNull();
	});

	it("exposes the neutral high-contrast button variant", () => {
		render(<Button variant="neutral">Open review</Button>);
		expect(screen.getByRole("button", { name: "Open review" })).toHaveAttribute("data-variant", "neutral");
	});

	it("removes disabled links from navigation and suppresses activation", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(
			<Link href="/danger" disabled onClick={onClick}>
				Unavailable record
			</Link>
		);

		const link = screen.getByText("Unavailable record");
		expect(link).not.toHaveAttribute("href");
		expect(link).toHaveAttribute("aria-disabled", "true");
		expect(link).toHaveAttribute("tabindex", "-1");
		await user.click(link);
		expect(onClick).not.toHaveBeenCalled();
	});

	it("removes an external render element href when a Link is disabled", () => {
		render(
			<Link
				href="/internal"
				disabled
				// Link 在組合完成後提供連結內容。
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				render={<a href="/external" />}
			>
				Disabled composition
			</Link>
		);
		const link = screen.getByText("Disabled composition");
		expect(link).not.toHaveAttribute("href");
		expect(link).toHaveAttribute("aria-disabled", "true");
	});
});

describe("foundation display primitives", () => {
	it("renders a stable avatar fallback and an optional readable status", () => {
		render(<Avatar alt="Lin Yao" status="online" statusLabel="Online" />);
		expect(screen.getByText("LY")).toBeVisible();
		expect(screen.getByRole("img", { name: "Lin Yao, Online" })).toBeInTheDocument();
	});

	it("uses the Base UI separator semantics", () => {
		render(<Separator orientation="vertical" />);
		expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
	});

	it("lets cards opt into a meaningful consumer-owned element", () => {
		render(
			<Card render={<article aria-labelledby="system-title" />}>
				<CardTitle id="system-title">Power system</CardTitle>
				<CardBody>Nominal</CardBody>
			</Card>
		);

		expect(screen.getByRole("article", { name: "Power system" })).toBeVisible();
		expect(screen.getByRole("heading", { level: 3, name: "Power system" })).toBeVisible();
	});

	it("keeps card anatomy out of page-level landmark roles by default", () => {
		render(
			<Card>
				<CardHeader>Header content</CardHeader>
				<CardFooter>Footer content</CardFooter>
			</Card>
		);

		expect(screen.queryByRole("banner")).not.toBeInTheDocument();
		expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument();
	});

	it("renders status badges as text rather than color-only information", () => {
		render(<Badge variant="success">Operational</Badge>);
		expect(screen.getByText("Operational")).toBeVisible();
	});

	it("renders a requested section heading level", () => {
		render(
			<SectionHeading level={4} annotation="SYS/04" description="Primary thermal loop">
				Cooling
			</SectionHeading>
		);
		expect(screen.getByRole("heading", { level: 4, name: "Cooling" })).toBeVisible();
		expect(screen.getByText("Primary thermal loop")).toBeVisible();
	});
});

describe("ListCell composition", () => {
	it("renders one interactive root with non-interactive slots", () => {
		render(
			<ListCell
				action={{ href: "/modules/power", "aria-label": "Power module" }}
				leading="01"
				title="Power module"
				description="All rails nominal"
				trailing={<ArrowRightIcon aria-hidden weight="bold" />}
			/>
		);

		const cell = screen.getByRole("link", { name: /Power module/ });
		expect(cell).toHaveAttribute("href", "/modules/power");
		expect(cell.closest(".lyds-list-cell")).toBe(cell.parentElement);
	});

	it("supports explicit slots for custom content structures", () => {
		render(
			<ListCell>
				<ListCellLeading>02</ListCellLeading>
				<ListCellContent>
					<ListCellTitle>Cooling loop</ListCellTitle>
					<ListCellDescription>Manual override</ListCellDescription>
				</ListCellContent>
			</ListCell>
		);

		expect(screen.getByText("Cooling loop")).toHaveClass("lyds-list-cell__title");
		expect(screen.getByText("Manual override")).toHaveClass("lyds-list-cell__description");
	});

	it("preserves numeric slot content and exposes explicit selection semantics", () => {
		render(<ListCell leading={0} metadata={0} title="Counter" selected selectionSemantics="page" />);
		const cell = screen.getByText("Counter").closest(".lyds-list-cell");
		expect(cell).toHaveAttribute("aria-current", "page");
		expect(screen.getAllByText("0")).toHaveLength(2);
	});

	it("keeps the whole-cell action and a trailing action as siblings", () => {
		render(
			<ListCell
				action={{ href: "/module", "aria-label": "Power module" }}
				title="Power module"
				trailing={
					<IconButton aria-label="More options">
						<DotsThreeIcon weight="bold" />
					</IconButton>
				}
			/>
		);
		const cellAction = screen.getByRole("link", { name: "Power module" });
		const trailingAction = screen.getByRole("button", { name: "More options" });
		expect(cellAction.contains(trailingAction)).toBe(false);
		expect(cellAction.parentElement).toBe(trailingAction.closest(".lyds-list-cell"));
	});

	it("suppresses activation for a disabled composed cell", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<ListCell action={{ href: "/locked", "aria-label": "Locked module", onClick }} title="Locked module" disabled />);
		const action = screen.getByLabelText("Locked module");
		expect(action.closest(".lyds-list-cell")).toHaveAttribute("data-disabled", "");
		expect(action.closest(".lyds-list-cell")).not.toHaveAttribute("aria-disabled");
		expect(action).toHaveAttribute("aria-disabled", "true");
		expect(action).toHaveAttribute("tabindex", "-1");
		expect(action).not.toHaveAttribute("href");
		expect(action).not.toHaveAttribute("role", "link");
		await user.click(action);
		expect(onClick).not.toHaveBeenCalled();
	});
});

describe("foundation accessibility", () => {
	it("has no detectable semantic violations in a representative composition", async () => {
		const { container } = render(
			<main>
				<SectionHeading annotation="SYS/01">Control deck</SectionHeading>
				<Card render={<section aria-label="System status" />}>
					<ListCell title="Thermal loop" description="Nominal" leading={<Avatar alt="Thermal controller" fallback="TC" />} trailing={<Badge variant="success">Online</Badge>} />
					<Button>Run diagnostic</Button>
					<IconButton aria-label="Open system options">
						<DotsThreeIcon weight="bold" />
					</IconButton>
				</Card>
			</main>
		);

		const results = await axe.run(container, {
			rules: {
				"color-contrast": { enabled: false }
			}
		});
		expect(results.violations).toEqual([]);
	});
});

describe("heading levels and link targets", () => {
	it("lets a card title sit at the level its page needs", () => {
		render(
			<Card>
				<CardTitle level={4}>Node status</CardTitle>
			</Card>
		);

		expect(screen.getByRole("heading", { name: "Node status", level: 4 })).toBeInTheDocument();
	});

	it("defaults a card title to h3", () => {
		render(
			<Card>
				<CardTitle>Node status</CardTitle>
			</Card>
		);

		expect(screen.getByRole("heading", { name: "Node status", level: 3 })).toBeInTheDocument();
	});

	it("warns that a link opens a new window and secures the relationship", () => {
		render(
			<Link href="https://example.com" target="_blank" external>
				Operations handbook
			</Link>
		);

		const link = screen.getByRole("link", { name: /Operations handbook/ });
		expect(link).toHaveAccessibleName(expect.stringMatching(/^Operations handbook\s*（在新視窗開啟）$/));
		expect(link.querySelector(".lyds-sr-only")).toHaveTextContent("（在新視窗開啟）");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
		expect(link).toHaveAttribute("data-external");
	});

	it("stays quiet about new windows when the link opens in place", () => {
		render(
			<Link href="/handbook" external>
				Operations handbook
			</Link>
		);

		const link = screen.getByRole("link", { name: "Operations handbook" });
		expect(link).toHaveAccessibleName("Operations handbook");
		expect(link).toHaveAttribute("data-external");
	});
});

describe("list cell composition", () => {
	it("keeps every slot addressable and carries the selection semantics onto the action", () => {
		render(
			<ListCell selected selectionSemantics="page" size="lg" variant="inset">
				<ListCellLeading>◆</ListCellLeading>
				<ListCellContent>
					<ListCellTitle>alpha</ListCellTitle>
					<ListCellDescription>Primary region</ListCellDescription>
					<ListCellMetadata>Updated 2 minutes ago</ListCellMetadata>
				</ListCellContent>
				<ListCellTrailing>
					<ListCellAction aria-label="Open node" href="/nodes/alpha" />
				</ListCellTrailing>
			</ListCell>
		);

		const cell = screen.getByText("alpha").closest(".lyds-list-cell");
		expect(cell).toHaveAttribute("data-size", "lg");
		expect(cell).toHaveAttribute("data-variant", "inset");
		expect(cell?.querySelector(".lyds-list-cell__leading")).toHaveTextContent("◆");
		expect(cell?.querySelector(".lyds-list-cell__metadata")).toHaveTextContent("Updated 2 minutes ago");

		const action = screen.getByRole("link", { name: "Open node" });
		expect(action).toHaveAttribute("aria-current", "page");
		expect(action).toHaveAttribute("href", "/nodes/alpha");
	});

	it("disables the action along with the cell", () => {
		const { container } = render(
			<ListCell disabled>
				<ListCellTitle>alpha</ListCellTitle>
				<ListCellAction aria-label="Open node" href="/nodes/alpha" />
			</ListCell>
		);

		// Dropping href also drops the link role, which is the point: a disabled action is not a target.
		const action = container.querySelector(".lyds-list-cell__action");
		expect(action).toHaveAttribute("aria-disabled", "true");
		expect(action).not.toHaveAttribute("href");
		expect(action).toHaveAttribute("tabindex", "-1");
		expect(screen.queryByRole("link")).not.toBeInTheDocument();
	});
});
