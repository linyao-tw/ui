import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from "react";

import type { HeadingLevel } from "@/components/foundations/section-heading";
import { cx } from "@/internal";
import { type FeedbackStatus } from "./feedback.types";
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
	actions?: ReactNode;
	description?: ReactNode;
	eyebrow?: ReactNode;
	headingLevel?: HeadingLevel;
	icon?: ReactNode;
	status?: FeedbackStatus;
	title: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
	{ actions, className, description, eyebrow, headingLevel = 2, icon, status = "neutral", title, ...props },
	ref
) {
	return (
		<div ref={ref} className={cx("lyds-empty-state", className)} data-status={status} {...props}>
			<div className={"lyds-empty-state__rail"} aria-hidden="true">
				<span />
				<span />
				<span />
			</div>
			<div className={"lyds-empty-state__body"}>
				{icon ? (
					<div className={"lyds-empty-state__icon"} aria-hidden="true">
						{icon}
					</div>
				) : null}
				{eyebrow ? <div className={"lyds-empty-state__eyebrow"}>{eyebrow}</div> : null}
				{createElement(`h${headingLevel}`, { className: "lyds-empty-state__title" }, title)}
				{description ? <p className={"lyds-empty-state__description"}>{description}</p> : null}
				{actions ? <div className={"lyds-empty-state__actions"}>{actions}</div> : null}
			</div>
		</div>
	);
});
