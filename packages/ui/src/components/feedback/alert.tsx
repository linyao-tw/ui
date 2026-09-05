import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "../../internal";
import styles from "./feedback.module.css";
import { getLiveRegionProps, type FeedbackLiveMode, type FeedbackStatus } from "./feedback.types";
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * 控制語意狀態色盤。此屬性不會讓 Alert 成為即時區域；
	 * 僅在內容動態加入或更新時設定 `live`。
	 */
	status?: FeedbackStatus;
	/**
	 * 動態回饋的播報方式。靜態 Alert 預設為 `off`，
	 * 避免頁面載入時不必要的播報。
	 */
	live?: FeedbackLiveMode;
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert({ "aria-live": ariaLive, className, live = "off", role, status = "neutral", ...props }, ref) {
	const liveRegionProps = getLiveRegionProps(live);

	return (
		<div
			ref={ref}
			className={cx(styles.feedbackPanel, styles.alert, className)}
			data-status={status}
			role={role ?? liveRegionProps.role}
			aria-live={ariaLive ?? liveRegionProps["aria-live"]}
			{...props}
		/>
	);
});

/** Alert 元件的別名。 */
export const AlertView = Alert;

export const AlertContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertContent({ className, ...props }, ref) {
	return <div ref={ref} className={cx(styles.feedbackContent, className)} {...props} />;
});

export const AlertTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertTitle({ className, ...props }, ref) {
	return <div ref={ref} className={cx(styles.feedbackTitle, className)} {...props} />;
});

export const AlertDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function AlertDescription({ className, ...props }, ref) {
	return <p ref={ref} className={cx(styles.feedbackDescription, className)} {...props} />;
});

export const AlertActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AlertActions({ className, ...props }, ref) {
	return <div ref={ref} className={cx(styles.feedbackActions, className)} {...props} />;
});
