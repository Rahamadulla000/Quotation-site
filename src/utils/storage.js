import { syncSequenceWithQuotes } from './quotationNumber.js';

const STORAGE_KEYS = {
  QUOTATIONS: 'hot_quotations_v1',
  SETTINGS: 'hot_company_settings_v1',
  LANGUAGE: 'hot_app_language_v1'
};

const DEFAULT_COMPANY_SETTINGS = {
  name: 'HI ONE TECH',
  address: '',
  phone: '',
  email: '',
  gstin: '',
  logoUrl: ''
};

/**
 * Checks if localStorage is available
 */
export function isStorageAvailable() {
  try {
    const test = '__hot_storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    console.error('LocalStorage is not available:', e);
    return false;
  }
}

/**
 * Retrieves all saved quotations
 */
export function getSavedQuotations() {
  if (!isStorageAvailable()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading quotations from storage:', e);
    return [];
  }
}

/**
 * Saves or updates a quotation
 */
export function saveQuotation(quotation) {
  if (!isStorageAvailable()) {
    throw new Error('Local storage is not available in your browser.');
  }

  const quotes = getSavedQuotations();
  const now = new Date().toISOString();

  // If quote doesn't have an internal unique id, generate one
  const quoteToSave = {
    ...quotation,
    id: quotation.id || `quote_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    updatedAt: now,
    createdAt: quotation.createdAt || now
  };

  const existingIndex = quotes.findIndex(q => q.id === quoteToSave.id);

  if (existingIndex >= 0) {
    quotes[existingIndex] = quoteToSave;
  } else {
    quotes.unshift(quoteToSave);
  }

  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotes));
  // Sync the sequence number registry so numbers won't clash
  syncSequenceWithQuotes(quotes);

  return quoteToSave;
}

/**
 * Deletes a quotation by internal ID
 */
export function deleteQuotation(id) {
  if (!isStorageAvailable()) return false;
  try {
    const quotes = getSavedQuotations();
    const filtered = quotes.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to delete quotation:', e);
    return false;
  }
}

/**
 * Gets company settings
 */
export function getCompanySettings() {
  if (!isStorageAvailable()) return DEFAULT_COMPANY_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_COMPANY_SETTINGS;
    return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(data) };
  } catch (e) {
    console.error('Failed to read company settings:', e);
    return DEFAULT_COMPANY_SETTINGS;
  }
}

/**
 * Saves company settings
 */
export function saveCompanySettings(settings) {
  if (!isStorageAvailable()) return false;
  try {
    const merged = { ...DEFAULT_COMPANY_SETTINGS, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    return true;
  } catch (e) {
    console.error('Failed to save company settings:', e);
    return false;
  }
}

/**
 * Exports current quotations and settings as a downloadable JSON file
 */
export function exportBackupData() {
  const quotes = getSavedQuotations();
  const settings = getCompanySettings();
  const exportPayload = {
    appName: 'HI ONE TECH Quotation Manager',
    version: '1.0',
    exportDate: new Date().toISOString(),
    companySettings: settings,
    quotations: quotes
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `HI_ONE_TECH_Quotations_Backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validates and imports JSON backup data
 * @param {string} jsonContent
 * @returns {number} count of imported quotations
 */
export function importBackupData(jsonContent) {
  let parsed;
  try {
    parsed = JSON.parse(jsonContent);
  } catch {
    throw new Error('Invalid JSON format');
  }

  if (!parsed || (!Array.isArray(parsed.quotations) && !Array.isArray(parsed))) {
    throw new Error('Unrecognized backup file structure');
  }

  const incomingQuotes = Array.isArray(parsed.quotations) ? parsed.quotations : parsed;
  const currentQuotes = getSavedQuotations();

  // Validate incoming quotes structure
  const validQuotes = incomingQuotes.filter(q => q && q.quotationNumber && Array.isArray(q.items));

  if (validQuotes.length === 0 && incomingQuotes.length > 0) {
    throw new Error('Backup contains no valid quotation records');
  }

  // Merge: update existing by id, append new
  const quotesMap = new Map();
  currentQuotes.forEach(q => quotesMap.set(q.id, q));
  validQuotes.forEach(q => {
    const id = q.id || `quote_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    quotesMap.set(id, { ...q, id });
  });

  const merged = Array.from(quotesMap.values());
  localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(merged));
  syncSequenceWithQuotes(merged);

  // If company settings are included, optionally restore them
  if (parsed.companySettings && typeof parsed.companySettings === 'object') {
    saveCompanySettings(parsed.companySettings);
  }

  return validQuotes.length;
}

/**
 * Get preferred language (en | ta)
 */
export function getSavedLanguage() {
  if (!isStorageAvailable()) return 'en';
  return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
}

/**
 * Save preferred language
 */
export function saveLanguage(lang) {
  if (!isStorageAvailable()) return;
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}
