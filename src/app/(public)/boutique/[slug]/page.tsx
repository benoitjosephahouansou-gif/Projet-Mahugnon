import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/public/ProductCard';
import {
  Store,
  Phone,
  MessageCircle,
  MapPin,
  CheckCircle,
  Star,
  Search,
} from 'lucide-react';

interface ShopPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 60;

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = params;

  let shop: any = null;
  try {
    shop = await prisma.shop.findUnique({
      where: { slug },
      include: {
        categories: true,
        products: {
          where: { status: 'ACTIVE' },
          include: {
            images: { orderBy: { order: 'asc' } },
            category: true,
            shop: { select: { slug: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          where: { status: 'APPROVED' },
          take: 10,
        },
      },
    });
  } catch (e) {
    console.error('Erreur chargement boutique:', e);
  }

  if (!shop) {
    notFound();
  }

  const averageRating =
    shop.reviews.length > 0
      ? (
          shop.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
          shop.reviews.length
        ).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-10 pb-16">
      {/* Bannière de la Boutique */}
      <div className="relative h-48 sm:h-64 lg:h-72 w-full bg-slate-800 overflow-hidden">
        {shop.bannerUrl ? (
          <img
            src={shop.bannerUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Profil de la boutique */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-md p-1 border-2 border-blue-500 overflow-hidden flex-shrink-0">
              {shop.logoUrl ? (
                <img
                  src={shop.logoUrl}
                  alt={shop.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-black text-xl rounded-xl">
                  {shop.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {shop.name}
                </h1>
                <CheckCircle className="w-5 h-5 text-blue-600 fill-blue-100 dark:fill-blue-950" />
              </div>
              <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                {shop.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {shop.country}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {averageRating} / 5 ({shop.reviews.length} avis)
                </span>
              </div>
            </div>
          </div>

          {/* Contact Direct WhatsApp */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`https://wa.me/${shop.whatsappNumber.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp Boutique</span>
            </a>
            <a
              href={`tel:${shop.phone}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Appeler</span>
            </a>
          </div>
        </div>
      </div>

      {/* Catalogue des Produits de la Boutique */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Articles disponibles ({shop.products.length})
            </h2>
            <p className="text-xs text-slate-500">
              Tous les prix sont affichés dans votre devise choisie. Paiement à la réception.
            </p>
          </div>
        </div>

        {shop.products.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">Aucun article actif dans cette boutique.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shop.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
