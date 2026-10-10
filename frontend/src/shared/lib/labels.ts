import type { TicketSource } from '@/shared/api';

/** UI text of each ticket source (glossary, guideline 03 §5). Status labels live in StatusTag. */
export const TICKET_SOURCE_LABELS: Record<TicketSource, string> = {
  SOLUTION_FORM: 'Solution Form',
  JIRA_IMPORT: 'Jira import',
  CSV: 'CSV',
  MANUAL: 'Manual',
};
