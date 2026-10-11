import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CMSPageProps {
  params: {
    slug: string;
    pageSlug: string;
  };
}

export const revalidate = 60;

export default async function CMSPage({ params }: CMSPageProps) {
  const { slug, pageSlug } = params;

  let page: any = null;
  try {
    page = await prisma.page.findFirst({
      where: {
        slug: pageSlug,
        shop: { slug },
        isPublished: true,
      },
      include: {
        shop: true,
      },
    });
  } catch (e) {
    console.error('Erreur chargement page CMS:', e);
  }

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <Link
        href={`/boutique/${slug}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la boutique</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
          {page.title}
        </h1>

        <div
          className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
