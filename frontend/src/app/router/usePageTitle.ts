import { useMatches } from 'react-router';

/** The current route's SRS screen name (FeatureRoute.title), or '' when the route has none. */
export function usePageTitle(): string {
  const matches = useMatches();
  for (const match of [...matches].reverse()) {
    const handle = match.handle as { title?: string } | undefined;
    if (handle?.title) return handle.title;
  }
  return '';
}
