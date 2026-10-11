import React from 'react';
import { prisma } from '@/lib/prisma';
import { formatFCFA } from '@/lib/utils';
import { Truck, Plus, MapPin } from 'lucide-react';
import { ShippingZonesClient } from './ShippingZonesClient';

export const dynamic = 'force-dynamic';

export default async function AdminShippingZonesPage() {
  let zones: any[] = [];
  try {
    zones = await prisma.shippingZone.findMany({
      orderBy: { feeXOF: 'asc' },
    });
  } catch (e) {
    console.error('Erreur chargement zones de livraison:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Zones de Livraison au Bénin & Sous-Région
        </h1>
        <p className="text-xs text-slate-500">
          Configurez les tarifs fixes par quartier à Cotonou et les frais d'expédition pour les autres villes et pays voisins.
        </p>
      </div>

      <ShippingZonesClient initialZones={zones} />
    </div>
  );
}
