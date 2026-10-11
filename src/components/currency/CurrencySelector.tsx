'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { ChevronDown, Coins } from 'lucide-react';

export const CurrencySelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentCurrency, currencies, setCurrency } = useCurrencyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = currencies.find((c) => c.code === currentCurrency) || currencies[0];

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
        title="Changer de devise"
      >
        <span className="text-sm">{selected?.flag}</span>
        <span>{selected?.code}</span>
        {!compact && <span className="text-slate-500 font-normal">({selected?.symbol})</span>}
        <ChevronDown className={`w-3.5 h-3.5 text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-blue-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            <span>Sélectionner une devise</span>
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => {
                  setCurrency(currency.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors ${
                  currency.code === currentCurrency
                    ? 'bg-blue-50 dark:bg-slate-800/80 font-bold text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{currency.flag}</span>
                  <div>
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5">({currency.symbol})</span>
                  </div>
                </div>
                {currency.isPivot && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                    Pivot
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
