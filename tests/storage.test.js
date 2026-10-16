import {
  saveQuotation,
  getSavedQuotations,
  deleteQuotation,
  getCompanySettings,
  saveCompanySettings,
  importBackupData
} from '../src/utils/storage.js';

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

console.log('--- Testing Storage and Backup/Restore ---');

// 1. Company settings
const defaultSettings = getCompanySettings();
assert(defaultSettings.name === 'HI ONE TECH', 'Default company name is HI ONE TECH');

saveCompanySettings({ phone: '+91 9876543210', email: 'test@hionetech.com' });
const updatedSettings = getCompanySettings();
assert(updatedSettings.phone === '+91 9876543210', 'Phone updated in settings');
assert(updatedSettings.name === 'HI ONE TECH', 'Company name preserved');

// 2. Save quote
const q1 = saveQuotation({
  quotationNumber: 'HOT-2026-001',
  customerName: 'Ramesh Kumar',
  phone: '9840123456',
  location: 'Chennai',
  items: [{ id: '1', description: 'Terrace Waterproofing', quantity: 100, rate: 50 }]
});

assert(q1.id !== null && q1.id !== undefined, 'Quote given unique ID');
let allQuotes = getSavedQuotations();
assert(allQuotes.length === 1, 'One quote in storage');
assert(allQuotes[0].customerName === 'Ramesh Kumar', 'Customer name stored correctly');

// 3. Update existing quote
saveQuotation({
  ...q1,
  customerName: 'Ramesh Kumar (Updated)'
});
allQuotes = getSavedQuotations();
assert(allQuotes.length === 1, 'Updating existing quote does not duplicate records');
assert(allQuotes[0].customerName === 'Ramesh Kumar (Updated)', 'Customer name updated');

// 4. Delete quote
deleteQuotation(q1.id);
allQuotes = getSavedQuotations();
assert(allQuotes.length === 0, 'Quotation deleted successfully');

// 5. Backup import
const backupPayload = JSON.stringify({
  appName: 'HI ONE TECH Quotation Manager',
  version: '1.0',
  companySettings: { name: 'HI ONE TECH', phone: '044-12345678' },
  quotations: [
    {
      id: 'quote_import_1',
      quotationNumber: 'HOT-2026-010',
      customerName: 'Karthik',
      items: [{ id: '1', description: 'Basement coating', quantity: 50, rate: 80 }]
    },
    {
      id: 'quote_import_2',
      quotationNumber: 'HOT-2026-011',
      customerName: 'Senthil',
      items: [{ id: '2', description: 'Bathroom waterproofing', quantity: 20, rate: 120 }]
    }
  ]
});

const importedCount = importBackupData(backupPayload);
assert(importedCount === 2, `Imported 2 quotes (got ${importedCount})`);
allQuotes = getSavedQuotations();
assert(allQuotes.length === 2, 'Two imported quotes in storage');
assert(allQuotes.some(q => q.customerName === 'Karthik'), 'Karthik imported');
assert(allQuotes.some(q => q.customerName === 'Senthil'), 'Senthil imported');

console.log('🎉 All storage tests passed successfully!');
