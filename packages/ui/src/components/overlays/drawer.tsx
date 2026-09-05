import {
	Drawer as BaseDrawer,
	type DrawerCloseProps as BaseDrawerCloseProps,
	type DrawerPopupProps as BaseDrawerPopupProps,
	type DrawerBackdropProps,
	type DrawerContentProps,
	type DrawerDescriptionProps,
	type DrawerPortalProps,
	type DrawerRootProps,
	type DrawerSwipeAreaProps,
	type DrawerTitleProps,
	type DrawerTriggerProps,
	type DrawerViewportProps
} from "@base-ui/react/drawer";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { forwardRef, type HTMLAttributes, type JSX, type RefAttributes } from "react";

import { withStateClassName } from "@/internal";
import { useMessages } from "@/intl";
export type { DrawerRootChangeEventDetails } from "@base-ui/react/drawer";

function CloseGlyph(): JSX.Element {
	return <XIcon aria-hidden="true" className="lyds-overlayClose__glyph" weight="bold" />;
}

export function DrawerRoot<Payload = unknown>({ swipeDirection = "right", ...props }: DrawerRootProps<Payload>): JSX.Element {
	return <BaseDrawer.Root {...props} swipeDirection={swipeDirection} />;
}

export function DrawerTrigger<Payload = unknown>({ className, ...props }: DrawerTriggerProps<Payload> & RefAttributes<HTMLElement>): JSX.Element {
	return <BaseDrawer.Trigger {...props} className={withStateClassName("lyds-drawer__trigger", className)} />;
}

export const DrawerPortal = forwardRef<HTMLDivElement, DrawerPortalProps>(function DrawerPortal(props, ref) {
	return <BaseDrawer.Portal {...props} ref={ref} />;
});

export const DrawerBackdrop = forwardRef<HTMLDivElement, DrawerBackdropProps>(function DrawerBackdrop({ className, ...props }, ref) {
	return <BaseDrawer.Backdrop {...props} ref={ref} className={withStateClassName("lyds-drawer__backdrop", className)} />;
});

export const DrawerViewport = forwardRef<HTMLDivElement, DrawerViewportProps>(function DrawerViewport({ className, ...props }, ref) {
	return <BaseDrawer.Viewport {...props} ref={ref} className={withStateClassName("lyds-drawer__viewport", className)} />;
});

export interface DrawerPopupProps extends BaseDrawerPopupProps {
	/** 內建關閉控制項的無障礙標籤。 */
	closeLabel?: string;
	/** 傳給內建關閉控制項的屬性。 */
	closeProps?: Omit<DrawerCloseProps, "children">;
	/** 僅在彈出內容另有可存取的 Drawer.Close 時設定。 */
	hasCustomClose?: boolean;
}

export const DrawerPopup = forwardRef<HTMLDivElement, DrawerPopupProps>(function DrawerPopup({ children, className, closeLabel, closeProps, hasCustomClose = false, ...props }, ref) {
	const messages = useMessages();

	return (
		<BaseDrawer.Popup {...props} ref={ref} className={withStateClassName("lyds-drawer__popup", className)}>
			{children}
			{hasCustomClose ? null : <DrawerClose {...closeProps} aria-label={closeLabel ?? messages.drawerClose} />}
		</BaseDrawer.Popup>
	);
});

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent({ className, ...props }, ref) {
	return <BaseDrawer.Content {...props} ref={ref} className={withStateClassName("lyds-drawer__content", className)} />;
});

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(function DrawerTitle({ className, ...props }, ref) {
	return <BaseDrawer.Title {...props} ref={ref} className={withStateClassName("lyds-drawer__title", className)} />;
});

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(function DrawerDescription({ className, ...props }, ref) {
	return <BaseDrawer.Description {...props} ref={ref} className={withStateClassName("lyds-drawer__description", className)} />;
});

export interface DrawerCloseProps extends BaseDrawerCloseProps {
	/** 圖示控制項位於面板角落；動作控制項則參與內容排版。 */
	variant?: "icon" | "action";
}

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(function DrawerClose(
	{ "aria-label": ariaLabel, children, className, variant = children == null ? "icon" : "action", ...props },
	ref
) {
	const messages = useMessages();

	return (
		<BaseDrawer.Close
			{...props}
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? messages.drawerClose : undefined)}
			className={withStateClassName(variant === "icon" ? "lyds-overlayClose" : "lyds-overlayCloseAction", className)}
		>
			{children ?? <CloseGlyph />}
		</BaseDrawer.Close>
	);
});

export const DrawerSwipeArea = forwardRef<HTMLDivElement, DrawerSwipeAreaProps>(function DrawerSwipeArea({ className, ...props }, ref) {
	return <BaseDrawer.SwipeArea {...props} ref={ref} className={withStateClassName("lyds-drawer__swipeArea", className)} />;
});

export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(function DrawerHeader({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-drawer__header ${className}` : "lyds-drawer__header"} />;
});

export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(function DrawerBody({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-drawer__body ${className}` : "lyds-drawer__body"} />;
});

export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-drawer__footer ${className}` : "lyds-drawer__footer"} />;
});

export const Drawer = {
	Root: DrawerRoot,
	Trigger: DrawerTrigger,
	Portal: DrawerPortal,
	Backdrop: DrawerBackdrop,
	Viewport: DrawerViewport,
	Popup: DrawerPopup,
	Content: DrawerContent,
	Header: DrawerHeader,
	Body: DrawerBody,
	Footer: DrawerFooter,
	Title: DrawerTitle,
	Description: DrawerDescription,
	Close: DrawerClose,
	SwipeArea: DrawerSwipeArea,
	Provider: BaseDrawer.Provider,
	Indent: BaseDrawer.Indent,
	IndentBackground: BaseDrawer.IndentBackground,
	VirtualKeyboardProvider: BaseDrawer.VirtualKeyboardProvider,
	createHandle: BaseDrawer.createHandle,
	Handle: BaseDrawer.Handle
} as const;

export type BottomSheetSnapPoint = number | `${number}rem`;

export interface BottomSheetRootProps<Payload = unknown> extends Omit<DrawerRootProps<Payload>, "snapPoints" | "swipeDirection"> {
	/** 響應式面板建議使用 0 至 1 的比例值或 rem 長度。 */
	snapPoints?: BottomSheetSnapPoint[];
	/** 底部面板一律向下關閉。 */
	swipeDirection?: "down";
}

const defaultBottomSheetSnapPoints: BottomSheetSnapPoint[] = [0.45, 0.92];

export function BottomSheetRoot<Payload = unknown>({ snapPoints = defaultBottomSheetSnapPoints, defaultSnapPoint, ...props }: BottomSheetRootProps<Payload>): JSX.Element {
	const accessibleDefaultSnapPoint = snapPoints.at(-1) ?? null;
	return <BaseDrawer.Root {...props} swipeDirection="down" snapPoints={snapPoints} defaultSnapPoint={defaultSnapPoint ?? accessibleDefaultSnapPoint} />;
}

export const BottomSheetPopup = forwardRef<HTMLDivElement, DrawerPopupProps>(function BottomSheetPopup({ children, className, closeLabel, closeProps, hasCustomClose = false, ...props }, ref) {
	const messages = useMessages();

	return (
		<BaseDrawer.Popup {...props} ref={ref} className={withStateClassName("lyds-drawer__popup lyds-bottomSheet__popup", className)}>
			{children}
			{hasCustomClose ? null : <DrawerClose {...closeProps} aria-label={closeLabel ?? messages.bottomSheetClose} />}
		</BaseDrawer.Popup>
	);
});

export type BottomSheetHandleProps = HTMLAttributes<HTMLDivElement>;

/** 符合觸控尺寸的裝飾性操作提示；滑動行為仍由 Base UI 負責。 */
export const BottomSheetHandle = forwardRef<HTMLDivElement, BottomSheetHandleProps>(function BottomSheetHandle({ className, ...props }, ref) {
	return (
		<div {...props} ref={ref} aria-hidden="true" className={className ? `lyds-bottomSheet__handle ${className}` : "lyds-bottomSheet__handle"}>
			<span className="lyds-bottomSheet__handleBar" />
		</div>
	);
});

export const BottomSheetHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(function BottomSheetHeader({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-drawer__header lyds-bottomSheet__header ${className}` : "lyds-drawer__header lyds-bottomSheet__header"} />;
});

export const BottomSheetBody = forwardRef<HTMLDivElement, DrawerBodyProps>(function BottomSheetBody({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-drawer__body lyds-bottomSheet__body ${className}` : "lyds-drawer__body lyds-bottomSheet__body"} />;
});

export const BottomSheetFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function BottomSheetFooter({ className, ...props }, ref) {
	return <div {...props} ref={ref} className={className ? `lyds-drawer__footer lyds-bottomSheet__footer ${className}` : "lyds-drawer__footer lyds-bottomSheet__footer"} />;
});

export const BottomSheet = {
	Root: BottomSheetRoot,
	Trigger: DrawerTrigger,
	Portal: DrawerPortal,
	Backdrop: DrawerBackdrop,
	Viewport: DrawerViewport,
	Popup: BottomSheetPopup,
	Content: DrawerContent,
	Handle: BottomSheetHandle,
	Header: BottomSheetHeader,
	Body: BottomSheetBody,
	Footer: BottomSheetFooter,
	Title: DrawerTitle,
	Description: DrawerDescription,
	Close: DrawerClose,
	SwipeArea: DrawerSwipeArea,
	createHandle: BaseDrawer.createHandle,
	ImperativeHandle: BaseDrawer.Handle
} as const;
