import { Card, Flex, Typography } from 'antd';
import styles from './Cards.module.css';

type StatCardProps = { label: string; value: number | string };

/** Figma "Web/Card" Kind=Stat: one dashboard number with its label. */
export function StatCard({ label, value }: StatCardProps) {
  return (
    <Card variant="borderless" className={styles.card}>
      <Flex vertical gap="small">
        <Typography.Text type="secondary">{label}</Typography.Text>
        <span className={styles.statValue}>{value}</span>
      </Flex>
    </Card>
  );
}
