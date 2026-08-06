import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';
import { CATEGORY_TAG, isAvailable } from '../data/products.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart();
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
      aria-label={`Otvori ${product.name}`}
      className="group flex cursor-pointer flex-col rounded-2xl border border-gray-100 bg-brand-surface p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1"
    >
      {/* Pale teal fading to white — the cutouts are transparent, so this
          ground shows around every bloom and has to stay on-brand. */}
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-b from-brand-mist to-white">
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105 ${
            available ? '' : 'opacity-40 saturate-50'
          }`}
        />

        {product.badge && available && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-rose px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
            {product.badge}
          </span>
        )}

        {!available && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Trenutno nije dostupno
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-primary-dark">
          {CATEGORY_TAG[product.category] ?? product.category}
        </p>

        <h3 className="mt-1 font-serif text-lg text-brand-dark">{product.name}</h3>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {product.description}
          </p>
        )}

        {/* mt-auto keeps prices and buttons aligned across uneven descriptions. */}
        <p className="mt-auto pt-2 text-lg font-bold text-brand-dark">
          {product.sizes ? `od ${formatPrice(product.sizes[0].price)}` : formatPrice(product.price)}
        </p>
        {product.sizes && (
          <p className="mt-0.5 text-xs text-brand-muted">
            {product.sizes.length} veličine
          </p>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!available}
          aria-label={
            available ? `Dodaj ${product.name} u korpu` : `${product.name} trenutno nije dostupan`
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
            'Nije dostupno'
          ) : product.sizes ? (
            'Izaberi veličinu'
          ) : justAdded ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Dodato
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Dodaj u korpu
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
