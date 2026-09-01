import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Autocomplete, CheckboxGroup, CheckboxItem, Combobox, ContextMenu, DropdownMenu, RadioGroup, RadioItem, SegmentedControl, SegmentedControlItem, Select, Slider, Switch } from "./index";

beforeAll(() => {
	document.documentElement.style.setProperty("--motion-duration-fast", "0ms");
	document.documentElement.style.setProperty("--motion-duration-normal", "0ms");
	document.documentElement.style.setProperty("--motion-duration-instant", "0ms");
	document.documentElement.style.setProperty("--motion-ease-out", "linear");
	document.documentElement.style.setProperty("--motion-ease-snap", "linear");
	Object.defineProperty(window, "PointerEvent", { configurable: true, value: MouseEvent });
	Object.defineProperty(Element.prototype, "scrollIntoView", {
		configurable: true,
		value: vi.fn()
	});
	Object.defineProperty(Element.prototype, "hasPointerCapture", {
		configurable: true,
		value: () => false
	});
	Object.defineProperty(Element.prototype, "setPointerCapture", {
		configurable: true,
		value: vi.fn()
	});
	Object.defineProperty(Element.prototype, "releasePointerCapture", {
		configurable: true,
		value: vi.fn()
	});
	Object.defineProperty(Element.prototype, "getBoundingClientRect", {
		configurable: true,
		value: () => ({
			bottom: 40,
			height: 40,
			left: 0,
			right: 160,
			top: 0,
			width: 160,
			x: 0,
			y: 0,
			toJSON: () => ({})
		})
	});
});

describe("selection controls", () => {
	it("submits checkbox group values and supports uncontrolled changes", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		const { container } = render(
			<form data-testid="form">
				<CheckboxGroup aria-label="Notification channels" defaultValue={["email"]} onValueChange={onValueChange}>
					<CheckboxItem label="Email" name="channels" value="email" />
					<CheckboxItem label="SMS" name="channels" value="sms" />
				</CheckboxGroup>
			</form>
		);

		await user.click(screen.getByRole("checkbox", { name: "SMS" }));

		expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"], expect.objectContaining({ reason: "none" }));
		const data = new FormData(screen.getByTestId("form"));
		expect(data.getAll("channels")).toEqual(["email", "sms"]);

		const results = await axe.run(container, {
			rules: { "color-contrast": { enabled: false } }
		});
		expect(results.violations).toHaveLength(0);
	});

	it("moves radio selection with arrow keys", async () => {
		const user = userEvent.setup();
		render(
			<RadioGroup aria-label="Power mode" defaultValue="balanced" name="mode">
				<RadioItem label="Balanced" value="balanced" />
				<RadioItem label="Performance" value="performance" />
				<RadioItem label="Silent" value="silent" />
			</RadioGroup>
		);

		const balanced = screen.getByRole("radio", { name: "Balanced" });
		const performance = screen.getByRole("radio", { name: "Performance" });
		balanced.focus();
		await user.keyboard("{ArrowRight}");

		expect(performance).toHaveAttribute("aria-checked", "true");
		expect(performance).toHaveFocus();
	});

	it("supports controlled switch state and details", async () => {
		const user = userEvent.setup();
		const onCheckedChange = vi.fn();
		const { rerender } = render(<Switch aria-label="Cooling system" checked={false} onCheckedChange={onCheckedChange} />);
		const control = screen.getByRole("switch", { name: "Cooling system" });

		expect(control).toHaveAttribute("data-unchecked");

		await user.click(control);
		expect(onCheckedChange).toHaveBeenCalledWith(true, expect.objectContaining({ reason: "none" }));
		expect(control).toHaveAttribute("aria-checked", "false");

		rerender(<Switch aria-label="Cooling system" checked onCheckedChange={onCheckedChange} />);
		expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
		expect(screen.getByRole("switch")).toHaveAttribute("data-checked");
	});

	it("toggles an uncontrolled switch with Space", async () => {
		const user = userEvent.setup();
		render(<Switch aria-label="Automatic updates" defaultChecked />);
		const control = screen.getByRole("switch", { name: "Automatic updates" });

		control.focus();
		await user.keyboard(" ");

		expect(control).toHaveFocus();
		expect(control).toHaveAttribute("aria-checked", "false");
		expect(control).toHaveAttribute("data-unchecked");
	});

	it("changes a slider with the keyboard", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<Slider defaultValue={40} getAriaLabel={() => "Output level"} onValueChange={onValueChange} step={5} />);

		const slider = screen.getByRole("slider", { name: "Output level" });
		slider.focus();
		await user.keyboard("{ArrowRight}");

		expect(onValueChange).toHaveBeenCalledWith(45, expect.objectContaining({ activeThumbIndex: 0, reason: "keyboard" }));
		expect(slider).toHaveAttribute("aria-valuenow", "45");
	});

	it("applies a single slider label to its actual range input", () => {
		render(<Slider aria-label="Output gain" defaultValue={64} />);
		expect(screen.getByRole("slider", { name: "Output gain" })).toBeInTheDocument();
	});

	it("uses external slider labels and descriptions on the range input", () => {
		render(
			<>
				<span id="gain-label">Output gain</span>
				<span id="gain-description">Measured in percent</span>
				<Slider aria-describedby="gain-description" aria-labelledby="gain-label" defaultValue={64} />
			</>
		);
		const slider = screen.getByRole("slider", { name: "Output gain" });
		expect(slider).toHaveAccessibleDescription("Measured in percent");
	});

	it("adapts a controlled segmented control to one public value", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		const { rerender } = render(
			<SegmentedControl aria-label="Density" onValueChange={onValueChange} value="compact">
				<SegmentedControlItem value="compact">Compact</SegmentedControlItem>
				<SegmentedControlItem value="comfortable">Comfortable</SegmentedControlItem>
			</SegmentedControl>
		);

		await user.click(screen.getByRole("button", { name: "Comfortable" }));
		expect(onValueChange).toHaveBeenCalledWith("comfortable", expect.objectContaining({ reason: "none" }));
		expect(screen.getByRole("button", { name: "Compact" })).toHaveAttribute("aria-pressed", "true");

		rerender(
			<SegmentedControl aria-label="Density" onValueChange={onValueChange} value="comfortable">
				<SegmentedControlItem value="compact">Compact</SegmentedControlItem>
				<SegmentedControlItem value="comfortable">Comfortable</SegmentedControlItem>
			</SegmentedControl>
		);
		expect(screen.getByRole("button", { name: "Comfortable" })).toHaveAttribute("aria-pressed", "true");
	});

	it("honors canceled segmented-control changes before updating uncontrolled state", async () => {
		const user = userEvent.setup();
		render(
			<SegmentedControl
				aria-label="Density"
				defaultValue="compact"
				onValueChange={(_value, details) => {
					details.cancel();
				}}
			>
				<SegmentedControlItem value="compact">Compact</SegmentedControlItem>
				<SegmentedControlItem value="comfortable">Comfortable</SegmentedControlItem>
			</SegmentedControl>
		);

		await user.click(screen.getByRole("button", { name: "Comfortable" }));
		expect(screen.getByRole("button", { name: "Compact" })).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByRole("button", { name: "Comfortable" })).toHaveAttribute("aria-pressed", "false");
	});
});

describe("selection popups", () => {
	it("indexes combobox options once and preserves item identity while filtering", () => {
		const valueReads = vi.fn();
		const options = Array.from({ length: 12 }, (_, index) => {
			const option = { label: `Option ${index}` } as { label: string; value: string };
			Object.defineProperty(option, "value", {
				enumerable: true,
				get() {
					valueReads();
					return `option-${index}`;
				}
			});
			return option;
		});

		render(<Combobox aria-label="Indexed options" defaultOpen modal={false} options={options} />);
		const targetBeforeFilter = screen.getByRole("option", { name: "Option 11" });
		expect(valueReads).toHaveBeenCalledTimes(options.length);

		fireEvent.change(screen.getByRole("combobox", { name: "Indexed options" }), { target: { value: "11" } });

		expect(screen.getByRole("option", { name: "Option 11" })).toBe(targetBeforeFilter);
		expect(valueReads).toHaveBeenCalledTimes(options.length);
	});

	it("indexes autocomplete options once while filtering suggestions", () => {
		const valueReads = vi.fn();
		const options = Array.from({ length: 12 }, (_, index) => {
			const option = { label: `Suggestion ${index}` } as { label: string; value: string };
			Object.defineProperty(option, "value", {
				enumerable: true,
				get() {
					valueReads();
					return `suggestion-${index}`;
				}
			});
			return option;
		});

		render(<Autocomplete aria-label="Indexed suggestions" defaultOpen modal={false} options={options} />);
		expect(valueReads).toHaveBeenCalledTimes(options.length);

		fireEvent.change(screen.getByRole("combobox", { name: "Indexed suggestions" }), { target: { value: "11" } });

		expect(screen.getByRole("option", { name: "Suggestion 11" })).toBeInTheDocument();
		expect(valueReads).toHaveBeenCalledTimes(options.length);
	});

	it("puts consumer labels on the actual select trigger", () => {
		render(
			<>
				<span id="material-label">Material</span>
				<Select aria-labelledby="material-label" options={[{ label: "Limestone", value: "limestone" }]} />
			</>
		);

		expect(screen.getByRole("combobox", { name: "Material" })).toBeInTheDocument();
	});

	it("selects an option after keyboard navigation", () => {
		const onValueChange = vi.fn();
		render(
			<Select
				aria-label="Material"
				modal={false}
				onValueChange={onValueChange}
				options={[
					{ label: "Limestone", value: "limestone" },
					{ label: "Charcoal", value: "charcoal" }
				]}
			/>
		);

		const trigger = screen.getByRole("combobox", { name: "Material" });
		trigger.focus();
		fireEvent.keyDown(trigger, { key: "ArrowDown" });
		const option = screen.getByText("Limestone").closest('[role="option"]');
		expect(option).toHaveAttribute("data-highlighted");
		fireEvent.click(option!);

		expect(onValueChange).toHaveBeenCalledWith("limestone", expect.objectContaining({ reason: "item-press" }));
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("closes a dropdown menu with Escape and returns focus", () => {
		const onOpenChange = vi.fn();
		render(
			<DropdownMenu.Root modal={false} onOpenChange={onOpenChange}>
				<DropdownMenu.Trigger>Operations</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Positioner>
						<DropdownMenu.Popup>
							<DropdownMenu.Item>Inspect</DropdownMenu.Item>
						</DropdownMenu.Popup>
					</DropdownMenu.Positioner>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		);

		const trigger = screen.getByRole("button", { name: "Operations" });
		trigger.focus();
		fireEvent.click(trigger);
		const item = screen.getByText("Inspect").closest('[role="menuitem"]');
		expect(item).toBeInTheDocument();
		expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ reason: "trigger-press" }));
		fireEvent.keyDown(document.activeElement ?? document.body, { key: "Escape" });

		expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: "escape-key" }));
		expect(trigger).toHaveFocus();
	});

	it("opens a context menu from the native contextmenu gesture", () => {
		function ContextExample() {
			const [open, setOpen] = useState(false);
			return (
				<ContextMenu.Root onOpenChange={setOpen}>
					<ContextMenu.Trigger data-testid="context-target">Panel {open ? "open" : "closed"}</ContextMenu.Trigger>
					<ContextMenu.Portal>
						<ContextMenu.Positioner>
							<ContextMenu.Popup>
								<ContextMenu.Item>Calibrate</ContextMenu.Item>
							</ContextMenu.Popup>
						</ContextMenu.Positioner>
					</ContextMenu.Portal>
				</ContextMenu.Root>
			);
		}

		render(<ContextExample />);
		fireEvent.contextMenu(screen.getByTestId("context-target"), {
			button: 2,
			clientX: 80,
			clientY: 40
		});

		expect(screen.getByText("Calibrate").closest('[role="menuitem"]')).toBeInTheDocument();
		expect(screen.getByTestId("context-target")).toHaveTextContent("Panel open");
	});

	it("maps Shift+F10 to the context menu gesture", () => {
		render(
			<ContextMenu.Root>
				<ContextMenu.Trigger data-testid="keyboard-context-target">Panel</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenu.Positioner>
						<ContextMenu.Popup>
							<ContextMenu.Item>Calibrate</ContextMenu.Item>
						</ContextMenu.Popup>
					</ContextMenu.Positioner>
				</ContextMenu.Portal>
			</ContextMenu.Root>
		);

		fireEvent.keyDown(screen.getByTestId("keyboard-context-target"), { key: "F10", shiftKey: true });
		expect(screen.getByText("Calibrate").closest('[role="menuitem"]')).toBeInTheDocument();
	});
});
