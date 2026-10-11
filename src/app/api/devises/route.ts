import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getActiveCurrencies, updateExchangeRates } from '@/lib/currency';

export async function GET() {
  try {
    const currencies = await getActiveCurrencies();
    return NextResponse.json({ currencies });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Option 1 : Synchronisation automatique via API
    if (body.action === 'sync') {
      const result = await updateExchangeRates(body.apiKey);
      return NextResponse.json(result);
    }

    // Option 2 : Mise à jour manuelle d'un taux de devise par l'administrateur
    const { code, rateToXOF, active } = body;
    if (!code) {
      return NextResponse.json({ error: 'Code de devise requis' }, { status: 400 });
    }

    const updated = await prisma.currency.update({
      where: { code: code.toUpperCase() },
      data: {
        ...(rateToXOF !== undefined ? { rateToXOF: Number(rateToXOF) } : {}),
        ...(active !== undefined ? { active: Boolean(active) } : {}),
      },
    });

    return NextResponse.json({ success: true, currency: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
