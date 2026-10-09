import { paths, type FeatureRoute } from '@/shared/routing';

/** Screens of the "search" feature (guideline 08 §2). */
export const searchRoutes: FeatureRoute[] = [
  {
    path: paths.search,
    title: 'Search', // 6.1
    roles: ['STAFF', 'PROJECT_MANAGER', 'DEPARTMENT_MANAGER'],
    lazy: () => import('./pages/SearchPage'),
  },
];
