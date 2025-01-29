# React Analytics Tracker

A powerful, lightweight, and customizable analytics tracking solution for React applications. Automatically track page views, clicks, errors, web vitals, and custom events with minimal setup.

## Features

- 📊 Automatic page view tracking
- 🖱️ Click event tracking
- ❌ Error tracking
- 📈 Web Vitals monitoring
- 🎯 Custom event tracking
- 🐛 Debug mode
- 🔧 Customizable event processing

## Installation

```bash
# Using npm
npm install react-analytics-tracker

# Using yarn
yarn add react-analytics-tracker

# Using pnpm
pnpm add react-analytics-tracker
```

## Usage

### Basic Setup

```tsx
import { AnalyticsProvider } from "react-analytics-tracker";

function App() {
  const config = {
    endpoint: "https://your-analytics-api.com/events",
    debug: process.env.NODE_ENV === "development",
    includeWebVitals: true,
  };

  return (
    <AnalyticsProvider config={config}>
      <YourApp />
    </AnalyticsProvider>
  );
}
```

### Tracking Custom Events

```tsx
import { useAnalytics } from "react-analytics-tracker";

function MyComponent() {
  const { trackEvent } = useAnalytics();

  const handleButtonClick = () => {
    trackEvent({
      name: "button_click",
      properties: {
        buttonId: "submit-form",
        location: "homepage",
      },
    });
  };

  return <button onClick={handleButtonClick}>Click me</button>;
}
```

### Configuration Options

```typescript
interface AnalyticsConfig {
  // Required: API endpoint to send analytics events
  endpoint: string;

  // Optional: Enable debug mode to log events to console
  debug?: boolean;

  // Optional: Enable Web Vitals tracking
  includeWebVitals?: boolean;

  // Optional: Custom headers for API requests
  customHeaders?: Record<string, string>;

  // Optional: Transform or filter events before sending
  beforeSend?: (event: AnalyticsEvent) => AnalyticsEvent | null;
}
```

### Available Hooks

- `useAnalytics()`: Main hook for tracking events
  - `trackEvent(event: AnalyticsEvent)`: Track custom events
  - `trackPageView(path: string, title?: string)`: Track page views
  - `trackError(error: Error, errorInfo?: React.ErrorInfo)`: Track errors
  - `trackClick(element: HTMLElement)`: Track element clicks

### Web Vitals Tracking

Web Vitals tracking is automatically included when `includeWebVitals` is enabled in the config. It tracks:

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)
- Time to First Byte (TTFB)

### Debug Mode

When `debug` is enabled in the config:

- All events are logged to the console
- Failed API requests are logged with error details
- Helpful for development and troubleshooting

## Example Implementation

```tsx
import { AnalyticsProvider, useAnalytics } from "react-analytics-tracker";

// Configure the provider
const config = {
  endpoint: "https://api.example.com/analytics",
  debug: true,
  includeWebVitals: true,
  beforeSend: (event) => {
    // Add common properties to all events
    return {
      ...event,
      properties: {
        ...event.properties,
        appVersion: "1.0.0",
        environment: process.env.NODE_ENV,
      },
    };
  },
};

// Wrap your app with the provider
function App() {
  return (
    <AnalyticsProvider config={config}>
      <Router>
        <YourRoutes />
      </Router>
    </AnalyticsProvider>
  );
}

// Use in components
function FeatureComponent() {
  const { trackEvent } = useAnalytics();

  const handleFeatureUse = () => {
    trackEvent({
      name: "feature_used",
      properties: {
        featureId: "awesome-feature",
        userId: "user-123",
      },
    });
  };

  return (
    <div>
      <button onClick={handleFeatureUse}>Use Feature</button>
    </div>
  );
}
```

## License

MIT

## Contributing

Contributions are welcome!
