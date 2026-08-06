import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import sr from './locales/sr.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

/**
 * Translations live one JSON per language. Adding a fourth (German has been
 * mentioned but not confirmed) means dropping in `de.json` and one line in
 * LOCALES — no component changes.
 *
 * Scope: interface copy. Product names, descriptions and the reviews stay in
 * Serbian until translations for them exist — showing half-translated product
 * data would read worse than showing it in the original.
 */
const BUNDLES = { sr, en, ru };

export const LOCALES = [
  { code: 'sr', label: 'Srpski', short: 'SR' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ru', label: 'Русский', short: 'RU' },
];

const STORAGE_KEY = 'cvecara-trofej:lang';
const DEFAULT = 'sr';

const I18nContext = createContext(null);

/** `t('checkout.title')` — dotted path, falls back to Serbian, then the key. */
function lookup(bundle, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), bundle);
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    // Serbian is the default by requirement — deliberately NOT sniffing
    // navigator.language, which would show a Belgrade shop in English to
    // anyone whose phone is set to English.
    return saved && BUNDLES[saved] ? saved : DEFAULT;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Private mode — the choice just won't persist.
    }
    document.documentElement.lang = locale === 'sr' ? 'sr-RS' : locale;
  }, [locale]);

  const t = useCallback(
    (path) => lookup(BUNDLES[locale], path) ?? lookup(BUNDLES[DEFAULT], path) ?? path,
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an <I18nProvider>');
  return context;
}
