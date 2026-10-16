import React, { useState } from 'react';
import {
  FilePlus,
  FolderOpen,
  Settings,
  Printer,
  Save,
  Menu,
  X,
  ShieldCheck,
  Eye
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function AppHeader({
  companySettings,
  savedQuotesCount,
  currentLang,
  onLanguageToggle,
  onNewQuotation,
  onOpenSaved,
  onOpenSettings,
  onOpenPreview,
  onSaveQuote,
  isSaving,
  t
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-700 flex items-center justify-center shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">
                  {companySettings.name || 'HI ONE TECH'}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-900/80 text-blue-300 border border-blue-700/50">
                  Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {t.quotationManagement}
              </p>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher currentLang={currentLang} onToggle={onLanguageToggle} />

            {/* New Quotation Button */}
            <button
              type="button"
              onClick={onNewQuotation}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            >
              <FilePlus className="w-4 h-4 text-sky-400" />
              <span>{t.newQuotation}</span>
            </button>

            {/* Saved Quotations Button */}
            <button
              type="button"
              onClick={onOpenSaved}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>{t.savedQuotations}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {savedQuotesCount}
              </span>
            </button>

            {/* Company Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              title={t.companySettings}
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>{t.companySettings}</span>
            </button>

            <div className="h-6 w-px bg-slate-800 mx-1" />

            {/* Print / Preview Button */}
            <button
              type="button"
              onClick={onOpenPreview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700 shadow-xs"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>{t.previewPrint}</span>
            </button>

            {/* Save Button */}
            <button
              type="button"
              onClick={onSaveQuote}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-900/30 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveFinal}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher currentLang={currentLang} onToggle={onLanguageToggle} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNewQuotation();
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200"
              >
                <FilePlus className="w-4 h-4 text-sky-400" />
                <span>{t.newQuotation}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSaved();
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200"
              >
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>{t.savedQuotations} ({savedQuotesCount})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSettings();
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>{t.companySettings}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPreview();
                }}
                className="flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>{t.previewPrint}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSaveQuote();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{t.saveFinal}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
