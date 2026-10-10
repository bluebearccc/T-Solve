import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { PAGE_SIZE, parseSort, sortToParam, type TableSort } from '@/shared/lib';

/**
 * Page, sort and filters of a list screen, kept in the URL (guideline 05 C8): the back button and shared
 * links work, and a reload shows the same list. `page` counts from 1 in the URL and the UI; `apiPaging`
 * converts to the API's paging (page from 0, size, sort — guideline 06 §4).
 * Changing a filter or the sort goes back to page 1.
 */
export function useListSearchParams(defaultSort: TableSort) {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Math.floor(Number(searchParams.get('page'))) || 1);
  const sort = parseSort(searchParams.get('sort')) ?? defaultSort;

  const update = useCallback(
    (changes: Record<string, string | null>) =>
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        for (const [name, value] of Object.entries(changes)) {
          if (value === null || value === '') next.delete(name);
          else next.set(name, value);
        }
        return next;
      }),
    [setSearchParams],
  );

  return {
    page,
    sort,
    setPage: (nextPage: number) => update({ page: nextPage > 1 ? String(nextPage) : null }),
    /** null = back to the screen's default sort. */
    setSort: (nextSort: TableSort | null) =>
      update({ sort: nextSort ? sortToParam(nextSort) : null, page: null }),
    getFilter: (name: string) => searchParams.get(name),
    setFilter: (name: string, value: string | null) => update({ [name]: value, page: null }),
    apiPaging: { page: page - 1, size: PAGE_SIZE, sort: [sortToParam(sort)] },
  };
}
