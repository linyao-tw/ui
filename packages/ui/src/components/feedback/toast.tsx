import { Toast as BaseToast } from "@base-ui/react/toast";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { Fragment, forwardRef, type ComponentPropsWithoutRef, type ForwardedRef, type ReactElement, type ReactNode, type RefAttributes } from "react";

import styles from "./feedback.module.css";
import { FEEDBACK_STATUSES, mergeClassNames, type FeedbackStatus } from "./feedback.types";

const feedbackStatusSet: ReadonlySet<string> = new Set(FEEDBACK_STATUSES);

export interface ToastData extends Record<string, unknown> {
	status?: FeedbackStatus;
}

export type ToastObject<Data extends object = ToastData> = BaseToast.Root.ToastObject<Data>;
export type ToastManager<Data extends object = ToastData> = ReturnType<typeof BaseToast.createToastManager<Data>>;

export function createToastManager<Data extends object = ToastData>(): ToastManager<Data> {
	return BaseToast.createToastManager<Data>();
}

export function useToastManager<Data extends object = ToastData>() {
	return BaseToast.useToastManager<Data>();
}

function getToastStatus<Data extends object>(toast: ToastObject<Data>): FeedbackStatus {
	const status = (toast.data as { status?: unknown } | undefined)?.status;
	if (typeof status === "string" && feedbackStatusSet.has(status)) {
		return status as FeedbackStatus;
	}

	if (toast.type && feedbackStatusSet.has(toast.type)) {
		return toast.type as FeedbackStatus;
	}

	return "neutral";
}

export interface ToastRootProps<Data extends object = ToastData> extends Omit<BaseToast.Root.Props, "className" | "toast"> {
	className?: string;
	closeLabel?: string;
	toast: ToastObject<Data>;
}

type ToastRootComponent = <Data extends object = ToastData>(props: ToastRootProps<Data> & RefAttributes<HTMLDivElement>) => ReactElement;

export const ToastRoot = forwardRef(function ToastRoot<Data extends object = ToastData>(
	{ className, closeLabel = "Dismiss notification", toast, ...props }: ToastRootProps<Data>,
	ref: ForwardedRef<HTMLDivElement>
) {
	const actionProps = toast.actionProps;
	const actionClassName = actionProps?.className;
	const status = getToastStatus(toast);

	return (
		<BaseToast.Root ref={ref} className={mergeClassNames(styles.toastRoot, className)} data-status={status} toast={toast} {...props}>
			<span aria-hidden="true" className={styles.toastSignal} />
			<BaseToast.Content className={styles.toastContent}>
				{toast.title ? <BaseToast.Title className={styles.toastTitle} /> : null}
				{toast.description ? <BaseToast.Description className={styles.toastDescription} /> : null}
			</BaseToast.Content>
			{actionProps ? <BaseToast.Action {...actionProps} className={mergeClassNames(styles.toastAction, actionClassName)} /> : null}
			<BaseToast.Close aria-label={closeLabel} className={styles.toastClose}>
				<XIcon aria-hidden="true" weight="bold" />
			</BaseToast.Close>
		</BaseToast.Root>
	);
}) as ToastRootComponent;

export interface ToastViewportProps<Data extends object = ToastData> extends Omit<ComponentPropsWithoutRef<typeof BaseToast.Viewport>, "children" | "className"> {
	className?: string;
	closeLabel?: string;
	renderToast?: (toast: ToastObject<Data>) => ReactNode;
}

type ToastViewportComponent = <Data extends object = ToastData>(props: ToastViewportProps<Data> & RefAttributes<HTMLDivElement>) => ReactElement;

export const ToastViewport = forwardRef(function ToastViewport<Data extends object = ToastData>(
	{ className, closeLabel, renderToast, ...props }: ToastViewportProps<Data>,
	ref: ForwardedRef<HTMLDivElement>
) {
	const toast = BaseToast.useToastManager<Data>();

	return (
		<BaseToast.Portal>
			<BaseToast.Viewport ref={ref} className={mergeClassNames(styles.toastViewport, className)} {...props}>
				{toast.toasts.map(toastObject =>
					renderToast ? (
						<Fragment key={toastObject.id}>{renderToast(toastObject)}</Fragment>
					) : (
						<ToastRoot {...(closeLabel === undefined ? {} : { closeLabel })} key={toastObject.id} toast={toastObject} />
					)
				)}
			</BaseToast.Viewport>
		</BaseToast.Portal>
	);
}) as ToastViewportComponent;

export interface ToastProviderProps<Data extends object = ToastData> extends Omit<BaseToast.Provider.Props, "toastManager"> {
	closeLabel?: string;
	renderToast?: ToastViewportProps<Data>["renderToast"];
	toastManager?: ToastManager<Data>;
	viewport?: boolean;
	viewportProps?: Omit<ToastViewportProps<Data>, "closeLabel" | "renderToast">;
}

export function ToastProvider<Data extends object = ToastData>({ children, closeLabel, renderToast, viewport = true, viewportProps, ...props }: ToastProviderProps<Data>) {
	return (
		<BaseToast.Provider {...props}>
			{children}
			{viewport ? <ToastViewport {...viewportProps} {...(closeLabel === undefined ? {} : { closeLabel })} {...(renderToast === undefined ? {} : { renderToast })} /> : null}
		</BaseToast.Provider>
	);
}
