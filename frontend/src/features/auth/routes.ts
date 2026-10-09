import { paths, type FeatureRoute } from '@/shared/routing';

/** Screens of the "auth" feature (guideline 08 §2). */
export const authRoutes: FeatureRoute[] = [
  {
    path: paths.login,
    title: 'Login', // 1.1.1
    roles: 'GUEST',
    lazy: () => import('./pages/LoginPage'),
  },
];
