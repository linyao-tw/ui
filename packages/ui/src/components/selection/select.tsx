import {
	Select as BaseSelect,
	type SelectGroupLabelProps,
	type SelectItemIndicatorProps,
	type SelectItemProps,
	type SelectItemTextProps,
	type SelectListProps,
	type SelectPopupProps,
	type SelectPositionerProps,
	type SelectRootProps,
	type SelectSeparatorProps,
	type SelectTriggerProps,
	type SelectValueProps
} from "@base-ui/react/select";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { forwardRef, type Key, type ReactNode } from "react";

import { combineStateClassNames, withStateClassName } from "../../internal";
import styles from "./selection.module.css";

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger({ className, ...props }, ref) {
	return <BaseSelect.Trigger {...props} className={withStateClassName(styles.selectTrigger, className)} ref={ref} />;
});

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(function SelectValue({ className, ...props }, ref) {
	return <BaseSelect.Value {...props} className={withStateClassName(styles.selectValue, className)} ref={ref} />;
});

export const SelectPositioner = forwardRef<HTMLDivElement, SelectPositionerProps>(function SelectPositioner({ className, ...props }, ref) {
	return <BaseSelect.Positioner {...props} className={withStateClassName(styles.positioner, className)} ref={ref} />;
});

export const SelectPopup = forwardRef<HTMLDivElement, SelectPopupProps>(function SelectPopup({ className, ...props }, ref) {
	return <BaseSelect.Popup {...props} className={withStateClassName(styles.popup, className)} ref={ref} />;
});

export const SelectList = forwardRef<HTMLDivElement, SelectListProps>(function SelectList({ className, ...props }, ref) {
	return <BaseSelect.List {...props} className={withStateClassName(styles.optionList, className)} ref={ref} />;
});

export const SelectItem = forwardRef<HTMLElement, SelectItemProps>(function SelectItem({ className, ...props }, ref) {
	return <BaseSelect.Item {...props} className={withStateClassName(styles.option, className)} ref={ref} />;
});

export const SelectItemIndicator = forwardRef<HTMLSpanElement, SelectItemIndicatorProps>(function SelectItemIndicator({ className, ...props }, ref) {
	return <BaseSelect.ItemIndicator {...props} className={withStateClassName(styles.optionIndicator, className)} ref={ref} />;
});

export const SelectItemText = forwardRef<HTMLDivElement, SelectItemTextProps>(function SelectItemText({ className, ...props }, ref) {
	return <BaseSelect.ItemText {...props} className={withStateClassName(styles.optionText, className)} ref={ref} />;
});

export const SelectGroupLabel = forwardRef<HTMLDivElement, SelectGroupLabelProps>(function SelectGroupLabel({ className, ...props }, ref) {
	return <BaseSelect.GroupLabel {...props} className={withStateClassName(styles.groupLabel, className)} ref={ref} />;
});

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(function SelectSeparator({ className, ...props }, ref) {
	return <BaseSelect.Separator {...props} className={withStateClassName(styles.separator, className)} ref={ref} />;
});

export interface SelectOption<Value> {
	description?: ReactNode;
	disabled?: boolean;
	key?: Key;
	label: ReactNode;
	textValue?: string;
	value: Value;
}

export interface SelectProps<Value> extends Omit<SelectRootProps<Value, false>, "children" | "items" | "multiple"> {
	"aria-describedby"?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	className?: string;
	invalid?: boolean;
	options: readonly SelectOption<Value>[];
	placeholder?: ReactNode;
	popupProps?: SelectPopupProps;
	positionerProps?: SelectPositionerProps;
	triggerProps?: Omit<SelectTriggerProps, "children">;
}

function SelectComponent<Value>({
	"aria-describedby": ariaDescribedby,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledby,
	className,
	invalid = false,
	options,
	placeholder = "請選擇",
	popupProps,
	positionerProps,
	triggerProps,
	...rootProps
}: SelectProps<Value>) {
	const items = options.map(option => ({ label: option.label, value: option.value }));

	return (
		<BaseSelect.Root {...rootProps} items={items}>
			<SelectTrigger
				{...triggerProps}
				aria-describedby={ariaDescribedby ?? triggerProps?.["aria-describedby"]}
				aria-invalid={invalid || triggerProps?.["aria-invalid"] || undefined}
				aria-label={ariaLabel ?? triggerProps?.["aria-label"]}
				aria-labelledby={ariaLabelledby ?? triggerProps?.["aria-labelledby"]}
				className={combineStateClassNames(className, triggerProps?.className)}
			>
				<SelectValue placeholder={placeholder} />
				<BaseSelect.Icon aria-hidden="true" className={styles.selectIcon}>
					<CaretDownIcon aria-hidden="true" weight="bold" />
				</BaseSelect.Icon>
			</SelectTrigger>
			<BaseSelect.Portal>
				<SelectPositioner alignItemWithTrigger={false} {...positionerProps}>
					<SelectPopup {...popupProps}>
						<SelectList>
							{options.map((option, index) => (
								<SelectItem disabled={option.disabled} key={option.key ?? option.textValue ?? index} label={option.textValue} value={option.value}>
									<SelectItemIndicator>
										<CheckIcon aria-hidden="true" weight="bold" />
									</SelectItemIndicator>
									<SelectItemText>
										<span>{option.label}</span>
										{option.description ? <span className={styles.optionDescription}>{option.description}</span> : null}
									</SelectItemText>
								</SelectItem>
							))}
						</SelectList>
					</SelectPopup>
				</SelectPositioner>
			</BaseSelect.Portal>
		</BaseSelect.Root>
	);
}

export const Select = Object.assign(SelectComponent, {
	Arrow: BaseSelect.Arrow,
	Backdrop: BaseSelect.Backdrop,
	Group: BaseSelect.Group,
	GroupLabel: SelectGroupLabel,
	Icon: BaseSelect.Icon,
	Item: SelectItem,
	ItemIndicator: SelectItemIndicator,
	ItemText: SelectItemText,
	Label: BaseSelect.Label,
	List: SelectList,
	Popup: SelectPopup,
	Portal: BaseSelect.Portal,
	Positioner: SelectPositioner,
	Root: BaseSelect.Root,
	ScrollDownArrow: BaseSelect.ScrollDownArrow,
	ScrollUpArrow: BaseSelect.ScrollUpArrow,
	Separator: SelectSeparator,
	Trigger: SelectTrigger,
	Value: SelectValue
});
