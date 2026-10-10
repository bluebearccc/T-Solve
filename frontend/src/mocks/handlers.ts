import type { HttpHandler } from 'msw';
import { handlers as auditLog } from '@/features/audit-log/mocks/handlers';
import { handlers as auth } from '@/features/auth/mocks/handlers';
import { handlers as feedback } from '@/features/feedback/mocks/handlers';
import { handlers as jiraIntegration } from '@/features/jira-integration/mocks/handlers';
import { handlers as knowledgeDashboard } from '@/features/knowledge-dashboard/mocks/handlers';
import { handlers as myProfile } from '@/features/my-profile/mocks/handlers';
import { handlers as review } from '@/features/review/mocks/handlers';
import { handlers as search } from '@/features/search/mocks/handlers';
import { handlers as ticketImport } from '@/features/ticket-import/mocks/handlers';
import { handlers as tickets } from '@/features/tickets/mocks/handlers';
import { handlers as users } from '@/features/users/mocks/handlers';
import { handlers as workspace } from '@/features/workspace/mocks/handlers';
import * as generated from '@/shared/api/generated/index.msw';
import { sessionHandlers } from './session';

/**
 * Every mock handler, in priority order (MSW uses the first match). Pre-filled once for all 12 features
 * (guideline 02): a feature adds handlers in its own mocks/handlers.ts, never here.
 * 1. session (/me, logout) — FE Lead
 * 2. hand-written feature handlers — realistic data and business errors
 * 3. orval's generated handlers (faker data) — every other endpoint in the spec, picked up automatically
 */
const generatedHandlers: HttpHandler[] = Object.values(generated).flatMap((tagHandlers) =>
  tagHandlers(),
);

export const handlers: HttpHandler[] = [
  ...sessionHandlers,
  ...auth,
  ...myProfile,
  ...users,
  ...workspace,
  ...jiraIntegration,
  ...ticketImport,
  ...tickets,
  ...search,
  ...review,
  ...feedback,
  ...knowledgeDashboard,
  ...auditLog,
  ...generatedHandlers,
];
