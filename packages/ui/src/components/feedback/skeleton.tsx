import { forwardRef, type HTMLAttributes } from "react";

import styles from "./feedback.module.css";
import { mergeClassNames } from "./feedback.types";

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, "aria-hidden" | "children"> {
	shape?: "text" | "rectangular" | "circular";
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton({ className, shape = "text", ...props }, ref) {
	return <span ref={ref} aria-hidden="true" className={mergeClassNames(styles.skeleton, className)} data-shape={shape} {...props} />;
});
