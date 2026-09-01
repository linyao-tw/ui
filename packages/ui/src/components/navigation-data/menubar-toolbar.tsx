import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Menubar as BaseMenubar } from "@base-ui/react/menubar";
import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { CircleIcon } from "@phosphor-icons/react/dist/csr/Circle";
import { forwardRef, type ComponentRef, type ForwardedRef, type ReactElement, type RefAttributes } from "react";

import { withBaseClass } from "./utils.js";

export const Menubar = forwardRef<ComponentRef<typeof BaseMenubar>, BaseMenubar.Props>(function Menubar(props, ref) {
	const { className, ...menubarProps } = props;
	return <BaseMenubar ref={ref} className={withBaseClass<BaseMenubar.State>("lyds-menubar", className)} {...menubarProps} />;
});

export function MenubarMenu<Payload = unknown>(props: BaseMenu.Root.Props<Payload>) {
	return <BaseMenu.Root {...props} />;
}

function MenubarTriggerInner<Payload = unknown>(props: BaseMenu.Trigger.Props<Payload>, ref: ForwardedRef<HTMLButtonElement>) {
	const { className, ...triggerProps } = props;
	return <BaseMenu.Trigger ref={ref} className={withBaseClass<BaseMenu.Trigger.State>("lyds-menubar__trigger", className)} {...triggerProps} />;
}

export const MenubarTrigger = forwardRef(MenubarTriggerInner) as <Payload = unknown>(props: BaseMenu.Trigger.Props<Payload> & RefAttributes<HTMLButtonElement>) => ReactElement;

export const MenubarPortal = BaseMenu.Portal;

export const MenubarPositioner = forwardRef<ComponentRef<typeof BaseMenu.Positioner>, BaseMenu.Positioner.Props>(function MenubarPositioner(props, ref) {
	const { className, sideOffset = 6, ...positionerProps } = props;
	return <BaseMenu.Positioner ref={ref} className={withBaseClass<BaseMenu.Positioner.State>("lyds-menubar__positioner", className)} sideOffset={sideOffset} {...positionerProps} />;
});

export const MenubarPopup = forwardRef<ComponentRef<typeof BaseMenu.Popup>, BaseMenu.Popup.Props>(function MenubarPopup(props, ref) {
	const { className, ...popupProps } = props;
	return <BaseMenu.Popup ref={ref} className={withBaseClass<BaseMenu.Popup.State>("lyds-menubar__popup", className)} {...popupProps} />;
});

export const MenubarItem = forwardRef<ComponentRef<typeof BaseMenu.Item>, BaseMenu.Item.Props>(function MenubarItem(props, ref) {
	const { className, ...itemProps } = props;
	return <BaseMenu.Item ref={ref} className={withBaseClass<BaseMenu.Item.State>("lyds-menubar__item", className)} {...itemProps} />;
});

export const MenubarLinkItem = forwardRef<ComponentRef<typeof BaseMenu.LinkItem>, BaseMenu.LinkItem.Props>(function MenubarLinkItem(props, ref) {
	const { className, ...itemProps } = props;
	return <BaseMenu.LinkItem ref={ref} className={withBaseClass<BaseMenu.LinkItem.State>("lyds-menubar__item", className)} {...itemProps} />;
});

export const MenubarCheckboxItem = forwardRef<ComponentRef<typeof BaseMenu.CheckboxItem>, BaseMenu.CheckboxItem.Props>(function MenubarCheckboxItem(props, ref) {
	const { className, ...itemProps } = props;
	return <BaseMenu.CheckboxItem ref={ref} className={withBaseClass<BaseMenu.CheckboxItem.State>("lyds-menubar__item", className)} {...itemProps} />;
});

export const MenubarCheckboxItemIndicator = forwardRef<ComponentRef<typeof BaseMenu.CheckboxItemIndicator>, BaseMenu.CheckboxItemIndicator.Props>(function MenubarCheckboxItemIndicator(props, ref) {
	const { className, children, ...indicatorProps } = props;
	return (
		<BaseMenu.CheckboxItemIndicator ref={ref} className={withBaseClass<BaseMenu.CheckboxItemIndicator.State>("lyds-menubar__indicator", className)} {...indicatorProps}>
			{children ?? <CheckIcon aria-hidden="true" weight="bold" />}
		</BaseMenu.CheckboxItemIndicator>
	);
});

export const MenubarRadioGroup = BaseMenu.RadioGroup;

export const MenubarRadioItem = forwardRef<ComponentRef<typeof BaseMenu.RadioItem>, BaseMenu.RadioItem.Props>(function MenubarRadioItem(props, ref) {
	const { className, ...itemProps } = props;
	return <BaseMenu.RadioItem ref={ref} className={withBaseClass<BaseMenu.RadioItem.State>("lyds-menubar__item", className)} {...itemProps} />;
});

export const MenubarRadioItemIndicator = forwardRef<ComponentRef<typeof BaseMenu.RadioItemIndicator>, BaseMenu.RadioItemIndicator.Props>(function MenubarRadioItemIndicator(props, ref) {
	const { className, children, ...indicatorProps } = props;
	return (
		<BaseMenu.RadioItemIndicator ref={ref} className={withBaseClass<BaseMenu.RadioItemIndicator.State>("lyds-menubar__indicator", className)} {...indicatorProps}>
			{children ?? <CircleIcon aria-hidden="true" weight="fill" />}
		</BaseMenu.RadioItemIndicator>
	);
});

export const MenubarGroup = BaseMenu.Group;

export const MenubarGroupLabel = forwardRef<ComponentRef<typeof BaseMenu.GroupLabel>, BaseMenu.GroupLabel.Props>(function MenubarGroupLabel(props, ref) {
	const { className, ...labelProps } = props;
	return <BaseMenu.GroupLabel ref={ref} className={withBaseClass<BaseMenu.GroupLabel.State>("lyds-menubar__group-label", className)} {...labelProps} />;
});

export const MenubarSeparator = forwardRef<ComponentRef<typeof BaseMenu.Separator>, BaseMenu.Separator.Props>(function MenubarSeparator(props, ref) {
	const { className, ...separatorProps } = props;
	return <BaseMenu.Separator ref={ref} className={withBaseClass<BaseMenu.Separator.State>("lyds-menubar__separator", className)} {...separatorProps} />;
});

export const MenubarSubmenu = BaseMenu.SubmenuRoot;

export const MenubarSubmenuTrigger = forwardRef<ComponentRef<typeof BaseMenu.SubmenuTrigger>, BaseMenu.SubmenuTrigger.Props>(function MenubarSubmenuTrigger(props, ref) {
	const { className, ...triggerProps } = props;
	return <BaseMenu.SubmenuTrigger ref={ref} className={withBaseClass<BaseMenu.SubmenuTrigger.State>("lyds-menubar__item", className)} {...triggerProps} />;
});

export const Toolbar = forwardRef<ComponentRef<typeof BaseToolbar.Root>, BaseToolbar.Root.Props>(function Toolbar(props, ref) {
	const { className, ...toolbarProps } = props;
	return <BaseToolbar.Root ref={ref} className={withBaseClass<BaseToolbar.Root.State>("lyds-toolbar", className)} {...toolbarProps} />;
});

export const ToolbarGroup = forwardRef<ComponentRef<typeof BaseToolbar.Group>, BaseToolbar.Group.Props>(function ToolbarGroup(props, ref) {
	const { className, ...groupProps } = props;
	return <BaseToolbar.Group ref={ref} className={withBaseClass<BaseToolbar.Group.State>("lyds-toolbar__group", className)} {...groupProps} />;
});

export const ToolbarButton = forwardRef<ComponentRef<typeof BaseToolbar.Button>, BaseToolbar.Button.Props>(function ToolbarButton(props, ref) {
	const { className, ...buttonProps } = props;
	return <BaseToolbar.Button ref={ref} className={withBaseClass<BaseToolbar.Button.State>("lyds-toolbar__button", className)} {...buttonProps} />;
});

export const ToolbarLink = forwardRef<ComponentRef<typeof BaseToolbar.Link>, BaseToolbar.Link.Props>(function ToolbarLink(props, ref) {
	const { className, ...linkProps } = props;
	return <BaseToolbar.Link ref={ref} className={withBaseClass<BaseToolbar.Link.State>("lyds-toolbar__button", className)} {...linkProps} />;
});

export const ToolbarInput = forwardRef<ComponentRef<typeof BaseToolbar.Input>, BaseToolbar.Input.Props>(function ToolbarInput(props, ref) {
	const { className, ...inputProps } = props;
	return <BaseToolbar.Input ref={ref} className={withBaseClass<BaseToolbar.Input.State>("lyds-toolbar__input", className)} {...inputProps} />;
});

export const ToolbarSeparator = forwardRef<ComponentRef<typeof BaseToolbar.Separator>, BaseToolbar.Separator.Props>(function ToolbarSeparator(props, ref) {
	const { className, ...separatorProps } = props;
	return <BaseToolbar.Separator ref={ref} className={withBaseClass<BaseToolbar.Separator.State>("lyds-toolbar__separator", className)} {...separatorProps} />;
});
