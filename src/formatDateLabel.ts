/**
 * Formats a date as a human-friendly label, e.g. "Today, Mon Jun 24" or "Tomorrow, Tue Jun 25".
 * Falls back to a short weekday/month/day label for other dates.
 *
 * @param date - The date to format
 * @returns A formatted string label for the date
 */
export function formatDateLabel(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const baseLabel = date
    .toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    .replace(/[\.,]/g, '');

  if (isSameDay(date, today)) return `Today, ${baseLabel}`;
  if (isSameDay(date, tomorrow)) return `Tomorrow, ${baseLabel}`;
  return baseLabel;
}
