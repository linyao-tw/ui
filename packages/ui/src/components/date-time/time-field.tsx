import type { Time } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { TimeField as AriaTimeField, DateInput, DateSegment, type TimeFieldProps as AriaTimeFieldProps, type TimeValue } from "react-aria-components/TimeField";
import { ClockGlyph, FieldLabel, FieldMessages, LocaleBoundary, cx, type DateTimeFieldChromeProps } from "./shared";

export interface TimeFieldProps<T extends TimeValue = Time>
	extends Omit<AriaTimeFieldProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isReadOnly" | "isRequired" | "onChange">, DateTimeFieldChromeProps {
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	onValueChange?: AriaTimeFieldProps<T>["onChange"];
}

export type TimePickerProps<T extends TimeValue = Time> = TimeFieldProps<T>;

function TimeControl<T extends TimeValue>(
	{ label, description, errorMessage, locale, size = "md", className, disabled, readOnly, required, invalid, onValueChange, ...fieldProps }: TimeFieldProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>,
	showPickerGlyph: boolean
) {
	return (
		<LocaleBoundary locale={locale}>
			<AriaTimeField
				{...fieldProps}
				ref={ref}
				className={cx("lyds-date-field", "lyds-time-field", showPickerGlyph && "lyds-time-picker", className)}
				data-size={size}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(required === undefined ? {} : { isRequired: required })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange })}
			>
				<FieldLabel>{label}</FieldLabel>
				<div className="lyds-date-input-shell">
					<DateInput className="lyds-date-input">{segment => <DateSegment segment={segment} className="lyds-date-segment" />}</DateInput>
					{showPickerGlyph ? (
						<span className="lyds-date-input-affordance">
							<ClockGlyph />
						</span>
					) : null}
				</div>
				<FieldMessages description={description} errorMessage={errorMessage} />
			</AriaTimeField>
		</LocaleBoundary>
	);
}

function TimeFieldImpl<T extends TimeValue>(props: TimeFieldProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
	return TimeControl(props, ref, false);
}

function TimePickerImpl<T extends TimeValue>(props: TimePickerProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
	return TimeControl(props, ref, true);
}

export const TimeField = forwardRef(TimeFieldImpl) as <T extends TimeValue = Time>(props: TimeFieldProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;

/**
 * A locale-aware segmented time picker. Unlike menu-based time selectors, it does not invent a finite list of times;
 * `minValue`, `maxValue`, `granularity`, and `hourCycle` remain consumer-controlled React Aria semantics.
 */
export const TimePicker = forwardRef(TimePickerImpl) as <T extends TimeValue = Time>(props: TimePickerProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
