import { Form, type FormItemProps, type FormProps } from 'antd';
import type { ReactNode } from 'react';

type AppFormProps<T> = Omit<FormProps<T>, 'children'> & { children?: ReactNode };

/**
 * antd Form with the app's defaults (guideline 09 §1): labels above fields, rules checked when the user
 * leaves a field, scroll to the first error on submit, `*` on required fields.
 */
export function AppForm<T>(props: AppFormProps<T>) {
  return (
    <Form layout="vertical" validateTrigger="onBlur" scrollToFirstError requiredMark {...props} />
  );
}

/**
 * Figma "Web/Form Field": label (+ `*` when a rule is required) above the input, the error under it.
 * `name` is the API property name, so server field errors land on the right field.
 */
export function FormField<T>(props: FormItemProps<T>) {
  return <Form.Item<T> validateFirst {...props} />;
}
