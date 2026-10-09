import { paths, type FeatureRoute } from '@/shared/routing';

// Popups of this feature (no route): 5.3 Import Ticket Preview (popup).

/** Screens of the "ticket-import" feature (guideline 08 §2). */
export const ticketImportRoutes: FeatureRoute[] = [
  {
    path: paths.importTickets,
    title: 'Import Tickets', // 5.1
    roles: ['PROJECT_MANAGER'],
    lazy: () => import('./pages/ImportTicketsPage'),
  },
  {
    path: paths.importPreview,
    title: 'Import Preview', // 5.2
    roles: ['PROJECT_MANAGER'],
    lazy: () => import('./pages/ImportPreviewPage'),
  },
  {
    path: paths.importHistory,
    title: 'Import History', // 5.4
    roles: ['PROJECT_MANAGER'],
    lazy: () => import('./pages/ImportHistoryPage'),
  },
];
