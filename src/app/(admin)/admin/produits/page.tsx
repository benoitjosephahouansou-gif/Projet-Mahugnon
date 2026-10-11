import React from 'react';
import { prisma } from '@/lib/prisma';
import { ProductsManagerClient } from './ProductsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  let products: any[] = [];
  let shops: any[] = [];
  let categories: any[] = [];

  try {
    products = await prisma.product.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        shop: { select: { id: true, name: true, slug: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    shops = await prisma.shop.findMany({ select: { id: true, name: true } });
    categories = await prisma.category.findMany();
  } catch (e) {
    console.error('Erreur chargement produits:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Gestion du Catalogue Produits
        </h1>
        <p className="text-xs text-slate-500">
          Tous les prix de référence sont fixés en Francs CFA (XOF) puis convertis automatiquement pour les acheteurs.
        </p>
      </div>

      <ProductsManagerClient
        initialProducts={products}
        shops={shops}
        categories={categories}
      />
    </div>
  );
}
