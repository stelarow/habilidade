import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    enabled: true,
    beforeSend(event) {
      // Filter out headers-related errors that are not actionable
      if (event.exception?.values?.[0]?.value?.includes('headers.split is not a function')) {
        return null;
      }
      return event;
    },
    integrations: [
      new Sentry.Integrations.BrowserTracing(),
    ],
  });
}