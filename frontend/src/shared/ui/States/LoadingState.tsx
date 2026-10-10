import { Flex, Spin, Typography } from 'antd';
import styles from './States.module.css';

/** Figma "Web/Empty & Loading" Kind=Loading. */
export function LoadingState() {
  return (
    <Flex vertical align="center" justify="center" gap="small" className={styles.state}>
      <Spin />
      <Typography.Text type="secondary">Loading ...</Typography.Text>
    </Flex>
  );
}
