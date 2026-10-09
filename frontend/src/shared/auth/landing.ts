import { paths } from '@/shared/routing/paths';
import type { Role } from './roles';

/** Landing page per role (SRS Screen List #1). */
export const LANDING_PATHS: Record<Role, string> = {
  ADMIN: paths.userList,
  DEPARTMENT_MANAGER: paths.knowledgeDashboard,
  PROJECT_MANAGER: paths.reviewQueue,
  STAFF: paths.search,
};
