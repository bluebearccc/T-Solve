import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { loadSession, setDevRole } from './dev-session';
import type { Session } from './session';

/** Query key of the session. Becomes the generated `/me` key in scaffold step 5.3. */
export const SESSION_QUERY_KEY = ['session'] as const;

/**
 * The only source of "who am I" (guideline 06 §7). Returns the session plus named access checks
 * for Project-level permissions (guideline 08 §4).
 */
export function useSession() {
  const query = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: loadSession,
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
    isProjectManagerOf,
    isMemberOf,
  };
}

/** Signs the user out and clears every cached query. */
export function useSignOut() {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    setDevRole(null); // step 5.3: call the logout endpoint instead
    queryClient.clear();
    await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
  }, [queryClient]);
}
