import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes, type MouseEvent, type ReactNode } from "react";

import { cx } from "./utils.js";

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
	/** Accessible name for the breadcrumb landmark. */
	label?: string;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb({ className, label = "Breadcrumb", ...props }, ref) {
	return <nav ref={ref} aria-label={label} className={cx("lyds-breadcrumb", className)} {...props} />;
});

export const BreadcrumbList = forwardRef<HTMLOListElement, HTMLAttributes<HTMLOListElement>>(function BreadcrumbList({ className, ...props }, ref) {
	return <ol ref={ref} className={cx("lyds-breadcrumb__list", className)} {...props} />;
});

export const BreadcrumbItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function BreadcrumbItem({ className, ...props }, ref) {
	return <li ref={ref} className={cx("lyds-breadcrumb__item", className)} {...props} />;
});

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function BreadcrumbLink({ children, className, ...props }, ref) {
	return (
		<a ref={ref} className={cx("lyds-breadcrumb__link", className)} {...props}>
			{children}
		</a>
	);
});

export const BreadcrumbPage = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function BreadcrumbPage({ className, ...props }, ref) {
	return <span ref={ref} aria-current="page" className={cx("lyds-breadcrumb__page", className)} {...props} />;
});

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLSpanElement> {
	children?: ReactNode;
}

export const BreadcrumbSeparator = forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(function BreadcrumbSeparator({ children = "/", className, ...props }, ref) {
	return (
		<span ref={ref} aria-hidden="true" className={cx("lyds-breadcrumb__separator", className)} {...props}>
			{children}
		</span>
	);
});

export const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function BreadcrumbEllipsis({ className, children = "…", ...props }, ref) {
	return (
		<span ref={ref} aria-label="More pages" className={cx("lyds-breadcrumb__ellipsis", className)} {...props}>
			{children}
		</span>
	);
});

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
	/** Accessible name for the pagination landmark. */
	label?: string;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination({ className, label = "Pagination", ...props }, ref) {
	return <nav ref={ref} aria-label={label} className={cx("lyds-pagination", className)} {...props} />;
});

export const PaginationList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function PaginationList({ className, ...props }, ref) {
	return <ul ref={ref} className={cx("lyds-pagination__list", className)} {...props} />;
});

export const PaginationItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function PaginationItem({ className, ...props }, ref) {
	return <li ref={ref} className={cx("lyds-pagination__item", className)} {...props} />;
});

export interface PaginationLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	current?: boolean;
	disabled?: boolean;
}

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(function PaginationLink(
	{ children, className, current = false, disabled = false, href, onClick, tabIndex, ...props },
	ref
) {
	const interactionProps = {
		onClick: (event: MouseEvent<HTMLAnchorElement>) => {
			if (disabled) {
				event.preventDefault();
				return;
			}
			onClick?.(event);
		},
		tabIndex: disabled ? -1 : tabIndex
	};

	return (
		<a
			{...props}
			ref={ref}
			aria-current={current ? "page" : undefined}
			aria-disabled={disabled || undefined}
			className={cx("lyds-pagination__control", className)}
			data-current={current ? "" : undefined}
			data-disabled={disabled ? "" : undefined}
			href={disabled ? undefined : href}
			{...interactionProps}
		>
			{children}
		</a>
	);
});

export interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	current?: boolean;
}

export const PaginationButton = forwardRef<HTMLButtonElement, PaginationButtonProps>(function PaginationButton({ className, current = false, type = "button", ...props }, ref) {
	return <button ref={ref} aria-current={current ? "page" : undefined} className={cx("lyds-pagination__control", className)} data-current={current ? "" : undefined} type={type} {...props} />;
});

export const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationLinkProps>(function PaginationPrevious({ "aria-label": ariaLabel = "Previous page", children = "←", ...props }, ref) {
	return (
		<PaginationLink ref={ref} aria-label={ariaLabel} {...props}>
			{children}
		</PaginationLink>
	);
});

export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationLinkProps>(function PaginationNext({ "aria-label": ariaLabel = "Next page", children = "→", ...props }, ref) {
	return (
		<PaginationLink ref={ref} aria-label={ariaLabel} {...props}>
			{children}
		</PaginationLink>
	);
});

export const PaginationEllipsis = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function PaginationEllipsis(
	{ "aria-label": ariaLabel = "More pages", children = "…", className, ...props },
	ref
) {
	return (
		<span ref={ref} aria-label={ariaLabel} className={cx("lyds-pagination__ellipsis", className)} {...props}>
			{children}
		</span>
	);
});
