import { Meter as BaseMeter } from "@base-ui/react/meter";
import { forwardRef, type ReactNode } from "react";

import styles from "./feedback.module.css";
import { mergeClassNames, type FeedbackStatus } from "./feedback.types";

export interface MeterProps extends Omit<BaseMeter.Root.Props, "children" | "className"> {
	label: ReactNode;
	className?: string;
	trackClassName?: string;
	indicatorClassName?: string;
	status?: FeedbackStatus;
	showValue?: boolean;
}

export const Meter = forwardRef<HTMLDivElement, MeterProps>(function Meter({ className, indicatorClassName, label, showValue = true, status = "neutral", trackClassName, ...props }, ref) {
	return (
		<BaseMeter.Root ref={ref} className={mergeClassNames(styles.rangeRoot, className)} data-status={status} {...props}>
			<div className={styles.rangeHeader}>
				<BaseMeter.Label className={styles.rangeLabel}>{label}</BaseMeter.Label>
				{showValue ? <BaseMeter.Value className={styles.rangeValue} /> : null}
			</div>
			<BaseMeter.Track className={mergeClassNames(styles.rangeTrack, trackClassName)}>
				<BaseMeter.Indicator className={mergeClassNames(styles.rangeIndicator, indicatorClassName)} />
			</BaseMeter.Track>
		</BaseMeter.Root>
	);
});
