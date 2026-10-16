/**
 * Utility functions for currency and date formatting
 */

/**
 * Format number as Indian Rupee (INR) currency string
 * e.g. 125000 -> "₹ 1,25,000.00"
 */
export function formatCurrency(amount, includeSymbol = true) {
  const num = Number(amount);
  if (isNaN(num)) return includeSymbol ? '₹ 0.00' : '0.00';

  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const fixed = absNum.toFixed(2);
  const [integerPart, decimalPart] = fixed.split('.');

  // Format integer part with Indian numbering system (3, 2, 2 digits)
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  let formattedInteger = lastThree;
  if (otherNumbers !== '') {
    formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  const result = `${isNegative ? '-' : ''}${formattedInteger}.${decimalPart}`;
  return includeSymbol ? `₹ ${result}` : result;
}

/**
 * Format date to standard readable format (DD/MM/YYYY)
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Get today's date formatted as YYYY-MM-DD for date input
 */
export function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Round a number to 2 decimal places safely
 */
export function roundToTwo(num) {
  const n = Number(num);
  if (isNaN(n)) return 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
