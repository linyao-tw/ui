import type { ReactNode } from "react";

interface FoundationHeroProps {
	eyebrow: string;
	title: string;
	description: string;
	readouts: readonly { label: string; value: string }[];
}

export function FoundationHero({ eyebrow, title, description, readouts }: FoundationHeroProps) {
	return (
		<header className="foundation-hero">
			<div className="foundation-hero__copy">
				<span className="foundation-eyebrow">{eyebrow}</span>
				<h1>{title}</h1>
				<p>{description}</p>
			</div>
			<div className="foundation-hero__aside" aria-label="System summary">
				{readouts.map(readout => (
					<div className="foundation-readout" key={readout.label}>
						<div>
							<strong>{readout.value}</strong>
							<span>{readout.label}</span>
						</div>
					</div>
				))}
			</div>
		</header>
	);
}

interface FoundationSectionProps {
	children: ReactNode;
	number: string;
	title: string;
}

export function FoundationSection({ children, number, title }: FoundationSectionProps) {
	return (
		<section className="foundation-section">
			<header className="foundation-section-heading">
				<span className="foundation-section-number" aria-hidden="true">
					{number}
				</span>
				<h2>{title}</h2>
			</header>
			{children}
		</section>
	);
}
