/** Rows per page of every list (SRS III default; guideline 06 §4). */
export const PAGE_SIZE = 20;

/** A column sort as the API takes it: `sort=<field>,<order>` (Spring). */
export type TableSort = { field: string; order: 'asc' | 'desc' };

export function sortToParam(sort: TableSort): string {
  return `${sort.field},${sort.order}`;
}

/** "reviewDueDate,desc" → { field, order }; anything else → null. */
export function parseSort(value: string | null): TableSort | null {
  if (!value) return null;
  const [field, order] = value.split(',');
  if (!field || (order !== 'asc' && order !== 'desc')) return null;
  return { field, order };
}
