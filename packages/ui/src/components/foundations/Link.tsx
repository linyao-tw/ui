import { type ComponentRenderProp, cx, type ElementProps } from "@/internal";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
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
		// 多型 `render` 函式或路由元件可能重新加入導覽行為。
		// 停用時改用無互動的原生連結，確保元件契約成立。
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
			className: cx("lyds-link", className),
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
