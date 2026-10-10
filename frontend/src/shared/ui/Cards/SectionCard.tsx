import { Card } from 'antd';
import type { ReactNode } from 'react';
import styles from './Cards.module.css';

type SectionCardProps = { title?: string; children: ReactNode };

/** Figma "Web/Card" Kind=Section: a titled block on dashboards and detail screens. */
export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Card title={title} variant="borderless" className={styles.card}>
      {children}
    </Card>
  );
}
