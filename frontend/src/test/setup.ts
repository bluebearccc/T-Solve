// Runs before every test file (vite.config.ts → test.setupFiles).
import '@testing-library/jest-dom/vitest';
import { resetMockData } from '@/mocks/handlers';
import { server } from '@/mocks/server';

// jsdom lacks these browser APIs; antd uses them for responsive layout and measuring.
if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  });
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Every request is answered by the same MSW handlers as mock mode (guideline 10). A request with no handler
// fails the test, so a missing mock is found at once.
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => {
  server.resetHandlers();
  resetMockData();
});
afterAll(() => server.close());

beforeEach(() => {
  window.localStorage.clear();
});
