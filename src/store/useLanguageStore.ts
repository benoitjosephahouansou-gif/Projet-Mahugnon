import { create } from 'zustand';
import { Locale, defaultLocale } from '@/lib/i18n';

interface LanguageState {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLocale: defaultLocale,

  setLocale: (locale: Locale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahugnon_locale', locale);
      document.cookie = `mahugnon_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    }
    set({ currentLocale: locale });
  },
}));
