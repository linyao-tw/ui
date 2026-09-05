/**
 * A Base UI `className` value: either a static string, or a function that receives the
 * component's state. Every Linyao Design System wrapper preserves the function form so
 * consumers can keep styling from state after the design system class has been applied.
 */
export type StateClassName<State> = string | ((state: State) => string | undefined) | undefined;

/** Joins the truthy class names with a single space. */
export function cx(...values: Array<string | false | null | undefined>): string {
	return values.filter(Boolean).join(" ");
}

/** Prefixes a Linyao Design System class onto a consumer `className`, keeping the state-function form. */
export function withStateClassName<State>(baseClassName: string, className?: StateClassName<State>): string | ((state: State) => string) {
	if (typeof className === "function") {
		return state => cx(baseClassName, className(state));
	}

	return cx(baseClassName, className);
}

/** Merges two consumer `className` values, either of which may be a state function. */
export function combineStateClassNames<State>(first?: StateClassName<State>, second?: StateClassName<State>): StateClassName<State> {
	if (typeof first === "function" || typeof second === "function") {
		return state => cx(typeof first === "function" ? first(state) : first, typeof second === "function" ? second(state) : second);
	}

	return cx(first, second);
}
