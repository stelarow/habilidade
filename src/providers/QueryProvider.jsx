import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
        refetchOnMount: 'always'
        
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

const QueryProvider = ({ children }) => {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
};

export default QueryProvider;