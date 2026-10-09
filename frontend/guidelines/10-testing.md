# 10 · Testing

> **Applies to:** every `*.test.ts(x)` file, `src/test/`, `src/mocks/` and `features/*/mocks/`.
> **Why it matters:** a few good tests catch the bugs that hurt in a demo (wrong state after Approve, a
> missing empty state, a broken guard) without slowing a part-time team down. There is **no coverage
> gate** (DevOps decision) — write tests where they pay off, not to hit a number.

## 1. Tools

| Tool | Job |
|---|---|
| **Vitest 5** | test runner; shares `vite.config.ts` (aliases, plugins), so tests resolve imports exactly like the app |
| **React Testing Library** + **user-event** | render components and act like a user (click, type, Tab) |
| **jsdom** | browser-like DOM in Node |
| **MSW 3** | intercepts `fetch` and answers with the same handlers used in mock mode — tests go through the real `http.ts`, generated hooks and TanStack Query |
| `src/test/render.tsx` | `renderWithProviders(ui, { role, route })` — wraps in theme, a fresh QueryClient (no retries), router, and a signed-in session of the given role |

Not adopted (on purpose): E2E (Playwright/Cypress), snapshot tests, coverage thresholds, component
screenshots. *Why:* high upkeep for a 14-week MVP; the Tester's system and acceptance tests (Report 5)
cover end-to-end flows on staging.

## 2. What to test

| Write tests for | Typically |
|---|---|
| **Kit components** (`shared/ui`) | each variant renders the right text/role; StatusTag label per status; DataTable empty/loading/error; upload limits → MSG40/MSG62 |
| **Logic** in `shared/` (`date.ts`, `rules`, `msg()` templating, `applyApiErrors`, landing page per role) | plain unit tests, many cases, fast |
| **One page test per feature** (minimum) | happy path + empty state + error state, through MSW |
| **Every mutation flow you build** | confirm → request sent with the right body → MSG toast → list refreshed |
| **Guards** | wrong role → 403 with MSG08; no session → `/login` |

Don't test: antd itself, generated code, TanStack Query caching, CSS, or implementation details (state
variable names, how many times a hook rendered).

## 3. Rules

### T1 — Test behaviour through what the user sees.
Query by role and accessible name, then by label text, then by text. `data-testid` only as a last resort.

```tsx
// ✅ Do
await user.click(screen.getByRole('button', { name: 'Reject' }));
expect(await screen.findByText('2 ticket(s) rejected.')).toBeInTheDocument();

// ❌ Don't
fireEvent.click(container.querySelector('.ant-btn-dangerous')!);
expect(component.state.isRejectOpen).toBe(true);
```

*Why:* tests that read like the SRS steps survive refactors and also check accessibility (a button with
no accessible name cannot be found by role).

### T2 — Mock the network, not your modules.
Use MSW handlers (`server.use(...)` to override per test). Don't `vi.mock` the API hooks or `fetch`.
*Why:* mocking hooks skips the code most likely to be wrong — params, keys, invalidation, error mapping.

```ts
// ✅ Do — override one endpoint for this test
server.use(http.get('*/api/v1/review-queue', () => HttpResponse.json({ items: [], total: 0 })));

// ❌ Don't
vi.mock('@/shared/api', () => ({ useGetReviewQueue: () => ({ data: [] }) }));
```

### T3 — Use the SRS texts in assertions, through the catalog.
`expect(await screen.findByText(msg('MSG16'))).toBeInTheDocument()` — the test breaks if someone types
the text by hand differently.

### T4 — Every test is independent.
A fresh QueryClient per render (done by `renderWithProviders`), MSW handlers reset after each test
(done in `src/test/setup.ts`), no shared mutable fixtures. Vitest 5 clears mocks between tests by default.

### T5 — Wait for the UI, never for time.
Use `findBy…` / `waitFor`; never `setTimeout` or arbitrary sleeps. For the 5-second polling, test the
hook option (`refetchInterval`), not real waiting.

### T6 — File and name conventions.
Test file sits next to its subject: `ReviewQueuePage.test.tsx`. `describe` = the unit
(`'ReviewQueuePage'`); `it` = the behaviour in plain English (`'shows MSG16 when no tickets are waiting'`).
`vi.mock`/`vi.hoisted`, if ever needed, go at the top level of the file (Vitest 5 requirement).

## 4. Example — a page test

```tsx
// features/review/ReviewQueuePage.test.tsx
import { http, HttpResponse } from 'msw';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/mocks/server';
import { renderWithProviders } from '@/test/render';
import { msg } from '@/shared/messages';
import ReviewQueuePage from './pages/ReviewQueuePage';

describe('ReviewQueuePage', () => {
  it('lists pending tickets of my Projects', async () => {
    renderWithProviders(<ReviewQueuePage />, { role: 'PROJECT_MANAGER' });
    expect(await screen.findByRole('row', { name: /TS-101/ })).toBeInTheDocument();
  });

  it('shows MSG16 when no tickets are waiting', async () => {
    server.use(http.get('*/api/v1/review-queue', () => HttpResponse.json({ items: [], total: 0 })));
    renderWithProviders(<ReviewQueuePage />, { role: 'PROJECT_MANAGER' });
    expect(await screen.findByText(msg('MSG16'))).toBeInTheDocument();
  });

  it('asks MSG90 before approving two tickets, then shows MSG18', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewQueuePage />, { role: 'PROJECT_MANAGER' });
    await user.click(await screen.findByRole('checkbox', { name: /TS-101/ }));
    await user.click(screen.getByRole('checkbox', { name: /TS-102/ }));
    await user.click(screen.getByRole('button', { name: 'Approve' }));
    await user.click(await screen.findByRole('button', { name: 'OK' }));  // MSG90 dialog
    expect(await screen.findByText(msg('MSG18', { count: 2 }))).toBeInTheDocument();
  });
});
```

*(Endpoint path and ticket keys come from the OpenAPI stub; this example becomes the real test in Step 5.)*

## 5. Running tests

| Command | When |
|---|---|
| `npm run test` | once, all tests (CI runs this) |
| `npm run test:watch` | while developing |
| `npx vitest run src/features/review` | only one feature |

## 6. Checklist

- [ ] At least one page test for the feature (happy + empty + error).
- [ ] Each mutation flow you added has a test (confirm → toast → refreshed list).
- [ ] Queries by role/label/text; MSG texts via `msg()`; no `vi.mock` of API hooks.
- [ ] `npm run test` passes locally.

---
*Last verified against code: not yet — helper names, MSW option names and the example will be checked in Step 5.*
