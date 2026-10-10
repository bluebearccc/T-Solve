import type { FormRule } from 'antd';
import { msg } from '@/shared/messages';

/**
 * Validation rule builders (guideline 09 §2). Every message is an SRS MSG text; `label` is the field's
 * visible label, which the message names.
 */
export const rules = {
  /** MSG01 "The {field_name} field is required." — whitespace-only input counts as empty. */
  required: (label: string): FormRule => ({
    required: true,
    whitespace: true,
    message: msg('MSG01', { field_name: label }),
  }),
  /** MSG02 "{field_name} must not exceed {max_length} characters." Pair with `count={{ show: true, max }}` on the input. */
  maxLength: (label: string, max: number): FormRule => ({
    max,
    message: msg('MSG02', { field_name: label, max_length: max }),
  }),
  /** MSG03 "Please enter a valid email address." */
  email: (): FormRule => ({ type: 'email', message: msg('MSG03') }),
  /** MSG44 — a whole number of days, `min` or more (Review range). */
  wholeNumberMin: (min: number): FormRule => ({
    validator: (_rule, value: unknown) =>
      value === undefined ||
      value === null ||
      value === '' ||
      (Number.isInteger(Number(value)) && Number(value) >= min)
        ? Promise.resolve()
        : Promise.reject(new Error(msg('MSG44'))),
  }),
};
