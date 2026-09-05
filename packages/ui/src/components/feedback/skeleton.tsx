import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "@/internal";
import styles from "./feedback.module.css";
export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, "aria-hidden" | "children"> {
	shape?: "text" | "rectangular" | "circular";
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton({ className, shape = "text", ...props }, ref) {
	return <span ref={ref} aria-hidden="true" className={cx(styles.skeleton, className)} data-shape={shape} {...props} />;
});
