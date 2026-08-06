import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import sr from './locales/sr.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

/**
 * Translations live one JSON per language. Adding a fourth (German has been
 * mentioned but not confirmed) means dropping in `de.json` and one line in
 * LOCALES — no component changes.
 *
 * Scope: everything a visitor can read. Interface copy, category and page
 * headers, the family story, product names and descriptions, and the Google
 * reviews. Reviews carry a "translated from Serbian" note so nobody mistakes
 * a translation for the customer's own words.
 *
 * The one thing deliberately left alone is the shop's own name and the
 * reviewers' names — proper nouns, and Google shows them in Latin script.
 */
const BUNDLES = { sr, en, ru };

export const LOCALES = [
  { code: 'sr', label: 'Srpski', short: 'SR', tag: 'sr-RS' },
  { code: 'en', label: 'English', short: 'EN', tag: 'en-GB' },
  { code: 'ru', label: 'Русский', short: 'RU', tag: 'ru-RU' },
];

const STORAGE_KEY = 'cvecara-trofej:lang';
const DEFAULT = 'sr';

const I18nContext = createContext(null);

/** `t('checkout.title')` — dotted path into the bundle. */
function lookup(bundle, path) {
  return path.split('.').reduce((node, key) => (node == null ? undefined : node[key]), bundle);
}

/** `"Add {name}"` + `{ name: 'Roze Oblak' }` -> `"Add Roze Oblak"`. */
function fill(template, vars) {
  if (typeof template !== 'string' || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    vars[key] === undefined || vars[key] === null ? match : String(vars[key])
  );
}

// One PluralRules per locale, built lazily. Serbian and Russian both need
// one/few/many; hard-coding an English "n === 1" would get both wrong.
const pluralRules = new Map();
function pluralCategory(tag, count) {
  if (!pluralRules.has(tag)) pluralRules.set(tag, new Intl.PluralRules(tag));
  return pluralRules.get(tag).select(count);
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

  const tag = useMemo(
    () => LOCALES.find((l) => l.code === locale)?.tag ?? 'sr-RS',
    [locale]
  );

  /** Interface copy. Missing keys fall back to Serbian, then to the path. */
  const t = useCallback(
    (path, vars) => {
      const value = lookup(BUNDLES[locale], path) ?? lookup(BUNDLES[DEFAULT], path);
      return fill(typeof value === 'string' ? value : path, vars);
    },
    [locale]
  );

  /**
   * Counted copy: `tn('common.itemCount', 3)` picks `.one` / `.few` / `.many`
   * / `.other` by the locale's own rules and fills `{n}`.
   */
  const tn = useCallback(
    (path, count, vars) => {
      const group = lookup(BUNDLES[locale], path) ?? lookup(BUNDLES[DEFAULT], path);
      if (!group || typeof group !== 'object') return String(count);
      const category = pluralCategory(tag, count);
      const template = group[category] ?? group.other ?? group.one;
      return fill(template, { n: count, ...vars });
    },
    [locale, tag]
  );

  /**
   * Catalogue copy. `products.js` holds the Serbian original, so a product
   * with no translation yet shows its own name rather than a raw key.
   */
  const tp = useCallback(
    (product, field = 'name') => {
      if (!product) return '';
      return lookup(BUNDLES[locale], `products.${product.id}.${field}`) ?? product[field] ?? '';
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, tn, tp, tag }),
    [locale, t, tn, tp, tag]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an <I18nProvider>');
  return context;
}
