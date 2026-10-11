import { prisma } from './prisma';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  rateToXOF: number; // 1 XOF = rateToXOF target
  active: boolean;
  isPivot: boolean;
  flag: string;
}

// Taux réalistes par défaut (1 XOF = ...)
export const FALLBACK_CURRENCIES: CurrencyConfig[] = [
  { code: 'XOF', name: 'Franc CFA UEMOA', symbol: 'FCFA', rateToXOF: 1.0, active: true, isPivot: true, flag: '🇧🇯' },
  { code: 'NGN', name: 'Naira Nigérian', symbol: '₦', rateToXOF: 2.45, active: true, isPivot: false, flag: '🇳🇬' },
  { code: 'GHS', name: 'Cedi Ghanéen', symbol: 'GH₵', rateToXOF: 0.024, active: true, isPivot: false, flag: '🇬🇭' },
  { code: 'GNF', name: 'Franc Guinéen', symbol: 'FG', rateToXOF: 14.15, active: true, isPivot: false, flag: '🇬🇳' },
  { code: 'XAF', name: 'Franc CFA CEMAC', symbol: 'FCFA', rateToXOF: 1.0, active: true, isPivot: false, flag: '🇨🇲' },
  { code: 'USD', name: 'Dollar Américain', symbol: '$', rateToXOF: 0.00164, active: true, isPivot: false, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', rateToXOF: 0.001524, active: true, isPivot: false, flag: '🇪🇺' },
];

/**
 * Convertit un montant stocké en XOF (référence) vers la devise cible
 */
export function convertFromXOF(
  amountXOF: number,
  targetCurrency: string,
  rateMap?: Record<string, number>
): number {
  const code = (targetCurrency || 'XOF').toUpperCase();
  if (code === 'XOF' || code === 'XAF') return amountXOF;

  let rate = rateMap ? rateMap[code] : undefined;
  if (!rate) {
    const fallback = FALLBACK_CURRENCIES.find((c) => c.code === code);
    rate = fallback ? fallback.rateToXOF : 1.0;
  }

  const converted = amountXOF * rate;
  // Arrondir intelligemment selon la devise (pas de centimes pour NGN, GNF, XOF, XAF)
  if (['XOF', 'XAF', 'NGN', 'GNF'].includes(code)) {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

/**
 * Convertit un montant d'une devise étrangère vers la devise pivot XOF
 */
export function convertToXOF(
  amount: number,
  sourceCurrency: string,
  rateMap?: Record<string, number>
): number {
  const code = (sourceCurrency || 'XOF').toUpperCase();
  if (code === 'XOF' || code === 'XAF') return amount;

  let rate = rateMap ? rateMap[code] : undefined;
  if (!rate) {
    const fallback = FALLBACK_CURRENCIES.find((c) => c.code === code);
    rate = fallback ? fallback.rateToXOF : 1.0;
  }

  if (rate <= 0) return amount;
  return Math.round(amount / rate);
}

/**
 * Récupère les devises actives depuis la base de données ou le fallback
 */
export async function getActiveCurrencies(): Promise<CurrencyConfig[]> {
  try {
    const dbCurrencies = await prisma.currency.findMany({
      where: { active: true },
      orderBy: { isPivot: 'desc' },
    });

    if (dbCurrencies && dbCurrencies.length > 0) {
      return dbCurrencies;
    }
  } catch (error) {
    console.warn('Utilisation du fallback de devises (DB non initialisée ou injoignable)', error);
  }
  return FALLBACK_CURRENCIES;
}

/**
 * Met à jour les taux de change via exchangerate-api.com si une clé est fournie
 */
export async function updateExchangeRates(apiKey?: string): Promise<{ success: boolean; message: string }> {
  const key = apiKey || process.env.EXCHANGE_RATE_API_KEY;
  if (!key) {
    return { success: false, message: 'Aucune clé API exchangerate-api.com configurée.' };
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/XOF`);
    if (!res.ok) {
      throw new Error(`Erreur API: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.result !== 'success' || !data.conversion_rates) {
      throw new Error('Réponse invalide de l\'API des devises');
    }

    const rates = data.conversion_rates;
    const trackedCodes = ['NGN', 'GHS', 'GNF', 'USD', 'EUR'];

    for (const code of trackedCodes) {
      if (rates[code]) {
        await prisma.currency.updateMany({
          where: { code },
          data: { rateToXOF: rates[code] },
        });
      }
    }

    return { success: true, message: 'Taux de change mis à jour avec succès depuis exchangerate-api.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Erreur inconnue lors de la mise à jour des devises' };
  }
}
