import { useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { getGetMeQueryKey, getMe, isApiError, logout } from '@/shared/api';
import type { Session } from './session';

/** Query key of the session: the generated key of `GET /api/v1/me`. */
export const SESSION_QUERY_KEY = getGetMeQueryKey();

/** `/me` answers 401 when nobody is signed in: that is "no session", not an error. */
async function fetchSession(signal: AbortSignal): Promise<Session | null> {
  try {
    return await getMe({ signal });
  } catch (error) {
    if (isApiError(error) && error.status === 401) return null;
    throw error;
  }
}

/**
 * The only source of "who am I" (guideline 06 §7). Returns the session plus named access checks
 * for Project-level permissions (guideline 08 §4).
 */
export function useSession() {
  const query = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: ({ signal }) => fetchSession(signal),
    staleTime: Infinity,
  });
  const session: Session | null = query.data ?? null;

  const isProjectManagerOf = useCallback(
    (projectId: number) =>
      session?.projects.some(
        (p) => p.projectId === projectId && p.roleInProject === 'PROJECT_MANAGER',
      ) ?? false,
    [session],
  );
  const isMemberOf = useCallback(
    (projectId: number) => session?.projects.some((p) => p.projectId === projectId) ?? false,
    [session],
  );

  return {
    session,
    role: session?.role ?? null,
    isPending: query.isPending,
    /** `/me` failed for another reason than 401 (server down…): the app cannot tell who you are. */
    isError: query.isError,
    retry: query.refetch,
    isProjectManagerOf,
    isMemberOf,
  };
}

/**
 * After the signed-in user changed (logout, expired session, dev role switch): drops every other cached
 * query and mutation — they belong to the previous user — and reloads the session in place. Mounted
 * guards see the new session at once (e.g. nobody → redirect to Login).
 */
export async function resetSession(queryClient: QueryClient): Promise<void> {
  const [sessionKey] = SESSION_QUERY_KEY;
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== sessionKey });
  queryClient.getMutationCache().clear();
  await queryClient.resetQueries({ queryKey: SESSION_QUERY_KEY });
}

/** Logs out (SRS 1.2.1): ends the session on the server, then resets the session (see above). */
export function useSignOut() {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    try {
      await logout();
    } finally {
      await resetSession(queryClient);
    }
  }, [queryClient]);
}
