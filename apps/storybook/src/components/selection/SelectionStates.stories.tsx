import {
	Autocomplete,
	CheckboxItem,
	Combobox,
	ContextMenu,
	DropdownMenu,
	MenuCheckboxItem,
	MenuCheckboxItemIndicator,
	MenuItem,
	MenuLinkItem,
	MenuPopup,
	MenuPositioner,
	MenuRadioItem,
	MenuRadioItemIndicator,
	MenuSeparator,
	MenuSubmenuTrigger,
	MenuTrigger,
	RadioGroup,
	RadioItem,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	Slider,
	Switch,
	Toggle,
	ToggleGroup
} from "@lyds/ui";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import "../story-layout.css";

const offices = [
	{ value: "north", label: "North office", description: "Taipei · Open" },
	{ value: "harbor", label: "Harbor office", description: "Kaohsiung · Limited hours" },
	{ value: "archive", label: "Archived workspace", description: "Read only", disabled: true }
] as const;

const meta = {
	title: "Components/Selection/State Matrix",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnlyAndDisabledControls: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Checkbox</h3>
				<CheckboxItem defaultChecked readOnly label="Read-only selection" description="The value is submitted but cannot be changed." />
				<CheckboxItem disabled label="Disabled selection" description="This option is unavailable." />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Switch</h3>
				<div className="lyds-story-row">
					<Switch defaultChecked readOnly aria-labelledby="state-matrix-readonly-switch" />
					<span id="state-matrix-readonly-switch">Read-only automation</span>
				</div>
				<div className="lyds-story-row">
					<Switch disabled aria-labelledby="state-matrix-disabled-switch" />
					<span id="state-matrix-disabled-switch">Unavailable automation</span>
				</div>
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Radio group</h3>
				<RadioGroup readOnly aria-label="Read-only delivery schedule" defaultValue="daily">
					<RadioItem value="daily" label="Daily digest" />
					<RadioItem value="weekly" label="Weekly digest" />
				</RadioGroup>
				<RadioGroup disabled aria-label="Disabled delivery schedule" defaultValue="weekly">
					<RadioItem value="daily" label="Daily unavailable" />
					<RadioItem value="weekly" label="Weekly unavailable" />
				</RadioGroup>
			</section>
		</div>
	)
};

export const SliderStates: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Disabled horizontal slider</h3>
				<Slider disabled aria-label="Locked output level" defaultValue={72} showValue />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Vertical slider</h3>
				<Slider aria-label="Vertical output level" defaultValue={48} orientation="vertical" showValue />
			</section>
		</div>
	)
};

function ControlledGroupsDemo() {
	const [views, setViews] = useState<string[]>(["cards"]);
	const [period, setPeriod] = useState<string | null>("day");

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<div className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Controlled toggle group</h3>
				<ToggleGroup aria-label="Controlled view" multiple={false} value={views} onValueChange={next => setViews(next)}>
					<Toggle value="cards">Cards</Toggle>
					<Toggle value="list">List</Toggle>
					<Toggle value="timeline">Timeline</Toggle>
				</ToggleGroup>
				<p className="lyds-story-readout" aria-live="polite">
					Selected view: {views[0] ?? "None"}
				</p>
			</div>
			<div className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Controlled segmented control</h3>
				<SegmentedControl aria-label="Controlled period" value={period} onValueChange={next => setPeriod(next)}>
					<SegmentedControlItem value="hour">1 H</SegmentedControlItem>
					<SegmentedControlItem value="day">24 H</SegmentedControlItem>
					<SegmentedControlItem value="week">7 D</SegmentedControlItem>
				</SegmentedControl>
				<p className="lyds-story-readout" aria-live="polite">
					Selected period: {period ?? "None"}
				</p>
			</div>
		</div>
	);
}

export const ControlledGroups: Story = {
	render: () => <ControlledGroupsDemo />
};

export const DisabledGroups: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<ToggleGroup disabled aria-label="Disabled view selection" defaultValue={["cards"]}>
				<Toggle value="cards">Cards</Toggle>
				<Toggle value="list">List</Toggle>
				<Toggle value="timeline">Timeline</Toggle>
			</ToggleGroup>
			<SegmentedControl disabled aria-label="Disabled period selection" defaultValue="day">
				<SegmentedControlItem value="hour">1 H</SegmentedControlItem>
				<SegmentedControlItem value="day">24 H</SegmentedControlItem>
				<SegmentedControlItem value="week">7 D</SegmentedControlItem>
			</SegmentedControl>
		</div>
	)
};

export const SelectOpen: Story = {
	render: () => <Select<string> defaultOpen aria-label="Open office selector" className="lyds-story-control" defaultValue="north" options={offices} />
};

export const SelectReadOnly: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Select<string> readOnly aria-describedby="state-matrix-readonly-select-note" aria-label="Read-only office" className="lyds-story-control" defaultValue="north" options={offices} />
			<p className="lyds-story-note" id="state-matrix-readonly-select-note">
				The selected office remains focusable and readable, but cannot be changed.
			</p>
		</div>
	)
};

export const SearchableFieldStates: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Invalid combobox</h3>
				<Combobox<string> invalid aria-describedby="state-matrix-combobox-error" aria-label="Required office search" className="lyds-story-control" options={offices} placeholder="Find an office" />
				<p className="lyds-story-note" id="state-matrix-combobox-error">
					Choose an available office.
				</p>
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Disabled combobox</h3>
				<Combobox<string> disabled aria-label="Disabled office search" className="lyds-story-control" defaultValue="north" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Read-only combobox</h3>
				<Combobox<string> readOnly aria-label="Read-only office search" className="lyds-story-control" defaultValue="harbor" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Invalid autocomplete</h3>
				<Autocomplete<string>
					invalid
					aria-describedby="state-matrix-autocomplete-error"
					aria-label="Required office query"
					className="lyds-story-control"
					options={offices}
					placeholder="Enter an office name"
				/>
				<p className="lyds-story-note" id="state-matrix-autocomplete-error">
					Enter a recognized office name.
				</p>
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Disabled autocomplete</h3>
				<Autocomplete<string> disabled aria-label="Disabled office query" className="lyds-story-control" defaultValue="North office" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Read-only autocomplete</h3>
				<Autocomplete<string> readOnly aria-label="Read-only office query" className="lyds-story-control" defaultValue="Harbor office" options={offices} />
			</section>
		</div>
	)
};

export const ComboboxEmpty: Story = {
	render: () => (
		<Combobox<string>
			defaultOpen
			aria-label="Office search with no results"
			className="lyds-story-control"
			defaultInputValue="No matching office"
			emptyMessage="No matching offices"
			filteredItems={[]}
			options={offices}
		/>
	)
};

export const AutocompleteEmpty: Story = {
	render: () => (
		<Autocomplete<string>
			defaultOpen
			aria-label="Office query with no suggestions"
			className="lyds-story-control"
			defaultValue="No matching office"
			emptyMessage="No office suggestions"
			filteredItems={[]}
			options={offices}
		/>
	)
};

export const SearchableDarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-grid">
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Combobox</h3>
				<Combobox<string> aria-label="Dark theme office search" className="lyds-story-control" defaultValue="north" options={offices} />
			</section>
			<section className="lyds-story-panel">
				<h3 className="lyds-story-panel__heading">Autocomplete</h3>
				<Autocomplete<string> aria-label="Dark theme office query" className="lyds-story-control" defaultValue="North office" options={offices} />
			</section>
		</div>
	)
};

export const MenuOpenWithRadioAndLink: Story = {
	render: () => (
		<DropdownMenu.Root defaultOpen>
			<MenuTrigger>View options</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<DropdownMenu.RadioGroup defaultValue="comfortable">
							<MenuRadioItem value="compact">
								<MenuRadioItemIndicator />
								Compact density
							</MenuRadioItem>
							<MenuRadioItem value="comfortable">
								<MenuRadioItemIndicator />
								Comfortable density
							</MenuRadioItem>
						</DropdownMenu.RadioGroup>
						<MenuSeparator />
						<MenuLinkItem href="#selection-state-details">Open state details</MenuLinkItem>
						<MenuItem disabled>Unavailable action</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const MenuDisabledTrigger: Story = {
	render: () => (
		<DropdownMenu.Root disabled>
			<MenuTrigger>Unavailable actions</MenuTrigger>
		</DropdownMenu.Root>
	)
};

export const MenuSubmenu: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(document.body);
		await canvas.findByRole("button", { name: "Share" });
		const submenuTrigger = await body.findByRole("menuitem", { name: "Send to" });
		submenuTrigger.focus();
		await userEvent.keyboard("{ArrowRight}");
		await body.findByRole("menuitem", { name: "Design review" });

		const parentMenu = body.getByRole("menuitem", { name: "Copy link" }).closest('[role="menu"]');
		await expect(parentMenu?.querySelector("span[aria-owns]")).toHaveAttribute("role", "group");
	},
	render: () => (
		<DropdownMenu.Root defaultOpen>
			<MenuTrigger>Share</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<MenuItem>Copy link</MenuItem>
						<DropdownMenu.SubmenuRoot>
							<MenuSubmenuTrigger>
								Send to
								<CaretRightIcon aria-hidden="true" weight="bold" />
							</MenuSubmenuTrigger>
							<DropdownMenu.Portal>
								<MenuPositioner align="start" side="right">
									<MenuPopup>
										<MenuItem>Design review</MenuItem>
										<MenuItem>Engineering review</MenuItem>
									</MenuPopup>
								</MenuPositioner>
							</DropdownMenu.Portal>
						</DropdownMenu.SubmenuRoot>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const MenuDarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<DropdownMenu.Root defaultOpen>
			<MenuTrigger>Dark menu</MenuTrigger>
			<DropdownMenu.Portal>
				<MenuPositioner>
					<MenuPopup>
						<MenuItem>Open details</MenuItem>
						<MenuCheckboxItem defaultChecked>
							<MenuCheckboxItemIndicator />
							Show descriptions
						</MenuCheckboxItem>
						<MenuItem disabled>Unavailable action</MenuItem>
					</MenuPopup>
				</MenuPositioner>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
};

export const ContextMenuKeyboard: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<ContextMenu.Root>
				<ContextMenu.Trigger className="lyds-story-context-area" tabIndex={0}>
					Focused report row
				</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenu.Positioner>
						<ContextMenu.Popup>
							<ContextMenu.Item>Open report</ContextMenu.Item>
							<ContextMenu.Item>Copy report link</ContextMenu.Item>
							<ContextMenu.Separator />
							<ContextMenu.Item>Archive report</ContextMenu.Item>
						</ContextMenu.Popup>
					</ContextMenu.Positioner>
				</ContextMenu.Portal>
			</ContextMenu.Root>
			<p className="lyds-story-note">Tab to the target, then press Shift+F10 or the Context Menu key. Use arrow keys within the menu and Escape to close and return focus.</p>
		</div>
	)
};
