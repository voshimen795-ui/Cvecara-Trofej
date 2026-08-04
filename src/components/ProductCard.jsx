import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import ProductImage from './ui/ProductImage.jsx';
import { CATEGORY_TAG } from '../data/products.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef(null);

  // Clear the pending "added" reset if the card unmounts (e.g. filter change).
  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleAdd = () => {
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
      className="group flex flex-col rounded-2xl border border-gray-100 bg-brand-surface p-4 transition-all duration-300 hover:shadow-lg"
    >
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-xl bg-gray-50">
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-rose px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wider text-brand-primary">
          {CATEGORY_TAG[product.category] ?? product.category}
        </p>

        <h3 className="mt-1 font-serif text-lg text-brand-dark">{product.name}</h3>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {product.description}
          </p>
        )}

        {/* mt-auto keeps prices and buttons aligned across uneven descriptions. */}
        <p className="mt-auto pt-2 font-semibold text-brand-dark">
          {formatPrice(product.price)}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Dodaj ${product.name} u korpu`}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-colors ${
            justAdded ? 'bg-brand-primary' : 'bg-gray-900 hover:bg-brand-primary'
          }`}
        >
          {justAdded ? (
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
