import { Flex, Spin } from 'antd';
import styles from './FullPageLoading.module.css';

export function FullPageLoading() {
  return (
    <Flex align="center" justify="center" className={styles.wrapper}>
      <Spin size="large" />
    </Flex>
  );
}
