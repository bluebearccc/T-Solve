import type { Role } from './roles';

/**
 * Who is signed in (SRS 1.2.1 My Profile fields).
 * TEMPORARY hand-written type: replaced by the generated `GET /api/v1/me` type when the data layer lands
 * (scaffold step 5.3). Do not copy this pattern — API types are generated (guideline 04 §3).
 */
export type Session = {
  user: { id: number; fullName: string; email: string };
  role: Role;
  /** Projects the user belongs to, with their role in each (empty for Admin and Department Manager). */
  projects: {
    projectId: number;
    jiraProjectKey: string;
    departmentId: number;
    departmentName: string;
    roleInProject: 'PROJECT_MANAGER' | 'MEMBER';
  }[];
  /** The user's Departments: derived from Projects, or the Departments a Department Manager manages. */
  departments: { departmentId: number; name: string }[];
};
