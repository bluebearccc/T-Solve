import { App } from 'antd';
import { useEffect } from 'react';
import { setMessageHost } from './show';

/** Connects showMessage / showAcknowledgement to antd's App context. Rendered once, by AppProviders. */
export function MessageHost() {
  const app = App.useApp();
  useEffect(() => {
    setMessageHost(app);
    return () => setMessageHost(null);
  }, [app]);
  return null;
}
