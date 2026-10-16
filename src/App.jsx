import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AppHeader from './components/AppHeader';
import CustomerDetails from './components/CustomerDetails';
import WorkItemsTable from './components/WorkItemsTable';
import QuotationTotals from './components/QuotationTotals';
import SavedQuotesModal from './components/SavedQuotesModal';
import CompanySettingsModal from './components/CompanySettingsModal';
import PrintableQuotation from './components/PrintableQuotation';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';

import { translations } from './utils/translations';
import { calculateTotals } from './utils/calculations';
import { getTodayDateString } from './utils/formatting';
import { generateNextQuotationNumber } from './utils/quotationNumber';
import {
  getSavedQuotations,
  saveQuotation,
  deleteQuotation,
  getCompanySettings,
  exportBackupData,
  importBackupData,
  getSavedLanguage,
  saveLanguage
} from './utils/storage';

export default function App() {
  // Language State
  const [lang, setLang] = useState(getSavedLanguage);
  const t = translations[lang] || translations.en;

  // Company Settings
  const [companySettings, setCompanySettings] = useState(getCompanySettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Saved Quotations List
  const [savedQuotes, setSavedQuotes] = useState(getSavedQuotations);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Preview / Print Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Confirmation Modals State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false
  });

  // Function to create blank quotation
  const createNewQuoteState = useCallback(() => {
    const existing = getSavedQuotations();
    const nextNumber = generateNextQuotationNumber(existing);
    const today = getTodayDateString();

    // Default validity date (+30 days)
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 30);
    const validUntilStr = validDate.toISOString().split('T')[0];

    return {
      id: null,
      quotationNumber: nextNumber,
      date: today,
      validUntil: validUntilStr,
      status: 'draft',
      customerName: '',
      phone: '',
      location: '',
      siteAddress: '',
      reference: '',
      items: [
        {
          id: `item_${Date.now()}_1`,
          description: '',
          quantity: '',
          unit: 'sq.ft',
          customUnit: '',
          rate: ''
        }
      ],
      pricing: {
        discountType: 'fixed',
        discountValue: 0,
        taxEnabled: false,
        taxRate: 18,
        advance: 0
      },
      terms: {
        workScope: '',
        materialsAndLabour: '',
        paymentTerms: '',
        advanceAndBalanceConditions: '',
        estimatedCompletionTime: '',
        warrantyConditions: '',
        exclusionsAndCharges: ''
      }
    };
  }, []);

  // Current Quotation in Editor
  const [currentQuote, setCurrentQuote] = useState(createNewQuoteState);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});

  // Recalculate totals reactively
  const totals = useMemo(() => {
    return calculateTotals({
      items: currentQuote.items || [],
      discountType: currentQuote.pricing?.discountType || 'fixed',
      discountValue: currentQuote.pricing?.discountValue || 0,
      taxEnabled: currentQuote.pricing?.taxEnabled || false,
      taxRate: currentQuote.pricing?.taxRate || 0,
      advance: currentQuote.pricing?.advance || 0
    });
  }, [currentQuote.items, currentQuote.pricing]);

  // Handle Language Toggle
  const handleLanguageToggle = (newLang) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  // Change handler for top-level quotation fields
  const handleQuoteFieldChange = (updatedData) => {
    setCurrentQuote(prev => ({ ...prev, ...updatedData }));
    setIsDirty(true);
    // Clear field-specific error if corrected
    setErrors(prev => {
      const copy = { ...prev };
      if (updatedData.customerName) delete copy.customerName;
      if (updatedData.phone) delete copy.phone;
      if (updatedData.location) delete copy.location;
      return copy;
    });
  };

  // Change handler for items
  const handleItemsChange = (newItems) => {
    setCurrentQuote(prev => ({ ...prev, items: newItems }));
    setIsDirty(true);
    if (newItems.length > 0) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.items;
        return copy;
      });
    }
  };

  // Change handler for pricing
  const handlePricingChange = (newPricing) => {
    setCurrentQuote(prev => ({ ...prev, pricing: newPricing }));
    setIsDirty(true);
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!currentQuote.customerName?.trim()) {
      newErrors.customerName = t.errorCustomerName;
    }
    if (!currentQuote.phone?.trim()) {
      newErrors.phone = t.errorPhoneNumber;
    }
    if (!currentQuote.location?.trim()) {
      newErrors.location = t.errorLocation;
    }

    const validItems = (currentQuote.items || []).filter(
      item => item.description?.trim() && Number(item.quantity) > 0 && Number(item.rate) >= 0
    );

    if (validItems.length === 0) {
      newErrors.items = t.errorNoItems;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Quotation
  const handleSaveQuotation = (customStatus = null) => {
    if (!validateForm()) {
      setToast({
        message: t.errorInvalidItem || 'Please complete required fields',
        type: 'error'
      });
      return false;
    }

    try {
      const quoteToSave = {
        ...currentQuote,
        status: customStatus || currentQuote.status || 'final',
        totals: totals
      };

      const saved = saveQuotation(quoteToSave);
      setCurrentQuote(saved);
      setIsDirty(false);

      // Refresh saved quotations list
      const updatedList = getSavedQuotations();
      setSavedQuotes(updatedList);

      setToast({
        message: t.quoteSavedSuccess,
        type: 'success'
      });
      return true;
    } catch (e) {
      console.error(e);
      setToast({
        message: e.message || 'Failed to save quotation',
        type: 'error'
      });
      return false;
    }
  };

  // New Quotation action
  const handleNewQuotation = () => {
    if (isDirty) {
      setConfirmDialog({
        isOpen: true,
        title: t.confirmUnsavedChanges,
        message: 'Your current edits will be lost if you start a new quotation without saving.',
        confirmText: 'Discard & New',
        cancelText: t.cancel,
        isDanger: true,
        onConfirm: () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          setCurrentQuote(createNewQuoteState());
          setIsDirty(false);
          setErrors({});
        }
      });
    } else {
      setCurrentQuote(createNewQuoteState());
      setIsDirty(false);
      setErrors({});
    }
  };

  // Open / Edit from saved list
  const handleSelectQuote = (quote) => {
    const doOpen = () => {
      setCurrentQuote(quote);
      setIsDirty(false);
      setErrors({});
      setIsSavedModalOpen(false);
    };

    if (isDirty) {
      setConfirmDialog({
        isOpen: true,
        title: t.confirmUnsavedChanges,
        message: 'You have unsaved changes in the current quotation. Do you want to open this saved quotation anyway?',
        confirmText: 'Discard & Open',
        cancelText: t.cancel,
        isDanger: true,
        onConfirm: () => {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
          doOpen();
        }
      });
    } else {
      doOpen();
    }
  };

  // Duplicate quote
  const handleDuplicateQuote = (quote) => {
    const existing = getSavedQuotations();
    const newNumber = generateNextQuotationNumber(existing);
    const duplicated = {
      ...quote,
      id: null,
      quotationNumber: newNumber,
      date: getTodayDateString(),
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    const saved = saveQuotation(duplicated);
    setSavedQuotes(getSavedQuotations());
    setToast({
      message: `${t.duplicateSuccess}: ${newNumber}`,
      type: 'success'
    });
  };

  // Delete quote
  const handleDeleteQuote = (quote) => {
    setConfirmDialog({
      isOpen: true,
      title: `${t.confirmDelete} ${quote.quotationNumber}?`,
      message: t.confirmDeleteDesc,
      confirmText: t.btnDelete,
      cancelText: t.cancel,
      isDanger: true,
      onConfirm: () => {
        deleteQuotation(quote.id);
        const updated = getSavedQuotations();
        setSavedQuotes(updated);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        setToast({
          message: t.deleteSuccess,
          type: 'info'
        });

        // If currently open quote was deleted, reset to a new one
        if (currentQuote.id === quote.id) {
          setCurrentQuote(createNewQuoteState());
          setIsDirty(false);
        }
      }
    });
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    try {
      exportBackupData();
      setToast({
        message: 'Backup file downloaded successfully.',
        type: 'success'
      });
    } catch (e) {
      setToast({
        message: 'Failed to export backup: ' + e.message,
        type: 'error'
      });
    }
  };

  // Import JSON Backup
  const handleImportBackup = (jsonString) => {
    try {
      const count = importBackupData(jsonString);
      setSavedQuotes(getSavedQuotations());
      setCompanySettings(getCompanySettings());
      setToast({
        message: t.importSuccess.replace('{count}', count),
        type: 'success'
      });
    } catch (e) {
      setToast({
        message: t.importError + ' (' + e.message + ')',
        type: 'error'
      });
    }
  };

  // Open Preview / Print
  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* App Header (no-print) */}
      <AppHeader
        companySettings={companySettings}
        savedQuotesCount={savedQuotes.length}
        currentLang={lang}
        onLanguageToggle={handleLanguageToggle}
        onNewQuotation={handleNewQuotation}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPreview={handleOpenPreview}
        onSaveQuote={() => handleSaveQuotation('final')}
        isSaving={false}
        t={t}
      />

      {/* Main Container Form */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 no-print">
        {/* Unsaved indicator banner */}
        {isDirty && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-xs flex items-center justify-between shadow-xs">
            <span className="font-medium">
              ⚠️ You have unsaved changes in quotation {currentQuote.quotationNumber}. Click "Save Final Quotation" or "Save Draft" to preserve your work.
            </span>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSaveQuotation('draft')}
                className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded font-semibold text-amber-900 transition-colors cursor-pointer"
              >
                {t.saveDraft}
              </button>
              <button
                type="button"
                onClick={() => handleSaveQuotation('final')}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors cursor-pointer"
              >
                {t.saveFinal}
              </button>
            </div>
          </div>
        )}

        {/* 1. Customer & Quotation Metadata Details */}
        <CustomerDetails
          formData={currentQuote}
          onChange={handleQuoteFieldChange}
          errors={errors}
          t={t}
        />

        {/* 2. Work Items Table */}
        <WorkItemsTable
          items={currentQuote.items}
          onChange={handleItemsChange}
          errors={errors}
          t={t}
        />

        {/* 3. Pricing Summary & Totals */}
        <QuotationTotals
          totals={totals}
          pricingData={currentQuote.pricing}
          onChange={handlePricingChange}
          t={t}
        />

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>{t.backupNotice}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => handleSaveQuotation('draft')}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {t.saveDraft}
            </button>
            <button
              type="button"
              onClick={handleOpenPreview}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {t.previewPrint}
            </button>
            <button
              type="button"
              onClick={() => handleSaveQuotation('final')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-md transition-all cursor-pointer"
            >
              {t.saveFinal}
            </button>
          </div>
        </div>
      </main>

      {/* Screen Preview Modal (shows A4 paper and print button) */}
      {isPreviewOpen && (
        <PrintableQuotation
          quotation={currentQuote}
          companySettings={companySettings}
          totals={totals}
          t={t}
          currentLang={lang}
          isPreview={true}
          onClosePreview={() => setIsPreviewOpen(false)}
        />
      )}

      {/* Standalone Printable View for Browser Print Media (@media print) */}
      <div className="print-only">
        <PrintableQuotation
          quotation={currentQuote}
          companySettings={companySettings}
          totals={totals}
          t={t}
          currentLang={lang}
          isPreview={false}
        />
      </div>

      {/* Company Settings Modal */}
      <CompanySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSuccess={() => {
          setCompanySettings(getCompanySettings());
          setToast({ message: t.settingsSaved, type: 'success' });
        }}
        t={t}
      />

      {/* Saved Quotes Drawer / Modal */}
      <SavedQuotesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        quotes={savedQuotes}
        onSelectQuote={handleSelectQuote}
        onDuplicateQuote={handleDuplicateQuote}
        onDeleteQuote={handleDeleteQuote}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        t={t}
      />

      {/* Generic Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />
    </div>
  );
}
