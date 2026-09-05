import { type ComponentRenderProp, cx, type ElementProps } from "@/internal";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
export type ListCellVariant = "default" | "inset";
export type ListCellSize = "sm" | "md" | "lg";
export type ListCellCurrentSemantics = "page" | "step" | "location" | "date" | "time";

export interface ListCellState extends Record<string, unknown> {
	disabled: boolean;
	interactive: boolean;
	selected: boolean;
	size: ListCellSize;
	variant: ListCellVariant;
}

type ListCellSelectionProps =
	| {
			selected?: never;
			selectionSemantics?: never;
	  }
	| {
			selected: boolean;
			selectionSemantics: ListCellCurrentSemantics;
	  }
	| {
			selected: boolean;
			selectionSemantics: "selected";
			role: "gridcell" | "option" | "row" | "tab" | "treeitem";
	  };

export type ListCellProps = Omit<ElementProps<"div">, "children" | "title"> &
	ListCellSelectionProps & {
		children?: React.ReactNode;
		leading?: React.ReactNode;
		title?: React.ReactNode;
		description?: React.ReactNode;
		metadata?: React.ReactNode;
		trailing?: React.ReactNode;
		action?: ListCellActionProps;
		actionRef?: React.Ref<HTMLElement>;
		variant?: ListCellVariant;
		size?: ListCellSize;
		disabled?: boolean;
		render?: ComponentRenderProp<ListCellState>;
	};

interface ListCellContextValue {
	current: ListCellCurrentSemantics | false | undefined;
	disabled: boolean;
}

const ListCellContext = React.createContext<ListCellContextValue>({ current: undefined, disabled: false });

type AccessibleName =
	| {
			"aria-label": string;
			"aria-labelledby"?: string;
	  }
	| {
			"aria-label"?: string;
			"aria-labelledby": string;
	  };

type ListCellLinkActionProps = Omit<ElementProps<"a">, "aria-label" | "aria-labelledby" | "children" | "className"> & {
	href: string;
	className?: string;
	disabled?: boolean;
};

type ListCellButtonActionProps = Omit<ElementProps<"button">, "aria-label" | "aria-labelledby" | "children" | "className" | "href"> & {
	href?: never;
	className?: string;
	disabled?: boolean;
};

export type ListCellActionProps = AccessibleName & (ListCellLinkActionProps | ListCellButtonActionProps);

export const ListCellAction = React.forwardRef<HTMLElement, ListCellActionProps>(function ListCellAction(props, ref) {
	const context = React.useContext(ListCellContext);
	const disabled = context.disabled || props.disabled === true;

	if ("href" in props && props.href !== undefined) {
		const { className, href, onClick, rel, target, ...linkProps } = props;
		return (
			<a
				{...linkProps}
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={disabled ? undefined : href}
				target={target}
				rel={target === "_blank" && !rel ? "noopener noreferrer" : rel}
				aria-current={props["aria-current"] ?? context.current}
				aria-disabled={disabled || undefined}
				tabIndex={disabled ? -1 : linkProps.tabIndex}
				className={cx("lyds-list-cell__action", className)}
				onClick={event => {
					if (disabled) {
						event.preventDefault();
						return;
					}
					onClick?.(event);
				}}
			>
				<span className="lyds-sr-only">{props["aria-label"] ?? ""}</span>
			</a>
		);
	}

	const { className, onClick, type, ...buttonProps } = props;
	return (
		<button
			{...buttonProps}
			ref={ref as React.Ref<HTMLButtonElement>}
			type={type ?? "button"}
			disabled={disabled}
			aria-current={props["aria-current"] ?? context.current}
			className={cx("lyds-list-cell__action", className)}
			onClick={onClick}
		/>
	);
});

ListCellAction.displayName = "ListCellAction";

export const ListCell = React.forwardRef<HTMLElement, ListCellProps>(function ListCell(
	{
		children,
		leading,
		title,
		description,
		metadata,
		trailing,
		action,
		actionRef,
		variant = "default",
		size = "md",
		selected = false,
		selectionSemantics,
		disabled = false,
		render,
		className,
		...props
	},
	ref
) {
	const interactive = action != null;
	const state: ListCellState = { disabled, interactive, selected, size, variant };
	const slotContent = children ?? (
		<>
			{leading != null ? <ListCellLeading>{leading}</ListCellLeading> : null}
			<ListCellContent>
				{title != null ? <ListCellTitle>{title}</ListCellTitle> : null}
				{description != null ? <ListCellDescription>{description}</ListCellDescription> : null}
			</ListCellContent>
			{metadata != null ? <ListCellMetadata>{metadata}</ListCellMetadata> : null}
			{trailing != null ? <ListCellTrailing>{trailing}</ListCellTrailing> : null}
		</>
	);
	const currentSemantics = selectionSemantics && selectionSemantics !== "selected" ? selectionSemantics : undefined;
	const current = currentSemantics ? (selected ? currentSemantics : false) : undefined;

	return useRender<ListCellState, HTMLElement>({
		defaultTagName: "div",
		ref,
		render,
		state,
		props: {
			...props,
			className: cx("lyds-list-cell", className),
			"aria-current": !action && current !== undefined ? current : props["aria-current"],
			"aria-disabled": !action && disabled ? true : props["aria-disabled"],
			"aria-selected": selectionSemantics === "selected" ? selected : props["aria-selected"],
			children: (
				<ListCellContext.Provider value={{ current, disabled }}>
					{action ? <ListCellAction ref={actionRef} {...action} /> : null}
					{slotContent}
				</ListCellContext.Provider>
			)
		}
	});
});

ListCell.displayName = "ListCell";

type ListCellSlotName = "leading" | "content" | "title" | "description" | "metadata" | "trailing";

interface ListCellSlotProps extends Omit<ElementProps<"span">, "children"> {
	children: React.ReactNode;
	render?: ComponentRenderProp<Record<string, unknown>>;
}

function createListCellSlot(slotName: ListCellSlotName) {
	const Slot = React.forwardRef<HTMLElement, ListCellSlotProps>(function ListCellSlot({ children, render, className, ...props }, ref) {
		return useRender<Record<string, unknown>, HTMLElement>({
			defaultTagName: "span",
			ref,
			render,
			props: {
				...props,
				children,
				className: cx(`lyds-list-cell__${slotName}`, className)
			}
		});
	});

	Slot.displayName = `ListCell${slotName[0]?.toUpperCase() ?? ""}${slotName.slice(1)}`;
	return Slot;
}

export const ListCellLeading = createListCellSlot("leading");
export const ListCellContent = createListCellSlot("content");
export const ListCellTitle = createListCellSlot("title");
export const ListCellDescription = createListCellSlot("description");
export const ListCellMetadata = createListCellSlot("metadata");
export const ListCellTrailing = createListCellSlot("trailing");
