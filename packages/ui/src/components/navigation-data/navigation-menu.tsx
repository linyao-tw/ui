import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { forwardRef, type ComponentRef, type ForwardedRef, type ReactElement, type RefAttributes } from "react";

import { withStateClassName } from "../../internal";
function NavigationMenuInner<Value = string>(props: BaseNavigationMenu.Root.Props<Value>, ref: ForwardedRef<HTMLElement>) {
	const { className, ...rootProps } = props;
	return <BaseNavigationMenu.Root ref={ref} className={withStateClassName<BaseNavigationMenu.Root.State>("lyds-navigation-menu", className)} {...rootProps} />;
}

export const NavigationMenu = forwardRef(NavigationMenuInner) as <Value = string>(props: BaseNavigationMenu.Root.Props<Value> & RefAttributes<HTMLElement>) => ReactElement;

export const NavigationMenuList = forwardRef<ComponentRef<typeof BaseNavigationMenu.List>, BaseNavigationMenu.List.Props>(function NavigationMenuList(props, ref) {
	const { className, ...listProps } = props;
	return <BaseNavigationMenu.List ref={ref} className={withStateClassName<BaseNavigationMenu.List.State>("lyds-navigation-menu__list", className)} {...listProps} />;
});

export const NavigationMenuItem = BaseNavigationMenu.Item;

export const NavigationMenuTrigger = forwardRef<ComponentRef<typeof BaseNavigationMenu.Trigger>, BaseNavigationMenu.Trigger.Props>(function NavigationMenuTrigger(props, ref) {
	const { className, ...triggerProps } = props;
	return <BaseNavigationMenu.Trigger ref={ref} className={withStateClassName<BaseNavigationMenu.Trigger.State>("lyds-navigation-menu__trigger", className)} {...triggerProps} />;
});

export const NavigationMenuIcon = forwardRef<ComponentRef<typeof BaseNavigationMenu.Icon>, BaseNavigationMenu.Icon.Props>(function NavigationMenuIcon(props, ref) {
	const { className, children, ...iconProps } = props;
	return (
		<BaseNavigationMenu.Icon ref={ref} className={withStateClassName<BaseNavigationMenu.Icon.State>("lyds-navigation-menu__icon", className)} {...iconProps}>
			{children ?? <CaretDownIcon aria-hidden="true" weight="bold" />}
		</BaseNavigationMenu.Icon>
	);
});

export const NavigationMenuLink = forwardRef<ComponentRef<typeof BaseNavigationMenu.Link>, BaseNavigationMenu.Link.Props>(function NavigationMenuLink(props, ref) {
	const { className, ...linkProps } = props;
	return <BaseNavigationMenu.Link ref={ref} className={withStateClassName<BaseNavigationMenu.Link.State>("lyds-navigation-menu__link", className)} {...linkProps} />;
});

export const NavigationMenuContent = forwardRef<ComponentRef<typeof BaseNavigationMenu.Content>, BaseNavigationMenu.Content.Props>(function NavigationMenuContent(props, ref) {
	const { className, ...contentProps } = props;
	return <BaseNavigationMenu.Content ref={ref} className={withStateClassName<BaseNavigationMenu.Content.State>("lyds-navigation-menu__content", className)} {...contentProps} />;
});

export const NavigationMenuPortal = BaseNavigationMenu.Portal;

export const NavigationMenuPositioner = forwardRef<ComponentRef<typeof BaseNavigationMenu.Positioner>, BaseNavigationMenu.Positioner.Props>(function NavigationMenuPositioner(props, ref) {
	const { className, sideOffset = 8, ...positionerProps } = props;
	return (
		<BaseNavigationMenu.Positioner
			ref={ref}
			className={withStateClassName<BaseNavigationMenu.Positioner.State>("lyds-navigation-menu__positioner", className)}
			sideOffset={sideOffset}
			{...positionerProps}
		/>
	);
});

export const NavigationMenuPopup = forwardRef<ComponentRef<typeof BaseNavigationMenu.Popup>, BaseNavigationMenu.Popup.Props>(function NavigationMenuPopup(props, ref) {
	const { className, ...popupProps } = props;
	return <BaseNavigationMenu.Popup ref={ref} className={withStateClassName<BaseNavigationMenu.Popup.State>("lyds-navigation-menu__popup", className)} {...popupProps} />;
});

export const NavigationMenuViewport = forwardRef<ComponentRef<typeof BaseNavigationMenu.Viewport>, BaseNavigationMenu.Viewport.Props>(function NavigationMenuViewport(props, ref) {
	const { className, ...viewportProps } = props;
	return <BaseNavigationMenu.Viewport ref={ref} className={withStateClassName<BaseNavigationMenu.Viewport.State>("lyds-navigation-menu__viewport", className)} {...viewportProps} />;
});

export const NavigationMenuArrow = forwardRef<ComponentRef<typeof BaseNavigationMenu.Arrow>, BaseNavigationMenu.Arrow.Props>(function NavigationMenuArrow(props, ref) {
	const { className, ...arrowProps } = props;
	return <BaseNavigationMenu.Arrow ref={ref} className={withStateClassName<BaseNavigationMenu.Arrow.State>("lyds-navigation-menu__arrow", className)} {...arrowProps} />;
});
