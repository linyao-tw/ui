import { Meter as BaseMeter } from "@base-ui/react/meter";
import { forwardRef, type ReactNode } from "react";

import { cx } from "@/internal";
import { type FeedbackStatus } from "./feedback.types";
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
		<BaseMeter.Root ref={ref} className={cx("lyds-range", className)} data-status={status} {...props}>
			<div className={"lyds-range__header"}>
				<BaseMeter.Label className={"lyds-range__label"}>{label}</BaseMeter.Label>
				{showValue ? <BaseMeter.Value className={"lyds-range__value"} /> : null}
			</div>
			<BaseMeter.Track className={cx("lyds-range__track", trackClassName)}>
				<BaseMeter.Indicator className={cx("lyds-range__indicator", indicatorClassName)} />
			</BaseMeter.Track>
		</BaseMeter.Root>
	);
});
