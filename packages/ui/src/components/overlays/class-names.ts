type StatefulClassName<State> = string | ((state: State) => string | undefined) | undefined;

/**
 * 加入 Linyao Design System 的 CSS 類別，並保留 Base UI 可依狀態計算的 className API。
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
