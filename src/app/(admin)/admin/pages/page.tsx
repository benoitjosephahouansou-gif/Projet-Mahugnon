import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FileText, Plus, ExternalLink } from 'lucide-react';
import { PagesManagerClient } from './PagesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  let pages: any[] = [];
  try {
    pages = await prisma.page.findMany({
      include: {
        shop: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) {
    console.error('Erreur chargement pages CMS:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Gestion des Pages Institutionnelles (CMS)
        </h1>
        <p className="text-xs text-slate-500">
          Rédigez vos pages d'information : Modalités de livraison, Paiement Mobile Money, À propos, Politiques de retour.
        </p>
      </div>

      <PagesManagerClient initialPages={pages} />
    </div>
  );
}
