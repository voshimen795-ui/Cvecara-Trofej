import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';
import { SHOP } from '../data/shop.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js';
import { useEscapeKey } from '../hooks/useEscapeKey.js';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    delivery,
    total,
    totalItems,
    qualifiesForFreeDelivery,
    amountToFreeDelivery,
    increment,
    decrement,
    removeItem,
  } = useCart();

  const closeButtonRef = useRef(null);

  useBodyScrollLock(isOpen);
  useEscapeKey(isOpen, closeCart);

  // Move focus into the dialog when it opens so keyboard users land inside it.
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Vaša Korpa">
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px]"
          />

          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="font-serif text-xl text-brand-dark">
                Vaša Korpa
                {totalItems > 0 && (
                  <span className="ml-2 text-sm font-sans text-brand-muted">({totalItems})</span>
                )}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeCart}
                aria-label="Zatvori korpu"
                className="rounded-lg p-2 text-brand-dark transition hover:bg-gray-100"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
                  <ShoppingBag className="h-7 w-7 text-brand-primary" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <p className="mt-6 font-serif text-lg text-brand-dark">Korpa je prazna</p>
                <p className="mt-2 text-sm text-gray-600">
                  Dodajte buket ili aranžman i vratite se ovde.
                </p>
                <button type="button" onClick={closeCart} className="btn-primary mt-8">
                  Nastavi kupovinu
                </button>
              </div>
            ) : (
              <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-6">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex gap-4 py-5"
                    >
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-brand-mist to-white">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          category={item.category}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate font-serif text-base text-brand-dark">
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Ukloni ${item.name} iz korpe`}
                            className="shrink-0 rounded p-1 text-brand-muted transition hover:text-brand-rose"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        <p className="mt-0.5 text-xs text-brand-muted">
                          {item.sizeLabel ? `${item.sizeLabel} · ` : ''}
                          {formatPrice(item.price)} / kom
                        </p>

                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-lg border border-brand-border">
                            <button
                              type="button"
                              onClick={() => decrement(item.key, item.quantity)}
                              aria-label={`Smanji količinu za ${item.name}`}
                              className="rounded-l-lg p-2 text-brand-dark transition hover:bg-gray-50"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span
                              aria-live="polite"
                              className="w-8 text-center text-sm font-medium tabular-nums"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increment(item.key, item.quantity)}
                              aria-label={`Povećaj količinu za ${item.name}`}
                              className="rounded-r-lg p-2 text-brand-dark transition hover:bg-gray-50"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <p className="font-semibold text-brand-dark">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 bg-brand-bg px-6 py-6">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <dt>Međuzbir</dt>
                    <dd className="font-medium text-brand-dark">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <dt>Dostava</dt>
                    <dd className="font-medium text-brand-dark">
                      {delivery === 0 ? 'Besplatno' : formatPrice(delivery)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-brand-border pt-3 text-base">
                    <dt className="font-medium text-brand-dark">Ukupno</dt>
                    <dd className="font-semibold text-brand-dark">{formatPrice(total)}</dd>
                  </div>
                </dl>

                <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-primary/10 px-3 py-2.5 text-xs leading-relaxed text-brand-primary-dark">
                  <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {qualifiesForFreeDelivery
                      ? `Besplatna dostava na teritoriji ${SHOP.city}a. Porudžbine do 14h isporučujemo istog dana.`
                      : `Dodajte još ${formatPrice(amountToFreeDelivery)} za besplatnu dostavu. Isporuka istog dana za porudžbine do 14h.`}
                  </span>
                </p>

                <Link
                  to="/porudzbina"
                  onClick={closeCart}
                  className="mt-4 block w-full rounded-xl bg-brand-primary py-4 text-center font-semibold text-brand-dark transition hover:bg-brand-teal"
                >
                  Nastavi na plaćanje
                </Link>

                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-3 w-full py-1 text-center text-sm text-brand-muted transition hover:text-brand-dark"
                >
                  Nastavi kupovinu
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
