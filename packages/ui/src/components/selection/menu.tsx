import { ContextMenu as BaseContextMenu, type ContextMenuTriggerProps } from "@base-ui/react/context-menu";
import {
	Menu as BaseMenu,
	type MenuCheckboxItemIndicatorProps,
	type MenuCheckboxItemProps,
	type MenuGroupLabelProps,
	type MenuItemProps,
	type MenuLinkItemProps,
	type MenuPopupProps,
	type MenuPositionerProps,
	type MenuRadioItemIndicatorProps,
	type MenuRadioItemProps,
	type MenuSubmenuTriggerProps,
	type MenuTriggerProps
} from "@base-ui/react/menu";
import { Separator as BaseSeparator, type SeparatorProps } from "@base-ui/react/separator";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CircleIcon } from "@phosphor-icons/react/dist/csr/Circle";
import { forwardRef } from "react";

import { mergeStateClassName } from "./classnames";
import styles from "./selection.module.css";

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(function MenuTrigger({ className, ...props }, ref) {
	return <BaseMenu.Trigger {...props} className={mergeStateClassName(styles.menuTrigger, className)} ref={ref} />;
});

export const MenuPositioner = forwardRef<HTMLDivElement, MenuPositionerProps>(function MenuPositioner({ className, ...props }, ref) {
	return <BaseMenu.Positioner {...props} className={mergeStateClassName(styles.positioner, className)} ref={ref} />;
});

export const MenuPopup = forwardRef<HTMLDivElement, MenuPopupProps>(function MenuPopup({ className, ...props }, ref) {
	return <BaseMenu.Popup {...props} className={mergeStateClassName(styles.menuPopup, className)} ref={ref} />;
});

export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(function MenuItem({ className, ...props }, ref) {
	return <BaseMenu.Item {...props} className={mergeStateClassName(styles.menuItem, className)} ref={ref} />;
});

export const MenuLinkItem = forwardRef<HTMLAnchorElement, MenuLinkItemProps>(function MenuLinkItem({ className, ...props }, ref) {
	return <BaseMenu.LinkItem {...props} className={mergeStateClassName(styles.menuItem, className)} ref={ref} />;
});

export const MenuCheckboxItem = forwardRef<HTMLElement, MenuCheckboxItemProps>(function MenuCheckboxItem({ className, ...props }, ref) {
	return <BaseMenu.CheckboxItem {...props} className={mergeStateClassName(styles.menuItem, className)} ref={ref} />;
});

export const MenuCheckboxItemIndicator = forwardRef<HTMLSpanElement, MenuCheckboxItemIndicatorProps>(function MenuCheckboxItemIndicator({ children, className, ...props }, ref) {
	return (
		<BaseMenu.CheckboxItemIndicator {...props} className={mergeStateClassName(styles.menuItemIndicator, className)} ref={ref}>
			{children ?? <CheckIcon aria-hidden="true" weight="bold" />}
		</BaseMenu.CheckboxItemIndicator>
	);
});

export const MenuRadioItem = forwardRef<HTMLElement, MenuRadioItemProps>(function MenuRadioItem({ className, ...props }, ref) {
	return <BaseMenu.RadioItem {...props} className={mergeStateClassName(styles.menuItem, className)} ref={ref} />;
});

export const MenuRadioItemIndicator = forwardRef<HTMLSpanElement, MenuRadioItemIndicatorProps>(function MenuRadioItemIndicator({ children, className, ...props }, ref) {
	return (
		<BaseMenu.RadioItemIndicator {...props} className={mergeStateClassName(styles.menuItemIndicator, className)} ref={ref}>
			{children ?? <CircleIcon aria-hidden="true" weight="fill" />}
		</BaseMenu.RadioItemIndicator>
	);
});

export const MenuGroupLabel = forwardRef<HTMLDivElement, MenuGroupLabelProps>(function MenuGroupLabel({ className, ...props }, ref) {
	return <BaseMenu.GroupLabel {...props} className={mergeStateClassName(styles.groupLabel, className)} ref={ref} />;
});

export const MenuSeparator = forwardRef<HTMLDivElement, SeparatorProps>(function MenuSeparator({ className, ...props }, ref) {
	return <BaseSeparator {...props} className={mergeStateClassName(styles.separator, className)} ref={ref} />;
});

export const MenuSubmenuTrigger = forwardRef<HTMLElement, MenuSubmenuTriggerProps>(function MenuSubmenuTrigger({ className, ...props }, ref) {
	return <BaseMenu.SubmenuTrigger {...props} className={mergeStateClassName(styles.menuItem, className)} ref={ref} />;
});

const menuParts = {
	Arrow: BaseMenu.Arrow,
	Backdrop: BaseMenu.Backdrop,
	CheckboxItem: MenuCheckboxItem,
	CheckboxItemIndicator: MenuCheckboxItemIndicator,
	Group: BaseMenu.Group,
	GroupLabel: MenuGroupLabel,
	Handle: BaseMenu.Handle,
	Item: MenuItem,
	LinkItem: MenuLinkItem,
	Popup: MenuPopup,
	Portal: BaseMenu.Portal,
	Positioner: MenuPositioner,
	RadioGroup: BaseMenu.RadioGroup,
	RadioItem: MenuRadioItem,
	RadioItemIndicator: MenuRadioItemIndicator,
	Root: BaseMenu.Root,
	Separator: MenuSeparator,
	SubmenuRoot: BaseMenu.SubmenuRoot,
	SubmenuTrigger: MenuSubmenuTrigger,
	Trigger: MenuTrigger,
	Viewport: BaseMenu.Viewport,
	createHandle: BaseMenu.createHandle
} as const;

/** A button-triggered application menu. */
export const DropdownMenu = menuParts;

/** Alias for DropdownMenu, matching the Base UI glossary name. */
export const Menu = menuParts;

export const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(function ContextMenuTrigger({ className, ...props }, ref) {
	return <BaseContextMenu.Trigger {...props} className={mergeStateClassName(styles.contextTrigger, className)} ref={ref} />;
});

export const ContextMenu = {
	Arrow: BaseContextMenu.Arrow,
	Backdrop: BaseContextMenu.Backdrop,
	CheckboxItem: MenuCheckboxItem,
	CheckboxItemIndicator: MenuCheckboxItemIndicator,
	Group: BaseContextMenu.Group,
	GroupLabel: MenuGroupLabel,
	Item: MenuItem,
	LinkItem: MenuLinkItem,
	Popup: MenuPopup,
	Portal: BaseContextMenu.Portal,
	Positioner: MenuPositioner,
	RadioGroup: BaseContextMenu.RadioGroup,
	RadioItem: MenuRadioItem,
	RadioItemIndicator: MenuRadioItemIndicator,
	Root: BaseContextMenu.Root,
	Separator: MenuSeparator,
	SubmenuRoot: BaseContextMenu.SubmenuRoot,
	SubmenuTrigger: MenuSubmenuTrigger,
	Trigger: ContextMenuTrigger
} as const;
