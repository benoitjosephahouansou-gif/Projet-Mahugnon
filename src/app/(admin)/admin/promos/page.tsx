import React from 'react';
import { prisma } from '@/lib/prisma';
import { formatFCFA } from '@/lib/utils';
import { Tag, Plus, CheckCircle, XCircle } from 'lucide-react';
import { PromosManagerClient } from './PromosManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPromosPage() {
  let promos: any[] = [];
  try {
    promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Erreur chargement codes promo:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Codes Promotionnels & Réductions
        </h1>
        <p className="text-xs text-slate-500">
          Créez des remises en pourcentage (%) ou en montant fixe (FCFA) applicables directement sur le checkout.
        </p>
      </div>

      <PromosManagerClient initialPromos={promos} />
    </div>
  );
}
