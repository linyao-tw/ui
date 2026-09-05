import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "@/internal";
import { type FeedbackStatus } from "./feedback.types";
type SpinnerAccessibilityProps =
	| {
			/** 附近已有載入說明文字時，對輔助科技隱藏 Spinner。 */
			decorative: true;
			label?: never;
	  }
	| {
			decorative?: false;
			/** 由狀態區域播報的無障礙名稱。 */
			label: string;
	  };

export type SpinnerProps = Omit<HTMLAttributes<HTMLSpanElement>, "aria-hidden" | "aria-label" | "children" | "role"> &
	SpinnerAccessibilityProps & {
		size?: "sm" | "md" | "lg";
		status?: FeedbackStatus;
	};

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner({ className, decorative = false, label, size = "md", status = "neutral", ...props }, ref) {
	return (
		<span
			ref={ref}
			aria-hidden={decorative ? "true" : undefined}
			aria-label={decorative ? undefined : label}
			className={cx("lyds-spinner", className)}
			data-size={size}
			data-status={status}
			role={decorative ? undefined : "status"}
			{...props}
		/>
	);
});

export interface LoaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
	label: ReactNode;
	size?: "sm" | "md" | "lg";
	status?: FeedbackStatus;
}

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(function Loader({ className, label, size = "md", status = "neutral", ...props }, ref) {
	return (
		<div ref={ref} aria-live="polite" className={cx("lyds-loader", className)} data-status={status} role="status" {...props}>
			<Spinner decorative size={size} status={status} />
			<span>{label}</span>
		</div>
	);
});
