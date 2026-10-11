import { LoyaltyTier } from '@prisma/client';

export interface TierInfo {
  tier: LoyaltyTier;
  name: string;
  minPoints: number;
  discountPercent: number;
  freeShipping: boolean;
  color: string;
}

export const LOYALTY_TIERS: Record<LoyaltyTier, TierInfo> = {
  BRONZE: {
    tier: 'BRONZE',
    name: 'Bronze',
    minPoints: 0,
    discountPercent: 0,
    freeShipping: false,
    color: '#CD7F32',
  },
  ARGENT: {
    tier: 'ARGENT',
    name: 'Argent',
    minPoints: 500,
    discountPercent: 3,
    freeShipping: false,
    color: '#94A3B8',
  },
  OR: {
    tier: 'OR',
    name: 'Or',
    minPoints: 1500,
    discountPercent: 5,
    freeShipping: false,
    color: '#EAB308',
  },
  PLATINE: {
    tier: 'PLATINE',
    name: 'Platine',
    minPoints: 5000,
    discountPercent: 10,
    freeShipping: true,
    color: '#2563EB',
  },
};

/**
 * Calcule les points gagnés pour un montant donné en FCFA (1 point par tranche de 1 000 FCFA)
 */
export function calculatePointsEarned(amountXOF: number): number {
  if (amountXOF <= 0) return 0;
  return Math.floor(amountXOF / 1000);
}

/**
 * Détermine le palier de fidélité selon le total de points
 */
export function determineTier(points: number): LoyaltyTier {
  if (points >= 5000) return 'PLATINE';
  if (points >= 1500) return 'OR';
  if (points >= 500) return 'ARGENT';
  return 'BRONZE';
}

/**
 * Calcule la remise de fidélité sur une commande en FCFA
 */
export function calculateLoyaltyDiscount(
  subtotalXOF: number,
  tier: LoyaltyTier
): { discountXOF: number; discountPercent: number; isFreeShipping: boolean } {
  const info = LOYALTY_TIERS[tier] || LOYALTY_TIERS.BRONZE;
  const discountXOF = Math.round((subtotalXOF * info.discountPercent) / 100);
  return {
    discountXOF,
    discountPercent: info.discountPercent,
    isFreeShipping: info.freeShipping,
  };
}
