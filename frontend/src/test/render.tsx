import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createMemoryRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { AppProviders } from '@/app/providers/AppProviders';
import { buildRoutes } from '@/app/router/routes';
import { createQueryClient } from '@/shared/api';
import { setDevRole, type Role } from '@/shared/auth';

type RenderOptions = {
  /** Who is signed in; null = signed out. Default: Project Manager. */
  role?: Role | null;
};

function freshQueryClient() {
  const client = createQueryClient();
  client.setDefaultOptions({ queries: { retry: false }, mutations: { retry: false } });
  return client;
}

/** Renders the whole app at `path` — real routes, guards and AppShell (guideline 10). */
export function renderApp(path: string, { role = 'PROJECT_MANAGER' }: RenderOptions = {}) {
  setDevRole(role);
  const router = createMemoryRouter(buildRoutes(), { initialEntries: [path] });
  const result = render(
    <AppProviders queryClient={freshQueryClient()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router };
}

/** Renders one component with the app providers (theme, antd, query cache). */
export function renderWithProviders(
  ui: ReactElement,
  { role = 'PROJECT_MANAGER' }: RenderOptions = {},
) {
  setDevRole(role);
  return render(<AppProviders queryClient={freshQueryClient()}>{ui}</AppProviders>);
}
