import { Avatar as BaseAvatar, type AvatarImageProps, type AvatarRootProps, type ImageLoadingStatus } from "@base-ui/react/avatar";
import * as React from "react";
import { mergeClassNames } from "./shared";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarVariant = "neutral" | "accent";
export type AvatarStatus = "online" | "away" | "busy" | "offline";

export interface AvatarBaseProps extends Omit<AvatarRootProps, "children" | "className" | "style"> {
	src?: string;
	alt: string;
	fallback?: React.ReactNode;
	fallbackDelay?: number;
	size?: AvatarSize;
	variant?: AvatarVariant;
	imageProps?: Omit<AvatarImageProps, "alt" | "className" | "onLoadingStatusChange" | "src"> & { className?: string };
	onLoadingStatusChange?: (status: ImageLoadingStatus) => void;
	className?: string;
	style?: React.CSSProperties;
}

export type AvatarProps = AvatarBaseProps & ({ status?: never; statusLabel?: never } | { status: AvatarStatus; statusLabel: string });

function getInitials(label: string): string {
	return label
		.trim()
		.split(/\s+/u)
		.slice(0, 2)
		.map(part => Array.from(part)[0] ?? "")
		.join("")
		.toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
	{ src, alt, fallback, fallbackDelay, size = "md", variant = "neutral", status, statusLabel, imageProps, onLoadingStatusChange, className, style, ...props },
	ref
) {
	return (
		<BaseAvatar.Root {...props} ref={ref} data-size={size} data-variant={variant} className={mergeClassNames("lyds-avatar", className)} style={style}>
			{src ? <BaseAvatar.Image {...imageProps} src={src} alt={alt} className={mergeClassNames("lyds-avatar__image", imageProps?.className)} onLoadingStatusChange={onLoadingStatusChange} /> : null}
			<BaseAvatar.Fallback className="lyds-avatar__fallback" delay={fallbackDelay}>
				{fallback ?? getInitials(alt)}
			</BaseAvatar.Fallback>
			{status ? <span className="lyds-avatar__status" data-status={status} aria-hidden="true" /> : null}
			{statusLabel ? <span className="lyds-sr-only">{statusLabel}</span> : null}
		</BaseAvatar.Root>
	);
});

Avatar.displayName = "Avatar";
