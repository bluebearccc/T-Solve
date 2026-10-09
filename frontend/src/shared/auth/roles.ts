/** The four fixed roles (glossary "Role"). Values are the API spellings (guideline 03 §5). */
export const ROLES = ['ADMIN', 'DEPARTMENT_MANAGER', 'PROJECT_MANAGER', 'STAFF'] as const;
export type Role = (typeof ROLES)[number];

/** UI text for each role — exactly as in the SRS. */
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Admin',
  DEPARTMENT_MANAGER: 'Department Manager',
  PROJECT_MANAGER: 'Project Manager',
  STAFF: 'Staff',
};
