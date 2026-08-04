import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ChevronRight, Minus, Plus, Truck } from 'lucide-react';
import ProductImage from '../components/ui/ProductImage.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import { CATEGORY_PAGES, CATEGORY_TAG, PRODUCTS, getProduct } from '../data/products.js';
import { SHOP } from '../data/shop.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return <NotFoundPage />;

  const page = CATEGORY_PAGES[product.category];
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <>
      <div className="container-editorial py-8 lg:py-12">
        <nav aria-label="Putanja" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-brand-muted">
            <li>
              <Link to="/" className="transition-colors hover:text-brand-primary-dark">
                Početna
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            {page && (
              <>
                <li>
                  <Link
                    to={`/${page.slug}`}
                    className="transition-colors hover:text-brand-primary-dark"
                  >
                    {page.title}
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
            <li aria-current="page" className="text-brand-dark">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-brand-mist to-white ring-1 ring-brand-border/70">
              <div className="aspect-square">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  className="h-full w-full object-contain p-6"
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col lg:col-span-6 lg:py-4">
            <p className="eyebrow">{CATEGORY_TAG[product.category] ?? product.category}</p>
            <h1 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">
              {product.name}
            </h1>

            {product.badge && (
              <span className="mt-4 inline-flex w-fit rounded-full bg-brand-rose px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
                {product.badge}
              </span>
            )}

            <p className="mt-6 text-lg leading-relaxed text-gray-600">{product.description}</p>

            <p className="mt-8 text-3xl font-bold text-brand-dark">
              {formatPrice(product.price)}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex w-fit items-center rounded-xl border border-brand-border">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Smanji količinu"
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
                  aria-label="Povećaj količinu"
                  className="rounded-r-xl p-3 text-brand-dark transition hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => addItem(product, quantity)}
                className="btn-primary flex-1 sm:flex-none"
              >
                Dodaj u korpu
              </button>
            </div>

            <ul className="mt-8 space-y-3 border-t border-brand-border pt-6 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <Truck
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary-dark"
                  aria-hidden="true"
                />
                {SHOP.deliveryArea}. Porudžbine do 14h isporučujemo istog dana.
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary-dark"
                  aria-hidden="true"
                />
                Besplatna dostava iznad {formatPrice(SHOP.freeDeliveryThreshold)}.
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary-dark"
                  aria-hidden="true"
                />
                Buket se pravi na dan isporuke, od svežeg cveća.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-editorial pb-16 lg:pb-24">
          <h2 className="font-serif text-2xl text-brand-dark">Slično iz iste kategorije</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </>
  );
}
