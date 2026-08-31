import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { forwardRef, type ComponentRef } from "react";

import { withBaseClass } from "./utils.js";

export const ScrollArea = forwardRef<ComponentRef<typeof BaseScrollArea.Root>, BaseScrollArea.Root.Props>(function ScrollArea(props, ref) {
	const { className, ...rootProps } = props;
	return <BaseScrollArea.Root ref={ref} className={withBaseClass<BaseScrollArea.Root.State>("lyds-scroll-area", className)} {...rootProps} />;
});

export const ScrollAreaViewport = forwardRef<ComponentRef<typeof BaseScrollArea.Viewport>, BaseScrollArea.Viewport.Props>(function ScrollAreaViewport(props, ref) {
	const { className, ...viewportProps } = props;
	return <BaseScrollArea.Viewport ref={ref} className={withBaseClass<BaseScrollArea.Viewport.State>("lyds-scroll-area__viewport", className)} {...viewportProps} />;
});

export const ScrollAreaContent = forwardRef<ComponentRef<typeof BaseScrollArea.Content>, BaseScrollArea.Content.Props>(function ScrollAreaContent(props, ref) {
	const { className, ...contentProps } = props;
	return <BaseScrollArea.Content ref={ref} className={withBaseClass<BaseScrollArea.Content.State>("lyds-scroll-area__content", className)} {...contentProps} />;
});

export const ScrollAreaScrollbar = forwardRef<ComponentRef<typeof BaseScrollArea.Scrollbar>, BaseScrollArea.Scrollbar.Props>(function ScrollAreaScrollbar(props, ref) {
	const { className, ...scrollbarProps } = props;
	return <BaseScrollArea.Scrollbar ref={ref} className={withBaseClass<BaseScrollArea.Scrollbar.State>("lyds-scroll-area__scrollbar", className)} {...scrollbarProps} />;
});

export const ScrollAreaThumb = forwardRef<ComponentRef<typeof BaseScrollArea.Thumb>, BaseScrollArea.Thumb.Props>(function ScrollAreaThumb(props, ref) {
	const { className, ...thumbProps } = props;
	return <BaseScrollArea.Thumb ref={ref} className={withBaseClass<BaseScrollArea.Thumb.State>("lyds-scroll-area__thumb", className)} {...thumbProps} />;
});

export const ScrollAreaCorner = forwardRef<ComponentRef<typeof BaseScrollArea.Corner>, BaseScrollArea.Corner.Props>(function ScrollAreaCorner(props, ref) {
	const { className, ...cornerProps } = props;
	return <BaseScrollArea.Corner ref={ref} className={withBaseClass<BaseScrollArea.Corner.State>("lyds-scroll-area__corner", className)} {...cornerProps} />;
});
