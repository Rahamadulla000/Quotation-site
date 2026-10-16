import { calculateLineAmount, calculateTotals } from '../src/utils/calculations.js';
import { formatCurrency, roundToTwo } from '../src/utils/formatting.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('--- Testing Calculations ---');

// 1. Line amount calculation
assert(calculateLineAmount(100, 25) === 2500, '100 * 25 = 2500');
assert(calculateLineAmount(12.5, 40) === 500, '12.5 * 40 = 500');
assert(calculateLineAmount(0, 50) === 0, '0 qty = 0');
assert(calculateLineAmount(-10, 50) === 0, 'negative qty returns 0');
assert(calculateLineAmount('abc', 50) === 0, 'invalid string returns 0');

// 2. Formatting
assert(formatCurrency(2500) === '₹ 2,500.00', 'format 2500 INR');
assert(formatCurrency(125000) === '₹ 1,25,000.00', 'format 125000 INR Indian lakhs comma');
assert(formatCurrency(10000000) === '₹ 1,00,00,000.00', 'format 10000000 INR 1 crore');

// 3. Totals with items
const items = [
  { quantity: 1000, rate: 45 }, // 45,000
  { quantity: 500, rate: 30 },  // 15,000
  { quantity: 200, rate: 12.5 } // 2,500
];
// Subtotal = 62,500

const totalsBasic = calculateTotals({
  items,
  discountType: 'fixed',
  discountValue: 2500,
  taxEnabled: false,
  advance: 10000
});

assert(totalsBasic.subtotal === 62500, 'Subtotal is 62500');
assert(totalsBasic.discountAmount === 2500, 'Discount is 2500');
assert(totalsBasic.taxableAmount === 60000, 'Taxable is 60000');
assert(totalsBasic.grandTotal === 60000, 'Grand total without tax is 60000');
assert(totalsBasic.advanceAmount === 10000, 'Advance is 10000');
assert(totalsBasic.balanceDue === 50000, 'Balance due is 50000');

// 4. Totals with Percentage Discount and Tax (18% GST)
const totalsWithTax = calculateTotals({
  items,
  discountType: 'percentage',
  discountValue: 10, // 10% of 62500 = 6250 => Taxable = 56250
  taxEnabled: true,
  taxRate: 18, // 18% of 56250 = 10125 => Grand Total = 66375
  advance: 20000
});

assert(totalsWithTax.discountAmount === 6250, '10% discount of 62500 = 6250');
assert(totalsWithTax.taxableAmount === 56250, 'Taxable is 56250');
assert(totalsWithTax.taxAmount === 10125, '18% GST of 56250 = 10125');
assert(totalsWithTax.grandTotal === 66375, 'Grand total with tax = 66375');
assert(totalsWithTax.balanceDue === 46375, 'Balance due = 66375 - 20000 = 46375');

console.log('🎉 All calculation tests passed successfully!');
