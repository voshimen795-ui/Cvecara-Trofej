import { CATEGORIES } from '../data/products.js';
import { useI18n } from '../i18n/index.jsx';

export default function CategoryFilter({ active, onChange }) {
  const { t } = useI18n();

  return (
    <div className="text-center">
      <p className="eyebrow">{t('categories.eyebrow')}</p>
      <h2 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">
        {t('categories.filterTitle')}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-gray-600">{t('categories.filterLead')}</p>

      {/* Pills: centered on desktop, horizontally scrollable on small screens. */}
      <div
        role="tablist"
        aria-label={t('categories.filterLabel')}
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
              {t(`tiles.${category.id}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
