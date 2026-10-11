'use client';

import React from 'react';
import Link from 'next/link';
import { MahugnonLogo } from '../brand/MahugnonLogo';
import { useLanguageStore } from '@/store/useLanguageStore';
import { t } from '@/lib/i18n';
import { PhoneCall, ShieldCheck, Truck, RefreshCw, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentLocale } = useLanguageStore();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* 4 Piliers de Confiance Béninoise */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Rappel Téléphonique</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chaque commande est confirmée par téléphone ou WhatsApp avant expédition.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Paiement à la Livraison</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Réglez en mains propres : Espèces, MTN MoMo, Moov Money ou Wave après vérification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Livraison Express</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zémidjan rapide à Cotonou et Calavi, expéditions sécurisées dans tout le Bénin.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-400 flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">Bénin & Sous-région</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Présent à Cotonou, Porto-Novo, Parakou, Lomé, Lagos et Abidjan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liens et Coordonnées */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <MahugnonLogo size="md" />
          <p className="text-xs text-slate-400 leading-relaxed">
            {t(currentLocale, 'common.tagline')}
          </p>
          <p className="text-xs text-blue-400 font-semibold">
            Siège : Cotonou, République du Bénin 🇧🇯
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors">
                {t(currentLocale, 'nav.home')}
              </Link>
            </li>
            <li>
              <Link href="/boutique/mahugnon-officiel" className="hover:text-blue-400 transition-colors">
                {t(currentLocale, 'nav.shops')}
              </Link>
            </li>
            <li>
              <Link href="/fidelite" className="hover:text-blue-400 transition-colors">
                {t(currentLocale, 'nav.loyalty')}
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-blue-400 transition-colors">
                {t(currentLocale, 'header.myWishlist')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Informations & Confiance</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/boutique/mahugnon-officiel/page/livraison-et-paiement" className="hover:text-blue-400 transition-colors">
                Modalités de Livraison & Paiement
              </Link>
            </li>
            <li>
              <Link href="/boutique/mahugnon-officiel/page/a-propos" className="hover:text-blue-400 transition-colors">
                À Propos de MAHUGNON
              </Link>
            </li>
            <li>
              <span className="text-slate-400">Paiements acceptés : MTN MoMo, Moov Money, Wave, Espèces</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Contact & Support</h4>
          <p className="text-xs text-slate-400 mb-2">
            Notre équipe commerciale vous répond 7j/7 de 8h à 20h.
          </p>
          <a
            href="https://wa.me/22997000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow"
          >
            WhatsApp : +229 97 00 00 00
          </a>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} MAHUGNON Bénin. {t(currentLocale, 'footer.rights')}</p>
      </div>
    </footer>
  );
};
