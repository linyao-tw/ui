type StatefulClassName<State> = string | ((state: State) => string | undefined) | undefined;

/**
 * Adds the LYDS class without flattening Base UI's state-aware className API.
 */
export function mergeClassName<State>(lydsClassName: string, className: StatefulClassName<State>): string | ((state: State) => string) {
	if (typeof className === "function") {
		return state => {
			const resolvedClassName = className(state);
			return resolvedClassName ? `${lydsClassName} ${resolvedClassName}` : lydsClassName;
		};
	}

	return className ? `${lydsClassName} ${className}` : lydsClassName;
}
