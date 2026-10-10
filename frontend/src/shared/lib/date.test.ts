import { formatDate, formatDateTime } from './date';

describe('date formatting', () => {
  it('shows API timestamps in Vietnam time', () => {
    // 11:35 UTC = 18:35 in Ho Chi Minh City (UTC+7), whatever the machine's timezone.
    expect(formatDateTime('2026-10-01T11:35:00Z')).toBe('01/10/2026 18:35');
    expect(formatDate('2026-10-01T20:00:00Z')).toBe('02/10/2026');
  });

  it('returns an empty string for missing or invalid values', () => {
    expect(formatDateTime(null)).toBe('');
    expect(formatDateTime('not a date')).toBe('');
  });
});
