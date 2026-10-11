'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, formatFCFA } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, getSubtotalXOF, getTotalItems } = useCartStore();
  const { currentCurrency, convert } = useCurrencyStore();
  const { currentLocale } = useLanguageStore();

  if (!isOpen) return null;

  const subtotalXOF = getSubtotalXOF();
  const subtotalClient = convert(subtotalXOF);
  const totalItems = getTotalItems();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t(currentLocale, 'cart.title')} ({totalItems})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-10">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  {t(currentLocale, 'cart.empty')}
                </p>
                <p className="text-xs text-slate-500 mb-6 max-w-xs">
                  {t(currentLocale, 'header.deliveryNotice')}
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  {t(currentLocale, 'cart.startShopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const itemPriceClient = convert(item.priceXOF);
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden relative flex-shrink-0">
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

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {item.name}
                          </h4>
                          {item.variantName && (
                            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                              {item.variantName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs font-bold text-blue-900 dark:text-blue-300">
                              {formatCurrency(itemPriceClient * item.quantity, currentCurrency)}
                            </p>
                            {currentCurrency !== 'XOF' && (
                              <p className="text-[10px] text-slate-400">
                                {formatFCFA(item.priceXOF * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-300 hover:text-red-500 self-start p-1 transition-colors"
                        title={t(currentLocale, 'common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500 font-medium">
                  {t(currentLocale, 'cart.subtotal')}
                </span>
                <div className="text-right">
                  <span className="text-lg font-black text-blue-900 dark:text-blue-300">
                    {formatCurrency(subtotalClient, currentCurrency)}
                  </span>
                  {currentCurrency !== 'XOF' && (
                    <span className="block text-[11px] text-slate-400">
                      Réf: {formatFCFA(subtotalXOF)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                {t(currentLocale, 'cart.shippingNotice')}
              </p>

              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-xs uppercase tracking-wider"
              >
                <span>{t(currentLocale, 'cart.proceedToCheckout')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
