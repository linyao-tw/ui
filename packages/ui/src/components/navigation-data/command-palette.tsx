import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { forwardRef, useCallback, useState, type ComponentRef, type HTMLAttributes, type ReactNode } from "react";

import { cx, withBaseClass } from "./utils.js";

export interface CommandPaletteProps<Value> extends Omit<BaseCombobox.Root.Props<Value, false>, "autoComplete" | "children" | "defaultOpen" | "inline" | "modal" | "onOpenChange" | "open"> {
	children: ReactNode;
	defaultOpen?: boolean;
	modal?: BaseDialog.Root.Props["modal"];
	onOpenChange?: (open: boolean, eventDetails: CommandPaletteOpenChangeDetails) => void;
	open?: boolean;
}

export type CommandPaletteOpenChangeDetails = BaseDialog.Root.ChangeEventDetails | BaseCombobox.Root.ChangeEventDetails;

/**
 * Dialog and inline combobox composition for command interfaces.
 * LYDS owns focus/open behavior only: consumers own command data, filtering, and execution.
 */
export function CommandPalette<Value>({ children, defaultOpen = false, modal = true, onOpenChange, open, ...comboboxProps }: CommandPaletteProps<Value>) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
	const isControlled = open !== undefined;
	const resolvedOpen = isControlled ? open : uncontrolledOpen;
	const changeOpen = useCallback(
		(nextOpen: boolean, eventDetails: CommandPaletteOpenChangeDetails) => {
			onOpenChange?.(nextOpen, eventDetails);
			if (eventDetails.isCanceled) return;
			if (!isControlled) {
				setUncontrolledOpen(nextOpen);
			}
		},
		[isControlled, onOpenChange]
	);

	return (
		<BaseDialog.Root modal={modal} open={resolvedOpen} onOpenChange={changeOpen}>
			<BaseCombobox.Root
				{...comboboxProps}
				autoComplete="none"
				inline
				open={resolvedOpen}
				onOpenChange={(nextOpen, eventDetails) => {
					if (nextOpen !== resolvedOpen) {
						changeOpen(nextOpen, eventDetails);
					}
				}}
			>
				{children}
			</BaseCombobox.Root>
		</BaseDialog.Root>
	);
}

export const CommandPaletteTrigger = forwardRef<HTMLButtonElement, BaseDialog.Trigger.Props>(function CommandPaletteTrigger(props, ref) {
	const { className, ...triggerProps } = props;
	return <BaseDialog.Trigger ref={ref} className={withBaseClass<BaseDialog.Trigger.State>("lyds-command-palette__trigger", className)} {...triggerProps} />;
});

export const CommandPalettePortal = BaseDialog.Portal;

export const CommandPaletteBackdrop = forwardRef<ComponentRef<typeof BaseDialog.Backdrop>, BaseDialog.Backdrop.Props>(function CommandPaletteBackdrop(props, ref) {
	const { className, ...backdropProps } = props;
	return <BaseDialog.Backdrop ref={ref} className={withBaseClass<BaseDialog.Backdrop.State>("lyds-command-palette__backdrop", className)} {...backdropProps} />;
});

export const CommandPaletteViewport = forwardRef<ComponentRef<typeof BaseDialog.Viewport>, BaseDialog.Viewport.Props>(function CommandPaletteViewport(props, ref) {
	const { className, ...viewportProps } = props;
	return <BaseDialog.Viewport ref={ref} className={withBaseClass<BaseDialog.Viewport.State>("lyds-command-palette__viewport", className)} {...viewportProps} />;
});

export const CommandPalettePopup = forwardRef<ComponentRef<typeof BaseDialog.Popup>, BaseDialog.Popup.Props>(function CommandPalettePopup(props, ref) {
	const { className, ...popupProps } = props;
	return <BaseDialog.Popup ref={ref} className={withBaseClass<BaseDialog.Popup.State>("lyds-command-palette__popup", className)} {...popupProps} />;
});

export const CommandPaletteTitle = forwardRef<ComponentRef<typeof BaseDialog.Title>, BaseDialog.Title.Props>(function CommandPaletteTitle(props, ref) {
	const { className, ...titleProps } = props;
	return <BaseDialog.Title ref={ref} className={withBaseClass<BaseDialog.Title.State>("lyds-command-palette__title", className)} {...titleProps} />;
});

export const CommandPaletteDescription = forwardRef<ComponentRef<typeof BaseDialog.Description>, BaseDialog.Description.Props>(function CommandPaletteDescription(props, ref) {
	const { className, ...descriptionProps } = props;
	return <BaseDialog.Description ref={ref} className={withBaseClass<BaseDialog.Description.State>("lyds-command-palette__description", className)} {...descriptionProps} />;
});

export const CommandPaletteClose = forwardRef<ComponentRef<typeof BaseDialog.Close>, BaseDialog.Close.Props>(function CommandPaletteClose(props, ref) {
	const { className, children = "Close", ...closeProps } = props;
	return (
		<BaseDialog.Close ref={ref} className={withBaseClass<BaseDialog.Close.State>("lyds-command-palette__close", className)} {...closeProps}>
			{children}
		</BaseDialog.Close>
	);
});

export const CommandPaletteLabel = forwardRef<ComponentRef<typeof BaseCombobox.Label>, BaseCombobox.Label.Props>(function CommandPaletteLabel(props, ref) {
	const { className, ...labelProps } = props;
	return <BaseCombobox.Label ref={ref} className={withBaseClass<BaseCombobox.Label.State>("lyds-command-palette__label", className)} {...labelProps} />;
});

export const CommandPaletteInput = forwardRef<ComponentRef<typeof BaseCombobox.Input>, BaseCombobox.Input.Props>(function CommandPaletteInput(props, ref) {
	const { className, placeholder = "Type a command…", ...inputProps } = props;
	return <BaseCombobox.Input ref={ref} className={withBaseClass<BaseCombobox.Input.State>("lyds-command-palette__input", className)} placeholder={placeholder} {...inputProps} />;
});

export const CommandPaletteList = forwardRef<ComponentRef<typeof BaseCombobox.List>, BaseCombobox.List.Props>(function CommandPaletteList(props, ref) {
	const { className, ...listProps } = props;
	return <BaseCombobox.List ref={ref} className={withBaseClass<BaseCombobox.List.State>("lyds-command-palette__list", className)} {...listProps} />;
});

export const CommandPaletteItem = forwardRef<ComponentRef<typeof BaseCombobox.Item>, BaseCombobox.Item.Props>(function CommandPaletteItem(props, ref) {
	const { className, ...itemProps } = props;
	return <BaseCombobox.Item ref={ref} className={withBaseClass<BaseCombobox.Item.State>("lyds-command-palette__item", className)} {...itemProps} />;
});

export const CommandPaletteItemIndicator = forwardRef<ComponentRef<typeof BaseCombobox.ItemIndicator>, BaseCombobox.ItemIndicator.Props>(function CommandPaletteItemIndicator(props, ref) {
	const { className, children = "●", ...indicatorProps } = props;
	return (
		<BaseCombobox.ItemIndicator ref={ref} className={withBaseClass<BaseCombobox.ItemIndicator.State>("lyds-command-palette__indicator", className)} {...indicatorProps}>
			{children}
		</BaseCombobox.ItemIndicator>
	);
});

export const CommandPaletteGroup = BaseCombobox.Group;

export const CommandPaletteGroupLabel = forwardRef<ComponentRef<typeof BaseCombobox.GroupLabel>, BaseCombobox.GroupLabel.Props>(function CommandPaletteGroupLabel(props, ref) {
	const { className, ...labelProps } = props;
	return <BaseCombobox.GroupLabel ref={ref} className={withBaseClass<BaseCombobox.GroupLabel.State>("lyds-command-palette__group-label", className)} {...labelProps} />;
});

export const CommandPaletteEmpty = forwardRef<ComponentRef<typeof BaseCombobox.Empty>, BaseCombobox.Empty.Props>(function CommandPaletteEmpty(props, ref) {
	const { className, ...emptyProps } = props;
	return <BaseCombobox.Empty ref={ref} className={withBaseClass<BaseCombobox.Empty.State>("lyds-command-palette__empty", className)} {...emptyProps} />;
});

export const CommandPaletteSeparator = forwardRef<ComponentRef<typeof BaseCombobox.Separator>, BaseCombobox.Separator.Props>(function CommandPaletteSeparator(props, ref) {
	const { className, ...separatorProps } = props;
	return <BaseCombobox.Separator ref={ref} className={withBaseClass<BaseCombobox.Separator.State>("lyds-command-palette__separator", className)} {...separatorProps} />;
});

export const CommandPaletteStatus = BaseCombobox.Status;

export const CommandPaletteShortcut = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function CommandPaletteShortcut(props, ref) {
	const { className, ...shortcutProps } = props;
	return <kbd ref={ref} className={cx("lyds-command-palette__shortcut", className)} {...shortcutProps} />;
});
