import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Typography } from 'antd';
import type { ApiError } from '@/shared/api';
import { msg } from '@/shared/messages';
import styles from './States.module.css';

type ErrorStateProps = {
  /** The failed query's error; its MSG code is shown (MSG08 for 403, MSG06 otherwise). */
  error?: ApiError | null;
  /**
   * Usually `() => void query.refetch()`. Pass it from the page — never call the query hook inside the
   * error view (a new observer of a failed query refetches it on mount: an endless loop, guideline 06 §5).
   */
  onRetry?: () => void;
};

/** A data view that failed to load (guideline 05 C9). */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap="small"
      className={styles.state}
      role="alert"
    >
      <ExclamationCircleOutlined className={styles.errorIcon} aria-hidden />
      <Typography.Text type="secondary">
        {msg(error?.code ?? 'MSG06', error?.params)}
      </Typography.Text>
      {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </Flex>
  );
}
