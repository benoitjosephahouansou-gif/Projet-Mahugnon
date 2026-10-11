'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, formatFCFA, waLink } from '@/lib/utils';
import { calculatePointsEarned } from '@/lib/loyalty';
import { t } from '@/lib/i18n';
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Share2,
  Award,
  Truck,
  Plus,
  Minus,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: any;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { currentCurrency, convert } = useCurrencyStore();
  const { currentLocale } = useLanguageStore();

  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]?.url ||
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
  );
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const isFavorited = isInWishlist(product.id);
  const effectivePriceXOF = selectedVariant?.priceXOF || product.priceXOF;
  const convertedPrice = convert(effectivePriceXOF);
  const points = calculatePointsEarned(effectivePriceXOF * quantity);

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      shopId: product.shopId,
      name: product.name,
      slug: product.slug,
      priceXOF: effectivePriceXOF,
      quantity,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      imageUrl: selectedImage,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const shareText = `Bonjour, je suis intéressé par "${product.name}" sur MAHUGNON (${typeof window !== 'undefined' ? window.location.href : ''}).`;
  const whatsappShareUrl = waLink(product.shop?.whatsappNumber || '+22997000000', shareText);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      {/* Galerie Images */}
      <div className="space-y-4">
        <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 relative shadow-sm">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isPromo && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
              {t(currentLocale, 'product.promoBadge')}
            </span>
          )}
        </div>

        {/* Miniatures */}
        {product.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img: any) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  selectedImage === img.url
                    ? 'border-blue-600 scale-95 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Détails & Achat */}
      <div className="space-y-6">
        <div>
          {product.category && (
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {product.name}
          </h1>

          {product.sku && (
            <p className="text-xs text-slate-400 mt-1">
              SKU : <span className="font-mono">{product.sku}</span>
            </p>
          )}
        </div>

        {/* Prix Multi-devises */}
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-blue-900 dark:text-blue-200">
              {formatCurrency(convertedPrice, currentCurrency)}
            </span>
            {product.compareAtPriceXOF && (
              <span className="text-base text-slate-400 line-through">
                {formatCurrency(convert(product.compareAtPriceXOF), currentCurrency)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-blue-100/50 dark:border-slate-800">
            <span>
              {t(currentLocale, 'common.referencePrice')}{' '}
              <strong className="text-slate-700 dark:text-slate-300">
                {formatFCFA(effectivePriceXOF)}
              </strong>
            </span>
            {points > 0 && (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>+{points} pts de fidélité</span>
              </span>
            )}
          </div>
        </div>

        {/* Variantes */}
        {product.variants?.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t(currentLocale, 'product.variants')} :
            </label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedVariant?.id === v.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantité & Boutons d'action */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t(currentLocale, 'cart.quantity')} :
            </span>
            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-black">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-blue-300 font-black text-xs uppercase tracking-wider transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t(currentLocale, 'product.addToCart')}</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>{t(currentLocale, 'product.buyNow')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                toggleItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  priceXOF: effectivePriceXOF,
                  imageUrl: selectedImage,
                  shopSlug: product.shop?.slug,
                })
              }
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors ${
                isFavorited
                  ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-950/40'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              <span>{isFavorited ? 'Favori enregistré' : 'Coup de cœur'}</span>
            </button>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{t(currentLocale, 'product.shareWhatsApp')}</span>
            </a>
          </div>
        </div>

        {/* Box Confiance & Garanties Bénin */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-100">
                Rappel garanti sous 15 minutes :
              </strong>{' '}
              Notre équipe vous contacte directement pour convenir du lieu de rendez-vous.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-100">
                Paiement à la livraison :
              </strong>{' '}
              Espèces ou Mobile Money (MTN MoMo, Moov Money, Wave) après vérification du colis.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="text-slate-900 dark:text-slate-100">
                Zones desservies :
              </strong>{' '}
              Cotonou par quartier, Calavi, Porto-Novo, Parakou et toute la sous-région.
            </div>
          </div>
        </div>

        {/* Description complète */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t(currentLocale, 'product.description')}
          </h3>
          <div
            className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    </div>
  );
};
