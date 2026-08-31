import { Progress as BaseProgress } from "@base-ui/react/progress";
import { forwardRef, type ReactNode } from "react";

import styles from "./feedback.module.css";
import { mergeClassNames, type FeedbackStatus } from "./feedback.types";

export interface ProgressProps extends Omit<BaseProgress.Root.Props, "children" | "className"> {
	label: ReactNode;
	className?: string;
	trackClassName?: string;
	indicatorClassName?: string;
	status?: FeedbackStatus;
	showValue?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress({ className, indicatorClassName, label, showValue = true, status = "neutral", trackClassName, ...props }, ref) {
	return (
		<BaseProgress.Root ref={ref} className={mergeClassNames(styles.rangeRoot, className)} data-status={status} {...props}>
			<div className={styles.rangeHeader}>
				<BaseProgress.Label className={styles.rangeLabel}>{label}</BaseProgress.Label>
				{showValue ? <BaseProgress.Value className={styles.rangeValue} /> : null}
			</div>
			<BaseProgress.Track className={mergeClassNames(styles.rangeTrack, trackClassName)}>
				<BaseProgress.Indicator className={mergeClassNames(styles.rangeIndicator, indicatorClassName)} />
			</BaseProgress.Track>
		</BaseProgress.Root>
	);
});
