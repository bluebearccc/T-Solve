import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
// Ant Design's base reset (margins, box-sizing). With the font files above, the only global CSS (guideline 07 U3).
import 'antd/dist/reset.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';

/**
 * Mock mode (guideline 06 §2): every API call is answered by MSW. Dev builds only — `import.meta.env.…` is
 * written literally so production builds drop the mocks (and faker) entirely.
 */
async function startMocking(): Promise<void> {
  if (!(import.meta.env.DEV && import.meta.env.VITE_API_MOCKING === 'true')) return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledFrame: 'bypass' });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element in index.html');

await startMocking();

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
