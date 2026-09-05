import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { MessagesProvider, enUSMessages } from "@/intl";
import { Alert } from "./alert";
import { Banner } from "./banner";
import { Meter } from "./meter";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { ToastProvider, createToastManager } from "./toast";

describe("static feedback semantics", () => {
	it("does not turn static alerts and banners into live alerts by default", () => {
		render(
			<>
				<Alert>Saved settings are shown here.</Alert>
				<Banner>Scheduled maintenance is tomorrow.</Banner>
			</>
		);

		expect(screen.getByText("Saved settings are shown here.")).not.toHaveAttribute("role");
		expect(screen.getByText("Scheduled maintenance is tomorrow.")).not.toHaveAttribute("role");
	});

	it("opts dynamic feedback into the requested announcement priority", () => {
		render(
			<>
				<Alert live="assertive">Connection lost.</Alert>
				<Banner live="polite">A new version is available.</Banner>
			</>
		);

		expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
		expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
	});
});

describe("range feedback", () => {
	it("exposes progress values and labels through the Base UI progress primitive", () => {
		render(<Progress label="Upload" max={200} min={0} value={50} />);

		const progress = screen.getByRole("progressbar", { name: "Upload" });
		expect(progress).toHaveAttribute("aria-valuemin", "0");
		expect(progress).toHaveAttribute("aria-valuemax", "200");
		expect(progress).toHaveAttribute("aria-valuenow", "50");
		expect(progress).toHaveAttribute("aria-valuetext", "25%");
	});

	it("exposes meter values and locale-sensitive text through the Base UI meter primitive", () => {
		render(<Meter format={{ maximumFractionDigits: 1, style: "unit", unit: "gigabyte" }} label="Storage used" locale="en-US" max={10} min={0} value={4.5} />);

		const meter = screen.getByRole("meter", { name: "Storage used" });
		expect(meter).toHaveAttribute("aria-valuemin", "0");
		expect(meter).toHaveAttribute("aria-valuemax", "10");
		expect(meter).toHaveAttribute("aria-valuenow", "4.5");
		expect(meter).toHaveAttribute("aria-valuetext", "4.5 GB");
	});
});

describe("loading feedback", () => {
	it("supports both named and explicitly decorative spinners", () => {
		const { container } = render(
			<>
				<Spinner label="Loading records" />
				<Spinner decorative />
			</>
		);

		expect(screen.getByRole("status", { name: "Loading records" })).toBeInTheDocument();
		expect(container.querySelector('[aria-hidden="true"]')).not.toHaveAttribute("role");
	});

	it("keeps skeletons out of the accessibility tree", () => {
		const { container } = render(<Skeleton data-testid="placeholder" />);

		expect(screen.getByTestId("placeholder")).toHaveAttribute("aria-hidden", "true");
		expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
	});
});

describe("toast manager integration", () => {
	it("preserves custom toast-data types through manager, provider, and renderer", async () => {
		interface JobToastData {
			jobId: string;
		}

		const manager = createToastManager<JobToastData>();
		render(
			<ToastProvider<JobToastData> timeout={0} toastManager={manager} renderToast={toast => <div>Job {toast.data?.jobId}</div>}>
				<div>Application</div>
			</ToastProvider>
		);

		act(() => {
			manager.add({ data: { jobId: "JOB-071" }, title: "Job updated" });
		});

		expect(await screen.findByText("Job JOB-071")).toBeInTheDocument();
	});

	it("adds, announces, and closes manager-driven toasts", async () => {
		const manager = createToastManager();
		const onClose = vi.fn();
		let toastId = "";

		render(
			<ToastProvider closeLabel="Close system notice" timeout={0} toastManager={manager}>
				<div>Application</div>
			</ToastProvider>
		);

		act(() => {
			toastId = manager.add({
				data: { status: "success" },
				description: "Your changes are available.",
				onClose,
				priority: "low",
				title: "Configuration saved"
			});
		});

		expect(await screen.findByRole("heading", { name: "Configuration saved" })).toBeInTheDocument();
		expect(screen.getByText("Your changes are available.")).toBeInTheDocument();
		expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();

		expect(document.querySelector('[aria-label="Close system notice"]')).toBeInTheDocument();
		act(() => {
			manager.close(toastId);
		});
		expect(onClose).toHaveBeenCalledTimes(1);
		await waitFor(() => {
			expect(screen.queryByRole("heading", { name: "Configuration saved" })).not.toBeInTheDocument();
		});
	});
});

describe("feedback accessibility", () => {
	it("has no automated accessibility violations in a representative composition", async () => {
		const { container } = render(
			<main>
				<Alert status="info">System diagnostics are available.</Alert>
				<Progress label="Indexing" value={68} />
				<Meter label="Signal strength" status="success" value={82} />
				<Spinner label="Refreshing diagnostics" />
			</main>
		);

		const results = await axe.run(container, {
			rules: {
				"color-contrast": { enabled: false }
			}
		});
		expect(results.violations).toEqual([]);
	});
});

describe("toast manager", () => {
	// Base UI keeps the close control out of the accessibility tree until the toast is focused, so
	// these assertions read it from the DOM rather than through a role query.
	const closeControl = () => document.querySelector<HTMLButtonElement>(".lyds-toast__close");

	it("renders queued toasts through the provider's viewport and closes them", async () => {
		const user = userEvent.setup();
		const manager = createToastManager();

		render(
			<ToastProvider toastManager={manager} timeout={0}>
				<button type="button" onClick={() => manager.add({ title: "Deploy finished", description: "Node alpha is live.", data: { status: "success" } })}>
					Deploy
				</button>
			</ToastProvider>
		);

		await user.click(screen.getByRole("button", { name: "Deploy" }));

		const title = await screen.findByText("Deploy finished");
		expect(screen.getByText("Node alpha is live.")).toBeInTheDocument();
		expect(title.closest(".lyds-toast")).toHaveAttribute("data-status", "success");
		expect(document.querySelector(".lyds-toast__viewport")).toHaveAttribute("aria-live", "polite");

		expect(closeControl()).toHaveAttribute("aria-label", "關閉通知");
		await user.click(closeControl() as HTMLButtonElement);
		await waitFor(() => expect(screen.queryByText("Deploy finished")).not.toBeInTheDocument());
	});

	it("takes the close label from the message bundle", async () => {
		const user = userEvent.setup();
		const manager = createToastManager();

		render(
			<MessagesProvider messages={enUSMessages}>
				<ToastProvider toastManager={manager} timeout={0}>
					<button type="button" onClick={() => manager.add({ title: "Saved" })}>
						Save
					</button>
				</ToastProvider>
			</MessagesProvider>
		);

		await user.click(screen.getByRole("button", { name: "Save" }));
		await screen.findByText("Saved");
		expect(closeControl()).toHaveAttribute("aria-label", "Close notification");
	});
});
