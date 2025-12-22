/**
 * Date formatting utilities
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/** Format date as "4th January 2023" */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

/** Format date as ISO 8601 for sitemap */
export function formatDateISO(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toISOString().split('.')[0] + '+00:00';
}

/** Format date as RFC 822 for RSS */
export function formatDateRFC822(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toUTCString();
}

/** Get today's date in YYYY-MM-DD format */
export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}
