export function cx(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(" ");
}

export function withBaseClass<State>(baseClassName: string, className?: string | ((state: State) => string | undefined)): string | ((state: State) => string) {
	if (typeof className === "function") {
		return state => cx(baseClassName, className(state));
	}

	return cx(baseClassName, className);
}
