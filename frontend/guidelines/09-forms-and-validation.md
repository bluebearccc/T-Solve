# 09 · Forms & validation

> **Applies to:** every form, form popup and confirm dialog (`features/*/components/*Modal.tsx`, form pages,
> `src/shared/forms/`, `src/shared/ui/FormField`, `FormModal`, `ConfirmDialog`, uploads).
> **Why it matters:** the NFR asks for required fields marked `*`, checks when leaving a field, errors next
> to the field, no lost input on failure, and a confirm before hard-to-undo actions. One pattern makes all
> 25 screens behave that way.

## 1. The pattern

```
AppForm (antd Form: vertical layout, validate on blur, scroll to first error)
 └─ FormField (label + * + error under the field)  ← rules from shared/forms (MSG texts)
 └─ submit button → mutation.mutate(values) → success: showMessage + close/reset
                                            → error:   applyApiErrors(form, error)
```

- **Ant Form only.** No react-hook-form, Formik or zod. *Why:* antd inputs are built for `Form`; a second
  form library means two sets of rules and adapters for every input.
- `AppForm` (kit) is antd `Form` with our defaults: `layout="vertical"`, `validateTrigger="onBlur"`,
  `scrollToFirstError`, `requiredMark`. Use it instead of `Form` directly.
- Field `name`s are **the API property names** (`reason`, `jiraProjectKey`). *Why:* server `fieldErrors`
  then map onto fields with no translation table, and `onFinish` values go straight into the request.
- Type the form: `const [form] = Form.useForm<RejectTicketsRequest>()` using the **generated** request type.

## 2. Validation rules (`@/shared/forms`)

Rule builders return antd rules whose messages are the SRS MSG texts. The field name in the message is
the field's label.

| Builder | Message | Use for |
|---|---|---|
| `rules.required('Reason')` | MSG01 "The Reason field is required." (ignores whitespace-only input) | every `*` field |
| `rules.maxLength('Reason', 1000)` | MSG02 "Reason must not exceed 1000 characters." | every text field with a limit |
| `rules.email()` | MSG03 | Email |
| `rules.wholeNumberMin(1)` | MSG44 | Review range |
| `rules.dateRangeNotFuture()` | MSG94 | Resolved from / Resolved to |

```tsx
// ✅ Do
<FormField name="reason" label="Reason" rules={[rules.required('Reason'), rules.maxLength('Reason', 1000)]}>
  <Input.TextArea rows={4} showCount />
</FormField>

// ❌ Don't — invented text, native maxLength
<Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Please enter a reason!' }]}>
  <Input.TextArea maxLength={1000} />
</Form.Item>
```

- **Limits come from the SRS field tables** (Reason/Comment 1,000 · Solution/Description 10,000 · Title
  200 · Ticket ID 50 · Department name 50 · Company name 100 · Email 100 · Search 100 or 200 · Feedback
  comment 500 · Project key 20 · Jira site 200).
- **Don't use the input's native `maxLength`.** It silently cuts pasted text, so the user never sees MSG02.
  Use `showCount` + `rules.maxLength`.
- Server-only checks (duplicate name MSG43, duplicate email MSG41, Jira project already linked MSG47,
  existing ticket ID MSG66) come back as `fieldErrors` — don't try to pre-check them in the browser.

## 3. Submitting

```tsx
const reject = useRejectSelectedTickets();

function handleFinish(values: RejectTicketsRequest) {
  reject.mutate(
    { data: { ...values, ticketIds } },
    {
      onSuccess: () => { form.resetFields(); onClose(); },   // MSG20 is shown by the hook
      onError: (error) => applyApiErrors(form, error),        // field errors under fields
    },
  );
}
```

- The submit button shows `loading` and is disabled while `isPending` — no double submits.
- **On failure, keep everything the user typed** (NFR "data never lost when validation fails"). Reset only
  after success or when the user cancels.
- `applyApiErrors(form, error)` puts each `fieldErrors[]` item under its field (`form.setFields`) and
  returns `true`; if there are none it returns `false` and the feature shows the message with
  `showMessage(error.code, error.params)`. Because the form handles its own errors, its feature hook sets
  `meta: { handlesOwnErrors: true }` on the mutation, which turns the global error toast off
  ([06](06-data-layer.md) §6).

## 4. Popups with forms (`FormModal`)

- `FormModal` (kit, Figma "Web/Modal Header Kind=Form" + Footer) = antd `Modal` + `AppForm`, with
  `destroyOnHidden` so a reopened popup starts clean, OK button wired to `form.submit()`, and the title from
  the SRS ("Reject Ticket", "Request Changes", "Give Feedback").
- Cancel closes without asking — except where the SRS requires a confirm (below).

## 5. Confirm dialogs (`ConfirmDialog`)

Hard-to-undo actions ask first (NFR Usability "Phản hồi rõ ràng"). The dialog text is the MSG code; the
danger variant (Figma "Danger confirm") is used when the action is destructive or final.

| Action | MSG | Danger |
|---|---|---|
| Approve 2+ tickets | MSG90 | no |
| Reject ticket(s) (popup with reason) | MSG19 | yes |
| Unpublish · Re-publish | MSG29 · MSG63 | yes · no |
| Fill solution over existing ones (Import Preview) | MSG91 | no |
| Leave Import Preview | MSG92 | yes |
| Delete Department · Restore Department | MSG67 · MSG83 | yes · no |
| Remove Project · Remove member | MSG85 · MSG87 | yes · yes |
| Session expired | MSG07 | no (info) |

Single-ticket Approve, Request changes and Send back to queue have no extra confirm (SRS UC-38, UC-40, UC-35).

## 6. Other inputs

- **Dates:** antd `DatePicker` / `RangePicker` with `format="DD/MM/YYYY"` (dayjs), `disabledDate` for future
  dates where the SRS forbids them. Send ISO strings to the API.
- **Selects:** options from the API (Departments, Project Managers, Projects of the user); never
  hard-code business lists except the fixed enums (roles, statuses, sources).
- **Search boxes:** antd `Input.Search`; the value goes to the URL (`?q=`) on Enter, not on every keystroke.
- **Uploads:** `EvidenceUpload` (≤ 5 files, ≤ 10 MB each, PNG/JPG/PDF/DOCX/XLSX/TXT/LOG → MSG40, MSG62)
  and `CsvUpload` (.csv, ≤ 10 MB → MSG33, MSG34). Files are checked when added and sent with the form —
  no automatic upload. Existing Evidence is read-only (never removable).

## 7. Labels and focus

Every field has a visible label (no placeholder-only fields); errors are linked to the field (antd does
this); the first invalid field gets focus on submit (`scrollToFirstError`).

## 8. Checklist

- [ ] `AppForm` + `FormField`; field names = API property names; form typed with the generated request type.
- [ ] Every `*` field has `rules.required`; every limited field has `rules.maxLength` + `showCount`.
- [ ] No message text typed by hand; no native `maxLength`.
- [ ] Submit button loading/disabled while pending; input kept on failure; server field errors mapped.
- [ ] Confirm dialogs exactly where the table above says.

---
*Last verified against code: not yet — `AppForm`, `rules`, `applyApiErrors` and the mutation call shape will be checked in Step 5.*
