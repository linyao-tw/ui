import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { type ComponentRenderProp, type ElementProps, mergeClassNames } from "./shared";

export type LinkVariant = "default" | "accent" | "subtle";
export type LinkSize = "sm" | "md" | "lg";

export interface LinkState extends Record<string, unknown> {
	disabled: boolean;
	external: boolean;
	size: LinkSize;
	variant: LinkVariant;
}

export interface LinkProps extends Omit<ElementProps<"a">, "children"> {
	children: React.ReactNode;
	variant?: LinkVariant;
	size?: LinkSize;
	disabled?: boolean;
	external?: boolean;
	render?: ComponentRenderProp<LinkState>;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
	{ children, variant = "default", size = "md", disabled = false, external = false, render, className, href, target, rel, onClick, ...props },
	ref
) {
	const state: LinkState = { disabled, external, size, variant };
	const secureRel = target === "_blank" && !rel ? "noopener noreferrer" : rel;

	return useRender<LinkState, HTMLAnchorElement>({
		defaultTagName: "a",
		ref,
		// A polymorphic render function or router component can reintroduce navigation.
		// Render a native, inert anchor whenever disabled so the contract is enforceable.
		render: disabled ? undefined : render,
		state,
		props: {
			...props,
			children,
			href: disabled ? undefined : href,
			target,
			rel: secureRel,
			"aria-disabled": disabled || undefined,
			tabIndex: disabled ? -1 : props.tabIndex,
			className: mergeClassNames("lyds-link", className),
			onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
				if (disabled) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}

				onClick?.(event);
			}
		}
	});
});

Link.displayName = "Link";
