import { Typography } from 'antd';
import { Link } from 'react-router';
import { formatDateTime } from '@/shared/lib';
import { StatusTag, type StatusTagStatus } from '../StatusTag';

/**
 * Cell renderers matching Figma "Web/Table/Cell" kinds (Text, Link, Tag) — use them in `render` so every
 * table formats values the same way.
 */
export const cells = {
  /** Kind=Text: one line, cut with "…", full text on hover. Empty values show nothing. */
  text: (value: string | null | undefined) =>
    value ? <Typography.Text ellipsis={{ tooltip: value }}>{value}</Typography.Text> : null,
  /** Kind=Link: brand-colour link to another screen (e.g. the Ticket ID → Ticket Detail). */
  link: (to: string, text: string) => <Link to={to}>{text}</Link>,
  /** Kind=Tag: a status. */
  tag: (status: StatusTagStatus) => <StatusTag status={status} />,
  /** dd/MM/yyyy HH:mm in Vietnam time. */
  dateTime: (value: string | null | undefined) => formatDateTime(value),
};
