import { Checkbox as BaseCheckbox, type CheckboxRootProps } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup, type CheckboxGroupProps as BaseCheckboxGroupProps } from "@base-ui/react/checkbox-group";
import { Radio as BaseRadio, type RadioRootProps } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup, type RadioGroupProps as BaseRadioGroupProps } from "@base-ui/react/radio-group";
import { Slider as BaseSlider, type SliderRootProps } from "@base-ui/react/slider";
import { Switch as BaseSwitch, type SwitchRootProps } from "@base-ui/react/switch";
import { Toggle as BaseToggle, type ToggleProps as BaseToggleProps } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup, type ToggleGroupProps as BaseToggleGroupProps } from "@base-ui/react/toggle-group";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { forwardRef, useCallback, useId, useState, type ForwardedRef, type JSX, type ReactNode, type RefAttributes } from "react";

import { cx, withStateClassName, type AccessibleName } from "@/internal";

function CheckGlyph({ indeterminate = false }: { indeterminate?: boolean }) {
	return indeterminate ? <MinusIcon aria-hidden="true" weight="bold" /> : <CheckIcon aria-hidden="true" weight="bold" />;
}

export interface CheckboxProps extends CheckboxRootProps {
	indicator?: ReactNode;
}

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox({ children, className, indicator, indeterminate, ...props }, ref) {
	return (
		<BaseCheckbox.Root {...props} className={withStateClassName("lyds-checkbox", className)} indeterminate={indeterminate} ref={ref}>
			<BaseCheckbox.Indicator className={"lyds-checkbox__indicator"} keepMounted>
				{indicator ?? <CheckGlyph indeterminate={indeterminate ?? false} />}
			</BaseCheckbox.Indicator>
			{children}
		</BaseCheckbox.Root>
	);
});

export type CheckboxGroupProps = BaseCheckboxGroupProps;

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup({ className, ...props }, ref) {
	return <BaseCheckboxGroup {...props} className={withStateClassName("lyds-choice-group", className)} ref={ref} />;
});

/**
 * The wrapping <label> makes the whole row a hit target, but it also makes every word inside it
 * part of the control's accessible name — including the description. Naming the control from the
 * title and describing it from the description keeps the row clickable without reading the
 * supporting copy out as part of the name. The visible title always wins over an `aria-label`,
 * which is what WCAG 2.5.3 asks for; pass `aria-labelledby` to point somewhere else entirely.
 */
function useChoiceCopyIds(description: ReactNode) {
	const id = useId();
	return { titleId: `${id}-title`, descriptionId: description ? `${id}-description` : undefined };
}

export interface CheckboxItemProps extends CheckboxProps {
	label: ReactNode;
	description?: ReactNode;
	wrapperClassName?: string;
}

export const CheckboxItem = forwardRef<HTMLElement, CheckboxItemProps>(function CheckboxItem({ description, label, wrapperClassName, ...props }, ref) {
	const { titleId, descriptionId } = useChoiceCopyIds(description);

	return (
		<label className={cx("lyds-choice", wrapperClassName)}>
			<Checkbox {...props} ref={ref} aria-labelledby={props["aria-labelledby"] ?? titleId} aria-describedby={props["aria-describedby"] ?? descriptionId} />
			<span className={"lyds-choice__copy"}>
				<span className={"lyds-choice__title"} id={titleId}>
					{label}
				</span>
				{description ? (
					<span className={"lyds-choice__description"} id={descriptionId}>
						{description}
					</span>
				) : null}
			</span>
		</label>
	);
});

export type RadioGroupProps<Value = string> = BaseRadioGroupProps<Value>;

type RadioGroupComponent = <Value = string>(props: RadioGroupProps<Value> & RefAttributes<HTMLDivElement>) => JSX.Element;

export const RadioGroup = forwardRef(function RadioGroup<Value = string>({ className, ...props }: RadioGroupProps<Value>, ref: ForwardedRef<HTMLDivElement>) {
	return <BaseRadioGroup {...props} className={withStateClassName("lyds-choice-group", className)} ref={ref} />;
}) as RadioGroupComponent;

export type RadioProps<Value = string> = RadioRootProps<Value>;

type RadioComponent = <Value = string>(props: RadioProps<Value> & RefAttributes<HTMLElement>) => JSX.Element;

export const Radio = forwardRef(function Radio<Value = string>({ children, className, ...props }: RadioProps<Value>, ref: ForwardedRef<HTMLElement>) {
	return (
		<BaseRadio.Root {...props} className={withStateClassName("lyds-radio", className)} ref={ref}>
			<BaseRadio.Indicator className={"lyds-radio__indicator"} keepMounted />
			{children}
		</BaseRadio.Root>
	);
}) as RadioComponent;

export interface RadioItemProps<Value = string> extends RadioProps<Value> {
	label: ReactNode;
	description?: ReactNode;
	wrapperClassName?: string;
}

type RadioItemComponent = <Value = string>(props: RadioItemProps<Value> & RefAttributes<HTMLElement>) => JSX.Element;

export const RadioItem = forwardRef(function RadioItem<Value = string>({ description, label, wrapperClassName, ...props }: RadioItemProps<Value>, ref: ForwardedRef<HTMLElement>) {
	const { titleId, descriptionId } = useChoiceCopyIds(description);

	return (
		<label className={cx("lyds-choice", wrapperClassName)}>
			<Radio {...props} ref={ref} aria-labelledby={props["aria-labelledby"] ?? titleId} aria-describedby={props["aria-describedby"] ?? descriptionId} />
			<span className={"lyds-choice__copy"}>
				<span className={"lyds-choice__title"} id={titleId}>
					{label}
				</span>
				{description ? (
					<span className={"lyds-choice__description"} id={descriptionId}>
						{description}
					</span>
				) : null}
			</span>
		</label>
	);
}) as RadioItemComponent;

export interface SwitchProps extends SwitchRootProps {
	children?: ReactNode;
}

export const Switch = forwardRef<HTMLElement, SwitchProps>(function Switch({ children, className, ...props }, ref) {
	return (
		<BaseSwitch.Root {...props} className={withStateClassName("lyds-switch", className)} ref={ref}>
			<span aria-hidden="true" className={"lyds-switch__signal"} />
			<BaseSwitch.Thumb className={"lyds-switch__thumb"} />
			{children}
		</BaseSwitch.Root>
	);
});

export interface SliderProps<Value extends number | readonly number[] = number> extends SliderRootProps<Value> {
	getAriaLabel?: (index: number) => string;
	getAriaValueText?: (formattedValue: string, value: number, index: number) => string;
	showValue?: boolean;
}

type SliderComponent = <Value extends number | readonly number[] = number>(props: SliderProps<Value> & RefAttributes<HTMLDivElement>) => JSX.Element;

function getThumbCount(value: number | readonly number[] | undefined): number {
	return Array.isArray(value) ? Math.max(value.length, 1) : 1;
}

export const Slider = forwardRef(function Slider<Value extends number | readonly number[] = number>(
	{
		"aria-describedby": ariaDescribedby,
		"aria-label": ariaLabel,
		"aria-labelledby": ariaLabelledby,
		className,
		defaultValue,
		getAriaLabel,
		getAriaValueText,
		showValue = false,
		value,
		...props
	}: SliderProps<Value>,
	ref: ForwardedRef<HTMLDivElement>
) {
	const thumbCount = getThumbCount(value ?? defaultValue);
	const fallbackThumbLabel = ariaLabel ? (index: number) => (thumbCount === 1 ? ariaLabel : `${ariaLabel} ${index + 1}`) : undefined;
	// Base UI owns the thumb inputs, so these two relationships have to be applied to the nodes it
	// renders. An inline callback would detach and reattach on every render; aria-labelledby is only
	// ever added because Base UI sets its own, while aria-describedby is ours to clear.
	const applyThumbDescription = useCallback(
		(input: HTMLInputElement | null) => {
			if (!input) return;
			if (ariaDescribedby) input.setAttribute("aria-describedby", ariaDescribedby);
			else input.removeAttribute("aria-describedby");
			if (ariaLabelledby && !getAriaLabel) input.setAttribute("aria-labelledby", ariaLabelledby);
		},
		[ariaDescribedby, ariaLabelledby, getAriaLabel]
	);

	return (
		<BaseSlider.Root {...props} aria-label={ariaLabel} aria-labelledby={ariaLabelledby} className={withStateClassName("lyds-slider", className)} defaultValue={defaultValue} ref={ref} value={value}>
			{showValue ? <BaseSlider.Value className={"lyds-slider__value"} /> : null}
			<BaseSlider.Control className={"lyds-slider__control"}>
				<BaseSlider.Track className={"lyds-slider__track"}>
					<BaseSlider.Indicator className={"lyds-slider__indicator"} />
					{Array.from({ length: thumbCount }, (_, index) => (
						<BaseSlider.Thumb
							className={"lyds-slider__thumb"}
							getAriaLabel={getAriaLabel ?? fallbackThumbLabel}
							getAriaValueText={getAriaValueText}
							inputRef={applyThumbDescription}
							index={index}
							key={index}
						/>
					))}
				</BaseSlider.Track>
			</BaseSlider.Control>
		</BaseSlider.Root>
	);
}) as SliderComponent;

export interface ToggleProps<Value extends string = string> extends BaseToggleProps<Value> {
	variant?: "standard" | "quiet";
}

type ToggleComponent = <Value extends string = string>(props: ToggleProps<Value> & RefAttributes<HTMLButtonElement>) => JSX.Element;

export const Toggle = forwardRef(function Toggle<Value extends string = string>({ className, variant = "standard", ...props }: ToggleProps<Value>, ref: ForwardedRef<HTMLButtonElement>) {
	return <BaseToggle {...props} className={state => cx("lyds-toggle", variant === "quiet" && "lyds-toggle--quiet", typeof className === "function" ? className(state) : className)} ref={ref} />;
}) as ToggleComponent;

export type ToggleGroupProps<Value extends string = string> = BaseToggleGroupProps<Value>;

type ToggleGroupComponent = <Value extends string = string>(props: ToggleGroupProps<Value> & RefAttributes<HTMLDivElement>) => JSX.Element;

export const ToggleGroup = forwardRef(function ToggleGroup<Value extends string = string>({ className, ...props }: ToggleGroupProps<Value>, ref: ForwardedRef<HTMLDivElement>) {
	return <BaseToggleGroup {...props} className={withStateClassName("lyds-toggle-group", className)} ref={ref} />;
}) as ToggleGroupComponent;

interface SegmentedControlOwnProps<Value extends string = string> extends Omit<
	BaseToggleGroupProps<Value>,
	"aria-label" | "aria-labelledby" | "aria-readonly" | "defaultValue" | "multiple" | "onValueChange" | "value"
> {
	allowEmpty?: boolean;
	defaultValue?: Value | null;
	name?: string;
	onValueChange?: (value: Value | null, details: BaseToggleGroup.ChangeEventDetails) => void;
	size?: "sm" | "md";
	value?: Value | null;
}

/** The segments name themselves; the group they belong to does not, so it has to be told. */
export type SegmentedControlProps<Value extends string = string> = SegmentedControlOwnProps<Value> & AccessibleName;

type SegmentedControlComponent = <Value extends string = string>(props: SegmentedControlProps<Value> & RefAttributes<HTMLDivElement>) => JSX.Element;

export const SegmentedControl = forwardRef(function SegmentedControl<Value extends string = string>(
	{
		allowEmpty = false,
		"aria-label": ariaLabel,
		"aria-labelledby": ariaLabelledby,
		className,
		defaultValue = null,
		disabled = false,
		name,
		onValueChange,
		size = "md",
		value,
		...props
	}: SegmentedControlProps<Value>,
	ref: ForwardedRef<HTMLDivElement>
) {
	const controlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<Value | null>(defaultValue);
	const currentValue = controlled ? value : internalValue;

	return (
		<>
			<BaseToggleGroup
				{...props}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				className={withStateClassName("lyds-segmented-control", className)}
				data-size={size}
				disabled={disabled}
				multiple={false}
				onValueChange={(nextValues, details) => {
					const nextValue = nextValues[0] ?? null;
					if (!allowEmpty && nextValue === null) return;
					onValueChange?.(nextValue, details);
					if (details.isCanceled) return;
					if (!controlled) setInternalValue(nextValue);
				}}
				ref={ref}
				value={currentValue === null ? [] : [currentValue]}
			/>
			{name ? <input disabled={disabled} name={name} type="hidden" value={currentValue ?? ""} /> : null}
		</>
	);
}) as SegmentedControlComponent;

export const SegmentedControlItem = Toggle;
