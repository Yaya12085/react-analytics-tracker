import type React from "react";
export interface AnalyticsEvent {
	name: string;
	properties?: Record<string, any>;
	timestamp?: number;
}

export interface PageViewEvent extends AnalyticsEvent {
	path: string;
	title?: string;
	referrer?: string;
}

export interface ErrorEvent extends AnalyticsEvent {
	error: string;
	errorInfo?: string;
	componentStack?: string;
}

export interface ClickEvent extends AnalyticsEvent {
	elementId?: string;
	elementClass?: string;
	elementText?: string;
	href?: string;
}

export interface WebVitalsEvent extends AnalyticsEvent {
	id: string;
	name: "FCP" | "LCP" | "CLS" | "FID" | "TTFB";
	value: number;
	rating: "good" | "needs-improvement" | "poor";
}

export interface AnalyticsConfig {
	endpoint: string;
	debug?: boolean;
	includeWebVitals?: boolean;
	customHeaders?: Record<string, string>;
	beforeSend?: (event: AnalyticsEvent) => AnalyticsEvent | null;
}

export interface AnalyticsProviderProps {
	config: AnalyticsConfig;
	children: React.ReactNode;
}
