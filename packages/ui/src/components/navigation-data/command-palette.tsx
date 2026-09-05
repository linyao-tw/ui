import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { createContext, forwardRef, useCallback, useContext, useRef, useState, type ComponentRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";

import { cx, withStateClassName } from "@/internal";
import { useMessages } from "@/intl";
/**
 * The popup moves focus to the search input when the palette opens. Sharing a ref beats looking the
 * input up by class name: a consumer can render a different input, and a class name that focus
 * management depends on becomes public API by accident.
 */
const CommandPaletteInputContext = createContext<RefObject<HTMLInputElement | null> | null>(null);

export interface CommandPaletteProps<Value> extends Omit<BaseCombobox.Root.Props<Value, false>, "autoComplete" | "children" | "defaultOpen" | "inline" | "modal" | "onOpenChange" | "open"> {
	children: ReactNode;
	defaultOpen?: boolean;
	modal?: BaseDialog.Root.Props["modal"];
	onOpenChange?: (open: boolean, eventDetails: CommandPaletteOpenChangeDetails) => void;
	open?: boolean;
}

export type CommandPaletteOpenChangeDetails = BaseDialog.Root.ChangeEventDetails | BaseCombobox.Root.ChangeEventDetails;

/**
 * 用於指令介面的 Dialog 與行內 Combobox 組合。
 * Linyao Design System 僅管理焦點與開啟狀態；指令資料、篩選及執行由使用端負責。
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

	const inputRef = useRef<HTMLInputElement | null>(null);

	return (
		<CommandPaletteInputContext value={inputRef}>
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
		</CommandPaletteInputContext>
	);
}

export const CommandPaletteTrigger = forwardRef<HTMLButtonElement, BaseDialog.Trigger.Props>(function CommandPaletteTrigger(props, ref) {
	const { className, ...triggerProps } = props;
	return <BaseDialog.Trigger ref={ref} className={withStateClassName<BaseDialog.Trigger.State>("lyds-command-palette__trigger", className)} {...triggerProps} />;
});

export const CommandPalettePortal = BaseDialog.Portal;

export const CommandPaletteBackdrop = forwardRef<ComponentRef<typeof BaseDialog.Backdrop>, BaseDialog.Backdrop.Props>(function CommandPaletteBackdrop(props, ref) {
	const { className, ...backdropProps } = props;
	return <BaseDialog.Backdrop ref={ref} className={withStateClassName<BaseDialog.Backdrop.State>("lyds-command-palette__backdrop", className)} {...backdropProps} />;
});

export const CommandPaletteViewport = forwardRef<ComponentRef<typeof BaseDialog.Viewport>, BaseDialog.Viewport.Props>(function CommandPaletteViewport(props, ref) {
	const { className, ...viewportProps } = props;
	return <BaseDialog.Viewport ref={ref} className={withStateClassName<BaseDialog.Viewport.State>("lyds-command-palette__viewport", className)} {...viewportProps} />;
});

export const CommandPalettePopup = forwardRef<ComponentRef<typeof BaseDialog.Popup>, BaseDialog.Popup.Props>(function CommandPalettePopup(props, ref) {
	const { className, initialFocus, ...popupProps } = props;
	const inputRef = useContext(CommandPaletteInputContext);
	const focusSearchInput = useCallback((openType: string) => (openType === "touch" ? true : (inputRef?.current ?? true)), [inputRef]);

	return (
		<BaseDialog.Popup ref={ref} className={withStateClassName<BaseDialog.Popup.State>("lyds-command-palette__popup", className)} initialFocus={initialFocus ?? focusSearchInput} {...popupProps} />
	);
});

export const CommandPaletteTitle = forwardRef<ComponentRef<typeof BaseDialog.Title>, BaseDialog.Title.Props>(function CommandPaletteTitle(props, ref) {
	const { className, ...titleProps } = props;
	return <BaseDialog.Title ref={ref} className={withStateClassName<BaseDialog.Title.State>("lyds-command-palette__title", className)} {...titleProps} />;
});

export const CommandPaletteDescription = forwardRef<ComponentRef<typeof BaseDialog.Description>, BaseDialog.Description.Props>(function CommandPaletteDescription(props, ref) {
	const { className, ...descriptionProps } = props;
	return <BaseDialog.Description ref={ref} className={withStateClassName<BaseDialog.Description.State>("lyds-command-palette__description", className)} {...descriptionProps} />;
});

export const CommandPaletteClose = forwardRef<ComponentRef<typeof BaseDialog.Close>, BaseDialog.Close.Props>(function CommandPaletteClose(props, ref) {
	const messages = useMessages();
	const { className, children = messages.commandPaletteClose, ...closeProps } = props;
	return (
		<BaseDialog.Close ref={ref} className={withStateClassName<BaseDialog.Close.State>("lyds-command-palette__close", className)} {...closeProps}>
			{children}
		</BaseDialog.Close>
	);
});

export const CommandPaletteLabel = forwardRef<ComponentRef<typeof BaseCombobox.Label>, BaseCombobox.Label.Props>(function CommandPaletteLabel(props, ref) {
	const { className, ...labelProps } = props;
	return <BaseCombobox.Label ref={ref} className={withStateClassName<BaseCombobox.Label.State>("lyds-command-palette__label", className)} {...labelProps} />;
});

export const CommandPaletteInput = forwardRef<ComponentRef<typeof BaseCombobox.Input>, BaseCombobox.Input.Props>(function CommandPaletteInput(props, ref) {
	const messages = useMessages();
	const paletteInputRef = useContext(CommandPaletteInputContext);
	const { className, placeholder = messages.commandPalettePlaceholder, ...inputProps } = props;
	const setInput = useCallback(
		(node: HTMLInputElement | null) => {
			if (paletteInputRef) paletteInputRef.current = node;
			if (typeof ref === "function") ref(node);
			else if (ref) ref.current = node;
		},
		[paletteInputRef, ref]
	);

	return <BaseCombobox.Input ref={setInput} className={withStateClassName<BaseCombobox.Input.State>("lyds-command-palette__input", className)} placeholder={placeholder} {...inputProps} />;
});

export const CommandPaletteList = forwardRef<ComponentRef<typeof BaseCombobox.List>, BaseCombobox.List.Props>(function CommandPaletteList(props, ref) {
	const { className, ...listProps } = props;
	return <BaseCombobox.List ref={ref} className={withStateClassName<BaseCombobox.List.State>("lyds-command-palette__list", className)} {...listProps} />;
});

export const CommandPaletteItem = forwardRef<ComponentRef<typeof BaseCombobox.Item>, BaseCombobox.Item.Props>(function CommandPaletteItem(props, ref) {
	const { className, ...itemProps } = props;
	return <BaseCombobox.Item ref={ref} className={withStateClassName<BaseCombobox.Item.State>("lyds-command-palette__item", className)} {...itemProps} />;
});

export const CommandPaletteItemIndicator = forwardRef<ComponentRef<typeof BaseCombobox.ItemIndicator>, BaseCombobox.ItemIndicator.Props>(function CommandPaletteItemIndicator(props, ref) {
	const { className, children, ...indicatorProps } = props;
	return (
		<BaseCombobox.ItemIndicator ref={ref} className={withStateClassName<BaseCombobox.ItemIndicator.State>("lyds-command-palette__indicator", className)} {...indicatorProps}>
			{children ?? <CheckIcon aria-hidden="true" weight="bold" />}
		</BaseCombobox.ItemIndicator>
	);
});

export const CommandPaletteGroup = BaseCombobox.Group;

export const CommandPaletteGroupLabel = forwardRef<ComponentRef<typeof BaseCombobox.GroupLabel>, BaseCombobox.GroupLabel.Props>(function CommandPaletteGroupLabel(props, ref) {
	const { className, ...labelProps } = props;
	return <BaseCombobox.GroupLabel ref={ref} className={withStateClassName<BaseCombobox.GroupLabel.State>("lyds-command-palette__group-label", className)} {...labelProps} />;
});

export const CommandPaletteEmpty = forwardRef<ComponentRef<typeof BaseCombobox.Empty>, BaseCombobox.Empty.Props>(function CommandPaletteEmpty(props, ref) {
	const { className, ...emptyProps } = props;
	return <BaseCombobox.Empty ref={ref} className={withStateClassName<BaseCombobox.Empty.State>("lyds-command-palette__empty", className)} {...emptyProps} />;
});

export const CommandPaletteSeparator = forwardRef<ComponentRef<typeof BaseCombobox.Separator>, BaseCombobox.Separator.Props>(function CommandPaletteSeparator(props, ref) {
	const { className, ...separatorProps } = props;
	return <BaseCombobox.Separator ref={ref} className={withStateClassName<BaseCombobox.Separator.State>("lyds-command-palette__separator", className)} {...separatorProps} />;
});

export const CommandPaletteStatus = BaseCombobox.Status;

export const CommandPaletteShortcut = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function CommandPaletteShortcut(props, ref) {
	const { className, ...shortcutProps } = props;
	return <kbd ref={ref} className={cx("lyds-command-palette__shortcut", className)} {...shortcutProps} />;
});

/**
 * Every component built on a context root also exposes its parts as a namespace, so composing one
 * reads the same way as composing a Dialog or a Select.
 */
export const CommandPaletteNamespace = Object.assign(CommandPalette, {
	Backdrop: CommandPaletteBackdrop,
	Close: CommandPaletteClose,
	Description: CommandPaletteDescription,
	Empty: CommandPaletteEmpty,
	Group: CommandPaletteGroup,
	GroupLabel: CommandPaletteGroupLabel,
	Input: CommandPaletteInput,
	Item: CommandPaletteItem,
	ItemIndicator: CommandPaletteItemIndicator,
	Label: CommandPaletteLabel,
	List: CommandPaletteList,
	Popup: CommandPalettePopup,
	Portal: CommandPalettePortal,
	Root: CommandPalette,
	Separator: CommandPaletteSeparator,
	Shortcut: CommandPaletteShortcut,
	Status: CommandPaletteStatus,
	Title: CommandPaletteTitle,
	Trigger: CommandPaletteTrigger,
	Viewport: CommandPaletteViewport
});
