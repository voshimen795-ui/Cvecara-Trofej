import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';
import { isAvailable } from '../data/products.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart();
  const { t, tn, tp } = useI18n();
  const name = tp(product);
  const available = isAvailable(product);
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef(null);

  // Clear the pending "added" reset if the card unmounts (e.g. filter change).
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleAdd = (event) => {
    event.stopPropagation();
    if (!available) return;
    // Anything with sizes goes through the quick view, so the customer picks
    // one instead of the grid silently choosing a medium for them.
    if (product.sizes) return onOpen?.(product);
    addItem(product);
    setJustAdded(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => onOpen?.(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen?.(product);
        }
      }}
      aria-label={t('product.open', { name })}
      className="group flex cursor-pointer flex-col rounded-2xl border border-gray-100 bg-brand-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1"
    >
      {/* Pale teal fading to white — the cutouts are transparent, so this
          ground shows around every bloom and has to stay on-brand. */}
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-b from-brand-mist to-white">
        <ProductImage
          src={product.image}
          alt={name}
          category={product.category}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105 ${
            available ? '' : 'opacity-40 saturate-50'
          }`}
        />

        {product.badge && available && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-rose px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
            {t(`badges.${product.badge}`)}
          </span>
        )}

        {!available && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {t('common.outOfStock')}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-primary-dark">
          {t(`tags.${product.category}`)}
        </p>

        <h3 className="mt-1 font-serif text-lg text-brand-dark">{name}</h3>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {tp(product, 'description')}
          </p>
        )}

        {/* mt-auto keeps prices and buttons aligned across uneven descriptions. */}
        <p className="mt-auto pt-2 text-lg font-bold text-brand-dark">
          {product.sizes
            ? `${t('common.from')} ${formatPrice(product.sizes[0].price)}`
            : formatPrice(product.price)}
        </p>
        {product.sizes && (
          <p className="mt-0.5 text-xs text-brand-muted">
            {tn('common.sizeCount', product.sizes.length)}
          </p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!available}
          aria-label={
            available
              ? t('product.addNamed', { name })
              : t('product.unavailableNamed', { name })
          }
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
            !available
              ? 'cursor-not-allowed bg-gray-100 text-brand-muted'
              : justAdded
                ? 'bg-brand-teal text-brand-dark'
                : 'bg-brand-primary text-brand-dark hover:bg-brand-teal'
          }`}
        >
          {!available ? (
            t('common.unavailable')
          ) : product.sizes ? (
            t('common.chooseSize')
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              {t('common.added')}
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t('common.addToCart')}
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
