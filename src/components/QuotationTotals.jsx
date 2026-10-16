import React from 'react';
import { Percent, IndianRupee, ShieldAlert, Receipt } from 'lucide-react';
import { formatCurrency } from '../utils/formatting';

export default function QuotationTotals({
  totals,
  pricingData,
  onChange,
  t
}) {
  const handleUpdate = (field, value) => {
    onChange({ ...pricingData, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
      <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm pb-3 mb-4 border-b border-slate-100">
        <Receipt className="w-4 h-4 text-blue-600" />
        <span>{t.pricingSummary}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Inputs & Toggles */}
        <div className="space-y-4">
          {/* Discount Controls */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                {t.discount}
              </label>
              <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 text-xs">
                <button
                  type="button"
                  onClick={() => handleUpdate('discountType', 'fixed')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    pricingData.discountType === 'fixed'
                      ? 'bg-white shadow-xs font-semibold text-slate-900'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  ₹ Fixed
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdate('discountType', 'percentage')}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    pricingData.discountType === 'percentage'
                      ? 'bg-white shadow-xs font-semibold text-slate-900'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  % Percentage
                </button>
              </div>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">
                {pricingData.discountType === 'percentage' ? '%' : '₹'}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                max={pricingData.discountType === 'percentage' ? 100 : totals.subtotal}
                value={pricingData.discountValue || ''}
                onChange={(e) => handleUpdate('discountValue', e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Tax/GST Controls */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pricingData.taxEnabled || false}
                  onChange={(e) => handleUpdate('taxEnabled', e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">{t.enableTax}</span>
              </label>
              {pricingData.taxEnabled && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500">{t.taxRate}:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={pricingData.taxRate || ''}
                    onChange={(e) => handleUpdate('taxRate', e.target.value)}
                    placeholder="18"
                    className="w-16 px-2 py-0.5 border border-slate-300 rounded text-xs font-mono text-center focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-500">%</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{t.taxNotice}</span>
            </p>
          </div>

          {/* Advance Received */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.advanceReceived}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="any"
                max={totals.grandTotal}
                value={pricingData.advance || ''}
                onChange={(e) => handleUpdate('advance', e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Calculation Totals Box */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="space-y-2.5 text-sm">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-slate-600">
              <span>{t.subtotal}</span>
              <span className="font-mono font-medium">{formatCurrency(totals.subtotal)}</span>
            </div>

            {/* Discount */}
            {totals.discountAmount > 0 && (
              <div className="flex justify-between items-center text-emerald-700">
                <span className="text-xs">
                  {t.discount} {pricingData.discountType === 'percentage' && `(${pricingData.discountValue}%)`}
                </span>
                <span className="font-mono font-medium">- {formatCurrency(totals.discountAmount)}</span>
              </div>
            )}

            {/* Taxable Amount */}
            {pricingData.taxEnabled && (
              <div className="flex justify-between items-center text-slate-500 text-xs pt-1 border-t border-slate-200/60">
                <span>{t.taxableAmount}</span>
                <span className="font-mono">{formatCurrency(totals.taxableAmount)}</span>
              </div>
            )}

            {/* Tax */}
            {pricingData.taxEnabled && (
              <div className="flex justify-between items-center text-slate-600 text-xs">
                <span>GST / Tax ({pricingData.taxRate || 0}%)</span>
                <span className="font-mono">+ {formatCurrency(totals.taxAmount)}</span>
              </div>
            )}

            {/* Grand Total */}
            <div className="pt-3 border-t-2 border-slate-300 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">{t.grandTotal}</span>
              <span className="text-lg font-bold font-mono text-blue-700">
                {formatCurrency(totals.grandTotal)}
              </span>
            </div>

            {/* Advance Received */}
            {totals.advanceAmount > 0 && (
              <div className="flex justify-between items-center text-slate-600 text-xs pt-1">
                <span>{t.advanceReceived}</span>
                <span className="font-mono text-emerald-600 font-medium">
                  - {formatCurrency(totals.advanceAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Balance Due Highlight Box */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center bg-white p-3 rounded-lg border">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                {t.balanceDue}
              </span>
              <span className="text-[10px] text-slate-400">
                {totals.balanceDue === 0 ? 'Full payment received' : 'Payable on completion'}
              </span>
            </div>
            <span
              className={`text-base font-bold font-mono ${
                totals.balanceDue > 0 ? 'text-amber-700' : 'text-emerald-600'
              }`}
            >
              {formatCurrency(totals.balanceDue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
