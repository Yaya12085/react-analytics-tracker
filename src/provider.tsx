import type React from "react";
import type { JSX } from "react";
import { useCallback, useEffect } from "react";
import { onCLS, onFCP, onFID, onLCP, onTTFB } from "web-vitals";
import { AnalyticsContext } from "./context";
import type { AnalyticsEvent, AnalyticsProviderProps } from "./types";

export function AnalyticsProvider({
	config,
	children,
}: AnalyticsProviderProps): JSX.Element {
	const sendEvent = useCallback(
		async (event: AnalyticsEvent): Promise<void> => {
			const timestamp = event.timestamp || Date.now();
			let finalEvent: AnalyticsEvent = {
				...event,
				timestamp,
			};

			if (config.beforeSend) {
				const modifiedEvent = config.beforeSend(finalEvent);
				if (!modifiedEvent) {
					return;
				}
				finalEvent = modifiedEvent;
			}

			if (config.debug) {
				console.log("[Analytics]", finalEvent);
			}

			try {
				const response = await fetch(config.endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...config.customHeaders,
					},
					body: JSON.stringify(finalEvent),
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
			} catch (error) {
				if (config.debug) {
					console.error("[Analytics] Failed to send event:", error);
				}
			}
		},
		[config],
	);

	const trackEvent = useCallback(
		(event: AnalyticsEvent): void => {
			sendEvent(event);
		},
		[sendEvent],
	);

	const trackPageView = useCallback(
		(path: string, title?: string): void => {
			sendEvent({
				name: "pageview",
				properties: {
					path,
					title: title || document.title,
					referrer: document.referrer,
				},
			});
		},
		[sendEvent],
	);

	const trackError = useCallback(
		(error: Error, errorInfo?: React.ErrorInfo): void => {
			sendEvent({
				name: "error",
				properties: {
					error: error.toString(),
					errorInfo: errorInfo?.componentStack,
				},
			});
		},
		[sendEvent],
	);

	const trackClick = useCallback(
		(element: HTMLElement): void => {
			sendEvent({
				name: "click",
				properties: {
					elementId: element.id,
					elementClass: element.className,
					elementText: element.textContent,
					href: element instanceof HTMLAnchorElement ? element.href : undefined,
				},
			});
		},
		[sendEvent],
	);

	useEffect(() => {
		if (config.includeWebVitals) {
			onFCP((result) => sendEvent({ name: "web-vitals", properties: result }));
			onLCP((result) => sendEvent({ name: "web-vitals", properties: result }));
			onCLS((result) => sendEvent({ name: "web-vitals", properties: result }));
			onFID((result) => sendEvent({ name: "web-vitals", properties: result }));
			onTTFB((result) => sendEvent({ name: "web-vitals", properties: result }));
		}
	}, [config.includeWebVitals, sendEvent]);

	const value = {
		trackEvent,
		trackPageView,
		trackError,
		trackClick,
	};

	return (
		<AnalyticsContext.Provider value={value}>
			{children}
		</AnalyticsContext.Provider>
	);
}
