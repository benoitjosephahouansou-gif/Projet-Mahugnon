import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LOYALTY_TIERS } from '@/lib/loyalty';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Le numéro de téléphone est requis' }, { status: 400 });
    }

    const member = await prisma.loyaltyMember.findUnique({
      where: { phone: phone.trim() },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!member) {
      return NextResponse.json({
        found: false,
        message: 'Aucun compte fidélité associé à ce numéro. Vos points se cumuleront lors de votre première commande !',
      });
    }

    const tierInfo = LOYALTY_TIERS[member.tier];

    return NextResponse.json({
      found: true,
      member: {
        id: member.id,
        fullName: member.fullName,
        phone: member.phone,
        currentPoints: member.currentPoints,
        tier: member.tier,
        tierName: tierInfo.name,
        discountPercent: tierInfo.discountPercent,
        freeShipping: tierInfo.freeShipping,
        totalSpentXOF: member.totalSpentXOF,
        transactions: member.transactions,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
