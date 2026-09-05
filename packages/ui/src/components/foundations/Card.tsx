import { type ComponentRenderProp, cx, type ElementProps } from "@/internal";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
export type CardVariant = "material" | "elevated" | "inset" | "outline" | "cloud";
export type CardSize = "sm" | "md" | "lg";

export interface CardState extends Record<string, unknown> {
	size: CardSize;
	variant: CardVariant;
}

export interface CardProps extends Omit<ElementProps<"div">, "children"> {
	children: React.ReactNode;
	variant?: CardVariant;
	size?: CardSize;
	render?: ComponentRenderProp<CardState>;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card({ children, variant = "material", size = "md", render, className, ...props }, ref) {
	return useRender<CardState, HTMLDivElement>({
		defaultTagName: "div",
		ref,
		render,
		state: { size, variant },
		props: {
			...props,
			children,
			className: cx("lyds-card", className)
		}
	});
});

Card.displayName = "Card";

export type CloudBoxProps = Omit<CardProps, "variant">;

export const CloudBox = React.forwardRef<HTMLDivElement, CloudBoxProps>(function CloudBox(props, ref) {
	return <Card {...props} ref={ref} variant="cloud" />;
});

CloudBox.displayName = "CloudBox";

type CardSlotProps<ElementType extends React.ElementType> = Omit<ElementProps<ElementType>, "children"> & {
	children: React.ReactNode;
	render?: ComponentRenderProp<Record<string, unknown>>;
};

function useCardSlot<Element extends HTMLElement>(
	defaultTagName: keyof React.JSX.IntrinsicElements,
	slotName: string,
	children: React.ReactNode,
	render: ComponentRenderProp<Record<string, unknown>> | undefined,
	className: string | undefined,
	props: Record<string, unknown>,
	ref: React.ForwardedRef<Element>
) {
	return useRender<Record<string, unknown>, Element>({
		defaultTagName,
		ref,
		render,
		props: {
			...props,
			children,
			className: cx(`lyds-card__${slotName}`, className)
		}
	});
}

export type CardHeaderProps = CardSlotProps<"div">;
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader({ children, render, className, ...props }, ref) {
	return useCardSlot("div", "header", children, render, className, props, ref);
});

export type CardTitleProps = CardSlotProps<"h3">;
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle({ children, render, className, ...props }, ref) {
	return useCardSlot("h3", "title", children, render, className, props, ref);
});

export type CardDescriptionProps = CardSlotProps<"p">;
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(function CardDescription({ children, render, className, ...props }, ref) {
	return useCardSlot("p", "description", children, render, className, props, ref);
});

export type CardBodyProps = CardSlotProps<"div">;
export const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(function CardBody({ children, render, className, ...props }, ref) {
	return useCardSlot("div", "body", children, render, className, props, ref);
});

export type CardFooterProps = CardSlotProps<"div">;
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter({ children, render, className, ...props }, ref) {
	return useCardSlot("div", "footer", children, render, className, props, ref);
});
