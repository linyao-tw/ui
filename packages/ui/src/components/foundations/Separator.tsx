import { Separator as BaseSeparator, type SeparatorProps as BaseSeparatorProps } from "@base-ui/react/separator";
import * as React from "react";
import { mergeClassNames } from "./shared";

export type SeparatorVariant = "solid" | "technical";
export type SeparatorSpacing = "none" | "sm" | "md" | "lg";

export interface SeparatorProps extends Omit<BaseSeparatorProps, "className" | "style"> {
	variant?: SeparatorVariant;
	spacing?: SeparatorSpacing;
	className?: string;
	style?: React.CSSProperties;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator({ variant = "solid", spacing = "md", orientation = "horizontal", className, style, ...props }, ref) {
	return <BaseSeparator {...props} ref={ref} orientation={orientation} data-variant={variant} data-spacing={spacing} className={mergeClassNames("lyds-separator", className)} style={style} />;
});

Separator.displayName = "Separator";
