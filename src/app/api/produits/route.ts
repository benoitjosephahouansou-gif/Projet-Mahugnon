import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ProductStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shopSlug = searchParams.get('shopSlug');
    const categorySlug = searchParams.get('categorySlug');
    const query = searchParams.get('q');
    const limit = Number(searchParams.get('limit')) || 50;

    const where: any = {
      status: ProductStatus.ACTIVE,
    };

    if (shopSlug) {
      where.shop = { slug: shopSlug };
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
        shop: { select: { id: true, name: true, slug: true } },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      shopId,
      categoryId,
      name,
      slug,
      description,
      priceXOF,
      compareAtPriceXOF,
      sku,
      stock,
      isPromo,
      images = [],
    } = body;

    if (!shopId || !name || !priceXOF) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        shopId,
        categoryId: categoryId || null,
        name,
        slug: finalSlug,
        description: description || '',
        priceXOF: Number(priceXOF),
        compareAtPriceXOF: compareAtPriceXOF ? Number(compareAtPriceXOF) : null,
        sku: sku || null,
        stock: Number(stock) || 10,
        isPromo: Boolean(isPromo),
        images: {
          create: images.map((img: string, idx: number) => ({
            url: img,
            order: idx,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
