import React from 'react';
import { User, MapPin, Phone, Calendar, Hash, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function CustomerDetails({
  formData,
  onChange,
  t,
  errors = {}
}) {
  const handleInputChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quotation Metadata Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 lg:col-span-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Hash className="w-4 h-4 text-blue-600" />
              <span>{t.quotationDetails}</span>
            </div>
            {/* Status Badge Toggle */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-medium">
              <button
                type="button"
                onClick={() => handleInputChange('status', 'draft')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  formData.status === 'draft'
                    ? 'bg-amber-100 text-amber-800 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3 h-3" />
                {t.statusDraft}
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('status', 'final')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                  formData.status === 'final'
                    ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {t.statusFinal}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Quotation Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                {t.quotationNumber}
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={formData.quotationNumber || ''}
                  className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold tracking-wider text-sm font-mono cursor-not-allowed select-all"
                  title="Auto-generated unique sequence number"
                />
              </div>
            </div>

            {/* Quotation Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                {t.quotationDate} *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Validity Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                {t.validityDate}
              </label>
              <input
                type="date"
                value={formData.validUntil || ''}
                onChange={(e) => handleInputChange('validUntil', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
          Format: HOT-YYYY-001 • Guaranteed sequential
        </div>
      </div>

      {/* Customer & Site Details Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 lg:col-span-2">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm pb-3 mb-4 border-b border-slate-100">
          <User className="w-4 h-4 text-blue-600" />
          <span>{t.customerDetails}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              {t.customerName} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.customerName || ''}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder={t.customerNamePlaceholder}
              className={`w-full px-3 py-2 border rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.customerName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errors.customerName && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.customerName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              {t.phoneNumber} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t.phoneNumberPlaceholder}
                className={`w-full px-3 py-2 border rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.phone ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Project Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              {t.projectLocation} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={t.projectLocationPlaceholder}
                className={`w-full px-3 py-2 border rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.location ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                }`}
              />
            </div>
            {errors.location && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.location}</p>
            )}
          </div>

          {/* Customer Reference */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              {t.customerReference}
            </label>
            <input
              type="text"
              value={formData.reference || ''}
              onChange={(e) => handleInputChange('reference', e.target.value)}
              placeholder={t.customerReferencePlaceholder}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Site Address (full width) */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              {t.siteAddress}
            </label>
            <textarea
              rows="2"
              value={formData.siteAddress || ''}
              onChange={(e) => handleInputChange('siteAddress', e.target.value)}
              placeholder={t.siteAddressPlaceholder}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
