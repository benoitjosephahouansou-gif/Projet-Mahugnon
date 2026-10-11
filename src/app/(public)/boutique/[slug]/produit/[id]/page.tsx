import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ReviewSection } from '@/components/public/ReviewSection';
import { ProductDetailClient } from './ProductDetailClient';

interface ProductPageProps {
  params: {
    slug: string;
    id: string;
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug, id } = params;

  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        variants: true,
        category: true,
        shop: true,
        reviews: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  } catch (e) {
    console.error('Erreur chargement produit:', e);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <ProductDetailClient product={product} />

      {/* Section des Avis Clients & Génération IA */}
      <ReviewSection
        productId={product.id}
        productName={product.name}
        initialReviews={product.reviews}
      />
    </div>
  );
}
