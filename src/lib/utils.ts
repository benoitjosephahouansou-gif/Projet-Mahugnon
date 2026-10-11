import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un montant dans la devise ciblée avec le symbole et le formatage culturel approprié.
 * XOF/XAF: "15 000 FCFA"
 * NGN: "₦ 25,000"
 * GHS: "GH₵ 250.00"
 * GNF: "150 000 FG"
 * USD: "$ 25.00"
 * EUR: "25,00 €"
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "XOF",
  locale: string = "fr-FR"
): string {
  const code = (currencyCode || "XOF").toUpperCase();

  switch (code) {
    case "XOF":
    case "XAF": {
      const formatted = new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
      }).format(Math.round(amount));
      return `${formatted} FCFA`;
    }
    case "GNF": {
      const formatted = new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0,
      }).format(Math.round(amount));
      return `${formatted} FG`;
    }
    case "NGN": {
      const formatted = new Intl.NumberFormat("en-NG", {
        maximumFractionDigits: 0,
      }).format(Math.round(amount));
      return `₦ ${formatted}`;
    }
    case "GHS": {
      const formatted = new Intl.NumberFormat("en-GH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `GH₵ ${formatted}`;
    }
    case "USD": {
      const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `$ ${formatted}`;
    }
    case "EUR": {
      const formatted = new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `${formatted} €`;
    }
    default: {
      return `${amount.toLocaleString(locale)} ${code}`;
    }
  }
}

/**
 * Raccourci pour formater spécifiquement en Franc CFA UEMOA
 */
export function formatFCFA(amount: number): string {
  return formatCurrency(amount, "XOF");
}

/**
 * Normalise et formate un numéro de téléphone d'Afrique de l'Ouest
 * Priorité aux indicatifs : +229 (Bénin), +228 (Togo), +225 (CI), +227 (Niger),
 * +226 (Burkina), +221 (Sénégal), +234 (Nigeria), +233 (Ghana), +224 (Guinée), +223 (Mali)
 */
export function formatPhoneIntl(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Si le numéro commence sans indicatif (ex: 97000000 pour le Bénin à 8 chiffres ou 10 chiffres actuels)
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("00")) {
      cleaned = "+" + cleaned.slice(2);
    } else if (cleaned.length <= 10) {
      cleaned = "+229" + cleaned;
    } else {
      cleaned = "+" + cleaned;
    }
  }
  return cleaned;
}

/**
 * Génère un lien direct WhatsApp cliquable (wa.me)
 */
export function waLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  const base = `https://wa.me/${cleanPhone}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

/**
 * Formate une date au format français
 */
export function formatDateFr(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
