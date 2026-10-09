import { Result } from 'antd';

/**
 * Unknown path. The SRS has no MSG code for "page not found", so this text is not from the catalog —
 * open point for the SRS owner (replace with the MSG code once one exists).
 */
export function NotFoundPage() {
  return <Result status="404" title="404" subTitle="This page does not exist." />;
}
