import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from "react";

import styles from "./feedback.module.css";
import { mergeClassNames, type FeedbackStatus } from "./feedback.types";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	actions?: ReactNode;
	description?: ReactNode;
	eyebrow?: ReactNode;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	icon?: ReactNode;
	status?: FeedbackStatus;
	title: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
	{ actions, className, description, eyebrow, headingLevel = 2, icon, status = "neutral", title, ...props },
	ref
) {
	return (
		<div ref={ref} className={mergeClassNames(styles.emptyState, className)} data-status={status} {...props}>
			<div className={styles.emptyStateRail} aria-hidden="true">
				<span />
				<span />
				<span />
			</div>
			<div className={styles.emptyStateBody}>
				{icon ? (
					<div className={styles.emptyStateIcon} aria-hidden="true">
						{icon}
					</div>
				) : null}
				{eyebrow ? <div className={styles.emptyStateEyebrow}>{eyebrow}</div> : null}
				{createElement(`h${headingLevel}`, { className: styles.emptyStateTitle }, title)}
				{description ? <p className={styles.emptyStateDescription}>{description}</p> : null}
				{actions ? <div className={styles.emptyStateActions}>{actions}</div> : null}
			</div>
		</div>
	);
});
