import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, ChevronRight, Loader2, Truck } from 'lucide-react';
import ProductImage from '../components/ui/ProductImage.jsx';
import { SHOP } from '../data/shop.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import { fetchDeliveryQuote, submitOrder } from '../services/wolt.js';

const EMPTY_FORM = { name: '', phone: '', street: '', city: SHOP.city, comment: '' };

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [quote, setQuote] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [busy, setBusy] = useState(null); // 'quote' | 'order'
  const [error, setError] = useState('');

  const set = (field) => (event) => {
    setForm((f) => ({ ...f, [field]: event.target.value }));
    // Any address edit invalidates the price Wolt already quoted.
    if (field === 'street' || field === 'city') setQuote(null);
  };

  const getQuote = async () => {
    setError('');
    setBusy('quote');
    try {
      setQuote(await fetchDeliveryQuote({ street: form.street, city: form.city }));
    } catch (err) {
      setError(err.message);
      setQuote(null);
    } finally {
      setBusy(null);
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');
    setBusy('order');
    try {
      const result = await submitOrder({
        promiseId: quote.promiseId,
        customer: { name: form.name, phone: form.phone, street: form.street, city: form.city },
        comment: form.comment,
        items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity })),
      });
      setConfirmed(result);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  // ── Confirmation ─────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div className="container-editorial py-20 text-center lg:py-28">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
          <Check className="h-7 w-7 text-brand-primary-dark" aria-hidden="true" />
        </span>
        <h1 className="mt-6 font-serif text-3xl text-brand-dark">Porudžbina je primljena</h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600">
          Broj porudžbine <strong className="text-brand-dark">{confirmed.orderReference}</strong>.
          Zovemo vas na {form.phone} da potvrdimo detalje.
        </p>

        {confirmed.mock && <MockNotice className="mx-auto mt-8 max-w-lg text-left" />}

        {confirmed.trackingUrl && (
          <a
            href={confirmed.trackingUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-8"
          >
            Prati dostavu
          </a>
        )}

        <div className="mt-6">
          <Link to="/" className="text-sm text-brand-primary-dark hover:underline">
            Nazad na početnu
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty cart ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="container-editorial py-20 text-center lg:py-28">
        <h1 className="font-serif text-3xl text-brand-dark">Korpa je prazna</h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600">
          Dodajte buket ili aranžman pa se vratite na plaćanje.
        </p>
        <Link to="/buketi" className="btn-primary mt-8">
          Pogledaj bukete
        </Link>
      </div>
    );
  }

  const total = subtotal + (quote?.price ?? 0);

  return (
    <div className="container-editorial py-10 lg:py-14">
      <nav aria-label="Putanja" className="mb-8">
        <ol className="flex items-center gap-1.5 text-xs text-brand-muted">
          <li>
            <Link to="/" className="transition-colors hover:text-brand-primary-dark">
              Početna
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <li aria-current="page" className="text-brand-dark">
            Porudžbina
          </li>
        </ol>
      </nav>

      <h1 className="font-serif text-3xl text-brand-dark sm:text-4xl">Porudžbina</h1>

      <div className="mt-10 grid grid-cols-12 gap-8 lg:gap-12">
        {/* Form */}
        <form onSubmit={placeOrder} className="col-span-12 lg:col-span-7">
          <fieldset disabled={busy !== null} className="space-y-5">
            <legend className="font-serif text-xl text-brand-dark">Podaci za dostavu</legend>

            <Field label="Ime i prezime" value={form.name} onChange={set('name')} required />
            <Field
              label="Telefon"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              required
              placeholder="06x xxx xxxx"
            />
            <Field
              label="Adresa"
              value={form.street}
              onChange={set('street')}
              required
              placeholder="Ulica i broj"
            />
            <Field label="Grad" value={form.city} onChange={set('city')} required />
            <Field
              label="Napomena (opciono)"
              value={form.comment}
              onChange={set('comment')}
              placeholder="Sprat, interfon, poruka na čestitki…"
            />

            <button
              type="button"
              onClick={getQuote}
              disabled={!form.street || !form.city || busy !== null}
              className="btn-ghost w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {busy === 'quote' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Računam…
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  {quote ? 'Osveži cenu dostave' : 'Izračunaj dostavu'}
                </>
              )}
            </button>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!quote || busy !== null}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy === 'order' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Šaljem…
                </>
              ) : (
                'Potvrdi porudžbinu'
              )}
            </button>

            {!quote && (
              <p className="text-xs text-brand-muted">
                Prvo izračunajte dostavu — Wolt daje cenu i vreme za vašu adresu.
              </p>
            )}
          </fieldset>
        </form>

        {/* Summary */}
        <aside className="col-span-12 lg:col-span-5">
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
            <h2 className="font-serif text-xl text-brand-dark">Vaša porudžbina</h2>

            <ul className="mt-5 divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-b from-brand-mist to-white">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      category={item.category}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-sm text-brand-dark">{item.name}</p>
                    <p className="text-xs text-brand-muted">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-brand-dark">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-brand-border pt-5 text-sm">
              <div className="flex justify-between text-gray-600">
                <dt>Međuzbir</dt>
                <dd className="font-medium text-brand-dark">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Dostava (Wolt)</dt>
                <dd className="font-medium text-brand-dark">
                  {quote ? formatPrice(quote.price) : '—'}
                </dd>
              </div>
              <div className="flex justify-between border-t border-brand-border pt-3 text-base">
                <dt className="font-medium text-brand-dark">Ukupno</dt>
                <dd className="font-semibold text-brand-dark">
                  {quote ? formatPrice(total) : formatPrice(subtotal) + ' + dostava'}
                </dd>
              </div>
            </dl>

            {quote && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-primary/10 px-3 py-2.5 text-xs leading-relaxed text-brand-primary-dark">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  Procenjena dostava {quote.etaMinutes} min.
                  {!quote.binding && ' Cena je okvirna dok kurir ne bude dodeljen.'}
                </span>
              </p>
            )}

            {quote?.mock && <MockNotice className="mt-4" />}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-brand-dark">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-brand-dark transition placeholder:text-gray-400 focus:border-brand-primary-dark"
      />
    </label>
  );
}

/** Loud on purpose: in mock mode no courier is dispatched and nothing is charged. */
function MockNotice({ className = '' }) {
  return (
    <p
      className={`flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900 ${className}`}
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>
        <strong>Test režim.</strong> Wolt kredencijali nisu podešeni, pa je ovo simulirana
        cena i nijedan kurir nije poslat. Porudžbina nije stvarna.
      </span>
    </p>
  );
}
