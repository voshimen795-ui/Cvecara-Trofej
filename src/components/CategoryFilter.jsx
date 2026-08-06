import { CATEGORIES } from '../data/products.js';

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="text-center">
      <p className="eyebrow">Kolekcija</p>
      <h2 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">
        Izaberite savršen poklon
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-gray-600">
        Od klasičnih buketa do dekoracija za posebne prilike — sve pravimo po porudžbini,
        na dan isporuke.
      </p>

      {/* Pills: centered on desktop, horizontally scrollable on small screens. */}
      <div
        role="tablist"
        aria-label="Filter kategorija"
        className="no-scrollbar -mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
      >
        {CATEGORIES.map((category) => {
          const isActive = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(category.id)}
              className={`shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-primary text-brand-dark shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
