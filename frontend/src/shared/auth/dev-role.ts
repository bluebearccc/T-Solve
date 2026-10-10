import { ROLES, type Role } from './roles';

/**
 * DEV ONLY (mock mode). Which fixture user the MSW `/api/v1/me` mock returns (src/mocks/session.ts):
 * the dev role switcher and the test helpers write it, the mock reads it. With a real backend it does
 * nothing — the session cookie decides who is signed in.
 */
const STORAGE_KEY = 'tsolve.dev.role';
const DEFAULT_DEV_ROLE: Role = 'PROJECT_MANAGER';

function isRole(value: string | null): value is Role {
  return value !== null && (ROLES as readonly string[]).includes(value);
}

/** The dev role, or null when "signed out". */
export function getDevRole(): Role | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === '') return null;
    return isRole(stored) ? stored : DEFAULT_DEV_ROLE;
  } catch {
    return DEFAULT_DEV_ROLE;
  }
}

export function setDevRole(role: Role | null): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, role ?? '');
  } catch {
    // Storage blocked (private mode): the default role stays in use.
  }
}
