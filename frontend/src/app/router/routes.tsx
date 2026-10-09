import type { RouteObject } from 'react-router';
import type { FeatureRoute } from '@/shared/routing';
import { AppShell } from '../layout/AppShell';
import { NotFoundPage } from '../pages/NotFoundPage';
import { RouteErrorPage } from '../pages/RouteErrorPage';
import { featureRoutes } from './feature-routes';
import { GuestOnly, LandingRedirect, RequireAuth, RequireRole } from './guards';
import { RootLayout } from './RootLayout';

function toPageRoute(route: FeatureRoute): RouteObject {
  return {
    index: true,
    lazy: async () => {
      const { default: Component } = await route.lazy();
      return { Component };
    },
  };
}

/**
 * Route tree (guideline 08): guest screens · signed-in screens inside the AppShell, each behind its
 * role guard · "/" → landing page · unknown paths → 404. Built from `featureRoutes`.
 */
export function buildRoutes(routes: readonly FeatureRoute[] = featureRoutes): RouteObject[] {
  const guest = routes.flatMap((route) => (route.roles === 'GUEST' ? [route] : []));
  const signedIn = routes.flatMap((route) =>
    route.roles === 'GUEST' ? [] : [{ ...route, roles: route.roles }],
  );

  return [
    {
      element: <RootLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          element: <GuestOnly />,
          children: guest.map((route) => ({
            path: route.path,
            handle: { title: route.title },
            children: [toPageRoute(route)],
          })),
        },
        {
          element: <RequireAuth />,
          children: [
            {
              element: <AppShell />,
              children: [
                { index: true, element: <LandingRedirect /> },
                ...signedIn.map((route) => ({
                  path: route.path,
                  handle: { title: route.title },
                  element: <RequireRole roles={route.roles} />,
                  children: [toPageRoute(route)],
                })),
                { path: '*', handle: { title: 'Page not found' }, element: <NotFoundPage /> },
              ],
            },
          ],
        },
      ],
    },
  ];
}
