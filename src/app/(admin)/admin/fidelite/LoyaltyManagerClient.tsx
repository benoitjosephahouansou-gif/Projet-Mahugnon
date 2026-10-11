'use client';

import React, { useState } from 'react';
import { formatFCFA, waLink } from '@/lib/utils';
import { Award, MessageCircle, Plus, Minus, X } from 'lucide-react';

export const LoyaltyManagerClient: React.FC<{ initialMembers: any[] }> = ({ initialMembers }) => {
  const [members, setMembers] = useState<any[]>(initialMembers);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [pointsAdjust, setPointsAdjust] = useState<number>(100);
  const [adjustReason, setAdjustReason] = useState('Geste commercial MAHUGNON');

  const tierColors: Record<string, string> = {
    BRONZE: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    ARGENT: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    OR: 'bg-amber-300 text-amber-900',
    PLATINE: 'bg-blue-600 text-white',
  };

  const handleApplyPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id
          ? { ...m, currentPoints: Math.max(0, m.currentPoints + pointsAdjust) }
          : m
      )
    );
    setSelectedMember(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Membre</th>
                <th className="py-3.5 px-4">WhatsApp</th>
                <th className="py-3.5 px-4">Points</th>
                <th className="py-3.5 px-4">Palier</th>
                <th className="py-3.5 px-4">Total Acheté (FCFA)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {m.fullName}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {m.phone}
                  </td>

                  <td className="py-3.5 px-4 font-black text-sm text-blue-900 dark:text-blue-300">
                    {m.currentPoints} pts
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        tierColors[m.tier] || 'bg-slate-100'
                      }`}
                    >
                      {m.tier}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    {formatFCFA(m.totalSpentXOF)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedMember(m)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs transition-colors"
                      >
                        Ajuster points
                      </button>
                      <a
                        href={waLink(m.phone, `Bonjour ${m.fullName}, vous disposez actuellement de ${m.currentPoints} points sur MAHUGNON !`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-current" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajustement Points */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Ajuster les points fidélité
              </h3>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Membre : <strong>{selectedMember.fullName}</strong> ({selectedMember.currentPoints} pts actuels).
            </p>

            <form onSubmit={handleApplyPoints} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Variation de points (ex: 200 ou -100)
                </label>
                <input
                  type="number"
                  required
                  value={pointsAdjust}
                  onChange={(e) => setPointsAdjust(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Motif de l'ajustement
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
