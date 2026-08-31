import { Checkbox as BaseCheckbox, type CheckboxRootProps } from "@base-ui/react/checkbox";
import { CheckboxGroup as BaseCheckboxGroup, type CheckboxGroupProps as BaseCheckboxGroupProps } from "@base-ui/react/checkbox-group";
import { Radio as BaseRadio, type RadioRootProps } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup, type RadioGroupProps as BaseRadioGroupProps } from "@base-ui/react/radio-group";
import { Slider as BaseSlider, type SliderRootProps } from "@base-ui/react/slider";
import { Switch as BaseSwitch, type SwitchRootProps } from "@base-ui/react/switch";
import { Toggle as BaseToggle, type ToggleProps as BaseToggleProps } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup, type ToggleGroupProps as BaseToggleGroupProps } from "@base-ui/react/toggle-group";
import { forwardRef, useState, type ForwardedRef, type JSX, type ReactNode, type RefAttributes } from "react";

import { cx, mergeStateClassName } from "./classnames";
import styles from "./selection.module.css";

function CheckGlyph({ indeterminate = false }: { indeterminate?: boolean }) {
	return indeterminate ? (
		<svg aria-hidden="true" viewBox="0 0 16 16">
			<path d="M3 8h10" />
		</svg>
	) : (
		<svg aria-hidden="true" viewBox="0 0 16 16">
			<path d="m3 8 3 3 7-7" />
		</svg>
	);
}

export interface CheckboxProps extends CheckboxRootProps {
	indicator?: ReactNode;
}

export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox({ children, className, indicator, indeterminate, ...props }, ref) {
	return (
		<BaseCheckbox.Root {...props} className={mergeStateClassName(styles.checkbox, className)} indeterminate={indeterminate} ref={ref}>
			<BaseCheckbox.Indicator className={styles.checkboxIndicator} keepMounted>
				{indicator ?? <CheckGlyph indeterminate={indeterminate ?? false} />}
			</BaseCheckbox.Indicator>
			{children}
		</BaseCheckbox.Root>
	);
});

export type CheckboxGroupProps = BaseCheckboxGroupProps;

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(function CheckboxGroup({ className, ...props }, ref) {
	return <BaseCheckboxGroup {...props} className={mergeStateClassName(styles.choiceGroup, className)} ref={ref} />;
});

export interface CheckboxItemProps extends CheckboxProps {
	label: ReactNode;
	description?: ReactNode;
	wrapperClassName?: string;
}

export const CheckboxItem = forwardRef<HTMLElement, CheckboxItemProps>(function CheckboxItem({ description, label, wrapperClassName, ...props }, ref) {
	return (
		<label className={cx(styles.choiceLabel, wrapperClassName)}>
			<Checkbox {...props} ref={ref} />
			<span className={styles.choiceCopy}>
				<span className={styles.choiceTitle}>{label}</span>
				{description ? <span className={styles.choiceDescription}>{description}</span> : null}
			</span>
		</label>
	);
});

export type RadioGroupProps<Value = string> = BaseRadioGroupProps<Value>;

type RadioGroupComponent = <Value = string>(props: RadioGroupProps<Value> & RefAttributes<HTMLDivElement>) => JSX.Element;

export const RadioGroup = forwardRef(function RadioGroup<Value = string>({ className, ...props }: RadioGroupProps<Value>, ref: ForwardedRef<HTMLDivElement>) {
	return <BaseRadioGroup {...props} className={mergeStateClassName(styles.choiceGroup, className)} ref={ref} />;
}) as RadioGroupComponent;

export type RadioProps<Value = string> = RadioRootProps<Value>;

type RadioComponent = <Value = string>(props: RadioProps<Value> & RefAttributes<HTMLElement>) => JSX.Element;

export const Radio = forwardRef(function Radio<Value = string>({ children, className, ...props }: RadioProps<Value>, ref: ForwardedRef<HTMLElement>) {
	return (
		<BaseRadio.Root {...props} className={mergeStateClassName(styles.radio, className)} ref={ref}>
			<BaseRadio.Indicator className={styles.radioIndicator} keepMounted />
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
	return (
		<label className={cx(styles.choiceLabel, wrapperClassName)}>
			<Radio {...props} ref={ref} />
			<span className={styles.choiceCopy}>
				<span className={styles.choiceTitle}>{label}</span>
				{description ? <span className={styles.choiceDescription}>{description}</span> : null}
			</span>
		</label>
	);
}) as RadioItemComponent;

export interface SwitchProps extends SwitchRootProps {
	children?: ReactNode;
}

export const Switch = forwardRef<HTMLElement, SwitchProps>(function Switch({ children, className, ...props }, ref) {
	return (
		<BaseSwitch.Root {...props} className={mergeStateClassName(styles.switch, className)} ref={ref}>
			<span aria-hidden="true" className={styles.switchSignal} />
			<BaseSwitch.Thumb className={styles.switchThumb} />
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

	return (
		<BaseSlider.Root {...props} aria-label={ariaLabel} aria-labelledby={ariaLabelledby} className={mergeStateClassName(styles.slider, className)} defaultValue={defaultValue} ref={ref} value={value}>
			{showValue ? <BaseSlider.Value className={styles.sliderValue} /> : null}
			<BaseSlider.Control className={styles.sliderControl}>
				<BaseSlider.Track className={styles.sliderTrack}>
					<BaseSlider.Indicator className={styles.sliderIndicator} />
					{Array.from({ length: thumbCount }, (_, index) => (
						<BaseSlider.Thumb
							className={styles.sliderThumb}
							getAriaLabel={getAriaLabel ?? fallbackThumbLabel}
							getAriaValueText={getAriaValueText}
							inputRef={input => {
								if (!input) return;
								if (ariaDescribedby) input.setAttribute("aria-describedby", ariaDescribedby);
								if (ariaLabelledby && !getAriaLabel) input.setAttribute("aria-labelledby", ariaLabelledby);
							}}
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
	return <BaseToggle {...props} className={state => cx(styles.toggle, variant === "quiet" && styles.toggleQuiet, typeof className === "function" ? className(state) : className)} ref={ref} />;
}) as ToggleComponent;

export type ToggleGroupProps<Value extends string = string> = BaseToggleGroupProps<Value>;

type ToggleGroupComponent = <Value extends string = string>(props: ToggleGroupProps<Value> & RefAttributes<HTMLDivElement>) => JSX.Element;

export const ToggleGroup = forwardRef(function ToggleGroup<Value extends string = string>({ className, ...props }: ToggleGroupProps<Value>, ref: ForwardedRef<HTMLDivElement>) {
	return <BaseToggleGroup {...props} className={mergeStateClassName(styles.toggleGroup, className)} ref={ref} />;
}) as ToggleGroupComponent;

export interface SegmentedControlProps<Value extends string = string> extends Omit<BaseToggleGroupProps<Value>, "aria-readonly" | "defaultValue" | "multiple" | "onValueChange" | "value"> {
	allowEmpty?: boolean;
	defaultValue?: Value | null;
	name?: string;
	onValueChange?: (value: Value | null, details: BaseToggleGroup.ChangeEventDetails) => void;
	size?: "sm" | "md";
	value?: Value | null;
}

type SegmentedControlComponent = <Value extends string = string>(props: SegmentedControlProps<Value> & RefAttributes<HTMLDivElement>) => JSX.Element;

export const SegmentedControl = forwardRef(function SegmentedControl<Value extends string = string>(
	{ allowEmpty = false, "aria-label": ariaLabel, className, defaultValue = null, disabled = false, name, onValueChange, size = "md", value, ...props }: SegmentedControlProps<Value>,
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
				className={mergeStateClassName(styles.segmentedControl, className)}
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
