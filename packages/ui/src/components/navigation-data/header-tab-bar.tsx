import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type LiHTMLAttributes, type MouseEvent } from "react";

import { cx } from "../../internal";
export const Header = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Header({ className, ...props }, ref) {
	return <header ref={ref} className={cx("lyds-header", className)} {...props} />;
});

export const HeaderRail = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function HeaderRail({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-header__rail", className)} {...props} />;
});

export const HeaderBrand = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function HeaderBrand({ children, className, ...props }, ref) {
	return (
		<a ref={ref} className={cx("lyds-header__brand", className)} {...props}>
			{children}
		</a>
	);
});

export interface HeaderNavProps extends HTMLAttributes<HTMLElement> {
	label?: string;
}

export const HeaderNav = forwardRef<HTMLElement, HeaderNavProps>(function HeaderNav({ className, label = "主要導覽", ...props }, ref) {
	return <nav ref={ref} aria-label={label} className={cx("lyds-header__nav", className)} {...props} />;
});

export const HeaderActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function HeaderActions({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-header__actions", className)} {...props} />;
});

export const HeaderStatus = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function HeaderStatus({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-header__status", className)} {...props} />;
});

export interface TabBarProps extends HTMLAttributes<HTMLElement> {
	label?: string;
}

export const TabBar = forwardRef<HTMLElement, TabBarProps>(function TabBar({ className, label = "應用程式區段", ...props }, ref) {
	return <nav ref={ref} aria-label={label} className={cx("lyds-tab-bar", className)} {...props} />;
});

export const TabBarList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function TabBarList({ className, ...props }, ref) {
	return <ul ref={ref} className={cx("lyds-tab-bar__list", className)} {...props} />;
});

export const TabBarItem = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function TabBarItem({ className, ...props }, ref) {
	return <li ref={ref} className={cx("lyds-tab-bar__item", className)} {...props} />;
});

export interface TabBarLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	selected?: boolean;
	disabled?: boolean;
}

export const TabBarLink = forwardRef<HTMLAnchorElement, TabBarLinkProps>(function TabBarLink({ children, className, selected = false, disabled = false, href, onClick, tabIndex, ...props }, ref) {
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
			aria-current={selected ? "page" : undefined}
			aria-disabled={disabled || undefined}
			className={cx("lyds-tab-bar__link", className)}
			data-disabled={disabled ? "" : undefined}
			data-selected={selected ? "" : undefined}
			href={disabled ? undefined : href}
			{...interactionProps}
		>
			{children}
		</a>
	);
});

export const TabBarIcon = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function TabBarIcon({ className, ...props }, ref) {
	return <span ref={ref} aria-hidden="true" className={cx("lyds-tab-bar__icon", className)} {...props} />;
});

export const TabBarLabel = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(function TabBarLabel({ className, ...props }, ref) {
	return <span ref={ref} className={cx("lyds-tab-bar__label", className)} {...props} />;
});
