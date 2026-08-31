import type { useRender } from "@base-ui/react/use-render";
import type * as React from "react";

export type ComponentRenderProp<State extends Record<string, unknown>> = useRender.RenderProp<State>;

export type ElementProps<ElementType extends React.ElementType> = Omit<React.ComponentPropsWithoutRef<ElementType>, "color">;

export function mergeClassNames(...classNames: Array<string | undefined | false>): string {
	return classNames.filter(Boolean).join(" ");
}
