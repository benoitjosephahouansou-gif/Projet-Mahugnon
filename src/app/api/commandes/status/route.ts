import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OrderStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 });
  }

  try {
    const { orderId, status, note } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId et status requis' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as OrderStatus,
        history: {
          create: {
            status: status as OrderStatus,
            note: note || `Statut mis à jour par l'administrateur (${status})`,
            changedBy: session.user?.name || 'Administrateur',
          },
        },
      },
      include: { history: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
