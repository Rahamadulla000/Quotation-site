import React from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ currentLang, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(currentLang === 'en' ? 'ta' : 'en')}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white/90 hover:bg-white text-slate-800 text-sm font-medium shadow-xs transition-all hover:border-slate-400 cursor-pointer"
      title="Switch Language / மொழியை மாற்றுக"
      aria-label="Switch Language"
    >
      <Globe className="w-4 h-4 text-sky-600" />
      <span>{currentLang === 'en' ? 'தமிழ்' : 'English'}</span>
      <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
        {currentLang}
      </span>
    </button>
  );
}
