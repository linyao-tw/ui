import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const specimens = [
	{
		family: "sans",
		scale: "display",
		label: "Display / Sans",
		meta: "GenKiGothicTW · Bold",
		copy: "精密構造 / 2048"
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
		copy: "LYDS combines the discipline of an instrument panel with the clarity required by everyday application interfaces. 中文段落維持清楚節奏，長內容不因造型而犧牲可讀性。"
	},
	{
		family: "mono",
		scale: "technical",
		label: "Readout / Mono",
		meta: "Geist Mono · Medium",
		copy: "T–04 / 2026-08-31 / 23:48:06"
	}
] as const;

const numericReadouts = [
	{ label: "DATE", value: "2026.08.31" },
	{ label: "TIME", value: "23:48:06" },
	{ label: "COUNT", value: "0042" },
	{ label: "LOAD", value: "87.5%" }
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
				eyebrow="LYDS / TYPOGRAPHY"
				title="A voice for labels and long-form thought."
				description="One Traditional Chinese–ready sans, one editorial serif, and one precise monospace family form the system. Hierarchy comes from scale, weight, tracking, and numeric features—not an ever-growing font list."
				readouts={[
					{ value: "03", label: "font families" },
					{ value: "09", label: "size steps" },
					{ value: "TNUM", label: "numeric feature" }
				]}
			/>

			<FoundationSection number="01" title="System specimens">
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

			<FoundationSection number="02" title="Tabular readouts">
				<p className="foundation-section-copy">Dates, times, counters, and technical measures use tabular numerals so adjacent values stay aligned when they change.</p>
				<div className="type-numeric-rack">
					{numericReadouts.map(readout => (
						<div className="type-numeric-cell" key={readout.label}>
							<span className="foundation-label">{readout.label}</span>
							<strong>{readout.value}</strong>
						</div>
					))}
				</div>
			</FoundationSection>

			<FoundationSection number="03" title="Usage discipline">
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
						<span className="foundation-kicker">Technical</span>
						<h3>Mono for structured values</h3>
						<p>Use Geist Mono for codes, timestamps, serials, and compact labels. Technical tracking is useful in short labels but harmful in paragraphs.</p>
					</article>
				</div>
			</FoundationSection>
		</main>
	)
};
