import React from 'react';
import { prisma } from '@/lib/prisma';
import { ReviewsManagerClient } from './ReviewsManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  let reviews: any[] = [];
  try {
    reviews = await prisma.review.findMany({
      include: {
        product: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  } catch (e) {
    console.error('Erreur chargement avis:', e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Modération des Avis Clients & Générateur IA
        </h1>
        <p className="text-xs text-slate-500">
          Supervisez les témoignages authentiques et générez des avis d'acheteurs béninois par intelligence artificielle.
        </p>
      </div>

      <ReviewsManagerClient initialReviews={reviews} />
    </div>
  );
}
