'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { supportedLocales, Locale } from '@/lib/i18n';
import { ChevronDown, Globe } from 'lucide-react';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentLocale, setLocale } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = supportedLocales.find((l) => l.code === currentLocale) || supportedLocales[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-slate-700 hover:bg-blue-100 transition-colors focus:outline-none"
        title="Changer de langue"
      >
        <span className="text-sm">{selected.flag}</span>
        <span>{compact ? selected.code.toUpperCase() : selected.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-blue-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Langue / Gbe</span>
          </div>

          <div className="py-1">
            {supportedLocales.map((loc) => (
              <button
                key={loc.code}
                type="button"
                onClick={() => {
                  setLocale(loc.code as Locale);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors ${
                  loc.code === currentLocale
                    ? 'bg-blue-50 dark:bg-slate-800/80 font-bold text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-base">{loc.flag}</span>
                <span>{loc.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
