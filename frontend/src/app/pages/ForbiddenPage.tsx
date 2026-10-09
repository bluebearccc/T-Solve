import { Result } from 'antd';
import { msg } from '@/shared/messages';

/** Shown in place (URL unchanged) when the signed-in role may not open a screen (guideline 08 §3). */
export function ForbiddenPage() {
  return <Result status="403" title="403" subTitle={msg('MSG08')} />;
}
