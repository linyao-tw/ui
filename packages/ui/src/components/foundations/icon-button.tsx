import { type AccessibleName, cx } from "@/internal";
import * as React from "react";
import { Button, type ButtonProps } from "./button";
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
