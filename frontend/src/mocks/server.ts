import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/** Mock server for Vitest — started in src/test/setup.ts. Tests override handlers with server.use(). */
export const server = setupServer(...handlers);
