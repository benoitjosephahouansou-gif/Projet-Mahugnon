'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatCurrency, formatFCFA, waLink } from '@/lib/utils';
import { t } from '@/lib/i18n';
import {
  PhoneCall,
  CheckCircle,
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
  MessageCircle,
  Phone,
  AlertCircle,
  Clock,
} from 'lucide-react';

const BENIN_CITIES = [
  'Cotonou',
  'Abomey-Calavi',
  'Porto-Novo',
  'Ouidah',
  'Bohicon',
  'Parakou',
  'Natitingou',
  'Djougou',
  'Kandi',
  'Lokossa',
  'Savalou',
  'Lomé (Togo)',
  'Lagos (Nigeria)',
  'Abidjan (Côte d\'Ivoire)',
];

const COTONOU_DISTRICTS = [
  'Akpakpa',
  'Cadjehoun / Haie Vive',
  'Fidjrossè',
  'Gbégamey / Sainte-Rita',
  'Agla / Aïbatin',
  'Kouhounou / Stade',
  'Zogbo / Ménontin',
  'Marjorelle / Guinkomey',
  'Godomey (Calavi)',
  'Calavi Centre',
  'Autre quartier',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotalXOF, clearCart } = useCartStore();
  const { currentCurrency, convert } = useCurrencyStore();
  const { currentLocale } = useLanguageStore();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+229 ');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [city, setCity] = useState('Cotonou');
  const [district, setDistrict] = useState('Akpakpa');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const subtotalXOF = getSubtotalXOF();
  const subtotalClient = convert(subtotalXOF);

  // Estimation des frais de livraison selon la ville
  const getShippingFeeXOF = (selectedCity: string) => {
    switch (selectedCity) {
      case 'Cotonou':
        return 1500;
      case 'Abomey-Calavi':
        return 2000;
      case 'Porto-Novo':
        return 2500;
      case 'Ouidah':
        return 3000;
      case 'Bohicon':
        return 3500;
      case 'Parakou':
        return 5000;
      case 'Natitingou':
      case 'Djougou':
        return 6000;
      case 'Lomé (Togo)':
        return 7000;
      case 'Lagos (Nigeria)':
        return 10000;
      case 'Abidjan (Côte d\'Ivoire)':
        return 15000;
      default:
        return 2000;
    }
  };

  const shippingFeeXOF = getShippingFeeXOF(city);
  const shippingFeeClient = convert(shippingFeeXOF);
  const totalXOF = subtotalXOF + shippingFeeXOF;
  const totalClient = convert(totalXOF);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Votre panier est vide.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setErrorMsg('Veuillez entrer un numéro WhatsApp valide.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        shopId: items[0]?.shopId || 'default',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        secondaryPhone: secondaryPhone.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        city,
        district,
        address: address.trim(),
        landmark: landmark.trim() || undefined,
        notes: notes.trim() || undefined,
        promoCode: promoCode.trim() || undefined,
        currentCurrency,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          variantName: i.variantName,
          quantity: i.quantity,
          priceXOF: i.priceXOF,
          imageUrl: i.imageUrl,
        })),
      };

      const res = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement');
      }

      setOrderSuccess(data.order);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Une erreur est survenue lors de la validation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Écran de Confirmation Réussie
  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-in fade-in">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
              {t(currentLocale, 'orderStatus.NEW_TO_CALL')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {t(currentLocale, 'checkout.orderSuccessTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
              {t(currentLocale, 'checkout.orderSuccessMessage')}
            </p>
          </div>

          {/* Numéro et détails commande */}
          <div className="p-4 sm:p-6 bg-blue-50/60 dark:bg-slate-800/60 rounded-2xl border border-blue-100 dark:border-slate-700 max-w-md mx-auto text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">{t(currentLocale, 'checkout.orderNumber')} :</span>
              <span className="font-mono font-black text-blue-900 dark:text-blue-300">
                {orderSuccess.orderNumber}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-semibold">Montant à régler à la livraison :</span>
              <span className="font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(orderSuccess.totalcurrentCurrency, orderSuccess.currentCurrency)}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Référence FCFA :</span>
              <span>{formatFCFA(orderSuccess.totalXOF)}</span>
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-semibold">Mode de paiement :</span>
              <span className="font-bold text-emerald-600">Espèces ou MTN MoMo / Wave sur place</span>
            </div>
          </div>

          {/* Boutons d'action immédiate pour le client */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={orderSuccess.waDirectUrl || waLink('+22997000000')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t(currentLocale, 'checkout.chatWhatsApp')}</span>
            </a>

            <a
              href={`tel:${orderSuccess.shopWhatsapp || '+22997000000'}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>{t(currentLocale, 'checkout.callStore')}</span>
            </a>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Panier Vide
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Votre panier est vide
        </h2>
        <p className="text-xs text-slate-500">
          Veuillez ajouter des articles avant de valider votre commande.
        </p>
        <Link
          href="/boutique/mahugnon-officiel"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow"
        >
          <span>Voir le catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // 3. Formulaire de Commande 1-Page
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          {t(currentLocale, 'checkout.title')}
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xl">
          {t(currentLocale, 'checkout.subtitle')}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Colonne Gauche : Coordonnées Client & Localisation Bénin */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              {t(currentLocale, 'checkout.customerInfo')}
            </h2>

            {/* Nom & Téléphone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t(currentLocale, 'checkout.fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Koffi Dossou"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t(currentLocale, 'checkout.whatsappNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+229 97 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {t(currentLocale, 'checkout.whatsappHelp')}
                </span>
              </div>
            </div>

            {/* Téléphone secondaire & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t(currentLocale, 'checkout.secondaryPhone')}
                </label>
                <input
                  type="tel"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  placeholder="Ex: +229 95 00 00 00"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email (Optionnel)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Ville & Quartier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t(currentLocale, 'checkout.city')} *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  {BENIN_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t(currentLocale, 'checkout.district')} *
                </label>
                {city === 'Cotonou' ? (
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                  >
                    {COTONOU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Précisez votre quartier"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                )}
              </div>
            </div>

            {/* Adresse & Point de repère */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t(currentLocale, 'checkout.address')} *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ex: Rue Pavée Sainte-Cécile, maison à étage barrière bleue"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t(currentLocale, 'checkout.landmark')}
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Ex: Derrière la pharmacie du Sacré-Cœur / En face du collège"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Remarques livreur */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t(currentLocale, 'checkout.notes')}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Merci d'appeler avant 12h. Paiement par MTN MoMo sur place."
                className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Colonne Droite : Récapitulatif Commande & Validation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              {t(currentLocale, 'checkout.summary')}
            </h2>

            {/* Liste abrégée des articles */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.quantity}x {item.name}
                    </p>
                    {item.variantName && (
                      <p className="text-[10px] text-blue-600">{item.variantName}</p>
                    )}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex-shrink-0">
                    {formatCurrency(convert(item.priceXOF * item.quantity), currentCurrency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Code Promo */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t(currentLocale, 'checkout.promoCode')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Ex: BIENVENUE10"
                  className="flex-1 px-3 py-2 rounded-xl text-xs uppercase font-bold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  {t(currentLocale, 'checkout.applyPromo')}
                </button>
              </div>
            </div>

            {/* Détails financiers */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t(currentLocale, 'cart.subtotal')} :</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(subtotalClient, currentCurrency)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Frais de livraison ({city}) :</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(shippingFeeClient, currentCurrency)}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                  Total à régler à la livraison :
                </span>
                <div className="text-right">
                  <span className="text-2xl font-black text-blue-900 dark:text-blue-200">
                    {formatCurrency(totalClient, currentCurrency)}
                  </span>
                  {currentCurrency !== 'XOF' && (
                    <span className="block text-[11px] text-slate-400 font-medium">
                      Réf: {formatFCFA(totalXOF)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bouton de validation de commande */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-black rounded-2xl shadow-xl shadow-blue-500/25 transition-all text-xs uppercase tracking-wider disabled:opacity-50 active:scale-95"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>
                {isSubmitting
                  ? t(currentLocale, 'checkout.submitting')
                  : t(currentLocale, 'checkout.submitOrder')}
              </span>
            </button>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Aucun paiement par carte n'est demandé. Paiement direct à la réception.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
