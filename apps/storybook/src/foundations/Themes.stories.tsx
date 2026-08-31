import { Badge, Button, Card, CardBody, CardDescription, CardHeader, CardTitle, Switch } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const themeSamples = [
	{ theme: "light", name: "Light material", code: "LIMESTONE / DAY" },
	{ theme: "dark", name: "Low-light material", code: "CHARCOAL / NIGHT" }
] as const;

const meta = {
	title: "Foundations/Themes",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightAndDark: Story = {
	render: () => (
		<main className="foundation-page">
			<FoundationHero
				eyebrow="LYDS / THEMES"
				title="The same machine in two conditions."
				description="Light and dark themes preserve material warmth, depth hierarchy, and Vermilion signaling. Dark mode is designed as a low-light operating condition—not a mathematical inversion."
				readouts={[
					{ value: "02", label: "theme modes" },
					{ value: "01", label: "semantic contract" },
					{ value: "AA", label: "interactive text" }
				]}
			/>

			<FoundationSection number="01" title="Theme comparison">
				<div className="foundation-theme-grid">
					{themeSamples.map(sample => (
						<section className="foundation-theme-sample" data-lyds-theme={sample.theme} key={sample.theme}>
							<header className="foundation-theme-sample__header">
								<div>
									<span className="foundation-theme-code">{sample.code}</span>
									<h3>{sample.name}</h3>
								</div>
								<Badge variant="accent">Signal online</Badge>
							</header>
							<Card variant="inset">
								<CardHeader>
									<CardTitle>Transit control</CardTitle>
									<CardDescription>Semantic roles preserve the hierarchy across both material conditions.</CardDescription>
								</CardHeader>
								<CardBody>
									<div className="foundation-theme-sample__panel">
										<span className="foundation-label">SECTION 04 / POWER</span>
										<p>Primary text stays readable while inset seams and dividers retain physical depth.</p>
										<div className="foundation-theme-sample__controls">
											<Switch defaultChecked aria-label={`${sample.name} power control`} />
											<Button size="sm">Confirm state</Button>
										</div>
									</div>
								</CardBody>
							</Card>
						</section>
					))}
				</div>
			</FoundationSection>

			<FoundationSection number="02" title="Theme authoring contract">
				<div className="foundation-principle-grid">
					<article className="foundation-principle">
						<span className="foundation-kicker">Set</span>
						<h3>One explicit attribute</h3>
						<p>Set data-lyds-theme to light or dark on a root element. Nested themed regions work because tokens are scoped by the nearest theme attribute.</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">Use</span>
						<h3>Consume semantic roles</h3>
						<p>Application and component CSS should use roles such as Background/Main and Text/Title, serialized as deterministic custom properties.</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">Extend</span>
						<h3>Override complete pairs</h3>
						<p>When creating a product theme, update foreground, background, border, focus, and state pairs together. A single accent override is not a complete theme.</p>
					</article>
				</div>
			</FoundationSection>
		</main>
	)
};
