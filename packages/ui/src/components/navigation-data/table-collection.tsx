import {
	forwardRef,
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type LiHTMLAttributes,
	type OlHTMLAttributes,
	type TableHTMLAttributes,
	type TdHTMLAttributes,
	type ThHTMLAttributes
} from "react";

import { cx } from "../../internal";
export const TableFrame = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TableFrame({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-table-frame", className)} {...props} />;
});

export const Table = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(function Table({ className, ...props }, ref) {
	return <table ref={ref} className={cx("lyds-table", className)} {...props} />;
});

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption({ className, ...props }, ref) {
	return <caption ref={ref} className={cx("lyds-table__caption", className)} {...props} />;
});

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableHeader({ className, ...props }, ref) {
	return <thead ref={ref} className={cx("lyds-table__header", className)} {...props} />;
});

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...props }, ref) {
	return <tbody ref={ref} className={cx("lyds-table__body", className)} {...props} />;
});

export const TableFooter = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableFooter({ className, ...props }, ref) {
	return <tfoot ref={ref} className={cx("lyds-table__footer", className)} {...props} />;
});

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow({ className, ...props }, ref) {
	return <tr ref={ref} className={cx("lyds-table__row", className)} {...props} />;
});

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
	textAlign?: "start" | "center" | "end";
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead({ className, scope = "col", textAlign = "start", ...props }, ref) {
	return <th ref={ref} className={cx("lyds-table__head", className)} data-align={textAlign} scope={scope} {...props} />;
});

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
	textAlign?: "start" | "center" | "end";
	numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ className, textAlign = "start", numeric = false, ...props }, ref) {
	return <td ref={ref} className={cx("lyds-table__cell", className)} data-align={textAlign} data-numeric={numeric ? "" : undefined} {...props} />;
});

/** 純呈現用結構。資料擷取、排序、篩選與分頁由使用端負責。 */
export const DataTable = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function DataTable({ className, ...props }, ref) {
	return <section ref={ref} className={cx("lyds-data-table", className)} {...props} />;
});

export const DataTableHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DataTableHeader({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-data-table__header", className)} {...props} />;
});

export const DataTableTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function DataTableTitle({ children, className, ...props }, ref) {
	return (
		<h2 ref={ref} className={cx("lyds-data-table__title", className)} {...props}>
			{children}
		</h2>
	);
});

export const DataTableDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function DataTableDescription({ className, ...props }, ref) {
	return <p ref={ref} className={cx("lyds-data-table__description", className)} {...props} />;
});

export const DataTableControls = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DataTableControls({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-data-table__controls", className)} {...props} />;
});

export interface DataTableRegionProps extends HTMLAttributes<HTMLDivElement> {
	label?: string;
}

export const DataTableRegion = forwardRef<HTMLDivElement, DataTableRegionProps>(function DataTableRegion({ className, label, ...props }, ref) {
	return <div ref={ref} aria-label={label} className={cx("lyds-data-table__region", className)} role={label ? "region" : undefined} {...props} />;
});

export const DataTableStatus = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function DataTableStatus({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-data-table__status", className)} {...props} />;
});

export interface CollectionProps extends HTMLAttributes<HTMLUListElement> {
	density?: "comfortable" | "compact";
}

export const Collection = forwardRef<HTMLUListElement, CollectionProps>(function Collection({ className, density = "comfortable", ...props }, ref) {
	return <ul ref={ref} className={cx("lyds-collection", className)} data-density={density} {...props} />;
});

export interface OrderedCollectionProps extends OlHTMLAttributes<HTMLOListElement> {
	density?: "comfortable" | "compact";
}

export const OrderedCollection = forwardRef<HTMLOListElement, OrderedCollectionProps>(function OrderedCollection({ className, density = "comfortable", ...props }, ref) {
	return <ol ref={ref} className={cx("lyds-collection", className)} data-density={density} {...props} />;
});

export type CollectionItemProps = LiHTMLAttributes<HTMLLIElement>;

export const CollectionItem = forwardRef<HTMLLIElement, CollectionItemProps>(function CollectionItem({ className, ...props }, ref) {
	return <li ref={ref} className={cx("lyds-collection__item", className)} {...props} />;
});

export const CollectionContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CollectionContent({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-collection__content", className)} {...props} />;
});

export const CollectionHeading = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(function CollectionHeading({ children, className, ...props }, ref) {
	return (
		<h3 ref={ref} className={cx("lyds-collection__heading", className)} {...props}>
			{children}
		</h3>
	);
});

export const CollectionDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(function CollectionDescription({ className, ...props }, ref) {
	return <p ref={ref} className={cx("lyds-collection__description", className)} {...props} />;
});

export const CollectionMeta = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CollectionMeta({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-collection__meta", className)} {...props} />;
});

export const CollectionActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CollectionActions({ className, ...props }, ref) {
	return <div ref={ref} className={cx("lyds-collection__actions", className)} {...props} />;
});

export interface CollectionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	selected?: boolean;
}

export const CollectionLink = forwardRef<HTMLAnchorElement, CollectionLinkProps>(function CollectionLink({ children, className, selected = false, ...props }, ref) {
	return (
		<a ref={ref} aria-current={selected ? "page" : undefined} className={cx("lyds-collection__interactive", className)} data-selected={selected ? "" : undefined} {...props}>
			{children}
		</a>
	);
});

export interface CollectionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	selected?: boolean;
}

export const CollectionButton = forwardRef<HTMLButtonElement, CollectionButtonProps>(function CollectionButton({ className, selected = false, type = "button", ...props }, ref) {
	return <button ref={ref} aria-pressed={selected} className={cx("lyds-collection__interactive", className)} data-selected={selected ? "" : undefined} type={type} {...props} />;
});

export const List = Collection;
export const OrderedList = OrderedCollection;
export const ListItem = CollectionItem;
export const ListContent = CollectionContent;
export const ListHeading = CollectionHeading;
export const ListDescription = CollectionDescription;
export const ListMeta = CollectionMeta;
export const ListActions = CollectionActions;
export const ListLink = CollectionLink;
export const ListButton = CollectionButton;
