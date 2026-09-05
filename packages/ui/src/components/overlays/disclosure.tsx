import {
	Accordion as BaseAccordion,
	type AccordionHeaderProps,
	type AccordionItemProps,
	type AccordionPanelProps,
	type AccordionRootProps,
	type AccordionTriggerProps
} from "@base-ui/react/accordion";
import { Collapsible as BaseCollapsible, type CollapsiblePanelProps, type CollapsibleRootProps, type CollapsibleTriggerProps } from "@base-ui/react/collapsible";
import { Tabs as BaseTabs, type TabsIndicatorProps, type TabsListProps, type TabsPanelProps, type TabsRootProps, type TabsTabProps } from "@base-ui/react/tabs";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { forwardRef, type JSX } from "react";

import { withStateClassName } from "@/internal";
export type { AccordionRootChangeEventDetails } from "@base-ui/react/accordion";
export type { CollapsibleRootChangeEventDetails } from "@base-ui/react/collapsible";
export type { TabsRootChangeEventDetails } from "@base-ui/react/tabs";

export function AccordionRoot<Value = string>(props: AccordionRootProps<Value>): JSX.Element {
	const { className, ...rootProps } = props;

	return <BaseAccordion.Root {...rootProps} className={withStateClassName("lyds-accordion", className)} />;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem({ className, ...props }, ref) {
	return <BaseAccordion.Item {...props} ref={ref} className={withStateClassName("lyds-accordion__item", className)} />;
});

export const AccordionHeader = forwardRef<HTMLHeadingElement, AccordionHeaderProps>(function AccordionHeader({ className, ...props }, ref) {
	return <BaseAccordion.Header {...props} ref={ref} className={withStateClassName("lyds-accordion__header", className)} />;
});

export const AccordionTrigger = forwardRef<HTMLElement, AccordionTriggerProps>(function AccordionTrigger({ children, className, ...props }, ref) {
	return (
		<BaseAccordion.Trigger {...props} ref={ref} className={withStateClassName("lyds-accordion__trigger", className)}>
			<span className="lyds-accordion__label">{children}</span>
			<span className="lyds-accordion__indicator" aria-hidden="true">
				<CaretDownIcon aria-hidden="true" weight="bold" />
			</span>
		</BaseAccordion.Trigger>
	);
});

export const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(function AccordionPanel({ children, className, ...props }, ref) {
	return (
		<BaseAccordion.Panel {...props} ref={ref} className={withStateClassName("lyds-accordion__panel", className)}>
			<div className="lyds-accordion__panelContent">{children}</div>
		</BaseAccordion.Panel>
	);
});

export const Accordion = {
	Root: AccordionRoot,
	Item: AccordionItem,
	Header: AccordionHeader,
	Trigger: AccordionTrigger,
	Panel: AccordionPanel
} as const;

export const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleRootProps>(function CollapsibleRoot({ className, ...props }, ref) {
	return <BaseCollapsible.Root {...props} ref={ref} className={withStateClassName("lyds-collapsible", className)} />;
});

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(function CollapsibleTrigger({ children, className, ...props }, ref) {
	return (
		<BaseCollapsible.Trigger {...props} ref={ref} className={withStateClassName("lyds-collapsible__trigger", className)}>
			<span className="lyds-collapsible__label">{children}</span>
			<span className="lyds-collapsible__indicator" aria-hidden="true">
				<CaretDownIcon aria-hidden="true" weight="bold" />
			</span>
		</BaseCollapsible.Trigger>
	);
});

export const CollapsiblePanel = forwardRef<HTMLDivElement, CollapsiblePanelProps>(function CollapsiblePanel({ children, className, ...props }, ref) {
	return (
		<BaseCollapsible.Panel {...props} ref={ref} className={withStateClassName("lyds-collapsible__panel", className)}>
			<div className="lyds-collapsible__panelContent">{children}</div>
		</BaseCollapsible.Panel>
	);
});

export const Collapsible = {
	Root: CollapsibleRoot,
	Trigger: CollapsibleTrigger,
	Panel: CollapsiblePanel
} as const;

export const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot({ className, ...props }, ref) {
	return <BaseTabs.Root {...props} ref={ref} className={withStateClassName("lyds-tabs", className)} />;
});

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList({ className, ...props }, ref) {
	return <BaseTabs.List {...props} ref={ref} className={withStateClassName("lyds-tabs__list", className)} />;
});

export const TabsTab = forwardRef<HTMLElement, TabsTabProps>(function TabsTab({ className, ...props }, ref) {
	return <BaseTabs.Tab {...props} ref={ref} className={withStateClassName("lyds-tabs__tab", className)} />;
});

/** Base UI 指示器的進階自訂介面。作用中的分頁已有自身選取樣式，因此 Linyao Design System 預設隱藏此元件。 */
export const TabsIndicator = forwardRef<HTMLSpanElement, TabsIndicatorProps>(function TabsIndicator({ className, ...props }, ref) {
	return <BaseTabs.Indicator {...props} ref={ref} className={withStateClassName("lyds-tabs__indicator", className)} />;
});

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel({ className, ...props }, ref) {
	return <BaseTabs.Panel {...props} ref={ref} className={withStateClassName("lyds-tabs__panel", className)} />;
});

export const Tabs = {
	Root: TabsRoot,
	List: TabsList,
	Tab: TabsTab,
	Indicator: TabsIndicator,
	Panel: TabsPanel
} as const;
