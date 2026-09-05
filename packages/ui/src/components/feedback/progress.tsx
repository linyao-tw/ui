import { Progress as BaseProgress } from "@base-ui/react/progress";
import { forwardRef, type ReactNode } from "react";

import { cx } from "@/internal";
import { type FeedbackStatus } from "./feedback.types";
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
		<BaseProgress.Root ref={ref} className={cx("lyds-range", className)} data-status={status} {...props}>
			<div className={"lyds-range__header"}>
				<BaseProgress.Label className={"lyds-range__label"}>{label}</BaseProgress.Label>
				{showValue ? <BaseProgress.Value className={"lyds-range__value"} /> : null}
			</div>
			<BaseProgress.Track className={cx("lyds-range__track", trackClassName)}>
				<BaseProgress.Indicator className={cx("lyds-range__indicator", indicatorClassName)} />
			</BaseProgress.Track>
		</BaseProgress.Root>
	);
});
