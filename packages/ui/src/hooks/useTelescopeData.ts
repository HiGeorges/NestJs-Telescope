import { useState, useEffect, useCallback, useRef } from 'react';
import type { UseTelescopeDataReturn, TelescopeEntry, TelescopeStats } from '../types';
import { telescopeApi } from '../services/api';

const HOOK_CONFIG = {
  /** Auto-refresh interval in milliseconds */
  AUTO_REFRESH_INTERVAL: 5000,
  
  /** Initial loading state */
  INITIAL_LOADING: true,
  
  /** Initial error state */
  INITIAL_ERROR: null,
} as const;

export function useTelescopeData(): UseTelescopeDataReturn {
  // State management
  const [entries, setEntries] = useState<TelescopeEntry[]>([]);
  const [stats, setStats] = useState<TelescopeStats>({
    totalEntries: 0,
    requests: 0,
    exceptions: 0,
    uniqueIPs: 0,
    uniqueUserAgents: 0,
    averageResponseTime: 0,
    statusCodes: {},
    methods: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(HOOK_CONFIG.INITIAL_LOADING);
  const [error, setError] = useState<string | null>(HOOK_CONFIG.INITIAL_ERROR);

  // Refs for managing intervals and abort controllers
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Fetch all telescope data (entries and stats)
   */
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      
      // Fetch entries and stats in parallel
      const [entriesData, statsData] = await Promise.all([
        telescopeApi.getEntries(),
        telescopeApi.getStats(),
      ]);

      setEntries(entriesData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch telescope data';
      setError(errorMessage);
      console.error('Error fetching telescope data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear all entries
   */
  const clearEntries = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      await telescopeApi.clearEntries();
      
      // Refresh data after clearing
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear entries';
      setError(errorMessage);
      console.error('Error clearing entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  /**
   * Refresh data manually
   */
  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    await fetchData();
  }, [fetchData]);

  /**
   * Start auto-refresh interval
   */
  const startAutoRefresh = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      fetchData();
    }, HOOK_CONFIG.AUTO_REFRESH_INTERVAL);
  }, [fetchData]);

  /**
   * Stop auto-refresh interval
   */
  const stopAutoRefresh = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Effect for initial data fetch and auto-refresh
  useEffect(() => {
    // Initial data fetch
    fetchData();
    
    // Start auto-refresh
    startAutoRefresh();

    // Cleanup function
    return () => {
      stopAutoRefresh();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, startAutoRefresh, stopAutoRefresh]);

  // Effect for visibility change handling
  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        stopAutoRefresh();
      } else {
        startAutoRefresh();
        // Refresh data when tab becomes visible
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchData, startAutoRefresh, stopAutoRefresh]);

  return {
    entries,
    stats,
    isLoading,
    error,
    refresh,
    clearEntries,
  };
} 