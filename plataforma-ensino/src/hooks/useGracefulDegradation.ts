'use client';

import { useState, useCallback, useRef } from 'react';

interface GracefulDegradationOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallbackData?: any;
  onError?: (error: Error, attempt: number) => void;
  onRetry?: (attempt: number) => void;
  onSuccess?: (data: any, attempt: number) => void;
}

interface GracefulDegradationState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  retryCount: number;
  isRetrying: boolean;
  hasMaxRetriesReached: boolean;
  lastSuccessTime: number | null;
}

export function useGracefulDegradation<T>(
  asyncOperation: () => Promise<T>,
  options: GracefulDegradationOptions = {}
) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    fallbackData = null,
    onError,
    onRetry,
    onSuccess
  } = options;

  const [state, setState] = useState<GracefulDegradationState<T>>({
    data: fallbackData,
    loading: false,
    error: null,
    retryCount: 0,
    isRetrying: false,
    hasMaxRetriesReached: false,
    lastSuccessTime: null
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const execute = useCallback(async (attempt: number = 0): Promise<void> => {
    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      loading: attempt === 0,
      isRetrying: attempt > 0,
      error: null,
      retryCount: attempt
    }));

    try {
      const result = await asyncOperation();
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setState(prev => ({
        ...prev,
        data: result,
        loading: false,
        isRetrying: false,
        error: null,
        hasMaxRetriesReached: false,
        lastSuccessTime: Date.now()
      }));

      onSuccess?.(result, attempt);
    } catch (error) {
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      onError?.(errorObj, attempt);

      if (attempt < maxRetries) {
        setState(prev => ({
          ...prev,
          loading: false,
          isRetrying: true,
          error: errorObj
        }));

        onRetry?.(attempt + 1);

        // Schedule retry with exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        retryTimeoutRef.current = setTimeout(() => {
          execute(attempt + 1);
        }, delay);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          isRetrying: false,
          error: errorObj,
          hasMaxRetriesReached: true,
          data: prev.data || fallbackData
        }));
      }
    }
  }, [asyncOperation, maxRetries, retryDelay, fallbackData, onError, onRetry, onSuccess]);

  const retry = useCallback(() => {
    if (!state.loading && !state.isRetrying) {
      execute(0);
    }
  }, [execute, state.loading, state.isRetrying]);

  const reset = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: fallbackData,
      loading: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
      hasMaxRetriesReached: false,
      lastSuccessTime: null
    });
  }, [fallbackData]);

  const cancel = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState(prev => ({
      ...prev,
      loading: false,
      isRetrying: false
    }));
  }, []);

  return {
    ...state,
    execute: () => execute(0),
    retry,
    reset,
    cancel,
    // Computed properties
    isOperationActive: state.loading || state.isRetrying,
    canRetry: !state.loading && !state.isRetrying && !state.hasMaxRetriesReached,
    hasData: state.data !== null && state.data !== undefined,
    isStale: state.lastSuccessTime ? (Date.now() - state.lastSuccessTime) > 300000 : false, // 5 minutes
    // Helper methods
    getErrorMessage: () => state.error?.message || 'An unknown error occurred',
    getRetryProgress: () => state.hasMaxRetriesReached ? 100 : (state.retryCount / maxRetries) * 100
  };
}

// Specialized hook for API calls with built-in fetch handling
export function useGracefulApiCall<T>(
  url: string,
  options: RequestInit & GracefulDegradationOptions = {}
) {
  const { maxRetries, retryDelay, fallbackData, onError, onRetry, onSuccess, ...fetchOptions } = options;

  const asyncOperation = useCallback(async (): Promise<T> => {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  }, [url, fetchOptions]);

  return useGracefulDegradation<T>(asyncOperation, {
    maxRetries,
    retryDelay,
    fallbackData,
    onError,
    onRetry,
    onSuccess
  });
}

// Hook for handling multiple operations with graceful degradation
export function useGracefulBatch<T extends Record<string, any>>(
  operations: Record<keyof T, () => Promise<any>>,
  options: GracefulDegradationOptions = {}
) {
  const [results, setResults] = useState<Partial<T>>({});
  const [loading, setLoading] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [errors, setErrors] = useState<Record<keyof T, Error | null>>({} as Record<keyof T, Error | null>);

  const executeAll = useCallback(async () => {
    const keys = Object.keys(operations) as (keyof T)[];
    
    // Initialize loading states
    const initialLoading = keys.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    setLoading(initialLoading);

    // Execute all operations
    const promises = keys.map(async (key) => {
      try {
        const result = await operations[key]();
        setResults(prev => ({ ...prev, [key]: result }));
        setErrors(prev => ({ ...prev, [key]: null }));
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setErrors(prev => ({ ...prev, [key]: errorObj }));
        options.onError?.(errorObj, 0);
      } finally {
        setLoading(prev => ({ ...prev, [key]: false }));
      }
    });

    await Promise.allSettled(promises);
  }, [operations, options]);

  const isLoading = Object.values(loading).some(Boolean);
  const hasErrors = Object.values(errors).some(error => error !== null);
  const successCount = Object.values(errors).filter(error => error === null).length;
  const totalCount = Object.keys(operations).length;

  return {
    results,
    loading,
    errors,
    isLoading,
    hasErrors,
    successCount,
    totalCount,
    executeAll,
    reset: () => {
      setResults({});
      setLoading({} as Record<keyof T, boolean>);
      setErrors({} as Record<keyof T, Error | null>);
    }
  };
}