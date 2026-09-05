import type { useRender } from "@base-ui/react/use-render";
import type * as React from "react";

/** The polymorphic `render` prop shared by components built on Base UI's `useRender`. */
export type ComponentRenderProp<State extends Record<string, unknown>> = useRender.RenderProp<State>;

/** Intrinsic element props with the legacy presentational `color` attribute removed. */
export type ElementProps<ElementType extends React.ElementType> = Omit<React.ComponentPropsWithoutRef<ElementType>, "color">;
