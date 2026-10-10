import { Table, type TableColumnType, type TableProps } from 'antd';
import type { Key } from 'react';
import type { ApiError } from '@/shared/api';
import { PAGE_SIZE, type TableSort } from '@/shared/lib';
import type { MsgCode, MsgParams } from '@/shared/messages';
import { EmptyState, ErrorState } from '../States';
import styles from './DataTable.module.css';

/** An antd column with a required `key`; `sortable` columns sort on the server by that key. */
export type DataTableColumn<T> = Omit<TableColumnType<T>, 'key' | 'sorter' | 'sortOrder'> & {
  key: string;
  sortable?: boolean;
};

type DataTableProps<T> = {
  /** Accessible name of the table (screen readers, tests). */
  label: string;
  columns: DataTableColumn<T>[];
  rows: readonly T[] | undefined;
  rowKey: (row: T) => Key;
  /** First load only — background refetches keep showing the rows (guideline 06 §5). */
  loading?: boolean;
  /** The failed query's error: the table is replaced by ErrorState. */
  error?: ApiError | null;
  onRetry?: () => void;
  /** Empty message of this screen (SRS); default MSG04. */
  emptyCode?: MsgCode;
  emptyParams?: MsgParams;
  /** Server-side paging, 20 rows per page; `page` counts from 1 like the UI. */
  pagination?: { page: number; total: number; onChange: (page: number) => void };
  sort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  rowSelection?: TableProps<T>['rowSelection'];
  /** Total width of the columns: wider than the screen → the table scrolls sideways (min 1366 px). */
  scrollX?: number;
};

/**
 * Figma "Web/Table" (Header Cell, Cell) + "Web/Pagination" (guideline 07 §3). Loading, error and empty
 * states are built in; paging and sorting are controlled by the page (values live in the URL).
 */
export function DataTable<T extends object>({
  label,
  columns,
  rows,
  rowKey,
  loading = false,
  error,
  onRetry,
  emptyCode = 'MSG04',
  emptyParams,
  pagination,
  sort,
  onSortChange,
  rowSelection,
  scrollX,
}: DataTableProps<T>) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />;

  const antColumns: TableProps<T>['columns'] = columns.map(({ sortable, ...column }) => ({
    ellipsis: true, // Figma cells are one line, cut with "…"
    ...column,
    sorter: sortable ? true : undefined,
    sortOrder:
      sortable && sort?.field === column.key ? (sort.order === 'asc' ? 'ascend' : 'descend') : null,
  }));

  const handleChange: TableProps<T>['onChange'] = (_pagination, _filters, sorter, extra) => {
    if (extra.action !== 'sort' || !onSortChange) return;
    const single = Array.isArray(sorter) ? sorter[0] : sorter;
    const columnKey = single?.columnKey;
    const order = single?.order;
    onSortChange(
      order && typeof columnKey === 'string'
        ? { field: columnKey, order: order === 'ascend' ? 'asc' : 'desc' }
        : null,
    );
  };

  return (
    <Table<T>
      aria-label={label}
      className={styles.table}
      columns={antColumns}
      dataSource={rows ? [...rows] : []}
      rowKey={rowKey}
      loading={loading}
      rowSelection={rowSelection}
      onChange={handleChange}
      tableLayout="fixed"
      scroll={scrollX ? { x: scrollX } : undefined}
      locale={{ emptyText: <EmptyState code={emptyCode} params={emptyParams} /> }}
      showSorterTooltip={false}
      pagination={
        pagination
          ? {
              current: pagination.page,
              pageSize: PAGE_SIZE,
              total: pagination.total,
              onChange: pagination.onChange,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} items`,
            }
          : false
      }
    />
  );
}
