import { InboxOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { msg, type MsgCode, type MsgParams } from '@/shared/messages';
import styles from './States.module.css';

type EmptyStateProps = {
  /** The screen's empty message (SRS); MSG04 "No results found." when the SRS names none. */
  code?: MsgCode;
  params?: MsgParams;
};

/** Figma "Web/Empty & Loading" Kind=Empty. */
export function EmptyState({ code = 'MSG04', params }: EmptyStateProps) {
  return (
    <Flex vertical align="center" justify="center" gap="small" className={styles.state}>
      <InboxOutlined className={styles.emptyIcon} aria-hidden />
      <Typography.Text type="secondary">{msg(code, params)}</Typography.Text>
    </Flex>
  );
}
