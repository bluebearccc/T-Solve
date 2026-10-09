import { paths, type FeatureRoute } from '@/shared/routing';

// Popups of this feature (no route): 7.2 Request Changes (popup), 7.3 Reject Ticket (popup).

/** Screens of the "review" feature (guideline 08 §2). */
export const reviewRoutes: FeatureRoute[] = [
  {
    path: paths.reviewQueue,
    title: 'Review Queue', // 7.1
    roles: ['PROJECT_MANAGER'],
    lazy: () => import('./pages/ReviewQueuePage'),
  },
  {
    path: paths.reviewHistory,
    title: 'Review History', // 7.4
    roles: ['PROJECT_MANAGER'],
    lazy: () => import('./pages/ReviewHistoryPage'),
  },
  {
    path: paths.expiredTickets,
    title: 'Expired Tickets', // 7.5
    roles: ['PROJECT_MANAGER'],
    lazy: () => import('./pages/ExpiredTicketsPage'),
  },
];
