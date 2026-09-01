import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
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

	it("keeps a checked checkbox selected until the press completes", () => {
		render(<CheckboxItem defaultChecked label="Enable notifications" />);
		const checkbox = screen.getByRole("checkbox", { name: "Enable notifications" });

		fireEvent.pointerDown(checkbox);
		expect(checkbox).toHaveAttribute("data-checked");
		fireEvent.pointerUp(checkbox);
		expect(checkbox).toHaveAttribute("data-checked");

		fireEvent.click(checkbox);
		expect(checkbox).toHaveAttribute("data-unchecked");
	});

	it("does not change read-only or disabled checkbox states", async () => {
		const user = userEvent.setup();
		render(
			<>
				<CheckboxItem defaultChecked readOnly label="Read-only selection" />
				<CheckboxItem defaultChecked disabled label="Disabled selection" />
			</>
		);

		const readOnly = screen.getByRole("checkbox", { name: "Read-only selection" });
		const disabled = screen.getByRole("checkbox", { name: "Disabled selection" });
		await user.click(readOnly);
		await user.click(disabled);

		expect(readOnly).toHaveAttribute("aria-checked", "true");
		expect(disabled).toHaveAttribute("aria-disabled", "true");
		expect(disabled).toHaveAttribute("aria-checked", "true");
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
	it("indexes combobox options without rereading option values", () => {
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

		const view = render(<Combobox aria-label="Indexed options" options={options} />);
		expect(valueReads).toHaveBeenCalledTimes(options.length);
		view.rerender(<Combobox aria-label="Indexed options" options={options} />);
		expect(valueReads).toHaveBeenCalledTimes(options.length);
	});

	it("indexes autocomplete options without rereading option values", () => {
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

		const view = render(<Autocomplete aria-label="Indexed suggestions" options={options} />);
		expect(valueReads).toHaveBeenCalledTimes(options.length);
		view.rerender(<Autocomplete aria-label="Indexed suggestions" options={options} />);
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

	it("renders a closed dropdown trigger with menu semantics", () => {
		render(
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>Operations</DropdownMenu.Trigger>
			</DropdownMenu.Root>
		);

		const trigger = screen.getByRole("button", { name: "Operations" });
		expect(trigger).toHaveAttribute("aria-haspopup", "menu");
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("renders a context-menu target without assigning button semantics", () => {
		render(
			<ContextMenu.Root>
				<ContextMenu.Trigger data-testid="context-target" tabIndex={0}>
					Panel
				</ContextMenu.Trigger>
			</ContextMenu.Root>
		);

		const target = screen.getByTestId("context-target");
		expect(target).not.toHaveAttribute("role", "button");
		expect(target).toHaveAttribute("tabindex", "0");
	});
});
