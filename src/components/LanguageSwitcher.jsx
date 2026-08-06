import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Globe } from 'lucide-react';
import { LOCALES, useI18n } from '../i18n/index.jsx';

export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click and on Escape — a dropdown that traps you is worse
  // than no dropdown.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('common.language')}: ${current.label}`}
        className="flex items-center gap-1 rounded-lg px-1.5 py-2 text-brand-dark transition hover:bg-gray-100 sm:gap-1.5 sm:px-2 sm:py-2.5"
      >
        <Globe className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        <span className="text-xs font-semibold tracking-wide">{current.short}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-brand-border bg-white py-1 shadow-lg"
          >
            {LOCALES.map((option) => (
              <li key={option.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.code === locale}
                  onClick={() => {
                    setLocale(option.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-brand-mist ${
                    option.code === locale ? 'font-semibold text-brand-dark' : 'text-brand-muted'
                  }`}
                >
                  {option.label}
                  {option.code === locale && (
                    <Check className="h-4 w-4 text-brand-primary-dark" aria-hidden="true" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
