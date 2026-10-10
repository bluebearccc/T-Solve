import type { CurrentUser } from '@/shared/api';

/** Who is signed in: the generated `GET /api/v1/me` response (SRS 1.2.1 My Profile fields). */
export type Session = CurrentUser;
