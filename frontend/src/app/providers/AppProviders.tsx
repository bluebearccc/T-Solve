import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { App as AntApp, ConfigProvider } from 'antd';
import { useState, type ReactNode } from 'react';
import { createQueryClient } from '@/shared/api';
import { theme } from '../theme/theme';

type AppProvidersProps = {
  children: ReactNode;
  /** Tests pass a fresh client per render (guideline 10 T4). */
  queryClient?: QueryClient;
};

/** Everything every screen needs: theme, antd context (messages, modals) and the query cache. */
export function AppProviders({ children, queryClient }: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}
