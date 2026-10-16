import React from 'react';
import { Plus, Trash2, Copy, Layers, AlertCircle } from 'lucide-react';
import { calculateLineAmount } from '../utils/calculations';
import { formatCurrency } from '../utils/formatting';

export default function WorkItemsTable({
  items = [],
  onChange,
  t,
  errors = {}
}) {
  const handleAddItem = () => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      description: '',
      quantity: '',
      unit: 'sq.ft',
      customUnit: '',
      rate: ''
    };
    onChange([...items, newItem]);
  };

  const handleUpdateItem = (id, field, value) => {
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const handleDeleteItem = (id) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleDuplicateItem = (itemToDup) => {
    const duplicate = {
      ...itemToDup,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };
    const index = items.findIndex(i => i.id === itemToDup.id);
    const newItems = [...items];
    newItems.splice(index + 1, 0, duplicate);
    onChange(newItems);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{t.workItems}</h3>
            <span className="text-xs text-slate-500">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addItem}</span>
        </button>
      </div>

      {errors.items && (
        <div className="p-3 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.items}</span>
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-slate-600 text-sm font-medium mb-1">{t.emptyItemsMessage}</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Add terrace waterproofing, bathroom coating, crack injection, basement slurry, or external wall treatment.
          </p>
          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addItem}</span>
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-12">{t.itemSlNo}</th>
                <th className="py-3 px-3 min-w-[240px]">{t.itemDescription} *</th>
                <th className="py-3 px-3 w-32">{t.itemQuantity} *</th>
                <th className="py-3 px-3 w-36">{t.itemUnit}</th>
                <th className="py-3 px-3 w-36">{t.itemRate} *</th>
                <th className="py-3 px-3 text-right w-40">{t.itemAmount}</th>
                <th className="py-3 px-3 text-center w-24">{t.itemActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item, index) => {
                const lineAmount = calculateLineAmount(item.quantity, item.rate);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* S.No */}
                    <td className="py-3 px-3 text-center font-mono text-xs text-slate-400 select-none">
                      {index + 1}
                    </td>

                    {/* Description */}
                    <td className="py-2 px-3">
                      <textarea
                        rows="2"
                        required
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder={t.descriptionPlaceholder}
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 resize-none font-normal"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="py-2 px-3 align-top">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                        placeholder="0"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                      />
                    </td>

                    {/* Unit */}
                    <td className="py-2 px-3 align-top space-y-1">
                      <select
                        value={item.unit}
                        onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-300 rounded-md text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="sq.ft">{t.units['sq.ft']}</option>
                        <option value="sq.m">{t.units['sq.m']}</option>
                        <option value="running ft">{t.units['running ft']}</option>
                        <option value="number">{t.units['number']}</option>
                        <option value="other">{t.units['other']}</option>
                      </select>

                      {item.unit === 'other' && (
                        <input
                          type="text"
                          value={item.customUnit || ''}
                          onChange={(e) => handleUpdateItem(item.id, 'customUnit', e.target.value)}
                          placeholder={t.customUnitPlaceholder}
                          className="w-full px-2 py-1 border border-slate-300 rounded-md text-xs"
                        />
                      )}
                    </td>

                    {/* Rate */}
                    <td className="py-2 px-3 align-top">
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          required
                          value={item.rate}
                          onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-6 pr-2 py-1.5 border border-slate-300 rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                        />
                      </div>
                    </td>

                    {/* Line Amount */}
                    <td className="py-3 px-3 text-right align-top">
                      <span className="font-semibold text-slate-900 font-mono text-sm block pt-1">
                        {formatCurrency(lineAmount)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-center align-top">
                      <div className="flex items-center justify-center gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicateItem(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Duplicate item"
                          aria-label="Duplicate item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
