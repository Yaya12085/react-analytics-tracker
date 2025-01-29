import type React from "react";
import { createContext, useContext } from "react";
import type { AnalyticsEvent } from "./types";

interface AnalyticsContextType {
	trackEvent: (event: AnalyticsEvent) => void;
	trackPageView: (path: string, title?: string) => void;
	trackError: (error: Error, errorInfo?: React.ErrorInfo) => void;
	trackClick: (element: HTMLElement) => void;
}

export const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
	undefined,
);

export function useAnalytics(): AnalyticsContextType {
	const context = useContext(AnalyticsContext);
	if (!context) {
		throw new Error("useAnalytics must be used within an AnalyticsProvider");
	}
	return context;
}
