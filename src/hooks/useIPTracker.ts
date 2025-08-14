import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import {
  fetchIPInfo,
  getCurrentUserIP,
  clearCache,
} from "../services/ipTracker";
import { useIPTrackerStore } from "../stores/ipTracker";

const QUERY_KEYS = {
  currentIP: ["ip", "current"] as const,
  searchIP: (query: string) => ["ip", "search", query] as const,
} as const;

export function useCurrentIP() {
  const { setCurrentIP, setLoading, setError } = useIPTrackerStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.currentIP,
    queryFn: getCurrentUserIP,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle state updates based on query status
  useEffect(() => {
    if (query.data) {
      setCurrentIP(query.data);
      setError(null);
    }
    if (query.error) {
      setError(query.error.message);
    }
    setLoading(query.isLoading);
  }, [
    query.data,
    query.error,
    query.isLoading,
    setCurrentIP,
    setError,
    setLoading,
  ]);

  return query;
}

export function useSearchIP() {
  const queryClient = useQueryClient();
  const { setCurrentIP, setLoading, setError, addToHistory } =
    useIPTrackerStore();

  const mutation = useMutation({
    mutationFn: fetchIPInfo,
    retry: 1,
    retryDelay: 2000,
  });

  // Handle mutation state updates
  useEffect(() => {
    if (mutation.isPending) {
      setLoading(true);
      setError(null);
    } else {
      setLoading(false);
    }

    if (mutation.data) {
      setCurrentIP(mutation.data);
    }

    if (mutation.error) {
      setError(mutation.error.message);
    }
  }, [
    mutation.isPending,
    mutation.data,
    mutation.error,
    setCurrentIP,
    setLoading,
    setError,
  ]);

  const searchIP = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setError("Please enter an IP address or domain name");
        return;
      }

      mutation.mutate(trimmedQuery, {
        onSuccess: (data, variables) => {
          if (variables) {
            addToHistory(variables);
            // Cache the search result
            queryClient.setQueryData(QUERY_KEYS.searchIP(variables), data);
          }
        },
      });
    },
    [mutation, setError, addToHistory, queryClient]
  );

  return {
    searchIP,
    isLoading: mutation.isPending,
    error: mutation.error?.message,
    data: mutation.data,
    reset: mutation.reset,
  };
}

export function usePrefetchIP() {
  const queryClient = useQueryClient();

  return useCallback(
    (query: string) => {
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.searchIP(query),
        queryFn: () => fetchIPInfo(query),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );
}

export function useClearCache() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearCache();
    queryClient.clear();
  }, [queryClient]);
}
