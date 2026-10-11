import React from 'react';
import { prisma } from '@/lib/prisma';
import { formatFCFA, waLink } from '@/lib/utils';
import { Award, Plus, MessageCircle } from 'lucide-react';
import { LoyaltyManagerClient } from './LoyaltyManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminLoyaltyPage() {
  let members: any[] = [];
  try {
    members = await prisma.loyaltyMember.findMany({
      include: {
        _count: { select: { transactions: true } },
      },
      orderBy: { currentPoints: 'desc' },
      take: 100,
    });
  } catch (e) {
    console.error('Erreur chargement fidélité:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Club de Fidélité MAHUGNON
        </h1>
        <p className="text-xs text-slate-500">
          1 point attribué automatiquement par tranche de 1 000 FCFA dépensés. Paliers Bronze, Argent, Or et Platine.
        </p>
      </div>

      <LoyaltyManagerClient initialMembers={members} />
    </div>
  );
}
