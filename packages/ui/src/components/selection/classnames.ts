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
