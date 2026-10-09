# 11 · Code quality & tooling

> **Applies to:** `eslint.config.js`, `.prettierrc`, `.prettierignore`, `tsconfig*.json`, `vite.config.ts`,
> `orval.config.ts`, `package.json` scripts, `Dockerfile`, `Caddyfile`.
> **Why it matters:** rules that live in tools don't depend on anyone's memory. The same commands run on
> your machine, in the git hooks and in CI, so "it passed for me" means it passes everywhere.
> **Ownership:** these files belong to the FE Lead. Git hooks (Husky, lint-staged, commitlint), CI
> workflows, CODEOWNERS and Dependabot belong to **DevOps** (decision log) — §5 tells DevOps what to call.

## 1. The quality gates

| Check | Command | Blocks merge (in CI) |
|---|---|---|
| Formatting | `npm run format:check` | yes |
| Lint (incl. import boundaries) | `npm run lint` | yes (errors) |
| Types | `npm run typecheck` | yes |
| Tests | `npm run test` | yes |
| Build | `npm run build` | yes |
| Generated API up to date | `npm run generate:api` + no git diff | yes |
| SonarQube Cloud | (CI, DevOps) | no — advisory |

Run the first four before every push: `npm run lint && npm run typecheck && npm run test`.

## 2. ESLint (flat config, ESLint 9)

Plugins: `typescript-eslint` (type-aware), `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`,
`eslint-plugin-jsx-a11y`, `eslint-plugin-boundaries`, `@tanstack/eslint-plugin-query`, and
`eslint-config-prettier` last (turns off rules Prettier handles).

| Rule | Level | Why |
|---|---|---|
| `boundaries/element-types` | error | Enforces `app → features → shared`; `shared` never imports `features`/`app` ([01](01-project-structure.md)). |
| `boundaries/entry-point` | error | Another feature only through its `index.ts`. |
| `no-restricted-imports` (antd `Tag`, `Table`, `Modal`, `Upload`, `message`, `notification` outside `shared/ui`) | error | Use the kit component ([07](07-ui-and-styling.md) U1). The error message names it. |
| `no-restricted-imports` (`@/shared/api/generated/*`, `react-router-dom`, `axios`) | error | Import from `@/shared/api`; v8 has no `react-router-dom`; one HTTP client. |
| `@typescript-eslint/no-explicit-any`, `ban-ts-comment`, `no-non-null-assertion` | error | [04](04-typescript.md) R1–R3. |
| `@typescript-eslint/consistent-type-imports` | error | `import type` for types (auto-fixable). |
| `@typescript-eslint/no-floating-promises`, `no-misused-promises` | error | A forgotten `await`/`.catch` hides errors. |
| `react-hooks/rules-of-hooks` · `react-hooks/exhaustive-deps` | error · warn | Hooks called correctly; effect dependencies complete. |
| `@tanstack/query/exhaustive-deps` | error | Query keys include every variable the query uses. |
| `jsx-a11y` recommended | error | Real buttons, labels, alt text ([05](05-react-components.md) §3). |
| `react-refresh/only-export-components` | warn | Keeps hot reload working. |
| `no-console` (allows `warn`, `error`) | warn | No debug logs left behind; never log ticket content or personal data (DevOps §8). |
| `eqeqeq` | error | `===` only. |

**Warnings vs errors.** The DevOps design starts rules as warnings in sprint 1. We apply that to style-ish
rules only; **architecture and safety rules are errors from day one** because the template starts clean
and they are what keep five people from colliding. `npm run lint` fails on errors, not warnings.

Disabling a rule: only on one line, with a reason, and mention it in the PR:
`// eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount by design`.
Never disable a rule for a whole file; never edit `eslint.config.js` in a feature PR.

## 3. Prettier

`.prettierrc`: `singleQuote: true`, `semi: true`, `trailingComma: "all"`, `printWidth: 100`.
`.prettierignore`: `dist/`, `src/shared/api/generated/`, `public/mockServiceWorker.js`,
`openapi/` (the spec stays as the backend emits it).

Install the **ESLint** and **Prettier** extensions in VS Code and turn on *Format On Save*.
(Line endings are LF — the repo's `.gitattributes` enforces it, which matters on Windows.)

## 4. npm scripts

| Script | Runs |
|---|---|
| `dev` | `vite` |
| `build` | `tsc -b && vite build` |
| `preview` | `vite preview` |
| `lint` / `lint:fix` | `eslint .` / `eslint . --fix` |
| `format` / `format:check` | `prettier --write .` / `prettier --check .` |
| `typecheck` | `tsc -b --noEmit` |
| `test` / `test:watch` | `vitest run` / `vitest` |
| `generate:api` | `orval` (reads `orval.config.ts`) |
| `api:pull` | download `http://localhost:8080/v3/api-docs.yaml` into `openapi/tsolve-api.yaml` |

`npm ci` (not `npm install`) everywhere except when you deliberately add a dependency. Node version comes
from `.nvmrc` (24); `engines` in `package.json` allows ≥ 22.22.

## 5. For DevOps: what hooks and CI should call

All commands run **inside `frontend/`**.

**pre-commit (on staged files under `frontend/`):**
`prettier --write` on `*.{ts,tsx,css,json,md}` and `eslint --fix` on `*.{ts,tsx}`. Exclude
`src/shared/api/generated/**`.

**CI job (path filter `frontend/**`), in order:**

```bash
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run generate:api && git diff --exit-code -- src/shared/api/generated   # spec and generated code in sync
npm run build
```

Use Node from `frontend/.nvmrc` and cache `~/.npm` keyed on `frontend/package-lock.json`.

**SonarQube Cloud** (`sonar-project.properties`, DevOps):
`sonar.exclusions=frontend/src/shared/api/generated/**,frontend/public/mockServiceWorker.js,frontend/dist/**`
· `sonar.tests=frontend/src` with `sonar.test.inclusions=**/*.test.ts,**/*.test.tsx`.
*Why:* generated code is thousands of lines that would eat the free plan's 50k-LOC limit and report
"duplication" nobody can fix.

**Dependabot:** weekly for `/frontend` (npm); group minor/patch updates into one PR; majors one by one —
the FE Lead checks them against [13](13-decision-log.md) (e.g. TypeScript 7, ESLint 10 are held back on purpose).

## 6. Build and Docker

`Dockerfile` (multi-stage): stage 1 `node:24-alpine` runs `npm ci && npm run build`; stage 2 `caddy:2-alpine`
copies `dist/` and `Caddyfile`, which serves the static files with **SPA fallback** (unknown paths →
`index.html`, so `/review-queue` works on reload) and long cache headers for hashed assets. The `/api`
reverse proxy is configured by DevOps in the environment's main Caddy, not in this image.
`VITE_*` variables are build-time: set them as build args; never put secrets in them (they end up in
the browser).

## 7. Checklist

- [ ] `npm run lint && npm run typecheck && npm run test` pass; no new warnings you could fix.
- [ ] No `eslint-disable` without a reason; no config files changed in a feature PR.
- [ ] Spec changed → `generate:api` run and committed.

---
*Last verified against code: not yet — exact rule options, scripts and Docker files are created in Step 5.*
