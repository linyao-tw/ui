import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type CSSProperties } from "react";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

type FoundationStyle = CSSProperties & Record<`--foundation-${string}`, string>;

const easingCurves = [
	{
		name: "Out",
		description: "Entrances and responsive settling",
		value: "var(--motion-ease-out)"
	},
	{
		name: "InOut",
		description: "Reversible layout changes",
		value: "var(--motion-ease-in-out)"
	},
	{
		name: "In",
		description: "Short exits that clear the stage",
		value: "var(--motion-ease-in)"
	},
	{
		name: "Snap",
		description: "Tiny toggles and confirmations only",
		value: "var(--motion-ease-snap)"
	},
	{
		name: "Mechanical",
		description: "Decorative indicators, never essential motion",
		value: "var(--motion-ease-mechanical)"
	}
] as const;

const durations = [
	{ name: "Instant", token: "Motion/Duration/Instant", value: "0ms", duration: "var(--motion-duration-instant)", instant: true },
	{ name: "Fast", token: "Motion/Duration/Fast", value: "120ms", duration: "var(--motion-duration-fast)", instant: false },
	{ name: "Normal", token: "Motion/Duration/Normal", value: "220ms", duration: "var(--motion-duration-normal)", instant: false },
	{ name: "Slow", token: "Motion/Duration/Slow", value: "360ms", duration: "var(--motion-duration-slow)", instant: false }
] as const;

const meta = {
	title: "Foundations/Motion",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function MotionCurveDemo({ description, name, value }: (typeof easingCurves)[number]) {
	const [atEnd, setAtEnd] = useState(false);

	return (
		<button
			className="foundation-motion-row"
			data-position={atEnd ? "end" : "start"}
			onClick={() => setAtEnd(current => !current)}
			style={{ "--foundation-motion-ease": value } as FoundationStyle}
			type="button"
		>
			<span className="foundation-motion-row__meta">
				<strong className="foundation-motion-name">Motion/Ease/{name}</strong>
				<span className="foundation-code">{description}</span>
			</span>
			<span className="foundation-motion-track" aria-hidden="true">
				<span className="foundation-motion-marker" />
			</span>
		</button>
	);
}

export const MotionVocabulary: Story = {
	render: () => (
		<main className="foundation-page">
			<FoundationHero
				eyebrow="LYDS / MOTION"
				title="Movement with mechanical intent."
				description="A compact motion vocabulary creates continuity without turning the interface into spectacle. Timing belongs to the system, and reduced-motion preferences remove nonessential travel."
				readouts={[
					{ value: "05", label: "easing curves" },
					{ value: "04", label: "core durations" },
					{ value: "RM", label: "reduced motion" }
				]}
			/>

			<FoundationSection number="01" title="Easing curves">
				<p className="foundation-section-copy">Activate any track with pointer or keyboard to compare how the same distance feels under each tokenized curve.</p>
				<div className="foundation-motion-list">
					{easingCurves.map(curve => (
						<MotionCurveDemo {...curve} key={curve.name} />
					))}
				</div>
			</FoundationSection>

			<FoundationSection number="02" title="Duration scale">
				<div className="foundation-duration-grid">
					{durations.map(duration => (
						<article className="foundation-duration" data-instant={duration.instant} key={duration.name} style={{ "--foundation-motion-duration": duration.duration } as FoundationStyle}>
							<div className="foundation-duration__bar" aria-hidden="true" />
							<div>
								<strong className="foundation-token-name">{duration.token}</strong>
								<code className="foundation-code">{duration.value}</code>
							</div>
						</article>
					))}
				</div>
			</FoundationSection>

			<FoundationSection number="03" title="Application rules">
				<div className="foundation-principle-grid">
					<article className="foundation-principle">
						<span className="foundation-kicker">Default</span>
						<h3>Fast, direct feedback</h3>
						<p>Hover, press, focus, and compact selection feedback should resolve quickly. Use ordinary CSS transitions and a named duration/easing pair.</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">Scale</span>
						<h3>Overshoot stays small</h3>
						<p>Snap belongs to knobs, toggles, and tiny confirmations. Dialogs, drawers, and reading surfaces use restrained non-overshooting curves.</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">Access</span>
						<h3>Preference is authoritative</h3>
						<p>Under reduced motion, remove travel and repetition that is not necessary to understand state. Never hide state changes themselves.</p>
					</article>
				</div>
			</FoundationSection>
		</main>
	)
};
