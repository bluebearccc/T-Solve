import { useQueryClient } from '@tanstack/react-query';
import { Card, Flex, Select, Typography } from 'antd';
import { useNavigate } from 'react-router';
import { getDevRole, resetSession, ROLE_LABELS, ROLES, setDevRole, type Role } from '@/shared/auth';
import styles from './DevRoleSwitcher.module.css';

const SIGNED_OUT = 'SIGNED_OUT';
type DevChoice = Role | typeof SIGNED_OUT;

/**
 * DEV ONLY, mock mode — pick which fixture user the `/api/v1/me` mock returns (src/mocks/session.ts), to see
 * each role's shell and test the guards without a backend (decision FE-11). Never part of a production build.
 */
export function DevRoleSwitcher() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleChange(value: DevChoice) {
    setDevRole(value === SIGNED_OUT ? null : value);
    await resetSession(queryClient);
    await navigate('/');
  }

  return (
    <Card size="small" className={styles.panel}>
      <Flex vertical gap="small">
        <Typography.Text type="secondary">Dev · signed in as</Typography.Text>
        <Select<DevChoice>
          aria-label="Dev role"
          className={styles.select}
          value={getDevRole() ?? SIGNED_OUT}
          onChange={(value) => void handleChange(value)}
          options={[
            ...ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
            { value: SIGNED_OUT, label: 'Signed out' },
          ]}
        />
      </Flex>
    </Card>
  );
}
