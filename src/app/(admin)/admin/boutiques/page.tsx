import React from 'react';
import { prisma } from '@/lib/prisma';
import { ShopsManagerClient } from './ShopsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminShopsPage() {
  let shops: any[] = [];
  try {
    shops = await prisma.shop.findMany({
      include: {
        _count: { select: { products: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Erreur chargement boutiques:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Gestion Multi-Boutiques
        </h1>
        <p className="text-xs text-slate-500">
          Supervisez l'ensemble des boutiques hébergées sur votre plateforme MAHUGNON.
        </p>
      </div>

      <ShopsManagerClient initialShops={shops} />
    </div>
  );
}
