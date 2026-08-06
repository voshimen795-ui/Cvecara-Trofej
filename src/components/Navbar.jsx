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
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-brand-surface/90 backdrop-blur-md">
      <nav className="container-editorial" aria-label="Glavna navigacija">
        <div className="flex h-20 items-center justify-between gap-4 lg:grid lg:grid-cols-3">
          {/* Left — desktop links / mobile menu toggle */}
          <div className="flex items-center lg:justify-start">
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
          <div className="flex justify-center lg:justify-center">
            <Link to="/" onClick={closeMobile} className="flex items-center gap-2.5 sm:gap-3">
              <span className="whitespace-nowrap font-serif text-base font-bold tracking-widest text-brand-dark sm:text-lg">
                CVEĆARA TROFEJ
              </span>
              <img
                src={logoDisc}
                alt=""
                aria-hidden="true"
                className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
              />
            </Link>
          </div>

          {/* Right — utilities */}
          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <LanguageSwitcher />

            <button
              type="button"
              aria-label={t("common.search")}
              className="rounded-lg p-2.5 text-brand-dark transition hover:bg-gray-100"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Korpa, ${totalItems} ${totalItems === 1 ? 'artikal' : 'artikala'}`}
              className="relative rounded-lg p-2.5 text-brand-dark transition hover:bg-gray-100"
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
                    className="absolute right-1 top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-rose px-1 text-[10px] font-semibold leading-none text-white"
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
