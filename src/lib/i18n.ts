import fr from '../../messages/fr.json';
import en from '../../messages/en.json';
import fon from '../../messages/fon.json';

export type Locale = 'fr' | 'en' | 'fon';

export const dictionaries = {
  fr,
  en,
  fon,
};

export const defaultLocale: Locale = 'fr';

export const supportedLocales: { code: Locale; name: string; flag: string }[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fon', name: 'Fongbe (Bénin)', flag: '🇧🇯' },
];

/**
 * Récupère un dictionnaire complet pour une locale donnée
 */
export function getDictionary(locale: Locale = 'fr') {
  return dictionaries[locale] || dictionaries.fr;
}

/**
 * Résout une clé imbriquée de type "common.save" ou "checkout.fullName"
 */
export function t(locale: Locale, path: string, params?: Record<string, string | number>): string {
  const dict = getDictionary(locale);
  const keys = path.split('.');
  let current: any = dict;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = current[k];
    } else {
      return path; // Fallback sur la clé si introuvable
    }
  }

  if (typeof current !== 'string') {
    return path;
  }

  let result = current;
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), String(val));
    }
  }

  return result;
}
