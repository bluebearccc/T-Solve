import type { Role } from './roles';
import type { Session } from './session';

/**
 * DEV ONLY — the signed-in user while there is no backend. The dev role switcher writes the role to
 * localStorage; `loadSession` reads it. Replaced by the real `/api/v1/me` call (via MSW in mock mode)
 * in scaffold step 5.3.
 */
const STORAGE_KEY = 'tsolve.dev.role';
const DEFAULT_DEV_ROLE: Role = 'PROJECT_MANAGER';

const IT = { departmentId: 1, name: 'IT' };
const HR = { departmentId: 2, name: 'HR' };

const DEV_SESSIONS: Record<Role, Session> = {
  ADMIN: {
    user: { id: 1, fullName: 'Admin User', email: 'admin@company.example' },
    role: 'ADMIN',
    projects: [],
    departments: [],
  },
  DEPARTMENT_MANAGER: {
    user: { id: 2, fullName: 'Department Manager User', email: 'dm@company.example' },
    role: 'DEPARTMENT_MANAGER',
    projects: [],
    departments: [IT],
  },
  PROJECT_MANAGER: {
    user: { id: 3, fullName: 'Project Manager User', email: 'pm@company.example' },
    role: 'PROJECT_MANAGER',
    projects: [
      {
        projectId: 101,
        jiraProjectKey: 'ITSUP',
        departmentId: 1,
        departmentName: 'IT',
        roleInProject: 'PROJECT_MANAGER',
      },
      {
        projectId: 102,
        jiraProjectKey: 'NET',
        departmentId: 1,
        departmentName: 'IT',
        roleInProject: 'MEMBER',
      },
    ],
    departments: [IT],
  },
  STAFF: {
    user: { id: 4, fullName: 'Staff User', email: 'staff@company.example' },
    role: 'STAFF',
    projects: [
      {
        projectId: 101,
        jiraProjectKey: 'ITSUP',
        departmentId: 1,
        departmentName: 'IT',
        roleInProject: 'MEMBER',
      },
      {
        projectId: 201,
        jiraProjectKey: 'HRD',
        departmentId: 2,
        departmentName: 'HR',
        roleInProject: 'MEMBER',
      },
    ],
    departments: [IT, HR],
  },
};

function isRole(value: string | null): value is Role {
  return value !== null && value in DEV_SESSIONS;
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

/** Resolves like an API call so callers already handle the asynchronous case. */
export function loadSession(): Promise<Session | null> {
  const role = getDevRole();
  return Promise.resolve(role ? DEV_SESSIONS[role] : null);
}
