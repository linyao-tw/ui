import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { type ComponentRenderProp, type ElementProps, mergeClassNames } from "./shared";

export type SectionHeadingSize = "sm" | "md" | "lg";
export type SectionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export interface SectionHeadingState extends Record<string, unknown> {
	size: SectionHeadingSize;
}

export interface SectionHeadingProps extends Omit<ElementProps<"header">, "children" | "title"> {
	children: React.ReactNode;
	annotation?: React.ReactNode;
	description?: React.ReactNode;
	action?: React.ReactNode;
	level?: SectionHeadingLevel;
	size?: SectionHeadingSize;
	render?: ComponentRenderProp<SectionHeadingState>;
}

export const SectionHeading = React.forwardRef<HTMLElement, SectionHeadingProps>(function SectionHeading(
	{ children, annotation, description, action, level = 2, size = "md", render, className, ...props },
	ref
) {
	const HeadingTag = `h${level}` as const;

	return useRender<SectionHeadingState, HTMLElement>({
		defaultTagName: "header",
		ref,
		render,
		state: { size },
		props: {
			...props,
			className: mergeClassNames("lyds-section-heading", className),
			children: (
				<>
					<span className="lyds-section-heading__rail" aria-hidden="true" />
					<span className="lyds-section-heading__content">
						{annotation != null ? <span className="lyds-section-heading__annotation">{annotation}</span> : null}
						<HeadingTag className="lyds-section-heading__title">{children}</HeadingTag>
						{description != null ? <span className="lyds-section-heading__description">{description}</span> : null}
					</span>
					{action != null ? <span className="lyds-section-heading__action">{action}</span> : null}
				</>
			)
		}
	});
});

SectionHeading.displayName = "SectionHeading";
