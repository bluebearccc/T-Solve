/** Typed access to the VITE_* variables (see .env.example). Read env only through this module. */
export const env = {
  apiMocking: import.meta.env.VITE_API_MOCKING === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  isDev: import.meta.env.DEV,
} as const;
