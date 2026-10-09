# 13 · Decision log (frontend)

> **Applies to:** every choice behind the other guidelines.
> **Format:** one entry per decision — the decision, the options considered, why. Decided by the FE Lead
> (Trần Trung Hiếu) on **2026-10-09** unless a date says otherwise. To change one, propose it, get the FE
> Lead's approval, then add a new entry that supersedes the old one (never rewrite history).
> Where an entry overrides the DevOps design, it says so; DevOps should update their file to match.

| ID | Topic | Status |
|---|---|---|
| FE-01 | Library versions | Approved |
| FE-02 | UI kit: antd 6, no ProComponents, component layer mirrors Figma | Approved — overrides DevOps "ProComponents adopted" |
| FE-03 | Routing: React Router 8, data mode | Approved |
| FE-04 | No client-state library | Approved |
| FE-05 | Forms: Ant Form + MSG rule builders | Approved |
| FE-06 | Styling: tokens + CSS Modules | Approved |
| FE-07 | API client: orval, spec and output committed | Approved |
| FE-08 | Error contract with MSG codes | Approved — needs backend agreement |
| FE-09 | Session: backend OIDC + cookie + `/me` | Approved — needs backend agreement |
| FE-10 | "Real-time" Review Queue = 5 s polling | Approved |
| FE-11 | Mocking: MSW | Approved |
| FE-12 | Testing scope and tools | Approved — closes DevOps open item #3 |
| FE-13 | One path alias `@/` | Approved |
| FE-14 | Import boundaries in ESLint | Approved |
| FE-15 | Node 24 LTS | Approved |
| FE-16 | Dates: dayjs, UTC+7 | Approved |
| FE-17 | Git hooks and CI stay with DevOps | Approved (option rejected: hooks in `frontend/`) |
| FE-18 | Guidelines location and format | Approved |
| FE-19 | Jira App is a separate app | Approved |
| FE-20 | Replace the old skeleton | Approved |
| FE-21 | Strict TypeScript | Approved — overrides DevOps "TypeScript (non-strict)" |
| FE-22 | Feature list and folder structure | Approved |
| FE-23 | Reference feature: Review Queue | Approved |
| FE-24 | Not adopted | Approved |
| FE-25 | ESLint 10, no accessibility lint plugin | Approved — supersedes the ESLint part of FE-01 |
| FE-26 | Import boundaries with import-x instead of eslint-plugin-boundaries | Approved — supersedes the tool in FE-14 |
| FE-27 | Prettier does not format Markdown | Approved |

---

**FE-01 — Library versions.** React 19.3 · Vite 8 · antd 6 · TanStack Query 5 · orval 8 · React Router 8 ·
Vitest 5 · MSW 3 · **TypeScript 6.0** · ESLint 9.39 *(ESLint superseded by FE-25)*.
*Options:* latest majors everywhere (TypeScript 7, ESLint 10). *Why:* on 2026-10-09 `typescript-eslint`
supports TypeScript < 6.1 and TypeScript 7.0 has no stable compiler API until 7.1; `eslint-plugin-jsx-a11y`
does not declare ESLint 10 support, so `npm ci` would fail on the peer dependency. Revisit when both are fixed.

**FE-02 — UI kit.** antd 6 without ProComponents. `src/shared/ui/` mirrors Figma kit v4 ("WEB COMPONENTS ·
Web/…") one-to-one; props mirror Figma variant properties; tokens from Figma STYLES in `theme.ts`; raw antd
`Tag/Table/Modal/Upload/message/notification` banned outside `shared/ui`. Figma placeholder colours
(`text/disabled`, `bg/disabled`, `bg/hover`, `bg/layout`, `bg/tooltip`) use antd defaults; font Inter
self-hosted (`@fontsource/inter`).
*Options:* antd 5 + ProComponents 2.x; antd 6 + ProComponents 3 beta. *Why:* ProComponents 2.x supports only
antd 5; antd 5's last release was Dec 2025 and ProComponents 2.x's Jul 2025; ProComponents 3 has been in beta
for 15 months — not acceptable in a graded project. ProTable/ProLayout also bring their own look, which
fights the Figma App Shell. *Overrides* DevOps design §0/§10 "ProComponents adopted".

**FE-03 — Routing.** React Router 8, data mode (`createBrowserRouter`); each feature exports `FeatureRoute[]`
with required `roles` and lazy pages; no route loaders for data.
*Options:* TanStack Router; React Router declarative mode. *Why:* widely known, data mode gives lazy routes
and `useBlocker` (MSG92); TanStack Router's type safety costs code generation and learning time.

**FE-04 — No client-state library.** Session via TanStack Query (`/me`), filters in URL search params,
local state otherwise. *Options:* Zustand, Redux Toolkit. *Why:* almost all state is server data or URL
state; a store would duplicate it. Revisit only for a concrete need.

**FE-05 — Forms.** Ant Form + shared rule builders that output SRS MSG texts; validate on blur; server
`fieldErrors` mapped by field name. *Options:* react-hook-form + zod. *Why:* antd inputs are built for Ant
Form; a second library adds adapters and a second set of rules.

**FE-06 — Styling.** antd theme tokens + CSS Modules using antd CSS variables; no global CSS, no `.ant-*`
overrides. *Options:* Tailwind, CSS-in-JS (antd-style), Sass. *Why:* zero extra dependency (built into Vite),
class names scoped automatically (no cross-feature clashes), one source of values (the tokens).

**FE-07 — API client.** orval → TanStack Query hooks + a fetch wrapper (`http.ts`), split by tag, with MSW
mocks. Spec committed at `openapi/tsolve-api.yaml`; generated code committed in `src/shared/api/generated/`
and excluded from SonarQube. *Options:* generate in CI only; hand-written client. *Why:* app runs right
after `npm ci` without a backend; API changes visible in PR diffs; no hand-written duplicate types.

**FE-08 — Error contract.** RFC 9457 Problem Details + `code` (MSGxx) + `params` + `fieldErrors[]`; the
frontend holds the MSG catalog (SRS V.2); unknown → MSG06. *Options:* backend sends final text; HTTP status
only. *Why:* the SRS fixes MSG texts by code; one catalog keeps them exact. **Needs backend agreement** (the
current backend returns `{status, message}`). Also assumed: server-side pagination `page`/`size`/`sort`, 20 rows.

**FE-09 — Session.** Backend runs OIDC (Google) and sets an HttpOnly session cookie; `GET /api/v1/me`
returns user, role, Projects (with role in each) and Departments; 401 → MSG07 → Login; sign-in errors
come back as `/login?error=MSGxx`. *Options:* tokens in the browser (localStorage). *Why:* no token handling
in JavaScript (XSS-safe); matches SRS API-05. **Needs backend agreement.**

**FE-10 — Review Queue "real time".** TanStack Query polling every 5 s while the tab is visible.
*Options:* WebSocket, Server-Sent Events. *Why:* meets the NFR (visible within 5 s) with no server work;
upgrade later only if needed.

**FE-11 — Mocking.** MSW 3: orval-generated fake-data handlers as a base, hand-written per-feature handlers
for realistic data; `VITE_API_MOCKING=true`; same handlers in tests; dev-only role switcher.
*Options:* json-server, hand-mocked hooks. *Why:* intercepts real `fetch`, so mock mode and tests exercise the
real data layer.

**FE-12 — Testing.** Vitest + React Testing Library + user-event + jsdom + MSW; kit components, shared
logic, one page test per feature, every mutation flow; no coverage gate, no E2E in the template.
*Options:* Jest; Playwright E2E. *Why:* Vitest reuses the Vite config; E2E upkeep is too high for a 14-week
part-time MVP. Closes DevOps design open item #3 (Vitest vs Jest).

**FE-13 — Path alias.** Only `@/` → `src/`. *Why:* one rule to remember; relative imports inside a feature.

**FE-14 — Import boundaries.** ESLint rule *(tool superseded by FE-26)*: `app → features → shared`; another feature only via
its `index.ts`; allowed cross-feature pairs: `tickets → review`, `tickets → feedback`. *Why:* keeps features
independent so five people can work in parallel; enforced by CI, not memory.

**FE-15 — Node.** Node 24 LTS in `.nvmrc`, CI and Docker; `engines` `^22.22.2 || >=24.15.0` (jsdom 30
minimum, which is stricter than React Router 8's 22.22; corrected during the scaffold).
*Why:* supported until 2028; covers the whole project.

**FE-16 — Dates.** dayjs (already an antd dependency) with one formatter: `dd/MM/yyyy HH:mm`,
Asia/Ho_Chi_Minh (SRS III, NFR 1.1). *Options:* date-fns, Intl only. *Why:* no extra dependency; antd pickers use it.

**FE-17 — Git hooks and CI.** No Husky, lint-staged, commitlint or `.github/` files in `frontend/`; DevOps
owns them. The frontend provides configs and npm scripts ([11](11-code-quality-and-tooling.md) §5).
*Rejected option:* Husky 9 in `frontend/.husky`. *Why:* the FE Lead assigned hooks and CI to DevOps.

**FE-18 — Guidelines.** `frontend/AGENTS.md` as entry, `frontend/CLAUDE.md` = `@AGENTS.md`, topic files in
`frontend/guidelines/NN-*.md`. *Why:* no `docs/` folder at the repo root (DevOps); `AGENTS.md` is read by most
AI coding tools, and the import avoids duplicate text.

**FE-19 — Jira App.** Not in `frontend/`; a separate Forge app (Atlassian Design System per NFR) that shares
only the OpenAPI spec. No npm workspaces in the MVP. *Why:* different design system, auth and build.

**FE-20 — Old skeleton.** The pre-SRS `frontend/` code (Solutions page, `DRAFT…ARCHIVED` statuses) is deleted
and replaced; `*.tsbuildinfo` is ignored. *Why:* it contradicts the glossary and SRS v2.

**FE-21 — Strict TypeScript.** `strict` plus `noUncheckedIndexedAccess`, `erasableSyntaxOnly`,
`verbatimModuleSyntax`; no `any`, no `!`, no `enum`. *Overrides* DevOps design open item #4 "TypeScript
(non-strict)". *Why:* the compiler catches the bugs juniors most often ship; TS 6 is strict by default anyway.

**FE-22 — Structure and features.** `src/app` (FE Lead), `src/features/<feature>` (owner), `src/shared`
(FE Lead); 12 features covering the 25 web screens; four registration files pre-filled once. All review
decisions live in `review`. *Why:* see [01](01-project-structure.md) and [02](02-conflict-avoidance.md).

**FE-23 — Reference feature.** Review Queue (7.1) + Reject Ticket popup (7.3), built end to end in the
template. *Options:* Ticket List (6.2). *Why:* covers polling, row selection, bulk mutation with confirm,
a form popup, MSG toasts and empty state — every pattern the team needs.

**FE-24 — Not adopted.** React Compiler, Storybook (a dev-only `/dev/kit` page instead), an i18n library
(UI is English-only), Nx/Turbo, Redux, optimistic updates. **Deferred:** chart library for the Knowledge
Dashboard (choose when that feature starts, checking antd 6 compatibility).

**FE-25 — ESLint 10, no accessibility lint (2026-10-09, during the scaffold).** ESLint 10.12 without any
a11y plugin. *Options:* stay on ESLint 9 (end-of-life: npm marks it unsupported); ESLint 10 +
`eslint-plugin-jsx-a11y-x` (maintained fork). *Why:* the only reason for ESLint 9 was
`eslint-plugin-jsx-a11y` (no release since Oct 2024, no ESLint 10 support); the FE Lead removed the
accessibility NFR from the SRS, so the plugin is not needed. Semantic HTML basics stay as good practice
([05](05-react-components.md) §3). Supersedes the ESLint part of FE-01.

**FE-26 — Import boundaries with import-x (2026-10-09).** `eslint-plugin-import-x` rule
`no-restricted-paths` with six zones (guideline 11 §2), plus `eslint-import-resolver-typescript`.
*Options:* `eslint-plugin-boundaries` 7.2 (pins `handlebars` 4.7.9 — critical advisory — and
`micromatch` → `braces` — high, no fixed version; an `overrides` entry could fix only the first);
`dependency-cruiser` (0 advisories, but a separate CLI: no editor feedback, own config language, extra CI step);
`eslint-plugin-project-structure` (same `braces` advisory); built-in `no-restricted-imports` (cannot see
relative paths that cross features). *Why:* import-x resolves real file paths, so `@/…` and `../../…` deep
imports are both caught; it supports ESLint 10, is actively maintained, and `npm audit` reports 0
vulnerabilities. Tested on the scaffold: every forbidden import fails, every allowed one passes — and it adds
two checks the old setup lacked (features → `app/`, non-test code → test helpers). Supersedes the tool named in FE-14.

**FE-27 — Prettier does not format Markdown (2026-10-09).** `*.md` is in `.prettierignore`. *Why:* Prettier
pads every Markdown table to equal column widths — each small doc edit becomes a whole-table diff, and the
padding adds tokens every time an AI agent loads the guidelines.

## Working conventions (not code decisions)

- Each change goes on its own short-lived branch; PR title and description follow the DevOps template.
- AI attribution: commits keep `Co-Authored-By`; PR descriptions keep "Generated with Claude Code";
  no session links.
