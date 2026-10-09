import { Result } from 'antd';
import { msg } from '@/shared/messages';

/** Unexpected error while rendering a route: MSG06 (guideline 06 §6). */
export function RouteErrorPage() {
  return <Result status="error" title={msg('MSG06')} />;
}
