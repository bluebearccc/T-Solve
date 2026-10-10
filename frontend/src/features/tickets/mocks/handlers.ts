import type { HttpHandler } from 'msw';

/**
 * MSW mock handlers of the "tickets" feature (guideline 10). Hand-written handlers with realistic data go here;
 * endpoints without one fall back to orval's generated fake-data handlers (src/mocks/handlers.ts).
 */
export const handlers: HttpHandler[] = [];
