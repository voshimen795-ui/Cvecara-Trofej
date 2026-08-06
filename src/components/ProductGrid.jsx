import { AnimatePresence, motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onOpen }) {
  if (products.length === 0) {
    return (
      <div className="my-10 flex flex-col items-center rounded-2xl border border-dashed border-brand-border bg-brand-surface px-6 py-16 text-center">
        <SearchX className="h-8 w-8 text-brand-muted" strokeWidth={1.5} aria-hidden="true" />
        <p className="mt-4 font-serif text-xl text-brand-dark">
          Trenutno nema artikala u ovoj kategoriji
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Pozovite nas — pravimo i bukete po vašoj želji.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="my-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={onOpen} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
