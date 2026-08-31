import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

export function formatDate(date: string | Date, pattern = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "Invalid date";
  return format(d, pattern);
}
export function formatDateTime(date: string | Date): string {
  return formatDate(date, "MMM d, yyyy HH:mm");
}
export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "Invalid date";
  return formatDistanceToNow(d, { addSuffix: true });
}
