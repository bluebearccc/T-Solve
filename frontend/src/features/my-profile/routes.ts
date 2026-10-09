import { ALL_SIGNED_IN_ROLES, paths, type FeatureRoute } from '@/shared/routing';

/** Screens of the "my-profile" feature (guideline 08 §2). */
export const myProfileRoutes: FeatureRoute[] = [
  {
    path: paths.profile,
    title: 'My Profile', // 1.2.1
    roles: ALL_SIGNED_IN_ROLES,
    lazy: () => import('./pages/MyProfilePage'),
  },
];
