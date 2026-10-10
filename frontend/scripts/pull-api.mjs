// npm run api:pull — downloads the backend's OpenAPI spec into openapi/tsolve-api.yaml (guideline 06 §2).
// The backend must be running. Default URL = springdoc on the local Spring Boot app; override with
// API_DOCS_URL, e.g. `API_DOCS_URL=http://localhost:9090/v3/api-docs.yaml npm run api:pull`.
import { writeFile } from 'node:fs/promises';

const url = process.env.API_DOCS_URL ?? 'http://localhost:8080/v3/api-docs.yaml';
const target = new URL('../openapi/tsolve-api.yaml', import.meta.url);

let response;
try {
  response = await fetch(url);
} catch {
  console.error(`Could not reach ${url}. Is the backend running?`);
  process.exit(1);
}
if (!response.ok) {
  console.error(`${url} answered ${response.status} ${response.statusText}.`);
  process.exit(1);
}
await writeFile(target, await response.text());
console.log(`Saved ${url} → openapi/tsolve-api.yaml. Next: npm run generate:api`);
