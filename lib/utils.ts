import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasValidUrl(url?: string | null): boolean {
  return !!url && typeof url === 'string' && url.trim() !== '';
}

export function buildQueryString(params: Record<string, string>): string {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
}

export function formatPrice(
  value: number,
  options?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const {
    currency = 'COP',
    locale = 'es-CO',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options || {};
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
