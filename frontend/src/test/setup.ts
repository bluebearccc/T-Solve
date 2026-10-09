// Runs before every test file (vite.config.ts → test.setupFiles).
import '@testing-library/jest-dom/vitest';

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

beforeEach(() => {
  window.localStorage.clear();
});
