import React from 'react';
import { Printer, X, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatting';
import { calculateLineAmount } from '../utils/calculations';

export default function PrintableQuotation({
  quotation,
  companySettings,
  totals,
  t,
  currentLang,
  onClosePreview = null,
  isPreview = false
}) {
  const {
    quotationNumber = '',
    date = '',
    validUntil = '',
    status = 'draft',
    customerName = '',
    phone = '',
    location = '',
    siteAddress = '',
    reference = '',
    items = [],
    pricing = {},
    terms = {}
  } = quotation || {};

  const handlePrint = () => {
    window.print();
  };

  const unitLabel = (unit, customUnit) => {
    if (unit === 'other') return customUnit || t.units.other;
    return t.units[unit] || unit;
  };

  return (
    <div className={isPreview ? "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs overflow-y-auto p-4 sm:p-8 flex flex-col items-center no-print" : ""}>
      {/* On-screen Preview Toolbar (hidden in print) */}
      {isPreview && (
        <div className="w-full max-w-[210mm] bg-slate-900 text-white px-5 py-3 rounded-xl mb-4 flex items-center justify-between shadow-xl no-print">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{t.previewPrint}</span>
            <span className="text-xs text-slate-400 font-mono">({quotationNumber})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printOrPdf}</span>
            </button>
            {onClosePreview && (
              <button
                type="button"
                onClick={onClosePreview}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* A4 Paper Container */}
      <div
        id="printable-quotation-root"
        className={`bg-white text-slate-900 mx-auto w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-2xl rounded-sm print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none print:rounded-none flex flex-col justify-between ${
          currentLang === 'ta' ? 'font-sans' : 'font-sans'
        }`}
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          {/* Header Section */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              {/* Company Info */}
              <div className="flex items-start gap-4">
                {companySettings.logoUrl && (
                  <img
                    src={companySettings.logoUrl}
                    alt={companySettings.name || 'HI ONE TECH'}
                    className="h-16 w-auto max-w-[140px] object-contain shrink-0"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-black text-slate-950 tracking-tight uppercase m-0 leading-tight">
                    {companySettings.name || 'HI ONE TECH'}
                  </h1>
                  <p className="text-xs text-blue-700 font-semibold tracking-wider uppercase mt-0.5 mb-1.5">
                    {t.brandTagline}
                  </p>
                  {companySettings.address && (
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed max-w-sm">
                      {companySettings.address}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                    {companySettings.phone && <span><strong>Ph:</strong> {companySettings.phone}</span>}
                    {companySettings.email && <span><strong>Email:</strong> {companySettings.email}</span>}
                    {companySettings.gstin && <span><strong>GSTIN:</strong> {companySettings.gstin}</span>}
                  </div>
                </div>
              </div>

              {/* Quotation Title & Number Box */}
              <div className="sm:text-right shrink-0 w-full sm:w-auto bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 border-slate-200">
                <div className="inline-block sm:block px-3 py-1 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-md mb-2">
                  {t.quotationTitle}
                </div>
                <div className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                  {quotationNumber}
                </div>
                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                  <div>
                    <span className="font-medium">{t.dateLabel}:</span> {formatDate(date)}
                  </div>
                  {validUntil && (
                    <div>
                      <span className="font-medium">{t.validUntilLabel}:</span> {formatDate(validUntil)}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">{t.status}:</span>{' '}
                    <span className="uppercase font-semibold text-[11px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-800">
                      {status === 'final' ? t.statusFinal : t.statusDraft}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Site Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs bg-slate-50/80 p-4 rounded-lg border border-slate-200 print:bg-white print:border-slate-300">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {t.billTo}
              </span>
              <div className="font-bold text-slate-900 text-sm mb-1">{customerName || '—'}</div>
              {phone && <div className="text-slate-700"><strong>Ph:</strong> {phone}</div>}
              {location && <div className="text-slate-700"><strong>Location:</strong> {location}</div>}
              {reference && <div className="text-slate-500 mt-1 italic">Ref: {reference}</div>}
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {t.projectSite}
              </span>
              <div className="text-slate-700 whitespace-pre-line leading-relaxed">
                {siteAddress || location || '—'}
              </div>
            </div>
          </div>

          {/* Work Items Table */}
          <div className="mb-6">
            <table className="w-full text-left text-xs border-collapse print-table">
              <thead>
                <tr className="border-y-2 border-slate-900 bg-slate-100 text-slate-900 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-2 text-center w-8">#</th>
                  <th className="py-2.5 px-3">{t.itemDescription}</th>
                  <th className="py-2.5 px-2 text-center w-20">{t.itemQuantity}</th>
                  <th className="py-2.5 px-2 text-center w-24">{t.itemUnit}</th>
                  <th className="py-2.5 px-3 text-right w-24">{t.itemRate}</th>
                  <th className="py-2.5 px-3 text-right w-28">{t.itemAmount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400 italic">
                      {t.emptyItemsMessage}
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const lineTotal = calculateLineAmount(item.quantity, item.rate);
                    return (
                      <tr key={item.id || index} className="page-break-inside-avoid">
                        <td className="py-2 px-2 text-center font-mono text-slate-500">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-900 whitespace-pre-line leading-snug">
                          {item.description || '—'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-800">
                          {item.quantity || 0}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-600">
                          {unitLabel(item.unit, item.customUnit)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-800">
                          {formatCurrency(item.rate, false)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-slate-950">
                          {formatCurrency(lineTotal, false)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pricing Breakdown & Totals */}
          <div className="flex flex-col sm:flex-row justify-end mb-6 page-break-inside-avoid">
            <div className="w-full sm:w-80 text-xs space-y-1.5 border-t border-slate-200 sm:border-t-0 pt-3 sm:pt-0">
              <div className="flex justify-between py-1 text-slate-700">
                <span>{t.subtotal}:</span>
                <span className="font-mono font-semibold">{formatCurrency(totals.subtotal)}</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between py-1 text-emerald-800">
                  <span>
                    {t.discount} {pricing.discountType === 'percentage' && `(${pricing.discountValue}%)`}:
                  </span>
                  <span className="font-mono font-semibold">- {formatCurrency(totals.discountAmount)}</span>
                </div>
              )}

              {pricing.taxEnabled && (
                <div className="flex justify-between py-1 text-slate-700">
                  <span>Tax / GST ({pricing.taxRate || 0}%):</span>
                  <span className="font-mono font-semibold">+ {formatCurrency(totals.taxAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-y-2 border-slate-900 text-sm font-bold text-slate-950">
                <span>{t.grandTotal}:</span>
                <span className="font-mono text-base">{formatCurrency(totals.grandTotal)}</span>
              </div>

              {totals.advanceAmount > 0 && (
                <div className="flex justify-between py-1 text-slate-700">
                  <span>{t.advanceReceived}:</span>
                  <span className="font-mono font-medium">- {formatCurrency(totals.advanceAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 text-xs font-bold text-slate-900 bg-slate-50 px-2 rounded">
                <span>{t.balanceDue}:</span>
                <span className="font-mono">{formatCurrency(totals.balanceDue)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Signatures Section */}
        <div className="pt-6 border-t border-slate-300 page-break-inside-avoid">
          <div className="grid grid-cols-2 gap-8 text-xs text-slate-700 mb-6">
            <div className="border-t border-dashed border-slate-400 pt-2 text-center">
              <span className="font-semibold block">{t.customerSignature}</span>
              <span className="text-[10px] text-slate-400">Date & Acceptance</span>
            </div>
            <div className="border-t border-dashed border-slate-400 pt-2 text-center">
              <span className="font-semibold block">{t.authorizedSignature}</span>
              <span className="text-[10px] text-slate-400">{t.forCompany}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2">
            {t.thankYouMessage} • HI ONE TECH Waterproofing Quotation System
          </div>
        </div>
      </div>
    </div>
  );
}
