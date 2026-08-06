import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ChevronRight, Minus, Plus, Truck } from 'lucide-react';
import ProductImage from '../components/ui/ProductImage.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import ReviewsSlider from '../components/ReviewsSlider.jsx';
import PetalRain from '../components/PetalRain.jsx';
import { useQuickView } from '../context/QuickViewContext.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import {
  CATEGORY_PAGES,
  PRODUCTS,
  defaultSize,
  getProduct,
  isAvailable,
  priceFor,
} from '../data/products.js';
import { SHOP } from '../data/shop.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function ProductPage() {
  const { id } = useParams();
  const product = getProduct(id);
  const { addItem } = useCart();
  const { t, tp } = useI18n();
  const [quantity, setQuantity] = useState(1);
  const quickView = useQuickView();
  const [sizeId, setSizeId] = useState(() => defaultSize(product)?.id ?? null);

  if (!product) return <NotFoundPage />;

  const available = isAvailable(product);
  const price = priceFor(product, sizeId);

  const page = CATEGORY_PAGES[product.category];
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <>
      {/* Line-art blooms drifting behind the product, in the same idiom as the
          category pages. */}
      <div className="relative isolate">
      <PetalRain />
      <div className="container-editorial py-8 lg:py-12">
        <nav aria-label={t('common.breadcrumb')} className="mb-8">
          {/* Opaque: brand-muted has almost no contrast headroom on the bare
              page background, so no falling petal may pass behind it. */}
          <ol className="flex flex-wrap items-center gap-1.5 bg-brand-bg text-xs text-brand-muted">
            <li>
              <Link to="/" className="transition-colors hover:text-brand-primary-dark">
                {t('common.home')}
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
                    {t(`pages.${product.category}.title`)}
                  </Link>
                </li>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
            <li aria-current="page" className="text-brand-dark">
              {tp(product)}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-brand-mist to-white ring-1 ring-brand-border/70">
              <div className="aspect-square">
                <ProductImage
                  src={product.image}
                  alt={tp(product)}
                  category={product.category}
                  className="h-full w-full object-contain p-6"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:col-span-6 lg:py-4">
            <p className="eyebrow">{t(`tags.${product.category}`)}</p>
            <h1 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">
              {tp(product)}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.badge && available && (
                <span className="inline-flex w-fit rounded-full bg-brand-rose px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
                  {t(`badges.${product.badge}`)}
                </span>
              )}
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  available
                    ? 'bg-brand-primary/20 text-brand-primary-dark'
                    : 'bg-brand-dark text-white'
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

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              {tp(product, 'description')}
            </p>

            {product.sizes && (
              <fieldset className="mt-8">
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
                        className={`rounded-xl border px-3 py-3 text-center transition ${
                          active
                            ? 'border-brand-primary-dark bg-brand-mist'
                            : 'border-brand-border bg-brand-bg hover:border-brand-primary'
                        }`}
                      >
                        <span className="block text-sm font-semibold text-brand-dark">
                          {t(`sizes.${size.id}`)}
                        </span>
                        <span className="mt-0.5 block text-xs text-brand-muted">
                          {t(`sizes.note.${size.id}`)}
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

            <p className="mt-8 text-3xl font-bold text-brand-dark">{formatPrice(price)}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
                onClick={() => addItem(product, quantity, sizeId)}
                disabled={!available}
                className="btn-primary flex-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-brand-muted sm:flex-none"
              >
                {available ? t('common.addToCart') : t('common.outOfStock')}
              </button>
            </div>

            {!available && (
              <p className="mt-4 rounded-xl bg-brand-mist px-4 py-3 text-sm text-brand-dark">
                {/* The phone number is a link inside the sentence, so the
                    template is split on its {phone} placeholder rather than
                    dumped in as plain text. */}
                {(() => {
                  const [before, after] = t('product.callUs').split('{phone}');
                  return (
                    <>
                      {before}
                      <a href={SHOP.phoneHref} className="font-semibold underline">
                        {SHOP.phone}
                      </a>
                      {after}
                    </>
                  );
                })()}
              </p>
            )}

            <ul className="mt-8 space-y-3 border-t border-brand-border pt-6 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <Truck
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary-dark"
                  aria-hidden="true"
                />
                {t('common.deliveryArea')}. {t('product.deliveryNote')}
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary-dark"
                  aria-hidden="true"
                />
                {t('product.freeAbove', { amount: formatPrice(SHOP.freeDeliveryThreshold) })}
              </li>
              <li className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary-dark"
                  aria-hidden="true"
                />
                {t('product.freshNote')}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-editorial pb-16 lg:pb-24">
          <h2 className="font-serif text-2xl text-brand-dark">{t('product.related')}</h2>
          <ProductGrid products={related} onOpen={quickView.open} />
        </div>
      )}
      </div>

      <ReviewsSlider />
    </>
  );
}
