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
import OrderReceipt from '../components/OrderReceipt.jsx';
import { reverseGeocode, sendOrder, validateVoucher } from '../services/wolt.js';
import ScheduleFields from '../components/checkout/ScheduleFields.jsx';
import PersonalisationFields, {
  OCCASION_SR,
} from '../components/checkout/PersonalisationFields.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useI18n } from '../i18n/index.jsx';

const EMPTY_FORM = { name: '', phone: '', street: '', city: SHOP.city, comment: '' };
const EMPTY_SCHEDULE = { mode: 'dostava', date: '', time: '' };
const EMPTY_PERSONALISATION = { occasion: '', cardMessage: '', wishes: '' };

/**
 * Folds the optional fields into one note for the florist and the courier.
 * Deliberately always Serbian: this is read in the shop, not by the customer,
 * so an order placed in Russian must still arrive readable behind the counter.
 */
function buildComment(form, personalisation, schedule) {
  return [
    form.comment,
    personalisation.occasion &&
      `Povod: ${OCCASION_SR[personalisation.occasion] ?? personalisation.occasion}`,
    personalisation.cardMessage && `Čestitka: „${personalisation.cardMessage}"`,
    personalisation.wishes && `Želje: ${personalisation.wishes}`,
    schedule.date && `Termin: ${schedule.date} u ${schedule.time} (${schedule.mode})`,
  ]
    .filter(Boolean)
    .join(' | ');
}

export default function CheckoutPage() {
  const { items, subtotal, delivery, clearCart } = useCart();
  const { t, tp } = useI18n();

  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmed, setConfirmed] = useState(null);
  const [schedule, setSchedule] = useState(EMPTY_SCHEDULE);
  const [personalisation, setPersonalisation] = useState(EMPTY_PERSONALISATION);
  const [busy, setBusy] = useState(null); // 'order' | 'locate' | 'voucher'
  const [error, setError] = useState(null);
  const geo = useGeolocation();
  const [lookupFailed, setLookupFailed] = useState(false);
  const [voucherInput, setVoucherInput] = useState('');
  const [voucher, setVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState(null);

  /**
   * Errors travel as a code plus the server's Serbian text. Translate the
   * code when we have a key for it, and fall back to the original so a new
   * server-side message is never swallowed into a blank alert.
   */
  const errorText = (err) =>
    err?.code ? t(`errors.${err.code}`, err.vars) : err?.message ?? '';

  const applyVoucher = async (event) => {
    event.preventDefault();
    setVoucherError(null);
    setBusy('voucher');
    try {
      setVoucher(await validateVoucher({ code: voucherInput, subtotal }));
    } catch (err) {
      setVoucher(null);
      setVoucherError(err);
    } finally {
      setBusy(null);
    }
  };

  const pickup = schedule.mode === 'preuzimanje';
  const scheduled = Boolean(schedule.date && schedule.time);

  const set = (field) => (event) => {
    setForm((f) => ({ ...f, [field]: event.target.value }));
  };

  /** Ask for location, then try to fill the address from it. */
  const useMyLocation = async () => {
    setError(null);
    const coords = await geo.request();
    if (!coords) return;

    setBusy('locate');
    setLookupFailed(false);
    try {
      const place = await reverseGeocode(coords);
      if (!place.street) throw new Error('no street');
      setForm((f) => ({ ...f, street: place.street, city: place.city || f.city }));
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
    setError(null);
    setBusy('order');
    try {
      const result = await sendOrder({
        customer: {
          name: form.name,
          phone: form.phone,
          street: form.street,
          city: form.city,
          comment: form.comment,
        },
        schedule,
        personalisation,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          size: i.sizeLabel,
          price: i.price,
          quantity: i.quantity,
        })),
        totals: {
          subtotal,
          discount,
          delivery: pickup ? 0 : delivery,
          total,
          voucherCode: voucher?.code ?? null,
        },
      });
      // Snapshot the cart before clearing — the receipt renders from it.
      setConfirmed({ ...result, loyaltyCode: `TROFEJ-${result.reference.slice(-6)}`, items, totals: { subtotal, discount, delivery: pickup ? 0 : delivery, total } });
      clearCart();
    } catch (err) {
      setError(err);
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
        <h1 className="mt-6 font-serif text-3xl text-brand-dark">{t('checkout.confirmed')}</h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600">
          {t('checkout.confirmedLead', { reference: confirmed.reference, phone: form.phone })}
        </p>

        <OrderReceipt
          reference={confirmed.reference}
          customer={form}
          schedule={schedule}
          personalisation={personalisation}
          items={confirmed.items}
          totals={confirmed.totals}
        />

        {confirmed.loyaltyCode && (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-brand-border bg-brand-mist px-6 py-5">
            <p className="text-sm text-brand-dark">{t('checkout.loyaltyLead')}</p>
            <p className="mt-2 font-mono text-xl font-bold tracking-wider text-brand-dark">
              {confirmed.loyaltyCode}
            </p>
            <p className="mt-2 text-xs text-brand-muted">{t('checkout.loyaltyNote')}</p>
          </div>
        )}

        {confirmed.mock && (
          <p className="mx-auto mt-8 flex max-w-lg items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-left text-xs leading-relaxed text-amber-900">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              <strong>{t('checkout.mockTitle')}</strong> {t('checkout.mockBody')}
            </span>
          </p>
        )}

        <div className="mt-6">
          <Link to="/" className="text-sm text-brand-primary-dark hover:underline">
            {t('common.back')}
          </Link>
        </div>
      </div>
    );
  }

  // ── Empty cart ───────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="container-editorial py-20 text-center lg:py-28">
        <h1 className="font-serif text-3xl text-brand-dark">{t('checkout.emptyTitle')}</h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600">{t('checkout.emptyLead')}</p>
        <Link to="/buketi" className="btn-primary mt-8">
          {t('checkout.emptyCta')}
        </Link>
      </div>
    );
  }

  const discount = voucher?.discount ?? 0;
  const total = Math.max(0, subtotal - discount) + (pickup ? 0 : delivery);

  return (
    <div className="container-editorial py-10 lg:py-14">
      <nav aria-label={t('common.breadcrumb')} className="mb-8">
        <ol className="flex items-center gap-1.5 text-xs text-brand-muted">
          <li>
            <Link to="/" className="transition-colors hover:text-brand-primary-dark">
              {t('common.home')}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <li aria-current="page" className="text-brand-dark">
            {t('checkout.title')}
          </li>
        </ol>
      </nav>

      <h1 className="font-serif text-3xl text-brand-dark sm:text-4xl">{t('checkout.title')}</h1>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Form */}
        <form onSubmit={placeOrder} className="lg:col-span-7">
          <fieldset disabled={busy !== null} className="space-y-5">
            <legend className="font-serif text-xl text-brand-dark">
              {t('checkout.details')}
            </legend>

            <Field
              label={t('checkout.name')}
              value={form.name}
              onChange={set('name')}
              required
            />
            <Field
              label={t('checkout.phone')}
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              required
              placeholder={t('checkout.phonePlaceholder')}
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
                  {t('checkout.useLocation')}
                </button>

                {geo.errorCode && (
                  <p className="text-xs text-brand-muted">{t(`errors.${geo.errorCode}`)}</p>
                )}
                {geo.status === 'granted' && !lookupFailed && (
                  <p className="text-xs text-brand-primary-dark">
                    {t('checkout.locationOk')}
                  </p>
                )}
                {geo.status === 'granted' && lookupFailed && (
                  <p className="text-xs text-brand-muted">
                    {t('checkout.locationNoStreet')}
                  </p>
                )}

                <Field
                  label={t('checkout.address')}
                  value={form.street}
                  onChange={set('street')}
                  required
                  placeholder={t('checkout.addressPlaceholder')}
                />
                <Field
                  label={t('checkout.city')}
                  value={form.city}
                  onChange={set('city')}
                  required
                />
              </>
            )}

            {pickup && (
              <p className="rounded-xl bg-brand-mist px-4 py-3 text-sm text-brand-dark">
                {t('checkout.pickupAt', { street: SHOP.street, city: SHOP.city })}
              </p>
            )}

            <Field
              label={t('checkout.note')}
              value={form.comment}
              onChange={set('comment')}
              placeholder={t('checkout.notePlaceholder')}
            />

            <div className="border-t border-brand-border pt-5">
              <ScheduleFields value={schedule} onChange={setSchedule} />
            </div>

            <div className="border-t border-brand-border pt-5">
              <PersonalisationFields value={personalisation} onChange={setPersonalisation} />
            </div>


            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorText(error)}
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
                {t('checkout.pickupCall')}
              </a>
            ) : (
              <button
                type="submit"
                disabled={!scheduled || busy !== null}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy === 'order' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t('checkout.sending')}
                  </>
                ) : (
                  t('checkout.submit')
                )}
              </button>
            )}

            {!scheduled && (
              <p className="text-xs text-brand-muted">{t('checkout.pickCombo')}</p>
            )}

          </fieldset>
        </form>

        {/* Summary */}
        <aside className="lg:col-span-5">
          <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
            <h2 className="font-serif text-xl text-brand-dark">{t('checkout.yourOrder')}</h2>

            <ul className="mt-5 divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 py-3">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-b from-brand-mist to-white">
                    <ProductImage
                      src={item.image}
                      alt={tp(item)}
                      category={item.category}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-sm text-brand-dark">{tp(item)}</p>
                    <p className="text-xs text-brand-muted">
                      {item.sizeId ? `${t(`sizes.${item.sizeId}`)} · ` : ''}
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
                <dt>{t('common.subtotal')}</dt>
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
                <dt>{pickup ? t('checkout.pickupMode') : t('checkout.deliveryWolt')}</dt>
                <dd className="font-medium text-brand-dark">
                  {pickup || delivery === 0 ? t('common.free') : formatPrice(delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-brand-border pt-3 text-base">
                <dt className="font-medium text-brand-dark">{t('common.total')}</dt>
                <dd className="font-semibold text-brand-dark">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {!pickup && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-primary/10 px-3 py-2.5 text-xs leading-relaxed text-brand-primary-dark">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {t('checkout.woltNote', {
                    amount: formatPrice(SHOP.freeDeliveryThreshold),
                  })}
                </span>
              </p>
            )}

            <form onSubmit={applyVoucher} className="mt-5 border-t border-brand-border pt-5">
              <label className="mb-2 block text-sm font-medium text-brand-dark" htmlFor="voucher">
                {t('checkout.voucher')}
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
                    aria-label={t('checkout.removeVoucher')}
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
                    placeholder={t('checkout.voucherPlaceholder')}
                    className="min-w-0 flex-1 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm uppercase tracking-wide text-brand-dark placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 focus:border-brand-primary-dark"
                  />
                  <button
                    type="submit"
                    disabled={!voucherInput || busy !== null}
                    className="shrink-0 rounded-xl border border-brand-border px-4 text-sm font-medium text-brand-dark transition hover:border-brand-primary disabled:opacity-50"
                  >
                    {busy === 'voucher' ? '…' : t('checkout.apply')}
                  </button>
                </div>
              )}
              {voucherError && (
                <p role="alert" className="mt-2 text-xs text-red-700">
                  {errorText(voucherError)}
                </p>
              )}
            </form>

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
