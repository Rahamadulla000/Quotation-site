import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Search,
  FolderOpen,
  Copy,
  Trash2,
  Download,
  Upload,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatting';

export default function SavedQuotesModal({
  isOpen,
  onClose,
  quotes = [],
  onSelectQuote,
  onDuplicateQuote,
  onDeleteQuote,
  onExportBackup,
  onImportBackup,
  t
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef(null);

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      // Status filter
      if (statusFilter !== 'all' && q.status !== statusFilter) {
        return false;
      }

      // Search term
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const quoteNo = (q.quotationNumber || '').toLowerCase();
      const name = (q.customerName || '').toLowerCase();
      const loc = (q.location || '').toLowerCase();
      const phone = (q.phone || '').toLowerCase();

      return quoteNo.includes(term) || name.includes(term) || loc.includes(term) || phone.includes(term);
    });
  }, [quotes, searchTerm, statusFilter]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImportBackup(event.target.result);
      };
      reader.readAsText(file);
    }
    // reset input so the same file can be re-selected if desired
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[88vh] flex flex-col border border-slate-200 animate-scale-up overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg text-sky-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                <span>{t.savedQuotesTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {quotes.length}
                </span>
              </h2>
              <p className="text-xs text-slate-400">{t.backupNotice}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExportBackup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Download JSON Backup"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">{t.exportBackup}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Restore JSON Backup"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.importBackup}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.filterAll} ({quotes.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'draft'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.filterDraft}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('final')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === 'final'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.filterFinal}
            </button>
          </div>
        </div>

        {/* Quotations List */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredQuotes.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-sm font-medium">{t.noQuotesFound}</p>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create and save your first quotation to see it here.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredQuotes.map(quote => (
                <div
                  key={quote.id}
                  className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg shrink-0 mt-0.5">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                          {quote.quotationNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold ${
                            quote.status === 'final'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {quote.status === 'final' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {quote.status === 'final' ? t.statusFinal : t.statusDraft}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {formatDate(quote.date)}
                        </span>
                      </div>

                      <div className="text-sm font-semibold text-slate-800 truncate mb-0.5">
                        {quote.customerName || 'Unnamed Customer'}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                        {quote.phone && <span>📞 {quote.phone}</span>}
                        {quote.location && <span>📍 {quote.location}</span>}
                        <span>
                          {quote.items?.length || 0} {(quote.items?.length || 0) === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Amount & Action buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{t.grandTotal}</span>
                      <span className="text-base font-bold font-mono text-blue-700">
                        {formatCurrency(quote.totals?.grandTotal || 0)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectQuote(quote)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        {t.btnEdit}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateQuote(quote)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        title={t.btnDuplicate}
                        aria-label={t.btnDuplicate}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteQuote(quote)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        title={t.btnDelete}
                        aria-label={t.btnDelete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
