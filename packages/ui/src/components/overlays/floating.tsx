import {
	Popover as BasePopover,
	type PopoverCloseProps as BasePopoverCloseProps,
	type PopoverArrowProps,
	type PopoverBackdropProps,
	type PopoverDescriptionProps,
	type PopoverPopupProps,
	type PopoverPortalProps,
	type PopoverPositionerProps,
	type PopoverRootProps,
	type PopoverTitleProps,
	type PopoverTriggerProps,
	type PopoverViewportProps
} from "@base-ui/react/popover";
import {
	PreviewCard as BasePreviewCard,
	type PreviewCardArrowProps,
	type PreviewCardBackdropProps,
	type PreviewCardPopupProps,
	type PreviewCardPortalProps,
	type PreviewCardPositionerProps,
	type PreviewCardRootProps,
	type PreviewCardTriggerProps,
	type PreviewCardViewportProps
} from "@base-ui/react/preview-card";
import {
	Tooltip as BaseTooltip,
	type TooltipPopupProps as BaseTooltipPopupProps,
	type TooltipRootProps as BaseTooltipRootProps,
	type TooltipArrowProps,
	type TooltipPortalProps,
	type TooltipPositionerProps,
	type TooltipProviderProps,
	type TooltipTriggerProps,
	type TooltipViewportProps
} from "@base-ui/react/tooltip";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { createContext, forwardRef, useContext, useId, type JSX, type RefAttributes } from "react";

import { mergeClassName } from "./class-names";

export type { PopoverRootChangeEventDetails } from "@base-ui/react/popover";
export type { PreviewCardRootChangeEventDetails } from "@base-ui/react/preview-card";
export type { TooltipRootChangeEventDetails } from "@base-ui/react/tooltip";

const TooltipDescriptionContext = createContext<string | undefined>(undefined);

function CloseGlyph(): JSX.Element {
	return <XIcon aria-hidden="true" className="lyds-overlayClose__glyph" weight="bold" />;
}

export function TooltipProvider(props: TooltipProviderProps): JSX.Element {
	return <BaseTooltip.Provider {...props} />;
}

export interface TooltipRootProps<Payload = unknown> extends BaseTooltipRootProps<Payload> {
	/** 將觸發項目與 Tooltip 說明關聯的穩定 id。 */
	descriptionId?: string;
}

export type TooltipPopupProps = Omit<BaseTooltipPopupProps, "id" | "role">;

export function TooltipRoot<Payload = unknown>({ descriptionId, ...props }: TooltipRootProps<Payload>): JSX.Element {
	const generatedId = useId();
	return (
		<TooltipDescriptionContext.Provider value={descriptionId ?? `lyds-tooltip-${generatedId}`}>
			<BaseTooltip.Root {...props} />
		</TooltipDescriptionContext.Provider>
	);
}

export function TooltipTrigger<Payload = unknown>({ className, ...props }: TooltipTriggerProps<Payload> & RefAttributes<HTMLElement>): JSX.Element {
	const descriptionId = useContext(TooltipDescriptionContext);
	const describedBy = [props["aria-describedby"], descriptionId].filter(Boolean).join(" ") || undefined;
	return <BaseTooltip.Trigger {...props} aria-describedby={describedBy} className={mergeClassName("lyds-tooltip__trigger", className)} />;
}

export const TooltipPortal = forwardRef<HTMLDivElement, TooltipPortalProps>(function TooltipPortal(props, ref) {
	return <BaseTooltip.Portal {...props} ref={ref} />;
});

export const TooltipPositioner = forwardRef<HTMLDivElement, TooltipPositionerProps>(function TooltipPositioner({ className, sideOffset = 8, ...props }, ref) {
	return <BaseTooltip.Positioner {...props} ref={ref} sideOffset={sideOffset} className={mergeClassName("lyds-tooltip__positioner", className)} />;
});

export const TooltipPopup = forwardRef<HTMLDivElement, TooltipPopupProps>(function TooltipPopup({ className, ...props }, ref) {
	const descriptionId = useContext(TooltipDescriptionContext);
	return <BaseTooltip.Popup {...props} ref={ref} id={descriptionId} role="tooltip" className={mergeClassName("lyds-tooltip__popup", className)} />;
});

export const TooltipArrow = forwardRef<HTMLDivElement, TooltipArrowProps>(function TooltipArrow({ className, ...props }, ref) {
	return <BaseTooltip.Arrow {...props} ref={ref} className={mergeClassName("lyds-tooltip__arrow", className)} />;
});

export const TooltipViewport = forwardRef<HTMLDivElement, TooltipViewportProps>(function TooltipViewport({ className, ...props }, ref) {
	return <BaseTooltip.Viewport {...props} ref={ref} className={mergeClassName("lyds-tooltip__viewport", className)} />;
});

export const Tooltip = {
	Provider: TooltipProvider,
	Root: TooltipRoot,
	Trigger: TooltipTrigger,
	Portal: TooltipPortal,
	Positioner: TooltipPositioner,
	Popup: TooltipPopup,
	Arrow: TooltipArrow,
	Viewport: TooltipViewport,
	createHandle: BaseTooltip.createHandle,
	Handle: BaseTooltip.Handle
} as const;

export function PopoverRoot<Payload = unknown>(props: PopoverRootProps<Payload>): JSX.Element {
	return <BasePopover.Root {...props} />;
}

export function PopoverTrigger<Payload = unknown>({ className, ...props }: PopoverTriggerProps<Payload> & RefAttributes<HTMLElement>): JSX.Element {
	return <BasePopover.Trigger {...props} className={mergeClassName("lyds-popover__trigger", className)} />;
}

export const PopoverPortal = forwardRef<HTMLDivElement, PopoverPortalProps>(function PopoverPortal(props, ref) {
	return <BasePopover.Portal {...props} ref={ref} />;
});

export const PopoverPositioner = forwardRef<HTMLDivElement, PopoverPositionerProps>(function PopoverPositioner({ className, sideOffset = 10, ...props }, ref) {
	return <BasePopover.Positioner {...props} ref={ref} sideOffset={sideOffset} className={mergeClassName("lyds-popover__positioner", className)} />;
});

export const PopoverBackdrop = forwardRef<HTMLDivElement, PopoverBackdropProps>(function PopoverBackdrop({ className, ...props }, ref) {
	return <BasePopover.Backdrop {...props} ref={ref} className={mergeClassName("lyds-popover__backdrop", className)} />;
});

export const PopoverPopup = forwardRef<HTMLDivElement, PopoverPopupProps>(function PopoverPopup({ className, ...props }, ref) {
	return <BasePopover.Popup {...props} ref={ref} className={mergeClassName("lyds-popover__popup", className)} />;
});

export const PopoverArrow = forwardRef<HTMLDivElement, PopoverArrowProps>(function PopoverArrow({ className, ...props }, ref) {
	return <BasePopover.Arrow {...props} ref={ref} className={mergeClassName("lyds-popover__arrow", className)} />;
});

export const PopoverTitle = forwardRef<HTMLHeadingElement, PopoverTitleProps>(function PopoverTitle({ className, ...props }, ref) {
	return <BasePopover.Title {...props} ref={ref} className={mergeClassName("lyds-popover__title", className)} />;
});

export const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(function PopoverDescription({ className, ...props }, ref) {
	return <BasePopover.Description {...props} ref={ref} className={mergeClassName("lyds-popover__description", className)} />;
});

export interface PopoverCloseProps extends BasePopoverCloseProps {
	/** 圖示控制項位於面板角落；動作控制項則參與內容排版。 */
	variant?: "icon" | "action";
}

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(function PopoverClose(
	{ "aria-label": ariaLabel, children, className, variant = children == null ? "icon" : "action", ...props },
	ref
) {
	return (
		<BasePopover.Close
			{...props}
			ref={ref}
			aria-label={ariaLabel ?? (children == null ? "關閉彈出視窗" : undefined)}
			className={mergeClassName(variant === "icon" ? "lyds-overlayClose" : "lyds-overlayCloseAction", className)}
		>
			{children ?? <CloseGlyph />}
		</BasePopover.Close>
	);
});

export const PopoverViewport = forwardRef<HTMLDivElement, PopoverViewportProps>(function PopoverViewport({ className, ...props }, ref) {
	return <BasePopover.Viewport {...props} ref={ref} className={mergeClassName("lyds-popover__viewport", className)} />;
});

export const Popover = {
	Root: PopoverRoot,
	Trigger: PopoverTrigger,
	Portal: PopoverPortal,
	Positioner: PopoverPositioner,
	Backdrop: PopoverBackdrop,
	Popup: PopoverPopup,
	Arrow: PopoverArrow,
	Title: PopoverTitle,
	Description: PopoverDescription,
	Close: PopoverClose,
	Viewport: PopoverViewport,
	createHandle: BasePopover.createHandle,
	Handle: BasePopover.Handle
} as const;

export function PreviewCardRoot<Payload = unknown>(props: PreviewCardRootProps<Payload>): JSX.Element {
	return <BasePreviewCard.Root {...props} />;
}

export function PreviewCardTrigger<Payload = unknown>({ className, ...props }: PreviewCardTriggerProps<Payload> & RefAttributes<HTMLElement>): JSX.Element {
	return <BasePreviewCard.Trigger {...props} className={mergeClassName("lyds-previewCard__trigger", className)} />;
}

export const PreviewCardPortal = forwardRef<HTMLDivElement, PreviewCardPortalProps>(function PreviewCardPortal(props, ref) {
	return <BasePreviewCard.Portal {...props} ref={ref} />;
});

export const PreviewCardPositioner = forwardRef<HTMLDivElement, PreviewCardPositionerProps>(function PreviewCardPositioner({ className, sideOffset = 10, ...props }, ref) {
	return <BasePreviewCard.Positioner {...props} ref={ref} sideOffset={sideOffset} className={mergeClassName("lyds-previewCard__positioner", className)} />;
});

/** PreviewCard 僅補充觸發項目的資訊；必要內容仍應顯示於頁面中。 */
export const PreviewCardPopup = forwardRef<HTMLDivElement, PreviewCardPopupProps>(function PreviewCardPopup({ className, ...props }, ref) {
	return <BasePreviewCard.Popup {...props} ref={ref} className={mergeClassName("lyds-previewCard__popup", className)} />;
});

export const PreviewCardArrow = forwardRef<HTMLDivElement, PreviewCardArrowProps>(function PreviewCardArrow({ className, ...props }, ref) {
	return <BasePreviewCard.Arrow {...props} ref={ref} className={mergeClassName("lyds-previewCard__arrow", className)} />;
});

export const PreviewCardBackdrop = forwardRef<HTMLDivElement, PreviewCardBackdropProps>(function PreviewCardBackdrop({ className, ...props }, ref) {
	return <BasePreviewCard.Backdrop {...props} ref={ref} className={mergeClassName("lyds-previewCard__backdrop", className)} />;
});

export const PreviewCardViewport = forwardRef<HTMLDivElement, PreviewCardViewportProps>(function PreviewCardViewport({ className, ...props }, ref) {
	return <BasePreviewCard.Viewport {...props} ref={ref} className={mergeClassName("lyds-previewCard__viewport", className)} />;
});

export const PreviewCard = {
	Root: PreviewCardRoot,
	Trigger: PreviewCardTrigger,
	Portal: PreviewCardPortal,
	Positioner: PreviewCardPositioner,
	Popup: PreviewCardPopup,
	Arrow: PreviewCardArrow,
	Backdrop: PreviewCardBackdrop,
	Viewport: PreviewCardViewport,
	createHandle: BasePreviewCard.createHandle,
	Handle: BasePreviewCard.Handle
} as const;
