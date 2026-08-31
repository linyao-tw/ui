import { act, render, screen, waitFor } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "./alert";
import { Banner } from "./banner";
import { Meter } from "./meter";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { createToastManager, ToastProvider } from "./toast";

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
