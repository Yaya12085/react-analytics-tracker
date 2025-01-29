import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useAnalytics } from "../context";
import { AnalyticsProvider } from "../provider";

// Demo component to showcase analytics tracking
function DemoComponent() {
	const { trackEvent, trackPageView, trackError, trackClick } = useAnalytics();

	const handleCustomEvent = () => {
		trackEvent({
			name: "custom_event",
			properties: {
				action: "demo_action",
				category: "demo",
				label: "Demo Custom Event",
			},
		});
	};

	const handlePageView = () => {
		trackPageView("/demo-page", "Demo Page View");
	};

	const handleError = () => {
		try {
			throw new Error("Demo Error");
		} catch (error) {
			if (error instanceof Error) {
				trackError(error);
			}
		}
	};

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		trackClick(event.currentTarget);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				padding: "1rem",
			}}
		>
			<h2>Analytics Tracking Demo</h2>
			<p>
				This is a demo component to showcase the usage of the AnalyticsProvider
				and the useAnalytics hook. See the network tab in the browser to see the
				events being sent to the endpoint and console for debug logs.
			</p>

			<div>
				<h3>Custom Event Tracking</h3>
				<button
					type="button"
					onClick={handleCustomEvent}
					style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
				>
					Track Custom Event
				</button>
			</div>

			<div>
				<h3>Page View Tracking</h3>
				<button
					type="button"
					onClick={handlePageView}
					style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
				>
					Track Page View
				</button>
			</div>

			<div>
				<h3>Error Tracking</h3>
				<button
					type="button"
					onClick={handleError}
					style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
				>
					Track Error
				</button>
			</div>

			<div>
				<h3>Click Tracking</h3>
				<button
					type="button"
					id="click-track-button"
					className="demo-button"
					onClick={handleClick}
					style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
				>
					Track Click
				</button>
			</div>
		</div>
	);
}

const meta = {
	title: "Analytics/Provider",
	component: AnalyticsProvider,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component: `
# React Analytics Tracker

A lightweight, powerful analytics solution for React applications that helps you track user interactions, page views, errors, and performance metrics with minimal setup.

## Key Features
- 🚀 **Simple Integration** - Easy to set up and use with any React application
- 📊 **Comprehensive Tracking** - Track events, page views, clicks, and errors
- 📈 **Performance Monitoring** - Built-in Web Vitals tracking
- 🛠️ **Customizable** - Transform and filter events before sending
- 🐛 **Debug Mode** - Easy debugging with detailed console logs
- 🔒 **Type-Safe** - Written in TypeScript with full type definitions
- ⚡ **Lightweight** - Zero dependencies besides React

## Quick Start

### 1. Installation

\`\`\`bash
npm install react-analytics-trackers
\`\`\`

### 2. Setup Provider

Wrap your application with \`AnalyticsProvider\`:

\`\`\`tsx
import { AnalyticsProvider } from 'react-analytics-trackers';

function App() {
  return (
    <AnalyticsProvider
      config={{
        endpoint: 'https://your-analytics-api.com',
        debug: process.env.NODE_ENV === 'development',
        includeWebVitals: true,
        customHeaders: {
          'Authorization': 'Bearer your-token'
        },
      }}
    >
      <YourApp />
    </AnalyticsProvider>
  );
}
\`\`\`

### 3. Start Tracking

Use the \`useAnalytics\` hook in your components:

\`\`\`tsx
import { useAnalytics } from 'react-analytics-trackers';

function MyComponent() {
  const { trackEvent, trackPageView } = useAnalytics();

  // Track custom events
  const handlePurchase = () => {
    trackEvent({
      name: 'purchase_completed',
      properties: {
        orderId: 'ord_123',
        amount: 99.99,
        currency: 'USD',
      },
    });
  };

  // Track page views (great with React Router)
  useEffect(() => {
    trackPageView(
      '/products/123',
      'Premium Product'
    );
  }, []);

  return (
    <button type="button" onClick={handlePurchase}>
      Complete Purchase
    </button>
  );
}
\`\`\`

## Advanced Usage

### Custom Event Tracking

Track any user interaction or business event:

\`\`\`tsx
const { trackEvent } = useAnalytics();

// Track feature usage
trackEvent({
  name: 'feature_used',
  properties: {
    featureId: 'dark_mode',
    source: 'settings_panel',
    successful: true,
  },
});

// Track business metrics
trackEvent({
  name: 'subscription_started',
  properties: {
    plan: 'pro',
    term: 'annual',
    revenue: 299,
  },
});
\`\`\`

### Automatic Page View Tracking

Integrate with your router for automatic page view tracking:

\`\`\`tsx
function RouteTracker() {
  const { trackPageView } = useAnalytics();
  const location = useLocation();
  const { title } = useDocumentTitle(); // Your title management hook

  useEffect(() => {
    trackPageView(location.pathname, title);
  }, [location.pathname, title]);

  return null;
}
\`\`\`

### Error Tracking

Capture and track errors throughout your application:

\`\`\`tsx
// In error boundaries
class ErrorBoundary extends React.Component {
  const { trackError } = useAnalytics();

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    trackError(error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

// In async operations
const { trackError } = useAnalytics();

try {
  await apiCall();
} catch (error) {
  if (error instanceof Error) {
    trackError(error);
    // Handle error appropriately
  }
}
\`\`\`

### Click Tracking

Track user interactions with UI elements:

\`\`\`tsx
const { trackClick } = useAnalytics();

// Track important buttons
<button
  type="button"
  id="checkout-button"
  className="primary-cta"
  onClick={(e) => {
    trackClick(e.currentTarget);
    // Your click handler
  }}
>
  Proceed to Checkout
</button>

// Track navigation links
<a
  href="/pricing"
  className="nav-link"
  onClick={(e) => {
    trackClick(e.currentTarget);
  }}
>
  View Pricing
</a>
\`\`\`

## Configuration

\`\`\`typescript
interface AnalyticsConfig {
  // Required: API endpoint for analytics events
  endpoint: string;
  
  // Optional: Enable console logging for development
  debug?: boolean;
  
  // Optional: Enable Core Web Vitals tracking
  includeWebVitals?: boolean;
  
  // Optional: Add custom headers to all requests
  customHeaders?: Record<string, string>;
  
  // Optional: Transform/filter events before sending
  beforeSend?: (event: AnalyticsEvent) => AnalyticsEvent | null;
}
\`\`\`

### Event Transformation

Use \`beforeSend\` to modify or filter events:

\`\`\`tsx
<AnalyticsProvider
  config={{
    endpoint: 'https://api.analytics.com',
    beforeSend: (event) => ({
      ...event,
      properties: {
        ...event.properties,
        environment: process.env.NODE_ENV,
        version: APP_VERSION,
        userId: getCurrentUser()?.id,
      },
    }),
  }}
>
  <App />
</AnalyticsProvider>
\`\`\`
        `,
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof AnalyticsProvider>;

export default meta;
type Story = StoryObj<typeof AnalyticsProvider>;

export const Default: Story = {
	render: () => (
		<AnalyticsProvider
			config={{
				debug: true,
				endpoint: "https://api.example.com/analytics",
				includeWebVitals: true,
				customHeaders: {
					token: "eyIZZIHUZN",
				},
				beforeSend: (event) => ({
					...event,
					properties: {
						...event.properties,
						appVersion: "1.0.0",
						environment: process.env.NODE_ENV,
					},
				}),
			}}
		>
			<DemoComponent />
		</AnalyticsProvider>
	),
};
