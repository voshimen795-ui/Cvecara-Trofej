import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Minus, Plus, Truck, X } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';
import { defaultSize, isAvailable, priceFor } from '../data/products.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock.js';
import { useEscapeKey } from '../hooks/useEscapeKey.js';
import { useI18n } from '../i18n/index.jsx';

/**
 * Quick view: tap a card and the product opens here, with the size choice in
 * front of you. Sizes used to be reachable only from the product page, which
 * meant the grid silently added a medium.
 */
export default function ProductQuickView({ product, onClose }) {
  const { addItem } = useCart();
  const { t, tp } = useI18n();
  const [sizeId, setSizeId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const closeRef = useRef(null);

  const open = Boolean(product);
  useBodyScrollLock(open);
  useEscapeKey(open, onClose);

  // Reset per product, so reopening never carries the last one's size over.
  useEffect(() => {
    if (!product) return;
    setSizeId(defaultSize(product)?.id ?? null);
    setQuantity(1);
    setAdded(false);
    closeRef.current?.focus();
  }, [product]);

  const available = product ? isAvailable(product) : false;
  const price = product ? priceFor(product, sizeId) : 0;

  const handleAdd = () => {
    addItem(product, quantity, sizeId);
    setAdded(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={tp(product)}
        >
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm"
          />

          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-brand-surface shadow-2xl sm:max-h-[88vh] sm:rounded-3xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-brand-dark shadow-md backdrop-blur transition hover:bg-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Block on phones, grid from md. As a grid with a definite height the
                image track shrank to 180px and the bouquet got clipped — grid
                auto tracks may compress below max-content, block flow won't. */}
            <div className="block overflow-y-auto md:grid md:grid-cols-2">
              {/* Visual */}
              {/* aspect-auto from md: with a definite height, aspect-square
                  derives the WIDTH from it and the bouquet spills sideways. */}
              <div className="relative aspect-square w-full bg-gradient-to-b from-brand-mist to-white md:aspect-auto md:h-full md:overflow-hidden">
                <ProductImage
                  src={product.image}
                  alt={tp(product)}
                  category={product.category}
                  className={`h-full w-full object-contain p-6 ${
                    available ? '' : 'opacity-40 saturate-50'
                  }`}
                />

                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.badge && available && (
                    <span className="w-fit rounded-full bg-brand-rose px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
                      {t(`badges.${product.badge}`)}
                    </span>
                  )}
                  <span
                    className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      available ? 'bg-white/90 text-brand-primary-dark' : 'bg-brand-dark text-white'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        available ? 'bg-brand-primary-dark' : 'bg-white/70'
                      }`}
                      aria-hidden="true"
                    />
                    {available ? t('common.inStock') : t('common.outOfStock')}
                  </span>
                </div>
              </div>

              {/* Detail */}
              <div className="flex flex-col p-6 sm:p-8">
                <p className="eyebrow">{t(`tags.${product.category}`)}</p>
                <h2 className="mt-2 font-serif text-2xl text-brand-dark sm:text-3xl">
                  {tp(product)}
                </h2>
                <p className="mt-3 leading-relaxed text-gray-600">
                  {tp(product, 'description')}
                </p>

                {/* Same placement as the product page: below the description,
                    bold, so it is read before a size is picked. */}
                <p className="mt-3 rounded-xl border border-brand-border bg-brand-mist/60 px-3 py-2.5 text-xs leading-relaxed text-brand-dark">
                  <span className="font-bold">{t('product.noteLabel')}</span>{' '}
                  {t('product.mayDiffer')}
                </p>

                {product.sizes && (
                  <fieldset className="mt-6">
                    <legend className="mb-2.5 text-sm font-medium text-brand-dark">
                      {t('sizes.label')}
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                      {product.sizes.map((size) => {
                        const active = size.id === sizeId;
                        return (
                          <button
                            key={size.id}
                            type="button"
                            onClick={() => setSizeId(size.id)}
                            aria-pressed={active}
                            className={`rounded-xl border px-2 py-3 text-center transition ${
                              active
                                ? 'border-brand-primary-dark bg-brand-mist ring-1 ring-brand-primary-dark'
                                : 'border-brand-border hover:border-brand-primary'
                            }`}
                          >
                            <span className="block text-sm font-semibold text-brand-dark">
                              {t(`sizes.${size.id}`)}
                            </span>
                            <span className="mt-1 block text-sm font-bold text-brand-dark">
                              {formatPrice(size.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                <div className="mt-6 flex items-baseline justify-between">
                  <span className="text-sm text-brand-muted">{t('common.total')}</span>
                  <span className="text-3xl font-bold text-brand-dark">
                    {formatPrice(price * quantity)}
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex w-fit items-center rounded-xl border border-brand-border">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label={t('common.decrease')}
                      className="rounded-l-xl p-3 text-brand-dark transition hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span aria-live="polite" className="w-10 text-center font-medium tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      aria-label={t('common.increase')}
                      className="rounded-r-xl p-3 text-brand-dark transition hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!available}
                    className="btn-primary flex-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-brand-muted"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        {t('common.added')}
                      </>
                    ) : available ? (
                      t('common.addToCart')
                    ) : (
                      t('common.unavailable')
                    )}
                  </button>
                </div>

                <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-brand-muted">
                  <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {t('common.deliveryArea')}. {t('product.madeOnDay')}
                </p>

                <Link
                  to={`/proizvod/${product.id}`}
                  onClick={onClose}
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-brand-primary-dark hover:underline"
                >
                  {t('product.fullPage')}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
