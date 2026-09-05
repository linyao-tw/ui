/**
 * A control whose visible content cannot serve as its name — an icon-only button, a group of
 * segments — still needs one, so the type asks for exactly one of the two ARIA attributes that
 * can supply it rather than leaving both optional.
 */
export type AccessibleName =
	| {
			"aria-label": string;
			"aria-labelledby"?: string;
	  }
	| {
			"aria-label"?: string;
			"aria-labelledby": string;
	  };
