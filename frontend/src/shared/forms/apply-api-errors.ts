import type { FormInstance } from 'antd';
import type { ApiError } from '@/shared/api';
import { msg } from '@/shared/messages';

/**
 * Puts each server field error (`fieldErrors[]`, guideline 06 §6) under its field. Returns false when the
 * error has no field errors — then show it yourself: `showMessage(error.code, error.params)`.
 * Field names are API property names, so they match the form's `name`s directly (guideline 09 §1).
 */
export function applyApiErrors<T>(form: FormInstance<T>, error: ApiError): boolean {
  if (error.fieldErrors.length === 0) return false;
  form.setFields(
    error.fieldErrors.map((fieldError) => ({
      name: fieldError.field as Parameters<FormInstance<T>['getFieldError']>[0],
      errors: [msg(fieldError.code, fieldError.params)],
    })),
  );
  return true;
}
