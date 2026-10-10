import { http } from 'msw';
import { setupWorker } from 'msw/browser';
import { problem } from '@/shared/api/mocks';
import { handlers } from './handlers';

/** Mock mode in the browser (VITE_API_MOCKING=true, dev only) — started by src/main.tsx. */
export const worker = setupWorker(
  ...handlers,
  // An API call with no mock at all: say so in the console and answer like an unknown server error.
  http.all('*/api/*', ({ request }) => {
    console.warn(`[mocks] No mock handler for ${request.method} ${request.url}`);
    return problem(501);
  }),
);
