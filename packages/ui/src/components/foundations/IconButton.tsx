import * as React from "react";
import { cx } from "../../internal";
import { Button, type ButtonProps } from "./Button";
type AccessibleName =
	| {
			"aria-label": string;
			"aria-labelledby"?: string;
	  }
	| {
			"aria-label"?: string;
			"aria-labelledby": string;
	  };

type IconButtonBaseProps = Omit<ButtonProps, "aria-label" | "aria-labelledby" | "children" | "endIcon" | "startIcon"> & {
	children: React.ReactNode;
};

export type IconButtonProps = IconButtonBaseProps & AccessibleName;

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton({ children, className, loading = false, ...props }, ref) {
	return (
		<Button {...props} ref={ref} className={cx("lyds-icon-button", className)} loading={loading}>
			{loading ? null : children}
		</Button>
	);
});

IconButton.displayName = "IconButton";
