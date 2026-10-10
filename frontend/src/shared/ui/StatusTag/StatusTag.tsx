import { Tag } from 'antd';
import { STATUS_TAGS, type StatusTagStatus } from './status-tags';
import styles from './StatusTag.module.css';

type StatusTagProps = { status: StatusTagStatus };

/** Figma "Web/Status Tag" — the status name in its preset colour. */
export function StatusTag({ status }: StatusTagProps) {
  const { label, color } = STATUS_TAGS[status];
  return (
    <Tag color={color} variant="outlined" className={styles.tag}>
      {label}
    </Tag>
  );
}
