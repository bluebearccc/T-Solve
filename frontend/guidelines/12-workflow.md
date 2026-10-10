# 12 · Workflow & PR checklist

> **Applies to:** how you start, build and hand in frontend work.
> **Git rules** (branch names `<type>/<JIRA-KEY>-<module>-<desc>`, Conventional Commits with the Jira key,
> squash-merge, syncing with `main` daily, the PR template) are in the **DevOps design §1** — they are not
> repeated here. This file adds only what is specific to the frontend.

## 1. Starting a feature, step by step

Example: Jira issue `TS-57` "6.2 Ticket List" in feature `tickets`.

1. **Branch** from the latest `main`: `feature/TS-57-tickets-ticket-list`. Run `npm ci` if
   `package-lock.json` changed since you last installed.
2. **Read the three sources** for your screen:
   - SRS III section (here III.6.2): fields, columns, filters, buttons, MSG codes;
   - the Figma frame (`6.2 Ticket List - Hiếu` on page `01 Web App`);
   - the guidelines you need (always 01–03; then 05–09 depending on the screen).
3. **Check the API** in `openapi/tsolve-api.yaml`. If the endpoint is missing or wrong, agree it with the
   backend owner and add/fix it in the YAML (it can be a stub until the backend lands), then
   `npm run generate:api`. ([06](06-data-layer.md) §2)
4. **Route:** your screen is already in your feature's `routes.ts` (path, title, roles) with a placeholder
   page — check the roles against the Permission Matrix. The path
   already exists in `paths.ts`; list screens already have their menu entry (detail screens have none — they
   highlight their list). ([08](08-routing-and-access.md))
5. **Page skeleton:** replace the `ScreenPlaceholder` with a toolbar + the four states (loading / error / empty / data)
   wired to a feature hook. ([05](05-react-components.md) C9)
6. **Feature hooks** in `hooks/`: wrap the generated hooks; URL search params for filters; invalidation and
   MSG toasts for mutations. ([06](06-data-layer.md) §3–4)
7. **Components:** build the screen from kit components ([07](07-ui-and-styling.md)); forms and popups
   per [09](09-forms-and-validation.md).
8. **Mocks:** realistic data in `mocks/handlers.ts` (+ `resetMockData()`) — real-looking ticket IDs, titles,
   Projects, all relevant statuses, an empty case ([10](10-testing.md) §5). Run `VITE_API_MOCKING=true npm run dev` and click through every role
   that can open the screen (use the dev role switcher).
9. **Tests:** at least the page test (happy, empty, error) and one per mutation flow. ([10](10-testing.md))
10. **Checks:** `npm run lint && npm run typecheck && npm run test`, then compare the screen with the Figma
    frame at 1366 × 768.
11. **PR** using the template (DevOps §1.4), plus the frontend checklist below. Keep it under ~400 lines
    (generated code and lock file excluded); split bigger work into stacked PRs.

When you get stuck on something outside your feature (a kit component missing, a shared helper, a guard),
don't patch `shared/` or `app/` in your PR — ask the FE Lead ([02](02-conflict-avoidance.md)).

## 2. Frontend PR checklist (paste under "Checklist" in the PR template)

```markdown
### Frontend
- [ ] Only my feature folder changed (or the FE Lead approved changes to shared/app/config)
- [ ] Screen matches the Figma frame and the SRS field table (titles, labels, columns, buttons)
- [ ] Glossary words only; no Cluster / Defer / Bulk sync / Project filter
- [ ] Loading, error and empty states (with the right MSG code)
- [ ] All messages from the MSG catalog; confirm dialogs where the SRS requires them
- [ ] Route has the correct roles; actions hidden for users who may not do them
- [ ] Works with mocks for every role that can open the screen
- [ ] Page test + mutation tests added; lint, typecheck, test pass
- [ ] Spec changed → generate:api run and generated code committed
- [ ] Screenshot of the screen attached (1366 × 768)
```

**Reviewers** (CODEOWNERS): the feature owner, plus the FE Lead when `shared/`, `app/`, configs or the
spec changed. Review against this checklist and the guideline files, not personal taste.

## 3. Keeping your branch in sync

Follow DevOps §1.4 (`git fetch && git merge origin/main` at least daily). After syncing:

- `package-lock.json` changed → `npm ci`.
- `openapi/tsolve-api.yaml` changed → `npm run generate:api`, then `npm run typecheck` to see what broke.
- Conflict in `package-lock.json` or `generated/` → don't hand-merge; follow [02](02-conflict-avoidance.md) §4.

## 4. Working with an AI coding agent

- Give it `AGENTS.md` (Claude Code reads `CLAUDE.md`, which imports it), the guideline files for the task,
  the SRS section text and a screenshot of the Figma frame. Name the feature folder it may change.
- Ask for one screen per session; ask it to run `npm run lint && npm run typecheck && npm run test`.
- Review its output exactly like a teammate's PR, with the checklist above. Watch for: invented MSG texts
  or labels, edits to `shared/`/`app/`, hand-written API types, `useEffect` fetching, raw antd `Table`/`Modal`.
- You are the author of what you commit. Disclose AI help the way the team agreed (commit trailer /
  PR footer).

## 5. Definition of done (frontend)

The PR is merged, CI is green, the screen works on staging for every role that can open it, the Tester
has verified it (DevOps §1.4 step 8), and the Jira issue is moved to Done.

---
*Last verified against code: 2026-10-10, step 5.5 — every path, name, rule and ✅ example checked against the scaffold.*
