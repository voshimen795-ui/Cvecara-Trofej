import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '../components/ProductGrid.jsx';
import { useQuickView } from '../context/QuickViewContext.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import { CATEGORY_PAGES, PRODUCTS, filterProducts } from '../data/products.js';

export default function CategoryPage({ category }) {
  const quickView = useQuickView();
  const page = CATEGORY_PAGES[category];

  const products = useMemo(
    () => (page ? filterProducts(PRODUCTS, category) : []),
    [category, page]
  );

  if (!page) return <NotFoundPage />;

  return (
    <>
      {/* Page header on the brand's deep teal, so category pages read as
          part of the same world as the hero without repeating it. */}
      <header className="relative isolate overflow-hidden bg-brand-deep">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(85,181,179,0.25),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-dashed border-white/20 sm:inset-5"
        />

        <div className="container-editorial relative py-14 text-center sm:py-20">
          <nav aria-label="Putanja" className="mb-6 flex justify-center">
            <ol className="flex items-center gap-1.5 text-xs text-white/60">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Početna
                </Link>
              </li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <li aria-current="page" className="text-white">
                {page.title}
              </li>
            </ol>
          </nav>

          <h1 className="font-serif text-3xl font-bold uppercase tracking-[0.01em] text-white sm:text-5xl">
            {page.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl font-serif text-lg italic text-white/75">
            {page.lead}
          </p>
        </div>
      </header>

      <div className="container-editorial py-12 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-2xl text-gray-600">{page.intro}</p>
          <p className="shrink-0 text-sm text-brand-muted">
            {products.length}{' '}
            {products.length === 1 ? 'artikal' : products.length < 5 ? 'artikla' : 'artikala'}
          </p>
        </div>

        <ProductGrid products={products} onOpen={quickView.open} />

        <div className="mt-4 rounded-2xl border border-dashed border-brand-border bg-brand-surface px-6 py-8 text-center">
          <p className="font-serif text-xl text-brand-dark">Ne vidite ono što tražite?</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            Komponujemo buket po vašoj želji — recite nam priliku i budžet.
          </p>
          <Link to="/o-nama" className="btn-primary mt-6">
            Buket po želji
          </Link>
        </div>
      </div>
    </>
  );
}
