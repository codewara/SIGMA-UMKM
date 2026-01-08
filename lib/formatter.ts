/**
 * Format currency with abbreviation to prevent overflow
 * Converts large numbers to readable format: 1.2T, 500M, 5Jt, etc.
 */
export function formatCurrency(value: number): string {
  // Handle null, undefined, NaN, Infinity
  if (!Number.isFinite(value)) return 'Rp 0';
  if (value === 0) return 'Rp 0';

  // Ensure we're working with a number
  const num = Number(value);
  if (!Number.isFinite(num)) return 'Rp 0';

  const absValue = Math.abs(num);
  const units = [
    { threshold: 1_000_000_000_000, abbr: 'T', name: 'Triliun' },
    { threshold: 1_000_000_000, abbr: 'M', name: 'Miliar' },
    { threshold: 1_000_000, abbr: 'Jt', name: 'Juta' },
    { threshold: 1_000, abbr: 'K', name: 'Ribu' },
  ];

  for (const unit of units) {
    if (absValue >= unit.threshold) {
      const divided = num / unit.threshold;
      // Ensure the division result is valid
      if (Number.isFinite(divided)) {
        return `Rp ${divided.toFixed(1).replace(/\.0$/, '')} ${unit.abbr}`;
      }
    }
  }

  return `Rp ${num.toLocaleString('id-ID')}`;
}

/**
 * Format currency using full locale formatting (for table cells with enough space)
 */
export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format number for display in stats cards (abbreviated format)
 */
export function formatNumber(value: number): string {
  // Handle null, undefined, NaN, Infinity
  if (!Number.isFinite(value)) return '0';
  if (value === 0) return '0';

  const num = Number(value);
  if (!Number.isFinite(num)) return '0';

  const absValue = Math.abs(num);
  const units = [
    { threshold: 1_000_000_000_000, abbr: 'T' },
    { threshold: 1_000_000_000, abbr: 'M' },
    { threshold: 1_000_000, abbr: 'Jt' },
    { threshold: 1_000, abbr: 'K' },
  ];

  for (const unit of units) {
    if (absValue >= unit.threshold) {
      const divided = num / unit.threshold;
      if (Number.isFinite(divided)) {
        return `${divided.toFixed(1).replace(/\.0$/, '')} ${unit.abbr}`;
      }
    }
  }

  return num.toLocaleString('id-ID');
}
