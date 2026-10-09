import { QueryClient } from '@tanstack/react-query';

/**
 * Cache defaults for the whole app (guideline 06 §4). Don't override them per hook without a reason.
 * Step 5.3 adds: no retry on 4xx, and the global 401 / 403 / MSG06 handling.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, gcTime: 5 * 60_000, retry: 1, refetchOnWindowFocus: true },
      mutations: { retry: 0 },
    },
  });
}
