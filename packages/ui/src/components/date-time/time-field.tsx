import type { Time } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { TimeField as AriaTimeField, DateInput, DateSegment, type TimeFieldProps as AriaTimeFieldProps } from "react-aria-components/TimeField";
import type { TimeValue as LydsTimeValue, TimeFieldBehaviorProps } from "./date-types";
import { ClockGlyph, FieldLabel, FieldMessages, LocaleBoundary, cx, type DateTimeFieldChromeProps } from "./shared";

export interface TimeFieldProps<T extends LydsTimeValue = Time> extends TimeFieldBehaviorProps<T>, DateTimeFieldChromeProps {}

export type TimePickerProps<T extends LydsTimeValue = Time> = TimeFieldProps<T>;

type TimeFieldForwardedKeys = Exclude<keyof TimeFieldBehaviorProps<LydsTimeValue>, "disabled" | "invalid" | "onValueChange" | "readOnly" | "required">;
type TimeFieldUnexpectedForwardedKeys = Exclude<TimeFieldForwardedKeys, keyof AriaTimeFieldProps<LydsTimeValue>>;
type TimeFieldPropContract = TimeFieldUnexpectedForwardedKeys extends never ? true : never;
const timeFieldPropContract: TimeFieldPropContract = true;
void timeFieldPropContract;

function TimeControl<T extends LydsTimeValue>(
	{ label, description, error, locale, size = "md", className, disabled, readOnly, required, invalid, onValueChange, ...fieldProps }: TimeFieldProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>,
	showPickerGlyph: boolean
) {
	const ariaFieldProps = fieldProps as unknown as Omit<AriaTimeFieldProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isReadOnly" | "isRequired" | "onChange">;

	return (
		<LocaleBoundary locale={locale}>
			<AriaTimeField
				{...ariaFieldProps}
				ref={ref}
				className={cx("lyds-date-field", "lyds-time-field", showPickerGlyph && "lyds-time-picker", className)}
				data-size={size}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(required === undefined ? {} : { isRequired: required })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange as unknown as NonNullable<AriaTimeFieldProps<T>["onChange"]> })}
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
				<FieldMessages description={description} error={error} />
			</AriaTimeField>
		</LocaleBoundary>
	);
}

function TimeFieldImpl<T extends LydsTimeValue>(props: TimeFieldProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
	return TimeControl(props, ref, false);
}

function TimePickerImpl<T extends LydsTimeValue>(props: TimePickerProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
	return TimeControl(props, ref, true);
}

export const TimeField = forwardRef(TimeFieldImpl) as <T extends LydsTimeValue = Time>(props: TimeFieldProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;

/**
 * A locale-aware segmented time picker. Unlike menu-based time selectors, it does not invent a finite list of times;
 * `minValue`, `maxValue`, `granularity`, and `hourCycle` remain consumer-controlled React Aria semantics.
 */
export const TimePicker = forwardRef(TimePickerImpl) as <T extends LydsTimeValue = Time>(props: TimePickerProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
