import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Combines clsx and tailwind-merge for dynamic class composition.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency (USD).
 * @param amount - The numeric amount to format.
 * @param currency - ISO 4217 currency code (default "USD").
 * @returns Formatted currency string (e.g., "$1,234.56").
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Formats a Date or ISO string into a readable date string.
 * @param date - Date object or ISO string.
 * @returns Formatted date string (e.g., "Jan 15, 2025").
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}
