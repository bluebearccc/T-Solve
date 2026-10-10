import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/** Every date and time in the UI is Vietnam time, whatever the browser's timezone (decision FE-16). */
export const APP_TIME_ZONE = 'Asia/Ho_Chi_Minh';

/** "01/10/2026 18:35" — the one date-time format of the app (SRS, Figma tables). Empty for no value. */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '';
  const date = dayjs(value);
  return date.isValid() ? date.tz(APP_TIME_ZONE).format('DD/MM/YYYY HH:mm') : '';
}

/** "01/10/2026" — dates without a time (e.g. resolved date, filters). */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = dayjs(value);
  return date.isValid() ? date.tz(APP_TIME_ZONE).format('DD/MM/YYYY') : '';
}
