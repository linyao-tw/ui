export const FEEDBACK_STATUSES = ["neutral", "info", "success", "warning", "danger"] as const;

export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export type FeedbackLiveMode = "off" | "polite" | "assertive";

export function getLiveRegionProps(live: FeedbackLiveMode): {
	"aria-live"?: "polite" | "assertive";
	role?: "status" | "alert";
} {
	if (live === "assertive") {
		return { "aria-live": "assertive", role: "alert" };
	}

	if (live === "polite") {
		return { "aria-live": "polite", role: "status" };
	}

	return {};
}
