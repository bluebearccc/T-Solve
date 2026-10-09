import { lazy, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router';
import { usePageTitle } from './usePageTitle';

// Dev builds only. `import.meta.env.DEV` must be written literally here: Vite replaces it with `false` in
// production builds and drops the switcher's code entirely.
const DevRoleSwitcher = import.meta.env.DEV
  ? lazy(() => import('../dev/DevRoleSwitcher').then((m) => ({ default: m.DevRoleSwitcher })))
  : null;

export function RootLayout() {
  const title = usePageTitle();

  // Browser tab: "<screen name> · T-Solve" (syncs with the document, an external system — guideline 05 C7).
  useEffect(() => {
    document.title = title ? `${title} · T-Solve` : 'T-Solve';
  }, [title]);

  return (
    <>
      <Outlet />
      {DevRoleSwitcher && (
        <Suspense fallback={null}>
          <DevRoleSwitcher />
        </Suspense>
      )}
    </>
  );
}
