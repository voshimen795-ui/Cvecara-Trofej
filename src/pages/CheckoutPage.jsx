import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Loader2,
  MapPin,
  Tag,
  Truck,
  X,
} from 'lucide-react';
import ProductImage from '../components/ui/ProductImage.jsx';
import { SHOP } from '../data/shop.js';
import { formatPrice } from '../utils/format.js';
import { useCart } from '../context/CartContext.jsx';
import {
  fetchDeliveryQuote,
  reverseGeocode,
  submitOrder,
  validateVoucher,
} from '../services/wolt.js';
import ScheduleFields from '../components/checkout/ScheduleFields.jsx';
import PersonalisationFields from '../components/checkout/PersonalisationFields.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';

const EMPTY_FORM = { name: '', phone: '', street: '', city: SHOP.city, comment: '' };
const EMPTY_SCHEDULE = { mode: 'dostava', date: '', time: '' };
const EMPTY_PERSONALISATION = { occasion: '', cardMessage: '', wishes: '' };

/** Folds the optional fields into one note for the florist and the courier. */
function buildComment(form, personalisation, schedule) {
  return [
    form.comment,
    personalisation.occasion && `Povod: ${personalisation.occasion}`,
    personalisation.cardMessage && `Čestitka: „${personalisation.cardMessage}"`,
    personalisation.wishes && `Želje: ${personalisation.wishes}`,
    schedule.date && `Termin: ${schedule.date} u ${schedule.time} (${schedule.mode})`,
  ]
    .filter(Boolean)
    .join(' | ');
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [quote, setQuote] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [schedule, setSchedule] = useState(EMPTY_SCHEDULE);
  const [personalisation, setPersonalisation] = useState(EMPTY_PERSONALISATION);
  const [busy, setBusy] = useState(null); // 'quote' | 'order' | 'locate'
  const [error, setError] = useState('');
  const geo = useGeolocation();
  const [lookupFailed, setLookupFailed] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');

  const applyVoucher = async (event) => {
    event.preventDefault();
    setVoucherError('');
    setBusy('voucher');
    try {
      setVoucher(await validateVoucher({ code: voucherInput, subtotal }));
    } catch (err) {
      setVoucher(null);
      setVoucherError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const pickup = schedule.mode === 'preuzimanje';
  const scheduled = Boolean(schedule.date && schedule.time);

  const set = (field) => (event) => {
    setForm((f) => ({ ...f, [field]: event.target.value }));
    // Any address edit invalidates the price Wolt already quoted.
    if (field === 'street' || field === 'city') setQuote(null);
  };

  const getQuote = async () => {
    setError('');
    setBusy('quote');
    try {
      // Coordinates, when we have them, make Wolt's price binding rather than
      // an estimate — so pass them through whenever geolocation succeeded.
      setQuote(
        await fetchDeliveryQuote({
          street: form.street,
          city: form.city,
          lat: geo.coords?.lat,
          lon: geo.coords?.lon,
        })
      );
    } catch (err) {
      setError(err.message);
      setQuote(null);
    } finally {
      setBusy(null);
    }
  };

  /** Ask for location, then try to fill the address from it. */
  const useMyLocation = async () => {
    setError('');
    const coords = await geo.request();
    if (!coords) return;

    setBusy('locate');
    setLookupFailed(false);
    try {
      const place = await reverseGeocode(coords);
      if (!place.street) throw new Error('no street');
      setForm((f) => ({ ...f, street: place.street, city: place.city || f.city }));
      setQuote(null);
    } catch {
      // Address lookup is only a convenience — the coordinates alone already
      // sharpen Wolt's price. Say so plainly instead of leaving the field
      // mysteriously empty.
      setLookupFailed(true);
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
        comment: buildComment(form, personalisation, schedule),
        voucherCode: voucher?.code ?? null,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          size: i.sizeLabel,
          quantity: i.quantity,
        })),
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

        {confirmed.loyaltyCode && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-brand-border bg-brand-mist px-6 py-5">
            <p className="text-sm text-brand-dark">Hvala! Vaš kod za sledeću porudžbinu:</p>
            <p className="mt-2 font-mono text-xl font-bold tracking-wider text-brand-dark">
              {confirmed.loyaltyCode}
            </p>
            <p className="mt-2 text-xs text-brand-muted">Donosi 10% popusta.</p>
          </div>
        )}

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

  const discount = voucher?.discount ?? 0;
  const total = Math.max(0, subtotal - discount) + (pickup ? 0 : (quote?.price ?? 0));

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
            {!pickup && (
              <>
                <button
                  type="button"
                  onClick={useMyLocation}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-primary px-4 py-3 text-sm font-medium text-brand-primary-dark transition hover:bg-brand-mist sm:w-auto"
                >
                  {geo.status === 'asking' || busy === 'locate' ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  )}
                  Koristi moju lokaciju
                </button>

                {geo.error && <p className="text-xs text-brand-muted">{geo.error}</p>}
                {geo.status === 'granted' && !lookupFailed && (
                  <p className="text-xs text-brand-primary-dark">
                    Lokacija je preuzeta — cena dostave će biti preciznija.
                  </p>
                )}
                {geo.status === 'granted' && lookupFailed && (
                  <p className="text-xs text-brand-muted">
                    Lokacija je preuzeta i koristimo je za precizniju cenu, ali nismo uspeli
                    da prepoznamo ulicu — upišite je ručno.
                  </p>
                )}

                <Field
                  label="Adresa"
                  value={form.street}
                  onChange={set('street')}
                  required
                  placeholder="Ulica i broj"
                />
                <Field label="Grad" value={form.city} onChange={set('city')} required />
              </>
            )}

            {pickup && (
              <p className="rounded-xl bg-brand-mist px-4 py-3 text-sm text-brand-dark">
                Preuzimanje u radnji: {SHOP.street}, {SHOP.city}.
              </p>
            )}

            <Field
              label="Napomena (opciono)"
              value={form.comment}
              onChange={set('comment')}
              placeholder="Sprat, interfon, gde da ostavimo…"
            />

            <div className="border-t border-brand-border pt-5">
              <ScheduleFields value={schedule} onChange={setSchedule} />
            </div>

            <div className="border-t border-brand-border pt-5">
              <PersonalisationFields value={personalisation} onChange={setPersonalisation} />
            </div>

            {!pickup && (
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
            )}

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            {/* Pickup skips Wolt entirely. There is no order store yet, so
                rather than fake a submission we hand the customer a phone
                call — see the README for what's still missing. */}
            {pickup ? (
              <a
                href={SHOP.phoneHref}
                className={`btn-primary w-full ${scheduled ? '' : 'pointer-events-none opacity-50'}`}
              >
                Pozovite nas da potvrdimo termin
              </a>
            ) : (
              <button
                type="submit"
                disabled={!quote || !scheduled || busy !== null}
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
            )}

            {!scheduled && (
              <p className="text-xs text-brand-muted">Izaberite datum i vreme.</p>
            )}
            {scheduled && !pickup && !quote && (
              <p className="text-xs text-brand-muted">
                Zatim izračunajte dostavu — Wolt daje cenu i vreme za vašu adresu.
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
                <li key={item.key} className="flex gap-3 py-3">
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
                      {item.sizeLabel ? `${item.sizeLabel} · ` : ''}
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
              {voucher && (
                <div className="flex justify-between text-brand-primary-dark">
                  <dt className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                    {voucher.label}
                  </dt>
                  <dd className="font-medium">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <dt>{pickup ? 'Preuzimanje u radnji' : 'Dostava (Wolt)'}</dt>
                <dd className="font-medium text-brand-dark">
                  {pickup ? 'Besplatno' : quote ? formatPrice(quote.price) : '—'}
                </dd>
              </div>
              <div className="flex justify-between border-t border-brand-border pt-3 text-base">
                <dt className="font-medium text-brand-dark">Ukupno</dt>
                <dd className="font-semibold text-brand-dark">
                  {pickup || quote
                    ? formatPrice(total)
                    : `${formatPrice(Math.max(0, subtotal - discount))} + dostava`}
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

            <form onSubmit={applyVoucher} className="mt-5 border-t border-brand-border pt-5">
              <label className="mb-2 block text-sm font-medium text-brand-dark" htmlFor="voucher">
                Vaučer ili lojalti kod
              </label>
              {voucher ? (
                <div className="flex items-center justify-between gap-2 rounded-xl bg-brand-mist px-4 py-3">
                  <span className="flex min-w-0 items-center gap-2 text-sm text-brand-dark">
                    <Check className="h-4 w-4 shrink-0 text-brand-primary-dark" aria-hidden="true" />
                    <span className="truncate font-medium">{voucher.code}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setVoucher(null);
                      setVoucherInput('');
                    }}
                    aria-label="Ukloni kod"
                    className="shrink-0 rounded p-1 text-brand-muted transition hover:text-brand-dark"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="voucher"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    placeholder="npr. DOBRODOSLI10"
                    className="min-w-0 flex-1 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm uppercase tracking-wide text-brand-dark placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:border-brand-primary-dark"
                  />
                  <button
                    type="submit"
                    disabled={!voucherInput || busy !== null}
                    className="shrink-0 rounded-xl border border-brand-border px-4 text-sm font-medium text-brand-dark transition hover:border-brand-primary disabled:opacity-50"
                  >
                    {busy === 'voucher' ? '…' : 'Primeni'}
                  </button>
                </div>
              )}
              {voucherError && (
                <p role="alert" className="mt-2 text-xs text-red-700">
                  {voucherError}
                </p>
              )}
            </form>

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
