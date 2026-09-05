import { Autocomplete as BaseAutocomplete, type AutocompleteInputGroupProps, type AutocompleteItemProps, type AutocompleteRootProps } from "@base-ui/react/autocomplete";
import {
	Combobox as BaseCombobox,
	type ComboboxClearProps,
	type ComboboxEmptyProps,
	type ComboboxInputGroupProps,
	type ComboboxInputProps,
	type ComboboxItemIndicatorProps,
	type ComboboxItemProps,
	type ComboboxListProps,
	type ComboboxPopupProps,
	type ComboboxPositionerProps,
	type ComboboxRootProps,
	type ComboboxTriggerProps
} from "@base-ui/react/combobox";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { forwardRef, useMemo, type Key, type ReactNode } from "react";

import { withStateClassName } from "@/internal";
import { useMessages } from "@/intl";
import styles from "./selection.module.css";

export const ComboboxInputGroup = forwardRef<HTMLDivElement, ComboboxInputGroupProps>(function ComboboxInputGroup({ className, ...props }, ref) {
	return <BaseCombobox.InputGroup {...props} className={withStateClassName(styles.comboboxInputGroup, className)} ref={ref} />;
});

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(function ComboboxInput({ className, ...props }, ref) {
	return <BaseCombobox.Input {...props} className={withStateClassName(styles.comboboxInput, className)} ref={ref} />;
});

export const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>(function ComboboxTrigger({ className, ...props }, ref) {
	return <BaseCombobox.Trigger {...props} className={withStateClassName(styles.comboboxTrigger, className)} ref={ref} />;
});

export const ComboboxClear = forwardRef<HTMLButtonElement, ComboboxClearProps>(function ComboboxClear({ className, ...props }, ref) {
	return <BaseCombobox.Clear {...props} className={withStateClassName(styles.comboboxClear, className)} ref={ref} />;
});

export const ComboboxPositioner = forwardRef<HTMLDivElement, ComboboxPositionerProps>(function ComboboxPositioner({ className, ...props }, ref) {
	return <BaseCombobox.Positioner {...props} className={withStateClassName(styles.positioner, className)} ref={ref} />;
});

export const ComboboxPopup = forwardRef<HTMLDivElement, ComboboxPopupProps>(function ComboboxPopup({ className, ...props }, ref) {
	return <BaseCombobox.Popup {...props} className={withStateClassName(styles.popup, className)} ref={ref} />;
});

export const ComboboxList = forwardRef<HTMLDivElement, ComboboxListProps>(function ComboboxList({ className, ...props }, ref) {
	return <BaseCombobox.List {...props} className={withStateClassName(styles.optionList, className)} ref={ref} />;
});

export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(function ComboboxItem({ className, ...props }, ref) {
	return <BaseCombobox.Item {...props} className={withStateClassName(styles.option, className)} ref={ref} />;
});

export const ComboboxItemIndicator = forwardRef<HTMLSpanElement, ComboboxItemIndicatorProps>(function ComboboxItemIndicator({ className, ...props }, ref) {
	return <BaseCombobox.ItemIndicator {...props} className={withStateClassName(styles.optionIndicator, className)} ref={ref} />;
});

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(function ComboboxEmpty({ className, ...props }, ref) {
	return <BaseCombobox.Empty {...props} className={withStateClassName(styles.emptyOption, className)} ref={ref} />;
});

export interface ComboboxOption<Value> {
	description?: ReactNode;
	disabled?: boolean;
	key?: Key;
	label: ReactNode;
	textValue?: string;
	value: Value;
}

interface IndexedOption<Option> {
	option: Option;
	sourceIndex: number;
}

function createOptionIndex<Value, Option extends { value: Value }>(options: readonly Option[]) {
	const values: Value[] = [];
	const lookup = new Map<Value, IndexedOption<Option>>();
	let negativeZero: IndexedOption<Option> | undefined;
	let positiveZero: IndexedOption<Option> | undefined;

	options.forEach((option, sourceIndex) => {
		const value = option.value;
		const indexed = { option, sourceIndex };
		values.push(value);

		if (typeof value === "number" && value === 0) {
			if (Object.is(value, -0)) negativeZero ??= indexed;
			else positiveZero ??= indexed;
			return;
		}

		if (!lookup.has(value)) lookup.set(value, indexed);
	});

	return {
		values,
		get(value: Value) {
			if (typeof value === "number" && value === 0) {
				return Object.is(value, -0) ? negativeZero : positiveZero;
			}
			return lookup.get(value);
		}
	};
}

export interface ComboboxProps<Value> extends Omit<ComboboxRootProps<Value, false>, "children" | "items" | "multiple"> {
	"aria-describedby"?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	className?: string;
	clearLabel?: string;
	emptyMessage?: ReactNode;
	inputProps?: Omit<ComboboxInputProps, "className" | "placeholder">;
	invalid?: boolean;
	options: readonly ComboboxOption<Value>[];
	placeholder?: string;
	popupProps?: ComboboxPopupProps;
	positionerProps?: ComboboxPositionerProps;
	triggerLabel?: string;
}

function ComboboxComponent<Value>({
	"aria-describedby": ariaDescribedby,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledby,
	className,
	clearLabel,
	emptyMessage,
	inputProps,
	invalid = false,
	itemToStringLabel,
	options,
	placeholder,
	popupProps,
	positionerProps,
	triggerLabel,
	...rootProps
}: ComboboxProps<Value>) {
	const messages = useMessages();
	const optionIndex = useMemo(() => createOptionIndex<Value, ComboboxOption<Value>>(options), [options]);
	const stringify = useMemo(
		() =>
			itemToStringLabel ??
			((itemValue: Value) => {
				const option = optionIndex.get(itemValue)?.option;
				return option?.textValue ?? (typeof option?.label === "string" ? option.label : String(itemValue));
			}),
		[itemToStringLabel, optionIndex]
	);

	return (
		<BaseCombobox.Root {...rootProps} itemToStringLabel={stringify} items={optionIndex.values}>
			<ComboboxInputGroup className={className}>
				<ComboboxInput
					{...inputProps}
					aria-describedby={ariaDescribedby ?? inputProps?.["aria-describedby"]}
					aria-invalid={invalid || inputProps?.["aria-invalid"] || undefined}
					aria-label={ariaLabel ?? inputProps?.["aria-label"]}
					aria-labelledby={ariaLabelledby ?? inputProps?.["aria-labelledby"]}
					autoComplete={inputProps?.autoComplete ?? "off"}
					placeholder={placeholder}
				/>
				<ComboboxClear aria-label={clearLabel ?? messages.comboboxClear}>
					<XIcon aria-hidden="true" weight="bold" />
				</ComboboxClear>
				<ComboboxTrigger aria-label={triggerLabel ?? messages.comboboxTrigger}>
					<CaretDownIcon aria-hidden="true" weight="bold" />
				</ComboboxTrigger>
			</ComboboxInputGroup>
			<BaseCombobox.Portal>
				<ComboboxPositioner {...positionerProps}>
					<ComboboxPopup {...popupProps}>
						<ComboboxList>
							{(value: Value, index: number) => {
								const indexed = optionIndex.get(value);
								if (!indexed) return null;
								const { option, sourceIndex } = indexed;
								return (
									<ComboboxItem disabled={option.disabled} index={index} key={option.key ?? option.textValue ?? sourceIndex} value={value}>
										<ComboboxItemIndicator>
											<CheckIcon aria-hidden="true" weight="bold" />
										</ComboboxItemIndicator>
										<span className={styles.optionText}>
											<span>{option.label}</span>
											{option.description ? <span className={styles.optionDescription}>{option.description}</span> : null}
										</span>
									</ComboboxItem>
								);
							}}
						</ComboboxList>
						<ComboboxEmpty>{emptyMessage ?? messages.comboboxEmpty}</ComboboxEmpty>
					</ComboboxPopup>
				</ComboboxPositioner>
			</BaseCombobox.Portal>
		</BaseCombobox.Root>
	);
}

export const Combobox = Object.assign(ComboboxComponent, {
	Arrow: BaseCombobox.Arrow,
	Backdrop: BaseCombobox.Backdrop,
	Chip: BaseCombobox.Chip,
	ChipRemove: BaseCombobox.ChipRemove,
	Chips: BaseCombobox.Chips,
	Clear: ComboboxClear,
	Collection: BaseCombobox.Collection,
	Empty: ComboboxEmpty,
	Group: BaseCombobox.Group,
	GroupLabel: BaseCombobox.GroupLabel,
	Icon: BaseCombobox.Icon,
	Input: ComboboxInput,
	InputGroup: ComboboxInputGroup,
	Item: ComboboxItem,
	ItemIndicator: ComboboxItemIndicator,
	Label: BaseCombobox.Label,
	List: ComboboxList,
	Popup: ComboboxPopup,
	Portal: BaseCombobox.Portal,
	Positioner: ComboboxPositioner,
	Root: BaseCombobox.Root,
	Row: BaseCombobox.Row,
	Separator: BaseCombobox.Separator,
	Status: BaseCombobox.Status,
	Trigger: ComboboxTrigger,
	Value: BaseCombobox.Value,
	useFilter: BaseCombobox.useFilter,
	useFilteredItems: BaseCombobox.useFilteredItems
});

export const AutocompleteInputGroup = forwardRef<HTMLDivElement, AutocompleteInputGroupProps>(function AutocompleteInputGroup({ className, ...props }, ref) {
	return <BaseAutocomplete.InputGroup {...props} className={withStateClassName(styles.comboboxInputGroup, className)} ref={ref} />;
});

export const AutocompleteItem = forwardRef<HTMLDivElement, AutocompleteItemProps>(function AutocompleteItem({ className, ...props }, ref) {
	return <BaseAutocomplete.Item {...props} className={withStateClassName(styles.option, className)} ref={ref} />;
});

export interface AutocompleteOption<Value> {
	disabled?: boolean;
	key?: Key;
	label: ReactNode;
	textValue?: string;
	value: Value;
}

export interface AutocompleteProps<ItemValue> extends Omit<AutocompleteRootProps<ItemValue>, "children" | "items"> {
	"aria-describedby"?: string;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	className?: string;
	clearLabel?: string;
	emptyMessage?: ReactNode;
	inputProps?: Omit<ComboboxInputProps, "className" | "placeholder">;
	invalid?: boolean;
	options: readonly AutocompleteOption<ItemValue>[];
	placeholder?: string;
	popupProps?: ComboboxPopupProps;
	positionerProps?: ComboboxPositionerProps;
	triggerLabel?: string;
}

function AutocompleteComponent<ItemValue>({
	"aria-describedby": ariaDescribedby,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledby,
	className,
	clearLabel,
	emptyMessage,
	inputProps,
	invalid = false,
	itemToStringValue,
	options,
	placeholder,
	popupProps,
	positionerProps,
	triggerLabel,
	...rootProps
}: AutocompleteProps<ItemValue>) {
	const messages = useMessages();
	const optionIndex = useMemo(() => createOptionIndex<ItemValue, AutocompleteOption<ItemValue>>(options), [options]);
	const stringify = useMemo(
		() =>
			itemToStringValue ??
			((itemValue: ItemValue) => {
				const option = optionIndex.get(itemValue)?.option;
				return option?.textValue ?? (typeof option?.label === "string" ? option.label : String(itemValue));
			}),
		[itemToStringValue, optionIndex]
	);

	return (
		<BaseAutocomplete.Root {...rootProps} itemToStringValue={stringify} items={optionIndex.values}>
			<AutocompleteInputGroup className={className}>
				<ComboboxInput
					{...inputProps}
					aria-describedby={ariaDescribedby ?? inputProps?.["aria-describedby"]}
					aria-invalid={invalid || inputProps?.["aria-invalid"] || undefined}
					aria-label={ariaLabel ?? inputProps?.["aria-label"]}
					aria-labelledby={ariaLabelledby ?? inputProps?.["aria-labelledby"]}
					autoComplete={inputProps?.autoComplete ?? "off"}
					placeholder={placeholder}
				/>
				<ComboboxClear aria-label={clearLabel ?? messages.autocompleteClear}>
					<XIcon aria-hidden="true" weight="bold" />
				</ComboboxClear>
				<BaseAutocomplete.Trigger aria-label={triggerLabel ?? messages.autocompleteTrigger} className={styles.comboboxTrigger}>
					<CaretDownIcon aria-hidden="true" weight="bold" />
				</BaseAutocomplete.Trigger>
			</AutocompleteInputGroup>
			<BaseAutocomplete.Portal>
				<ComboboxPositioner {...positionerProps}>
					<ComboboxPopup {...popupProps}>
						<ComboboxList>
							{(value: ItemValue, index: number) => {
								const indexed = optionIndex.get(value);
								if (!indexed) return null;
								const { option, sourceIndex } = indexed;
								return (
									<AutocompleteItem disabled={option.disabled} index={index} key={option.key ?? option.textValue ?? sourceIndex} value={value}>
										<span className={styles.optionText}>{option.label}</span>
									</AutocompleteItem>
								);
							}}
						</ComboboxList>
						<ComboboxEmpty>{emptyMessage ?? messages.autocompleteEmpty}</ComboboxEmpty>
					</ComboboxPopup>
				</ComboboxPositioner>
			</BaseAutocomplete.Portal>
		</BaseAutocomplete.Root>
	);
}

export const Autocomplete = Object.assign(AutocompleteComponent, {
	Arrow: BaseAutocomplete.Arrow,
	Backdrop: BaseAutocomplete.Backdrop,
	Clear: ComboboxClear,
	Collection: BaseAutocomplete.Collection,
	Empty: ComboboxEmpty,
	Group: BaseAutocomplete.Group,
	GroupLabel: BaseAutocomplete.GroupLabel,
	Icon: BaseAutocomplete.Icon,
	Input: ComboboxInput,
	InputGroup: AutocompleteInputGroup,
	Item: AutocompleteItem,
	List: ComboboxList,
	Popup: ComboboxPopup,
	Portal: BaseAutocomplete.Portal,
	Positioner: ComboboxPositioner,
	Root: BaseAutocomplete.Root,
	Row: BaseAutocomplete.Row,
	Separator: BaseAutocomplete.Separator,
	Status: BaseAutocomplete.Status,
	Trigger: BaseAutocomplete.Trigger,
	Value: BaseAutocomplete.Value,
	useFilter: BaseAutocomplete.useFilter,
	useFilteredItems: BaseAutocomplete.useFilteredItems
});
