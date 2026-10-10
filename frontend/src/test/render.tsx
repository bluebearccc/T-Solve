import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { createAppQueryClient } from '@/app/providers/global-errors';
import { buildRoutes } from '@/app/router/routes';
import { setDevRole, type Role } from '@/shared/auth';

type RenderOptions = {
  /** Who the `/me` mock says is signed in; null = signed out. Default: Project Manager. */
  role?: Role | null;
};

/** The app's real QueryClient (global error handling included) without retries, fresh per test. */
export function createTestQueryClient() {
  const client = createAppQueryClient();
  client.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } });
  return client;
}

/** Renders the whole app at `path` — real routes, guards, AppShell and MSW mocks (guideline 10). */
export function renderApp(path: string, { role = 'PROJECT_MANAGER' }: RenderOptions = {}) {
  setDevRole(role);
  const router = createMemoryRouter(buildRoutes(), { initialEntries: [path] });
  const queryClient = createTestQueryClient();
  const result = render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router, queryClient };
}

/** Renders one component with the app providers (theme, antd, query cache, MSW mocks). */
export function renderWithProviders(
  ui: ReactElement,
  { role = 'PROJECT_MANAGER' }: RenderOptions = {},
) {
  setDevRole(role);
  const queryClient = createTestQueryClient();
  return { ...render(<AppProviders queryClient={queryClient}>{ui}</AppProviders>), queryClient };
}
