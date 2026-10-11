'use client';

import React, { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { t } from '@/lib/i18n';
import { formatFCFA, formatDateFr } from '@/lib/utils';
import { Award, CheckCircle, Search, Gift, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function LoyaltyPage() {
  const { currentLocale } = useLanguageStore();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/fidelite?phone=${encodeURIComponent(phone.trim())}`);
      const data = await res.json();
      if (data.found) {
        setMemberData(data.member);
      } else {
        setMemberData(null);
      }
    } catch (e) {
      console.error(e);
      setMemberData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* En-tête Club Fidélité */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-wider">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Club Privilège MAHUGNON</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
          {t(currentLocale, 'loyalty.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {t(currentLocale, 'loyalty.subtitle')}
        </p>
      </div>

      {/* Recherche Solde de Points */}
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-md">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
          {t(currentLocale, 'loyalty.checkMyPoints')}
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Entrez votre numéro de téléphone WhatsApp pour afficher votre solde de points et vos avantages actuels.
        </p>

        <form onSubmit={handleLookup} className="flex gap-2">
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex: +229 97 11 22 33"
            className="flex-1 px-4 py-3 rounded-2xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>{isLoading ? 'Recherche...' : t(currentLocale, 'loyalty.check')}</span>
          </button>
        </form>

        {searched && (
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
            {memberData ? (
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {memberData.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">{memberData.phone}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-full uppercase">
                    Palier {memberData.tierName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100 dark:border-blue-900/50">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Solde actuel :</span>
                    <span className="text-xl font-black text-blue-900 dark:text-blue-200">
                      {memberData.currentPoints} pts
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Réduction permanente :</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {memberData.discountPercent}%
                    </span>
                  </div>
                </div>

                {memberData.freeShipping && (
                  <p className="text-xs text-blue-800 dark:text-blue-300 font-bold flex items-center gap-1 pt-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Livraison gratuite offerte sur toutes vos commandes !</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200">
                Aucun compte trouvé avec ce numéro. Passez votre première commande pour activer automatiquement votre compte fidélité !
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grille des 4 Paliers */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-center text-slate-900 dark:text-slate-100">
          {t(currentLocale, 'loyalty.tiers')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full inline-block">
                BRONZE
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                0 à 499 Points
              </h3>
              <p className="text-xs text-slate-500">
                Niveau de départ. Vos points s'accumulent dès le premier achat (1 pt / 1 000 FCFA).
              </p>
            </div>
            <p className="text-xs font-bold text-slate-600 pt-4">Remise : 0%</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full inline-block">
                ARGENT
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                500 à 1 499 Points
              </h3>
              <p className="text-xs text-slate-500">
                3% de remise immédiate sur l'ensemble du panier à chaque commande.
              </p>
            </div>
            <p className="text-xs font-bold text-blue-600 pt-4">Remise : 3% permanente</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-black text-amber-900 bg-amber-300 px-2.5 py-0.5 rounded-full inline-block">
                OR
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                1 500 à 4 999 Points
              </h3>
              <p className="text-xs text-slate-500">
                5% de réduction déduite automatiquement lors du passage en caisse.
              </p>
            </div>
            <p className="text-xs font-bold text-amber-600 pt-4">Remise : 5% permanente</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-black text-blue-900 bg-white px-2.5 py-0.5 rounded-full inline-block">
                PLATINE
              </span>
              <h3 className="text-base font-bold text-white">
                5 000+ Points
              </h3>
              <p className="text-xs text-blue-200">
                Le statut VIP suprême MAHUGNON. 10% de remise garantie + livraison toujours gratuite.
              </p>
            </div>
            <p className="text-xs font-bold text-amber-300 pt-4">
              Remise : 10% + Livraison Gratuite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
