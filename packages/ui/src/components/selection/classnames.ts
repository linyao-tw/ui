export type StateClassName<State> = string | ((state: State) => string | undefined);

export function cx(...values: Array<string | false | null | undefined>): string {
	return values.filter(Boolean).join(" ");
}

export function mergeStateClassName<State>(base: string, className?: StateClassName<State>): StateClassName<State> {
	if (typeof className === "function") {
		return state => cx(base, className(state));
	}

	return cx(base, className);
}

export function combineStateClassNames<State>(first?: StateClassName<State>, second?: StateClassName<State>): StateClassName<State> {
	if (typeof first === "function" || typeof second === "function") {
		return state => cx(typeof first === "function" ? first(state) : first, typeof second === "function" ? second(state) : second);
	}

	return cx(first, second);
}
