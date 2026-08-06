import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { NAV_LINKS } from '../data/shop.js';
import { useCart } from '../context/CartContext.jsx';
import logoDisc from '../assets/logo-trofej.png';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { t, tn } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-brand-surface/90 backdrop-blur-md">
      <nav className="container-editorial" aria-label={t('nav.main')}>
        {/* min-w-0 + shrink-0 is the whole fix for the row that used to push the
            cart button off a 390px screen: the wordmark is the only part
            allowed to give way, and it shrinks instead of widening the page. */}
        <div className="flex h-20 items-center justify-between gap-2 sm:gap-4 lg:grid lg:grid-cols-3">
          {/* Left — desktop links / mobile menu toggle */}
          <div className="flex shrink-0 items-center lg:justify-start">
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? t('common.closeMenu') : t('common.openMenu')}
              className="-ml-2 rounded-lg p-2 text-brand-dark transition hover:bg-gray-100 lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <ul className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `text-sm transition-colors hover:text-brand-primary ${
                        isActive ? 'text-brand-primary' : 'text-brand-muted'
                      }`
                    }
                  >
                    {t(link.i18n)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Center — wordmark + logo disc */}
          <div className="flex min-w-0 flex-1 justify-center lg:flex-none">
            <Link
              to="/"
              onClick={closeMobile}
              className="flex min-w-0 items-center gap-2 sm:gap-3"
            >
              <span className="truncate font-serif text-[0.8125rem] font-bold tracking-[0.06em] text-brand-dark sm:text-base sm:tracking-widest lg:text-lg">
                CVEĆARA TROFEJ
              </span>
              <img
                src={logoDisc}
                alt=""
                aria-hidden="true"
                className="h-7 w-7 shrink-0 sm:h-9 sm:w-9"
              />
            </Link>
          </div>

          {/* Right — utilities */}
          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-2">
            <LanguageSwitcher />

            {/* Hidden on phones: it is a placeholder with no search behind it
                yet, and on a 360px screen it was the button that pushed the
                cart past the right edge. */}
            <button
              type="button"
              aria-label={t('common.search')}
              className="hidden rounded-lg p-2.5 text-brand-dark transition hover:bg-gray-100 sm:block"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label={tn('common.cartCount', totalItems)}
              className="relative rounded-lg p-2 text-brand-dark transition hover:bg-gray-100 sm:p-2.5"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute right-0.5 top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-rose px-1 text-[10px] font-semibold leading-none text-white sm:right-1 sm:top-1"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer menu */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-gray-100 bg-brand-surface lg:hidden"
          >
            <ul className="container-editorial flex flex-col py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    onClick={closeMobile}
                    className={({ isActive }) =>
                      `block py-3 text-sm transition-colors hover:text-brand-primary ${
                        isActive ? 'text-brand-primary' : 'text-brand-dark'
                      }`
                    }
                  >
                    {t(link.i18n)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
