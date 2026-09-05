import { Avatar as BaseAvatar, type AvatarImageProps, type AvatarRootProps, type ImageLoadingStatus } from "@base-ui/react/avatar";
import * as React from "react";
import { cx } from "../../internal";
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
	const accessibleLabel = statusLabel ? `${alt}, ${statusLabel}` : alt;

	return (
		<BaseAvatar.Root
			{...props}
			ref={ref}
			aria-label={props["aria-label"] ?? accessibleLabel}
			role={props.role ?? "img"}
			data-size={size}
			data-variant={variant}
			className={cx("lyds-avatar", className)}
			style={style}
		>
			{src ? <BaseAvatar.Image {...imageProps} src={src} alt="" className={cx("lyds-avatar__image", imageProps?.className)} onLoadingStatusChange={onLoadingStatusChange} /> : null}
			<BaseAvatar.Fallback className="lyds-avatar__fallback" delay={fallbackDelay}>
				{fallback ?? getInitials(alt)}
			</BaseAvatar.Fallback>
			{status ? <span className="lyds-avatar__status" data-status={status} aria-hidden="true" /> : null}
		</BaseAvatar.Root>
	);
});

Avatar.displayName = "Avatar";
