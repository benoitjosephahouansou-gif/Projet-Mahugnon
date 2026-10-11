import React from 'react';
import { prisma } from '@/lib/prisma';
import { FALLBACK_CURRENCIES } from '@/lib/currency';
import { CurrenciesManagerClient } from './CurrenciesManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminCurrenciesPage() {
  let currencies: any[] = [];
  try {
    currencies = await prisma.currency.findMany({
      orderBy: { isPivot: 'desc' },
    });
    if (currencies.length === 0) {
      currencies = FALLBACK_CURRENCIES;
    }
  } catch (e) {
    currencies = FALLBACK_CURRENCIES;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Gestion des Devises & Taux de Change
        </h1>
        <p className="text-xs text-slate-500">
          XOF est la devise pivot obligatoire. Toutes les conversions s'effectuent à partir du Franc CFA.
        </p>
      </div>

      <CurrenciesManagerClient initialCurrencies={currencies} />
    </div>
  );
}
