import { forwardRef, type HTMLAttributes } from "react";

import styles from "./feedback.module.css";
import { getLiveRegionProps, mergeClassNames, type FeedbackLiveMode, type FeedbackStatus } from "./feedback.types";

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
	status?: FeedbackStatus;
	/** 僅在 Banner 動態出現時使用 `polite` 或 `assertive`。 */
	live?: FeedbackLiveMode;
}

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner({ "aria-live": ariaLive, className, live = "off", role, status = "neutral", ...props }, ref) {
	const liveRegionProps = getLiveRegionProps(live);

	return (
		<div
			ref={ref}
			className={mergeClassNames(styles.feedbackPanel, styles.banner, className)}
			data-status={status}
			role={role ?? liveRegionProps.role}
			aria-live={ariaLive ?? liveRegionProps["aria-live"]}
			{...props}
		/>
	);
});
