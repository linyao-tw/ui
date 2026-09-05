import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { type ComponentRenderProp, cx, type ElementProps } from "../../internal";
export type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger";
export type BadgeSize = "sm" | "md";

export interface BadgeState extends Record<string, unknown> {
	size: BadgeSize;
	variant: BadgeVariant;
}

export interface BadgeProps extends Omit<ElementProps<"span">, "children"> {
	children: React.ReactNode;
	variant?: BadgeVariant;
	size?: BadgeSize;
	render?: ComponentRenderProp<BadgeState>;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ children, variant = "neutral", size = "md", render, className, ...props }, ref) {
	return useRender<BadgeState, HTMLSpanElement>({
		defaultTagName: "span",
		ref,
		render,
		state: { size, variant },
		props: {
			...props,
			children: (
				<>
					<span className="lyds-badge__indicator" aria-hidden="true" />
					<span className="lyds-badge__label">{children}</span>
				</>
			),
			className: cx("lyds-badge", className)
		}
	});
});

Badge.displayName = "Badge";
