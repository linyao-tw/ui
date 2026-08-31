import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const specimens = [
	{
		family: "sans",
		scale: "display",
		label: "Display / Sans",
		meta: "GenKiGothicTW · Bold",
		copy: "清楚的層級，準確的節奏。"
	},
	{
		family: "serif",
		scale: "heading",
		label: "Editorial / Serif",
		meta: "GenKiMinTW · Semibold",
		copy: "Warm materials, exact decisions, and a measured human voice."
	},
	{
		family: "sans",
		scale: "body",
		label: "Interface / Sans",
		meta: "GenKiGothicTW · Regular",
		copy: "LYDS uses the same clear hierarchy in everyday application interfaces. 中文段落維持清楚節奏，長內容不因造型而犧牲可讀性。"
	},
	{
		family: "mono",
		scale: "structured",
		label: "Structured values / Mono",
		meta: "Geist Mono · Medium",
		copy: "2026-08-31 · 23:48:06 · 87.5%"
	}
] as const;

const numericExamples = [
	{ label: "Date", value: "2026.08.31" },
	{ label: "Time", value: "23:48:06" },
	{ label: "Count", value: "0042" },
	{ label: "Load", value: "87.5%" }
] as const;

const meta = {
	title: "Foundations/Typography",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeSystem: Story = {
	render: () => (
		<main className="foundation-page">
			<FoundationHero
				eyebrow="LYDS typography"
				title="A voice for labels and long-form thought."
				description="One Traditional Chinese–ready sans, one editorial serif, and one precise monospace family form the system. Hierarchy comes from scale, weight, tracking, and numeric features—not an ever-growing font list."
			/>

			<FoundationSection title="System specimens">
				<div>
					{specimens.map(specimen => (
						<article className="type-specimen" key={specimen.label}>
							<div className="type-specimen__meta">
								<span className="foundation-label">{specimen.label}</span>
								<code className="foundation-code">{specimen.meta}</code>
							</div>
							<p className="type-specimen__sample" data-family={specimen.family} data-scale={specimen.scale}>
								{specimen.copy}
							</p>
						</article>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="Tabular numerals">
				<p className="foundation-section-copy">Dates, times, counters, and numeric fields use tabular numerals so adjacent values stay aligned when they change.</p>
				<div className="type-numeric-rack">
					{numericExamples.map(readout => (
						<div className="type-numeric-cell" key={readout.label}>
							<span className="foundation-label">{readout.label}</span>
							<strong>{readout.value}</strong>
						</div>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="Usage discipline">
				<div className="foundation-principle-grid">
					<article className="foundation-principle">
						<span className="foundation-kicker">Interface</span>
						<h3>Sans for clarity</h3>
						<p>Use GenKiGothicTW for controls, navigation, body copy, and dense operational views. Sentence case remains the default for readable UI.</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">Editorial</span>
						<h3>Serif for emphasis</h3>
						<p>Use GenKiMinTW selectively for narrative headings, quotations, or quiet moments. It should create contrast, not an alternate interface hierarchy.</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">Structured values</span>
						<h3>Mono for structured values</h3>
						<p>Use Geist Mono for codes, timestamps, serials, and changing numeric values. Keep tracking natural and never use it for body paragraphs.</p>
					</article>
				</div>
			</FoundationSection>
		</main>
	)
};
