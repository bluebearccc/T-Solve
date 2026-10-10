import { Button, Result } from 'antd';
import { msg } from '@/shared/messages';

type SessionErrorPageProps = {
  /** Refetches the session. Passed in by the guard: calling useSession() here would add a second observer,
   * and a new observer of a failed query refetches it on mount — an endless loop. */
  onRetry: () => void;
};

/** `/api/v1/me` failed (server down, network): we cannot tell who is signed in. MSG06 + Try again. */
export function SessionErrorPage({ onRetry }: SessionErrorPageProps) {
  return (
    <Result
      status="error"
      title={msg('MSG06')}
      extra={
        <Button type="primary" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}
