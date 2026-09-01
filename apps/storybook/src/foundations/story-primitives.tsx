import type { ReactNode } from "react";

interface FoundationHeroProps {
	title: string;
	description: string;
}

export function FoundationHero({ title, description }: FoundationHeroProps) {
	return (
		<header className="foundation-hero">
			<div className="foundation-hero__copy">
				<h1>{title}</h1>
				<p>{description}</p>
			</div>
		</header>
	);
}

interface FoundationSectionProps {
	children: ReactNode;
	title: string;
}

export function FoundationSection({ children, title }: FoundationSectionProps) {
	return (
		<section className="foundation-section">
			<header className="foundation-section-heading">
				<h2>{title}</h2>
			</header>
			{children}
		</section>
	);
}
