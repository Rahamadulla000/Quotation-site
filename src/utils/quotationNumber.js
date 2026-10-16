const SEQUENCE_KEY = 'hot_quote_sequence_registry_v1';

/**
 * Gets the sequence registry from localStorage
 */
function getSequenceRegistry() {
  try {
    const raw = localStorage.getItem(SEQUENCE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to read sequence registry:', e);
    return {};
  }
}

/**
 * Updates the sequence registry in localStorage
 */
function updateSequenceRegistry(year, nextVal) {
  try {
    const registry = getSequenceRegistry();
    registry[year] = Math.max(registry[year] || 0, nextVal);
    localStorage.setItem(SEQUENCE_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error('Failed to update sequence registry:', e);
  }
}

/**
 * Generates the next unique quotation number: HOT-YYYY-001
 * Guarantees monotonic increase and never reuses deleted numbers.
 * @param {Array} existingQuotes - optional list of saved quotes to also check
 * @param {number|string} targetYear - optional target year (defaults to current year)
 */
export function generateNextQuotationNumber(existingQuotes = [], targetYear = null) {
  const year = targetYear ? String(targetYear) : String(new Date().getFullYear());
  const registry = getSequenceRegistry();
  let maxSeq = registry[year] || 0;

  // Also verify against any existing quotes passed in
  if (Array.isArray(existingQuotes)) {
    existingQuotes.forEach(q => {
      if (q && q.quotationNumber) {
        const match = q.quotationNumber.match(/^HOT-(\d{4})-(\d+)$/);
        if (match && match[1] === year) {
          const num = parseInt(match[2], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    });
  }

  const nextSeq = maxSeq + 1;
  updateSequenceRegistry(year, nextSeq);

  const paddedSeq = String(nextSeq).padStart(3, '0');
  return `HOT-${year}-${paddedSeq}`;
}

/**
 * Manually update the sequence tracker if an imported quote has a higher number
 */
export function syncSequenceWithQuotes(quotes = []) {
  if (!Array.isArray(quotes)) return;
  const registry = getSequenceRegistry();

  quotes.forEach(q => {
    if (q && q.quotationNumber) {
      const match = q.quotationNumber.match(/^HOT-(\d{4})-(\d+)$/);
      if (match) {
        const year = match[1];
        const num = parseInt(match[2], 10);
        if (!isNaN(num)) {
          registry[year] = Math.max(registry[year] || 0, num);
        }
      }
    }
  });

  try {
    localStorage.setItem(SEQUENCE_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error('Failed to sync sequence registry:', e);
  }
}
