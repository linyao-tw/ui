import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PasswordField } from "@/components/forms";
import { Pagination, PaginationList } from "@/components/navigation-data";
import { Select } from "@/components/selection";
import { MessagesProvider, enUSMessages, zhTWMessages } from "./index";

describe("messages", () => {
	it("falls back to the Traditional Chinese bundle without a provider", () => {
		render(<PasswordField label="Access key" />);
		expect(screen.getByRole("button", { name: "顯示密碼" })).toBeInTheDocument();
	});

	it("uses the bundle supplied by the nearest provider", () => {
		render(
			<MessagesProvider messages={enUSMessages}>
				<PasswordField label="Access key" />
				<Pagination>
					<PaginationList />
				</Pagination>
			</MessagesProvider>
		);

		expect(screen.getByRole("button", { name: "Show password" })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
	});

	it("merges a partial bundle over the one already in scope", () => {
		render(
			<MessagesProvider messages={enUSMessages}>
				<MessagesProvider messages={{ passwordFieldShow: "Reveal" }}>
					<PasswordField label="Access key" />
					<Pagination>
						<PaginationList />
					</Pagination>
				</MessagesProvider>
			</MessagesProvider>
		);

		expect(screen.getByRole("button", { name: "Reveal" })).toBeInTheDocument();
		expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
	});

	it("lets a component prop win over the bundle", () => {
		render(
			<MessagesProvider messages={enUSMessages}>
				<PasswordField label="Access key" showPasswordLabel="Unmask" />
			</MessagesProvider>
		);

		expect(screen.getByRole("button", { name: "Unmask" })).toBeInTheDocument();
	});

	it("keeps every bundle complete so a locale cannot silently fall back", () => {
		expect(Object.keys(enUSMessages).sort()).toEqual(Object.keys(zhTWMessages).sort());
		expect(Object.values(enUSMessages).every(value => typeof value === "string" || typeof value === "function")).toBe(true);
	});

	it("renders the select placeholder from the bundle", () => {
		render(
			<MessagesProvider messages={enUSMessages}>
				<Select aria-label="Region" options={[{ label: "Taipei", value: "tpe" }]} />
			</MessagesProvider>
		);

		expect(screen.getByRole("combobox", { name: "Region" })).toHaveTextContent("Select an option");
	});
});
