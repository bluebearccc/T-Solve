import { paths, type FeatureRoute } from '@/shared/routing';

/** Screens of the "tickets" feature (guideline 08 §2). */
export const ticketsRoutes: FeatureRoute[] = [
  {
    path: paths.ticketList,
    title: 'Ticket List', // 6.2
    roles: ['STAFF', 'PROJECT_MANAGER', 'DEPARTMENT_MANAGER'],
    lazy: () => import('./pages/TicketListPage'),
  },
  {
    path: paths.ticketDetail(),
    title: 'Ticket Detail', // 5.5
    roles: ['STAFF', 'PROJECT_MANAGER', 'DEPARTMENT_MANAGER'],
    lazy: () => import('./pages/TicketDetailPage'),
  },
];
