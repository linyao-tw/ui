import { createContext, useContext, useMemo, type ReactNode } from "react";

import { zhTWMessages, type ComponentMessages } from "./messages";

const MessagesContext = createContext<ComponentMessages>(zhTWMessages);

export interface MessagesProviderProps {
	children: ReactNode;
	/**
	 * Strings to use in place of the inherited bundle. Partial objects are merged over the bundle
	 * already in scope, so a provider can translate the whole system or correct a single string.
	 */
	messages: Partial<ComponentMessages>;
}

/**
 * Supplies the default strings the components fall back to. Without a provider the components use
 * the Traditional Chinese bundle, which is what they shipped with; wrap the tree in a provider to
 * swap in `enUSMessages` or a bundle of your own.
 */
export function MessagesProvider({ children, messages }: MessagesProviderProps) {
	const inherited = useContext(MessagesContext);
	const value = useMemo(() => ({ ...inherited, ...messages }), [inherited, messages]);

	return <MessagesContext value={value}>{children}</MessagesContext>;
}

/** Reads the strings in scope. Component props still take precedence over whatever this returns. */
export function useMessages(): ComponentMessages {
	return useContext(MessagesContext);
}
