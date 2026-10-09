import { auditLogRoutes } from '@/features/audit-log';
import { authRoutes } from '@/features/auth';
import { feedbackRoutes } from '@/features/feedback';
import { jiraIntegrationRoutes } from '@/features/jira-integration';
import { knowledgeDashboardRoutes } from '@/features/knowledge-dashboard';
import { myProfileRoutes } from '@/features/my-profile';
import { reviewRoutes } from '@/features/review';
import { searchRoutes } from '@/features/search';
import { ticketImportRoutes } from '@/features/ticket-import';
import { ticketsRoutes } from '@/features/tickets';
import { usersRoutes } from '@/features/users';
import { workspaceRoutes } from '@/features/workspace';
import type { FeatureRoute } from '@/shared/routing';

/**
 * Every feature's screens. PRE-FILLED for all 12 features — features add screens in their own
 * routes.ts, never here (guideline 02 §2).
 */
export const featureRoutes: readonly FeatureRoute[] = [
  ...authRoutes,
  ...myProfileRoutes,
  ...usersRoutes,
  ...workspaceRoutes,
  ...jiraIntegrationRoutes,
  ...ticketImportRoutes,
  ...ticketsRoutes,
  ...searchRoutes,
  ...reviewRoutes,
  ...feedbackRoutes,
  ...knowledgeDashboardRoutes,
  ...auditLogRoutes,
];
