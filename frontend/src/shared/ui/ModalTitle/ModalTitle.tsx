import { ExclamationCircleFilled } from '@ant-design/icons';
import type { ReactNode } from 'react';
import styles from './ModalTitle.module.css';

/** Figma "Web/Modal Header" kinds: Form (title only), Confirm (warning icon), Danger (error icon). */
export type ModalKind = 'form' | 'confirm' | 'danger';

/** Internal to shared/ui: the title row of ConfirmDialog and FormModal. */
export function ModalTitle({ kind, children }: { kind: ModalKind; children: ReactNode }) {
  return (
    <span className={styles.title}>
      {kind !== 'form' && (
        <ExclamationCircleFilled
          className={kind === 'danger' ? styles.danger : styles.warning}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
