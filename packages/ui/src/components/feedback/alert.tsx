import { forwardRef, type HTMLAttributes } from "react";

import styles from "./feedback.module.css";
import { getLiveRegionProps, mergeClassNames, type FeedbackLiveMode, type FeedbackStatus } from "./feedback.types";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * Controls the semantic status palette. This does not make the alert a live
	 * region; set `live` only when content is inserted or updated dynamically.
	 */
	status?: FeedbackStatus;
	/**
	 * Announcement behavior for dynamic feedback. Static alerts default to
	 * `off` so page-load content is not unnecessarily announced.
	 */
	live?: FeedbackLiveMode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({ "aria-live": ariaLive, className, live = "off", role, status = "neutral", ...props }, ref) {
	const liveRegionProps = getLiveRegionProps(live);

	return (
		<div
			ref={ref}
			className={mergeClassNames(styles.feedbackPanel, styles.alert, className)}
			data-status={status}
			role={role ?? liveRegionProps.role}
			aria-live={ariaLive ?? liveRegionProps["aria-live"]}
			{...props}
		/>
	);
});

/** Modulor-compatible name for the same composable alert surface. */
export const AlertView = Alert;

export const AlertContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertContent({ className, ...props }, ref) {
	return <div ref={ref} className={mergeClassNames(styles.feedbackContent, className)} {...props} />;
});

export const AlertTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertTitle({ className, ...props }, ref) {
	return <div ref={ref} className={mergeClassNames(styles.feedbackTitle, className)} {...props} />;
});

export const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function AlertDescription({ className, ...props }, ref) {
	return <p ref={ref} className={mergeClassNames(styles.feedbackDescription, className)} {...props} />;
});

export const AlertActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertActions({ className, ...props }, ref) {
	return <div ref={ref} className={mergeClassNames(styles.feedbackActions, className)} {...props} />;
});
