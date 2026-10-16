import { generateNextQuotationNumber, syncSequenceWithQuotes } from '../src/utils/quotationNumber.js';

// Polyfill localStorage for node testing
const storageMap = new Map();
global.localStorage = {
  getItem: (key) => storageMap.get(key) || null,
  setItem: (key, val) => storageMap.set(key, String(val)),
  removeItem: (key) => storageMap.delete(key),
  clear: () => storageMap.clear()
};

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('--- Testing Quotation Number Generation ---');

const q1 = generateNextQuotationNumber([], 2026);
assert(q1 === 'HOT-2026-001', `First quote number is HOT-2026-001 (got ${q1})`);

const q2 = generateNextQuotationNumber([], 2026);
assert(q2 === 'HOT-2026-002', `Second quote number is HOT-2026-002 (got ${q2})`);

const q3 = generateNextQuotationNumber([], 2026);
assert(q3 === 'HOT-2026-003', `Third quote number is HOT-2026-003 (got ${q3})`);

// Test monotonicity even if quotes are deleted (i.e. empty existing quotes list passed)
const q4 = generateNextQuotationNumber([], 2026);
assert(q4 === 'HOT-2026-004', `After deletion, number is never reused (got ${q4})`);

// Test with imported higher sequence
syncSequenceWithQuotes([{ quotationNumber: 'HOT-2026-050' }]);
const q5 = generateNextQuotationNumber([], 2026);
assert(q5 === 'HOT-2026-051', `Sequences correctly adapt to imported higher sequence HOT-2026-051 (got ${q5})`);

console.log('🎉 All quotation number tests passed successfully!');
