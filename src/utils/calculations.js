import { roundToTwo } from './formatting.js';

/**
 * Calculates line item amount: quantity * rate
 */
export function calculateLineAmount(quantity, rate) {
  const q = parseFloat(quantity);
  const r = parseFloat(rate);
  if (isNaN(q) || isNaN(r) || q < 0 || r < 0) {
    return 0;
  }
  return roundToTwo(q * r);
}

/**
 * Calculates complete quotation totals
 * @param {Array} items - List of work items
 * @param {string} discountType - 'fixed' | 'percentage'
 * @param {number|string} discountValue - discount number or string
 * @param {boolean} taxEnabled - whether tax/GST is enabled
 * @param {number|string} taxRate - tax percentage rate
 * @param {number|string} advance - advance received amount
 * @returns {Object} totals object
 */
export function calculateTotals({
  items = [],
  discountType = 'fixed',
  discountValue = 0,
  taxEnabled = false,
  taxRate = 0,
  advance = 0
}) {
  // 1. Subtotal = sum of valid line amounts
  const subtotal = roundToTwo(
    items.reduce((sum, item) => {
      const amount = calculateLineAmount(item.quantity, item.rate);
      return sum + amount;
    }, 0)
  );

  // 2. Discount
  const discVal = Math.max(0, parseFloat(discountValue) || 0);
  let discountAmount = 0;
  if (discountType === 'percentage') {
    const pct = Math.min(100, discVal);
    discountAmount = roundToTwo((subtotal * pct) / 100);
  } else {
    discountAmount = roundToTwo(Math.min(subtotal, discVal));
  }

  // 3. Taxable Amount
  const taxableAmount = roundToTwo(Math.max(0, subtotal - discountAmount));

  // 4. Tax/GST (optional and configurable, disabled by default)
  let taxAmount = 0;
  if (taxEnabled) {
    const tRate = Math.max(0, parseFloat(taxRate) || 0);
    taxAmount = roundToTwo((taxableAmount * tRate) / 100);
  }

  // 5. Grand Total = Subtotal - Discount + Tax
  const grandTotal = roundToTwo(Math.max(0, taxableAmount + taxAmount));

  // 6. Advance Received & Balance Due
  const advanceAmount = Math.max(0, parseFloat(advance) || 0);
  const balanceDue = roundToTwo(Math.max(0, grandTotal - advanceAmount));

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    grandTotal,
    advanceAmount,
    balanceDue
  };
}
