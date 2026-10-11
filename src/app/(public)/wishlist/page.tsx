'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, formatFCFA, waLink } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { Heart, ShoppingBag, Trash2, Share2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { currentCurrency, convert } = useCurrencyStore();
  const { currentLocale } = useLanguageStore();

  const handleShareWishlist = () => {
    if (items.length === 0) return;
    const text = `Bonjour, voici mes articles favoris sur MAHUGNON :\n` +
      items.map((i, idx) => `${idx + 1}. ${i.name} (${formatFCFA(i.priceXOF)})`).join('\n');
    window.open(waLink('+22997000000', text), '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <span>{t(currentLocale, 'header.myWishlist')}</span>
            <span className="text-sm bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300 font-bold px-2.5 py-0.5 rounded-full">
              {items.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Retrouvez tous vos articles préférés et commandez-les en un clic.
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWishlist}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager sur WhatsApp</span>
            </button>
            <button
              onClick={clearWishlist}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
            >
              Vider
            </button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-500 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Votre liste de souhaits est vide
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explorez notre catalogue et cliquez sur l'icône cœur pour conserver vos coups de cœur.
          </p>
          <Link
            href="/boutique/mahugnon-officiel"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            <span>Découvrir nos produits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const convertedPrice = convert(item.priceXOF);
            return (
              <div
                key={item.productId}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        IMG
                      </div>
                    )}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="absolute top-2.5 right-2.5 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full text-slate-400 hover:text-red-500 shadow-sm"
                      title="Retirer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <Link href={`/boutique/${item.shopSlug || 'mahugnon-officiel'}/produit/${item.productId}`}>
                      <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-blue-600">
                        {item.name}
                      </h3>
                    </Link>

                    <div>
                      <span className="text-sm font-black text-blue-900 dark:text-blue-300">
                        {formatCurrency(convertedPrice, currentCurrency)}
                      </span>
                      {currentCurrency !== 'XOF' && (
                        <span className="block text-[10px] text-slate-400">
                          Réf: {formatFCFA(item.priceXOF)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      addItem({
                        id: item.productId,
                        productId: item.productId,
                        shopId: 'default',
                        name: item.name,
                        slug: item.slug,
                        priceXOF: item.priceXOF,
                        quantity: 1,
                        imageUrl: item.imageUrl,
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t(currentLocale, 'product.addToCart')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
