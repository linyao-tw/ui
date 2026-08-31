import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const principles = [
	{
		label: "Semantic tokens",
		title: "Meaning survives the theme",
		copy: "Components consume category, role, and state tokens instead of physical color names. The same API can move between warm daylight and low-light conditions without changing its intent."
	},
	{
		label: "Composition",
		title: "Parts assemble into systems",
		copy: "Small controls compose into grouped fields, list cells, overlays, and application patterns. Consumers should extend through slots and render APIs before forking component internals."
	},
	{
		label: "Interaction states",
		title: "Behavior is visible",
		copy: "Hover, pressed, selected, open, disabled, invalid, loading, and focus-visible states remain distinct. Decorative geometry never obscures a state change or target."
	},
	{
		label: "Reference fidelity",
		title: "Anatomy before decoration",
		copy: "Verified Modulor dimensions, surfaces, type hierarchy, and state organization define the component. LYDS changes the palette without adding unrelated ornament."
	},
	{
		label: "Accessibility",
		title: "Accessibility is structural",
		copy: "Base UI and React Aria provide interaction semantics where appropriate. Focus, keyboard navigation, announcements, and reduced motion are designed into the component contract."
	},
	{
		label: "Product ownership",
		title: "Products own business logic",
		copy: "LYDS exposes controlled and uncontrolled primitives. Data fetching, routing, analytics, persistence, validation policy, and final date formatting stay with the consuming product."
	}
] as const;

const inventory = [
	{
		category: "Foundations",
		items: ["Button and IconButton", "Link and Badge", "Avatar and Separator", "Card and CloudBox", "SectionHeading and ListCell"]
	},
	{
		category: "Forms and selection",
		items: [
			"Text, search, password, code, phone, and number fields",
			"OTP, file upload, and drop zone",
			"Checkbox, radio, switch, slider, and toggles",
			"Select, Combobox, Autocomplete, Menu, and Context Menu"
		]
	},
	{
		category: "Structure and overlays",
		items: ["Accordion, Collapsible, and Tabs", "Tooltip, Popover, and Preview Card", "Dialog, AlertDialog, Drawer, and BottomSheet"]
	},
	{
		category: "Feedback and navigation",
		items: [
			"Toast, Alert, Banner, Progress, Meter, and loaders",
			"Breadcrumb, Pagination, Navigation Menu, Menubar, and Toolbar",
			"Header, Tab Bar, Table, Collection, Scroll Area, and Command Palette"
		]
	},
	{
		category: "Date and time",
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
				eyebrow="LYDS system overview"
				title="A consistent language for application interfaces."
				description="LYDS follows Modulor’s verified component anatomy, semantic-token structure, explicit states, and compositional discipline, then remaps those roles to the LYDS palette."
			/>

			<FoundationSection title="Design principles">
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

			<FoundationSection title="Component inventory">
				<div className="foundation-inventory-grid">
					{inventory.map(group => (
						<article className="foundation-inventory" key={group.category}>
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
