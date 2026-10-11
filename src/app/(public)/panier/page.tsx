'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, formatFCFA } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotalXOF, clearCart } = useCartStore();
  const { currentCurrency, convert } = useCurrencyStore();
  const { currentLocale } = useLanguageStore();

  const subtotalXOF = getSubtotalXOF();
  const subtotalClient = convert(subtotalXOF);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <span>{t(currentLocale, 'cart.title')}</span>
            <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold px-2.5 py-0.5 rounded-full">
              {items.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vérifiez vos articles avant de valider. Aucun paiement par carte n'est requis.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 font-bold"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t(currentLocale, 'cart.clearCart')}</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {t(currentLocale, 'cart.empty')}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t(currentLocale, 'header.deliveryNotice')}
          </p>
          <Link
            href="/boutique/mahugnon-officiel"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            <span>{t(currentLocale, 'cart.startShopping')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-sm">
              {items.map((item) => {
                const itemPriceClient = convert(item.priceXOF);
                return (
                  <div key={item.id} className="p-4 sm:p-5 flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                          IMG
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {item.name}
                      </h3>
                      {item.variantName && (
                        <p className="text-xs text-blue-600 font-medium">{item.variantName}</p>
                      )}
                      <div className="mt-1">
                        <span className="font-black text-sm text-blue-900 dark:text-blue-300">
                          {formatCurrency(itemPriceClient, currentCurrency)}
                        </span>
                        {currentCurrency !== 'XOF' && (
                          <span className="text-[11px] text-slate-400 ml-2">
                            ({formatFCFA(item.priceXOF)})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contrôle Quantité */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-slate-200 text-slate-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Après avoir validé, un commercial vous appellera pour ajuster les détails de livraison si besoin. Vous ne réglez rien maintenant.
              </p>
            </div>
          </div>

          {/* Résumé Panier */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
                {t(currentLocale, 'cart.subtotal')}
              </h2>

              <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Sous-total articles :</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(subtotalClient, currentCurrency)}
                  </span>
                </div>
                {currentCurrency !== 'XOF' && (
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Référence FCFA :</span>
                    <span>{formatFCFA(subtotalXOF)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">{t(currentLocale, 'cart.shipping')} :</span>
                  <span className="text-blue-600 font-bold">Calculée au checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">Total estimé :</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-900 dark:text-blue-200">
                    {formatCurrency(subtotalClient, currentCurrency)}
                  </span>
                  {currentCurrency !== 'XOF' && (
                    <span className="block text-[11px] text-slate-400">
                      Réf: {formatFCFA(subtotalXOF)}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-xs uppercase tracking-wider"
              >
                <span>{t(currentLocale, 'cart.proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
