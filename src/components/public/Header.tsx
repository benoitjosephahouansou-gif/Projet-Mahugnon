'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MahugnonLogo } from '../brand/MahugnonLogo';
import { CurrencySelector } from '../currency/CurrencySelector';
import { LanguageSelector } from '../language/LanguageSelector';
import { CartDrawer } from './CartDrawer';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { t } from '@/lib/i18n';
import { Heart, ShoppingBag, Menu, X, PhoneCall, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalCartItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { currentLocale } = useLanguageStore();

  return (
    <>
      {/* Barre d'annonce supérieure béninoise */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white text-[11px] py-1.5 px-4 border-b border-blue-700/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span className="font-medium tracking-wide">
              {t(currentLocale, 'header.deliveryNotice')} • 🇧🇯 Bénin & Sous-région
            </span>
          </div>

          <div className="flex items-center gap-3">
            <CurrencySelector compact />
            <LanguageSelector compact />
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <MahugnonLogo size="md" />
          </div>

          {/* Navigation Liens Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t(currentLocale, 'nav.home')}
            </Link>
            <Link
              href="/boutique/mahugnon-officiel"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {t(currentLocale, 'nav.shops')}
            </Link>
            <Link
              href="/fidelite"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <span>{t(currentLocale, 'nav.loyalty')}</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded-full font-bold">
                PROMO
              </span>
            </Link>
            <Link
              href="/admin/login"
              className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
            >
              {t(currentLocale, 'nav.admin')}
            </Link>
          </nav>

          {/* Boutons Actions (Wishlist + Panier + Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors"
              title={t(currentLocale, 'header.myWishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Bouton Panier interactif */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{t(currentLocale, 'common.cart')}</span>
              <span className="bg-white text-blue-700 text-[11px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {totalCartItems}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Déroulant Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              {t(currentLocale, 'nav.home')}
            </Link>
            <Link
              href="/boutique/mahugnon-officiel"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              {t(currentLocale, 'nav.shops')}
            </Link>
            <Link
              href="/fidelite"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              {t(currentLocale, 'nav.loyalty')}
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800 dark:text-slate-100"
            >
              {t(currentLocale, 'header.myWishlist')} ({wishlistCount})
            </Link>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Accès Administrateur :</span>
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs text-blue-600 font-bold"
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Drawer Panier */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
