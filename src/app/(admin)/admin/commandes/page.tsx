import React from 'react';
import { prisma } from '@/lib/prisma';
import { OrdersManagerClient } from './OrdersManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      include: {
        items: true,
        history: { orderBy: { createdAt: 'desc' } },
        shop: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  } catch (e) {
    console.error('Erreur chargement commandes:', e);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            Gestion des Commandes & Appels
          </h1>
          <p className="text-xs text-slate-500">
            Suivi des statuts, appels de confirmation et expéditions à Cotonou et en région.
          </p>
        </div>
      </div>

      <OrdersManagerClient initialOrders={orders} />
    </div>
  );
}
