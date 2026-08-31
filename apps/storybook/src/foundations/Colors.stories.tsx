import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

type FoundationStyle = CSSProperties & Record<`--foundation-${string}`, string>;

interface TokenSpecimen {
	name: string;
	role: string;
	value: string;
	ink: string;
}

const brandTokens: readonly TokenSpecimen[] = [
	{
		name: "Palette/Limestone",
		role: "Warm material foundation",
		value: "var(--palette-limestone)",
		ink: "var(--text-always-dark)"
	},
	{
		name: "Palette/Charcoal",
		role: "Structural foundation",
		value: "var(--palette-charcoal)",
		ink: "var(--text-always-white)"
	},
	{
		name: "Palette/Vermilion",
		role: "Signal and action foundation",
		value: "var(--palette-vermilion)",
		ink: "var(--text-always-dark)"
	}
];

const surfaceTokens: readonly TokenSpecimen[] = [
	{
		name: "Background/Main",
		role: "Application canvas",
		value: "var(--background-main)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Secondary",
		role: "Grouped regions",
		value: "var(--background-secondary)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Elevated",
		role: "Cards and overlays",
		value: "var(--background-elevated)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Inset",
		role: "Recessed panels",
		value: "var(--background-inset)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Selected",
		role: "Selected regions",
		value: "var(--background-selected)",
		ink: "var(--text-title)"
	},
	{
		name: "Control/Primary",
		role: "Action signal",
		value: "var(--control-primary)",
		ink: "var(--text-on-accent)"
	}
];

const stateTokens: readonly TokenSpecimen[] = [
	{
		name: "Status/Info/Background",
		role: "Informational feedback",
		value: "var(--status-info-background)",
		ink: "var(--status-info-foreground)"
	},
	{
		name: "Status/Success/Background",
		role: "Successful outcomes",
		value: "var(--status-success-background)",
		ink: "var(--status-success-foreground)"
	},
	{
		name: "Status/Warning/Background",
		role: "Cautionary feedback",
		value: "var(--status-warning-background)",
		ink: "var(--status-warning-foreground)"
	},
	{
		name: "Status/Danger/Background",
		role: "Destructive or invalid feedback",
		value: "var(--status-danger-background)",
		ink: "var(--status-danger-foreground)"
	}
];

const contrastPairs = [
	{
		name: "Primary interface",
		foreground: "var(--text-main)",
		background: "var(--background-main)",
		border: "var(--divider-strong)",
		copy: "Text/Main on Background/Main"
	},
	{
		name: "Prominent action",
		foreground: "var(--text-on-accent)",
		background: "var(--background-accent)",
		border: "var(--text-on-accent)",
		copy: "Text/On_Accent on Background/Accent"
	},
	{
		name: "Recessed readout",
		foreground: "var(--text-on-inset)",
		background: "var(--background-inset)",
		border: "var(--divider-strong)",
		copy: "Text/On_Inset on Background/Inset"
	}
] as const;

const meta = {
	title: "Foundations/Colors",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function TokenGrid({ tokens }: { tokens: readonly TokenSpecimen[] }) {
	return (
		<div className="foundation-token-grid">
			{tokens.map(token => (
				<article className="foundation-token" key={token.name}>
					<div aria-hidden="true" className="foundation-token__swatch" style={{ "--foundation-swatch": token.value, "--foundation-ink": token.ink } as FoundationStyle} />
					<div className="foundation-token__body">
						<strong className="foundation-token__role">{token.role}</strong>
						<code>{token.name}</code>
					</div>
				</article>
			))}
		</div>
	);
}

export const SemanticColorSystem: Story = {
	render: () => (
		<main className="foundation-page">
			<FoundationHero
				eyebrow="LYDS / COLOR SYSTEM"
				title="Material first. Meaning always."
				description="A restrained industrial palette becomes useful through semantic roles. Components consume purpose-driven tokens, so light and dark themes retain the same hierarchy without copying physical color names into component CSS."
				readouts={[
					{ value: "03", label: "brand foundations" },
					{ value: "02", label: "complete themes" },
					{ value: "AA", label: "contrast target" }
				]}
			/>

			<FoundationSection number="01" title="Brand foundations">
				<p className="foundation-section-copy">
					Limestone supplies warmth, Charcoal defines structure, and Vermilion behaves as a signal. These palette values are references for theme authors—not component-level styling hooks.
				</p>
				<TokenGrid tokens={brandTokens} />
			</FoundationSection>

			<FoundationSection number="02" title="Semantic surfaces">
				<p className="foundation-section-copy">Surface roles describe elevation and interaction. Their actual values change with the active theme while component intent stays stable.</p>
				<TokenGrid tokens={surfaceTokens} />
			</FoundationSection>

			<FoundationSection number="03" title="Feedback states">
				<p className="foundation-section-copy">Status colors pair backgrounds, foregrounds, and borders. Never communicate status by color alone; pair them with a label, icon, or explanatory text.</p>
				<TokenGrid tokens={stateTokens} />
			</FoundationSection>

			<FoundationSection number="04" title="Intentional foreground pairs">
				<div className="foundation-pair-grid">
					{contrastPairs.map(pair => (
						<article
							className="foundation-pair"
							key={pair.name}
							style={
								{
									"--foundation-pair-foreground": pair.foreground,
									"--foundation-pair-background": pair.background,
									"--foundation-pair-border": pair.border
								} as FoundationStyle
							}
						>
							<strong>{pair.name}</strong>
							<code>{pair.copy}</code>
						</article>
					))}
				</div>
			</FoundationSection>
		</main>
	)
};
