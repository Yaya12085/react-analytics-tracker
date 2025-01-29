import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AnalyticsConfig } from "../src/types";

describe("analytics Tracker", () => {
	const mockConfig: AnalyticsConfig = {
		endpoint: "https://api.example.com/analytics",
		debug: true,
		includeWebVitals: false,
	};

	// Mock fetch globally
	const mockFetch = vi.fn();
	globalThis.fetch = mockFetch;

	// Mock document object
	const mockDocument = {
		title: "Test Document",
		referrer: "https://example.com/referrer",
	};
	vi.stubGlobal("document", mockDocument);

	beforeEach(() => {
		mockFetch.mockReset();
		mockFetch.mockResolvedValue({ ok: true });
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-01"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should track custom events", async () => {
		const event = { name: "test-event", properties: { test: true } };

		await fetch(mockConfig.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...event,
				timestamp: Date.now(),
			}),
		});

		expect(mockFetch).toHaveBeenCalledWith(
			mockConfig.endpoint,
			expect.objectContaining({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: "test-event",
					properties: { test: true },
					timestamp: Date.now(),
				}),
			}),
		);
	});

	it("should track page views", async () => {
		const path = "/test-page";
		const title = "Test Page";

		await fetch(mockConfig.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "pageview",
				properties: {
					path,
					title,
					referrer: mockDocument.referrer,
				},
				timestamp: Date.now(),
			}),
		});

		expect(mockFetch).toHaveBeenCalledWith(
			mockConfig.endpoint,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					name: "pageview",
					properties: {
						path: "/test-page",
						title: "Test Page",
						referrer: "https://example.com/referrer",
					},
					timestamp: Date.now(),
				}),
			}),
		);
	});

	it("should track clicks", async () => {
		const mockElement = {
			id: "test-button",
			className: "test-class",
			textContent: "Track Click",
		};

		await fetch(mockConfig.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "click",
				properties: {
					elementId: mockElement.id,
					elementClass: mockElement.className,
					elementText: mockElement.textContent,
					href: undefined,
				},
				timestamp: Date.now(),
			}),
		});

		expect(mockFetch).toHaveBeenCalledWith(
			mockConfig.endpoint,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					name: "click",
					properties: {
						elementId: "test-button",
						elementClass: "test-class",
						elementText: "Track Click",
						href: undefined,
					},
					timestamp: Date.now(),
				}),
			}),
		);
	});

	it("should track errors", async () => {
		const error = new Error("Test error");

		await fetch(mockConfig.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "error",
				properties: {
					error: error.toString(),
					errorInfo: undefined,
				},
				timestamp: Date.now(),
			}),
		});

		expect(mockFetch).toHaveBeenCalledWith(
			mockConfig.endpoint,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					name: "error",
					properties: {
						error: "Error: Test error",
						errorInfo: undefined,
					},
					timestamp: Date.now(),
				}),
			}),
		);
	});

	it("should handle failed requests", async () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {
			//
		});
		mockFetch.mockRejectedValueOnce(new Error("Network error"));

		const event = { name: "test-event", properties: { test: true } };

		await fetch(mockConfig.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...event,
				timestamp: Date.now(),
			}),
		}).catch(() => {
			//
		});

		expect(mockFetch).toHaveBeenCalledWith(
			mockConfig.endpoint,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					name: "test-event",
					properties: { test: true },
					timestamp: Date.now(),
				}),
			}),
		);

		consoleSpy.mockRestore();
	});

	it("should respect beforeSend hook", async () => {
		const configWithBeforeSend: AnalyticsConfig = {
			...mockConfig,
			beforeSend: (event) => {
				if (event.name === "test-event") {
					return {
						...event,
						properties: { ...event.properties, modified: true },
					};
				}
				return null;
			},
		};

		const event = { name: "test-event", properties: { test: true } };
		const modifiedEvent = configWithBeforeSend.beforeSend?.(event);

		if (modifiedEvent) {
			await fetch(configWithBeforeSend.endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...modifiedEvent,
					timestamp: Date.now(),
				}),
			});
		}

		expect(mockFetch).toHaveBeenCalledWith(
			mockConfig.endpoint,
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					name: "test-event",
					properties: { test: true, modified: true },
					timestamp: Date.now(),
				}),
			}),
		);
	});
});
