import { AlertDialog as BaseAlertDialog, type AlertDialogRootProps, type AlertDialogTriggerProps } from "@base-ui/react/alert-dialog";
import {
	Dialog as BaseDialog,
	type DialogCloseProps as BaseDialogCloseProps,
	type DialogPopupProps as BaseDialogPopupProps,
	type DialogBackdropProps,
	type DialogDescriptionProps,
	type DialogPortalProps,
	type DialogRootProps,
	type DialogTitleProps,
	type DialogTriggerProps,
	type DialogViewportProps
} from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { forwardRef, type HTMLAttributes, type JSX, type ReactNode, type RefAttributes } from "react";

import { withStateClassName } from "../../internal";
export type { AlertDialogRootChangeEventDetails } from "@base-ui/react/alert-dialog";
export type { DialogRootChangeEventDetails } from "@base-ui/react/dialog";

function CloseGlyph(): JSX.Element {
	return <XIcon aria-hidden="true" className="lyds-overlayClose__glyph" weight="bold" />;
}

export function DialogRoot<Payload = unknown>(props: DialogRootProps<Payload>): JSX.Element {
	return <BaseDialog.Root {...props} />;
}

export function DialogTrigger<Payload = unknown>({ className, ...props }: DialogTriggerProps<Payload> & RefAttributes<HTMLElement>): JSX.Element {
	return <BaseDialog.Trigger {...props} className={withStateClassName("lyds-dialog__trigger", className)} />;
}

export const DialogPortal = forwardRef<HTMLDivElement, DialogPortalProps>(function DialogPortal(props, ref) {
	return <BaseDialog.Portal {...props} ref={ref} />;
});

export const DialogBackdrop = forwardRef<HTMLDivElement, DialogBackdropProps>(function DialogBackdrop({ className, ...props }, ref) {
	return <BaseDialog.Backdrop {...props} ref={ref} className={withStateClassName("lyds-dialog__backdrop", className)} />;
});

export const DialogViewport = forwardRef<HTMLDivElement, DialogViewportProps>(function DialogViewport({ className, ...props }, ref) {
	return <BaseDialog.Viewport {...props} ref={ref} className={withStateClassName("lyds-dialog__viewport", className)} />;
});

export interface DialogPopupProps extends BaseDialogPopupProps {
	/** 內建關閉控制項的無障礙標籤。 */
	closeLabel?: string;
	/** 傳給內建關閉控制項的屬性。 */
	closeProps?: Omit<DialogCloseProps, "children">;
	/** 僅在彈出內容另有可存取的 Dialog.Close 時設定。 */
	hasCustomClose?: boolean;
}

export const DialogPopup = forwardRef<HTMLDivElement, DialogPopupProps>(function DialogPopup({ children, className, closeLabel = "關閉對話框", closeProps, hasCustomClose = false, ...props }, ref) {
	return (
		<BaseDialog.Popup {...props} ref={ref} className={withStateClassName("lyds-dialog__popup", className)}>
			{children}
			{hasCustomClose ? null : <DialogClose {...closeProps} aria-label={closeLabel} />}
		</BaseDialog.Popup>
	);
});

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle({ className, ...props }, ref) {
	return <BaseDialog.Title {...props} ref={ref} className={withStateClassName("lyds-dialog__title", className)} />;
});

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(function DialogDescription({ className, ...props }, ref) {
	return <BaseDialog.Description {...props} ref={ref} className={withStateClassName("lyds-dialog__description", className)} />;
});

export interface DialogCloseProps extends BaseDialogCloseProps {
	/** 圖示控制項位於面板角落；動作控制項則參與內容排版。 */
	variant?: "icon" | "action";
}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(function DialogClose(
	{ "aria-label": ariaLabel, children, className, variant = children == null ? "icon" : "action", ...props },
	ref
) {
	return (
		<BaseDialog.Close
			{...props}
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? "關閉對話框" : undefined)}
			className={withStateClassName(variant === "icon" ? "lyds-overlayClose" : "lyds-overlayCloseAction", className)}
		>
			{children ?? <CloseGlyph />}
		</BaseDialog.Close>
	);
});

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-dialog__header ${className}` : "lyds-dialog__header"} />;
});

export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-dialog__body ${className}` : "lyds-dialog__body"} />;
});

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-dialog__footer ${className}` : "lyds-dialog__footer"} />;
});

export const Dialog = {
	Root: DialogRoot,
	Trigger: DialogTrigger,
	Portal: DialogPortal,
	Backdrop: DialogBackdrop,
	Viewport: DialogViewport,
	Popup: DialogPopup,
	Header: DialogHeader,
	Body: DialogBody,
	Footer: DialogFooter,
	Title: DialogTitle,
	Description: DialogDescription,
	Close: DialogClose,
	createHandle: BaseDialog.createHandle,
	Handle: BaseDialog.Handle
} as const;

/** Base UI 的 Dialog 預設為強制回應；Modal 是用途明確的別名。 */
export const Modal = Dialog;

export function AlertDialogRoot<Payload = unknown>(props: AlertDialogRootProps<Payload>): JSX.Element {
	return <BaseAlertDialog.Root {...props} />;
}

export function AlertDialogTrigger<Payload = unknown>({ className, ...props }: AlertDialogTriggerProps<Payload> & RefAttributes<HTMLElement>): JSX.Element {
	return <BaseAlertDialog.Trigger {...props} className={withStateClassName("lyds-alertDialog__trigger", className)} />;
}

export interface AlertDialogPopupProps extends BaseDialogPopupProps {
	/** 內建取消／關閉控制項的無障礙標籤。 */
	closeLabel?: string;
	/** 傳給內建取消／關閉控制項的屬性。 */
	closeProps?: Omit<DialogCloseProps, "children">;
	/** 僅在彈出內容另有可存取的 AlertDialog.Close 時設定。 */
	hasCustomClose?: boolean;
}

export const AlertDialogPopup = forwardRef<HTMLDivElement, AlertDialogPopupProps>(function AlertDialogPopup(
	{ children, className, closeLabel = "取消並關閉警示", closeProps, hasCustomClose = false, ...props },
	ref
) {
	return (
		<BaseAlertDialog.Popup {...props} ref={ref} className={withStateClassName("lyds-dialog__popup lyds-alertDialog__popup", className)}>
			{children}
			{hasCustomClose ? null : <AlertDialogClose {...closeProps} aria-label={closeLabel} />}
		</BaseAlertDialog.Popup>
	);
});

export const AlertDialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(function AlertDialogClose(
	{ "aria-label": ariaLabel, children, className, variant = children == null ? "icon" : "action", ...props },
	ref
) {
	return (
		<BaseAlertDialog.Close
			{...props}
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? "取消並關閉警示" : undefined)}
			className={withStateClassName(variant === "icon" ? "lyds-overlayClose" : "lyds-overlayCloseAction", className)}
		>
			{children ?? <CloseGlyph />}
		</BaseAlertDialog.Close>
	);
});

export interface AlertDialogActionsProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
}

export const AlertDialogActions = forwardRef<HTMLDivElement, AlertDialogActionsProps>(function AlertDialogActions({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-dialog__footer lyds-alertDialog__actions ${className}` : "lyds-dialog__footer lyds-alertDialog__actions"} />;
});

export const AlertDialog = {
	Root: AlertDialogRoot,
	Trigger: AlertDialogTrigger,
	Portal: DialogPortal,
	Backdrop: DialogBackdrop,
	Viewport: DialogViewport,
	Popup: AlertDialogPopup,
	Header: DialogHeader,
	Body: DialogBody,
	Footer: DialogFooter,
	Actions: AlertDialogActions,
	Title: DialogTitle,
	Description: DialogDescription,
	Close: AlertDialogClose,
	createHandle: BaseAlertDialog.createHandle,
	Handle: BaseAlertDialog.Handle
} as const;
