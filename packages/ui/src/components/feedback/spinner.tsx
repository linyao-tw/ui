import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import styles from "./feedback.module.css";
import { mergeClassNames, type FeedbackStatus } from "./feedback.types";

type SpinnerAccessibilityProps =
	| {
			/** Hides the spinner from assistive technology when nearby text already describes loading. */
			decorative: true;
			label?: never;
	  }
	| {
			decorative?: false;
			/** Accessible name announced by the status region. */
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
			className={mergeClassNames(styles.spinner, className)}
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
		<div ref={ref} aria-live="polite" className={mergeClassNames(styles.loader, className)} data-status={status} role="status" {...props}>
			<Spinner decorative size={size} status={status} />
			<span>{label}</span>
		</div>
	);
});
