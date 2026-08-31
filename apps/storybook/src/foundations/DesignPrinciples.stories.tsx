import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const principles = [
	{
		label: "01 / SEMANTICS",
		title: "Meaning survives the theme",
		copy: "Components consume category, role, and state tokens instead of physical color names. The same API can move between warm daylight and low-light conditions without changing its intent."
	},
	{
		label: "02 / COMPOSITION",
		title: "Parts assemble into systems",
		copy: "Small controls compose into grouped fields, list cells, overlays, and application patterns. Consumers should extend through slots and render APIs before forking component internals."
	},
	{
		label: "03 / STATES",
		title: "Behavior is visible",
		copy: "Hover, pressed, selected, open, disabled, invalid, loading, and focus-visible states remain distinct. Decorative geometry never obscures a state change or target."
	},
	{
		label: "04 / MATERIAL",
		title: "Industrial, not theatrical",
		copy: "Inset surfaces, seams, clipped corners, and signal indicators appear selectively. Readability and familiar control affordances remain stronger than the retro-technical expression."
	},
	{
		label: "05 / ACCESS",
		title: "Accessibility is structural",
		copy: "Base UI and React Aria provide interaction semantics where appropriate. Focus, keyboard navigation, announcements, and reduced motion are designed into the component contract."
	},
	{
		label: "06 / OWNERSHIP",
		title: "Products own business logic",
		copy: "LYDS exposes controlled and uncontrolled primitives. Data fetching, routing, analytics, persistence, validation policy, and final date formatting stay with the consuming product."
	}
] as const;

const inventory = [
	{
		category: "Foundations",
		count: "10",
		items: ["Button and IconButton", "Link and Badge", "Avatar and Separator", "Card and CloudBox", "SectionHeading and ListCell"]
	},
	{
		category: "Forms and selection",
		count: "25+",
		items: [
			"Text, search, password, code, phone, and number fields",
			"OTP, file upload, and drop zone",
			"Checkbox, radio, switch, slider, and toggles",
			"Select, Combobox, Autocomplete, Menu, and Context Menu"
		]
	},
	{
		category: "Structure and overlays",
		count: "15+",
		items: ["Accordion, Collapsible, and Tabs", "Tooltip, Popover, and Preview Card", "Dialog, AlertDialog, Drawer, and BottomSheet"]
	},
	{
		category: "Feedback and navigation",
		count: "20+",
		items: [
			"Toast, Alert, Banner, Progress, Meter, and loaders",
			"Breadcrumb, Pagination, Navigation Menu, Menubar, and Toolbar",
			"Header, Tab Bar, Table, Collection, Scroll Area, and Command Palette"
		]
	},
	{
		category: "Date and time",
		count: "08",
		items: ["Calendar and DateField", "DatePicker and DateRangePicker", "TimeField and TimePicker", "DateTimePicker with locale-aware segmented input"]
	}
] as const;

const meta = {
	title: "Foundations/Design Principles",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SystemPrinciplesAndInventory: Story = {
	render: () => (
		<main className="foundation-page">
			<FoundationHero
				eyebrow="LYDS / SYSTEM MAP"
				title="A control panel, scaled into a language."
				description="LYDS adopts Modulor’s semantic-token, explicit-state, and compositional discipline, then reinterprets it through a warm future-retro industrial material system for serious application interfaces."
				readouts={[
					{ value: "06", label: "principles" },
					{ value: "70+", label: "public pieces" },
					{ value: "01", label: "package install" }
				]}
			/>

			<FoundationSection number="01" title="Design principles">
				<div className="foundation-principle-grid">
					{principles.map(principle => (
						<article className="foundation-principle" key={principle.label}>
							<span className="foundation-kicker">{principle.label}</span>
							<h3>{principle.title}</h3>
							<p>{principle.copy}</p>
						</article>
					))}
				</div>
			</FoundationSection>

			<FoundationSection number="02" title="Component inventory">
				<div className="foundation-inventory-grid">
					{inventory.map(group => (
						<article className="foundation-inventory" key={group.category}>
							<span className="foundation-inventory-count">{group.count} ITEMS</span>
							<h3>{group.category}</h3>
							<ul>
								{group.items.map(item => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</FoundationSection>
		</main>
	)
};
