import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client with optimized settings
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache settings
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        
        // Retry settings
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          // Retry up to 3 times for server errors
          return failureCount < 3;
        },
        
        // Performance settings
        refetchOnWindowFocus: false, // Disable refetch on window focus for better UX
        refetchOnReconnect: true, // Refetch when reconnecting to internet
        
        // Force refetch on mount to handle navigation between similar routes
        refetchOnMount: 'always',
        
        // Background refetch settings
        refetchInterval: false, // No automatic background refetching
        refetchIntervalInBackground: false,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  });
};

// Create a single instance to prevent recreation on re-renders
let queryClient;

const getQueryClient = () => {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
};

// Client-only DevTools component to prevent hydration mismatch
const ClientOnlyDevTools = () => {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Only render on client side and in development
  if (!isClient || !import.meta.env.DEV) {
    return null;
  }
  
  // Dynamic import to ensure DevTools are only loaded in development
  const ReactQueryDevtools = React.lazy(() => 
    import('@tanstack/react-query-devtools').then(module => ({
      default: module.ReactQueryDevtools
    }))
  );
  
  return (
    <React.Suspense key="react-query-devtools" fallback={null}>
      <ReactQueryDevtools 
        initialIsOpen={false}
        position="bottom-right"
        buttonPosition="bottom-right"
      />
    </React.Suspense>
  );
};

const QueryProvider = ({ children }) => {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      <ClientOnlyDevTools />
    </QueryClientProvider>
  );
};

export default QueryProvider;