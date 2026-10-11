'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, formatFCFA } from '@/lib/utils';
import { calculatePointsEarned } from '@/lib/loyalty';
import { t } from '@/lib/i18n';
import { Heart, ShoppingBag, Eye, Award } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    shopId: string;
    name: string;
    slug: string;
    priceXOF: number;
    compareAtPriceXOF?: number | null;
    isPromo?: boolean;
    images?: { url: string }[];
    category?: { name: string } | null;
    shop?: { slug: string } | null;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { currentCurrency, convert } = useCurrencyStore();
  const { currentLocale } = useLanguageStore();

  const isFavorited = isInWishlist(product.id);
  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80';
  const shopSlug = product.shop?.slug || 'mahugnon-officiel';
  const productUrl = `/boutique/${shopSlug}/produit/${product.id}`;

  const convertedPrice = convert(product.priceXOF);
  const convertedCompareAt = product.compareAtPriceXOF ? convert(product.compareAtPriceXOF) : null;
  const points = calculatePointsEarned(product.priceXOF);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Zone Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={productUrl} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges Flottants */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isPromo && (
            <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm tracking-wider">
              {t(currentLocale, 'product.promoBadge')}
            </span>
          )}
          {points > 0 && (
            <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-300" />
              <span>+{points} pts</span>
            </span>
          )}
        </div>

        {/* Bouton Coup de cœur Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              priceXOF: product.priceXOF,
              imageUrl,
              shopSlug,
            });
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-10 shadow-sm ${
            isFavorited
              ? 'bg-red-500 text-white'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-red-500'
          }`}
          title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Détails Produit */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block mb-1">
              {product.category.name}
            </span>
          )}
          <Link href={productUrl}>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Tarification Multi-devises */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-blue-900 dark:text-blue-300">
              {formatCurrency(convertedPrice, currentCurrency)}
            </span>
            {convertedCompareAt && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrency(convertedCompareAt, currentCurrency)}
              </span>
            )}
          </div>

          {currentCurrency !== 'XOF' && (
            <span className="block text-[11px] text-slate-400 font-medium">
              Réf: {formatFCFA(product.priceXOF)}
            </span>
          )}

          {/* Bouton Panier Rapide */}
          <button
            onClick={() => {
              addItem({
                id: product.id,
                productId: product.id,
                shopId: product.shopId,
                name: product.name,
                slug: product.slug,
                priceXOF: product.priceXOF,
                quantity: 1,
                imageUrl,
              });
            }}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 font-bold text-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t(currentLocale, 'product.addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
