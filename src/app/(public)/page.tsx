import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/public/ProductCard';
import { ArrowRight, ShoppingBag, ShieldCheck, Sparkles, Award, PhoneCall } from 'lucide-react';

export const revalidate = 60; // Revalidation ISR toutes les 60 secondes

export default async function HomePage() {
  // Récupération des produits actifs et des boutiques
  let products: any[] = [];
  let shops: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        shop: { select: { slug: true, name: true } },
      },
      take: 12,
      orderBy: { createdAt: 'desc' },
    });

    shops = await prisma.shop.findMany({
      where: { active: true },
      take: 3,
    });
  } catch (e) {
    console.warn('DB non connectée lors du rendu HomePage, fallback statique', e);
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Bleu MAHUGNON */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-800/80 border border-blue-600/50 text-blue-200 text-xs font-bold tracking-wide animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Marketplace E-commerce n°1 au Bénin & en Afrique de l'Ouest</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Le meilleur du Bénin, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-400 to-white">
              livré directement à votre porte.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100 font-normal leading-relaxed">
            Pas de carte bancaire requise. Vous passez commande en quelques clics, notre service client vous rappelle par téléphone pour confirmer la livraison. Vous payez en mains propres (Espèces, MTN MoMo, Moov Money, Wave).
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/boutique/mahugnon-officiel"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-blue-900 font-extrabold text-sm shadow-xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span>Visiter la Boutique MAHUGNON</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/fidelite"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-800/80 hover:bg-blue-700/80 text-white font-bold text-sm border border-blue-600/50 transition-all"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Découvrir le Club Fidélité</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bannière Déroulement Commande en 3 étapes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-lg mb-3">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                Choisissez vos articles
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Remplissez votre panier et précisez votre quartier à Cotonou ou dans votre ville.
              </p>
            </div>

            <div className="flex flex-col items-center p-4 border-t md:border-t-0 md:border-l md:border-r border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-lg mb-3">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                Nous vous appelons
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Confirmation téléphonique immédiate pour convenir de l'heure et du point de repère.
              </p>
            </div>

            <div className="flex flex-col items-center p-4 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black text-lg mb-3">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                Paiement à la livraison
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vous recevez votre commande en mains propres et payez par Mobile Money ou Espèces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grille des Produits Vedettes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Sélection du jour
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Produits Phares au Bénin
            </h2>
          </div>

          <Link
            href="/boutique/mahugnon-officiel"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1 group"
          >
            <span>Voir tout le catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="text-sm">Chargement des produits de la boutique...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Section Fidélité & Récompenses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-[11px] font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Club Privilège MAHUGNON</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black">
              1 000 FCFA dépensés = 1 Point Fidélité
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Vos points se cumulent automatiquement avec votre numéro WhatsApp lors de chaque achat. Bénéficiez jusqu'à 10% de réduction permanente et de la livraison gratuite !
            </p>
          </div>

          <Link
            href="/fidelite"
            className="flex-shrink-0 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Consulter mon solde
          </Link>
        </div>
      </section>
    </div>
  );
}
