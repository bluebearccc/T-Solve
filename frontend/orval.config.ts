import { defineConfig } from 'orval';

/**
 * API client generation (guideline 06 §2). Run `npm run generate:api` after changing openapi/tsolve-api.yaml.
 * Output (committed, never edited): src/shared/api/generated/
 *   model/          API types and enum constants
 *   <tag>/<tag>.ts  request functions, TanStack Query hooks, query-key functions
 *   <tag>/<tag>.msw.ts  MSW handlers with faker data (mock mode and tests only)
 */
export default defineConfig({
  tsolve: {
    input: { target: './openapi/tsolve-api.yaml' },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated',
      schemas: './src/shared/api/generated/model',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      indexFiles: true,
      formatter: 'prettier',
      mock: { indexMockFiles: true, generators: [{ type: 'msw' }] },
      override: {
        // Every request goes through our fetch wrapper (base URL, cookie, ApiError).
        mutator: { path: './src/shared/api/http.ts', name: 'http' },
        // Hooks return the response body, not { data, status, headers }.
        fetch: { includeHttpResponseReturnType: false },
      },
    },
  },
});
