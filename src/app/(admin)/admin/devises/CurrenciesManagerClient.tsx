'use client';

import React, { useState } from 'react';
import { RefreshCw, Check, AlertCircle, Save } from 'lucide-react';

interface CurrencyItem {
  id?: string;
  code: string;
  name: string;
  symbol: string;
  rateToXOF: number;
  active: boolean;
  isPivot: boolean;
  flag: string;
}

export const CurrenciesManagerClient: React.FC<{ initialCurrencies: CurrencyItem[] }> = ({
  initialCurrencies,
}) => {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>(initialCurrencies);
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [editingRates, setEditingRates] = useState<Record<string, number>>({});

  const handleRateChange = (code: string, newRate: number) => {
    setEditingRates((prev) => ({ ...prev, [code]: newRate }));
  };

  const handleSaveRate = async (code: string) => {
    const rateToXOF = editingRates[code];
    if (rateToXOF === undefined) return;

    try {
      const res = await fetch('/api/devises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, rateToXOF }),
      });

      if (res.ok) {
        setCurrencies((prev) =>
          prev.map((c) => (c.code === code ? { ...c, rateToXOF } : c))
        );
        setMessage(`Taux pour ${code} mis à jour avec succès.`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleActive = async (code: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/devises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, active: !currentActive }),
      });

      if (res.ok) {
        setCurrencies((prev) =>
          prev.map((c) => (c.code === code ? { ...c, active: !currentActive } : c))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncApi = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/devises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await res.json();
      setMessage(data.message || 'Synchronisation terminée.');
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {message && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <button
          onClick={handleSyncApi}
          disabled={isSyncing}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser via API Exchangerate'}</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Devise</th>
              <th className="py-3.5 px-4">Symbole</th>
              <th className="py-3.5 px-4">Taux (1 XOF = ...)</th>
              <th className="py-3.5 px-4">Statut</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {currencies.map((currency) => {
              const currentRate =
                editingRates[currency.code] !== undefined
                  ? editingRates[currency.code]
                  : currency.rateToXOF;

              return (
                <tr
                  key={currency.code}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{currency.flag}</span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          {currency.name}
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">
                          {currency.code}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {currency.symbol}
                  </td>

                  <td className="py-3.5 px-4">
                    {currency.isPivot ? (
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                        1.0 (Pivot Référence)
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.00001"
                          value={currentRate}
                          onChange={(e) =>
                            handleRateChange(currency.code, parseFloat(e.target.value))
                          }
                          className="w-32 px-2.5 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        {editingRates[currency.code] !== undefined && (
                          <button
                            onClick={() => handleSaveRate(currency.code)}
                            className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            title="Enregistrer le nouveau taux"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {currency.isPivot ? (
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        Toujours Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleActive(currency.code, currency.active)}
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full transition-colors ${
                          currency.active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {currency.active ? 'Active' : 'Désactivée'}
                      </button>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-slate-400">
                      Ex: 10 000 FCFA ={' '}
                      <strong>
                        {currency.code === 'XOF'
                          ? '10 000 FCFA'
                          : `${Math.round(10000 * currentRate * 100) / 100} ${currency.code}`}
                      </strong>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
