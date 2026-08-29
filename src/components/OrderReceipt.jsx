import { Printer } from 'lucide-react';
import { HOURS_DISPLAY, SHOP } from '../data/shop.js';
import { formatPrice } from '../utils/format.js';
import { useI18n } from '../i18n/index.jsx';

/**
 * Printable order receipt. `window.print()` on the same page rather than a PDF
 * library: the browser's own dialog already offers "Save as PDF" everywhere,
 * and it keeps the bundle from growing by ~300 KB. Print rules in index.css
 * hide the rest of the page.
 */
export default function OrderReceipt({ reference, customer, schedule, items, totals }) {
  const { t, tp } = useI18n();

  return (
    <>
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-ghost mt-4 print:hidden"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
        {t('receipt.print')}
      </button>

      <div
        id="racun"
        className="mx-auto mt-8 max-w-lg rounded-2xl border border-brand-border bg-white p-6 text-left print:mt-0 print:max-w-none print:rounded-none print:border-0 print:p-0"
      >
        <header className="border-b border-brand-border pb-4">
          <p className="font-serif text-lg font-bold tracking-widest text-brand-dark">
            CVEĆARA TROFEJ
          </p>
          <p className="mt-1 text-xs text-brand-muted">
            {SHOP.street}, {SHOP.city} · {SHOP.phone} · {SHOP.email}
          </p>
        </header>

        <div className="flex items-baseline justify-between pt-4">
          <h3 className="font-serif text-lg text-brand-dark">{t('receipt.title')}</h3>
          <p className="font-mono text-sm font-bold text-brand-dark">{reference}</p>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <dt className="text-brand-muted">{t('receipt.customer')}</dt>
          <dd className="text-brand-dark">{customer.name}</dd>
          <dt className="text-brand-muted">{t('receipt.phone')}</dt>
          <dd className="tabular-nums text-brand-dark">{customer.phone}</dd>
          {schedule?.mode === 'dostava' && customer.street && (
            <>
              <dt className="text-brand-muted">{t('receipt.address')}</dt>
              <dd className="text-brand-dark">
                {customer.street}, {customer.city}
              </dd>
            </>
          )}
          <dt className="text-brand-muted">{t('receipt.mode')}</dt>
          <dd className="text-brand-dark">
            {schedule?.mode === 'preuzimanje' ? t('receipt.modePickup') : t('receipt.modeDelivery')}
          </dd>
          {schedule?.date && (
            <>
              <dt className="text-brand-muted">{t('receipt.slot')}</dt>
              <dd className="tabular-nums text-brand-dark">
                {t('receipt.slotValue', { date: schedule.date, time: schedule.time })}
              </dd>
            </>
          )}
        </dl>

        <table className="mt-5 w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left text-xs uppercase tracking-wide text-brand-muted">
              <th className="pb-2 font-medium">{t('receipt.item')}</th>
              <th className="pb-2 text-center font-medium">{t('receipt.qty')}</th>
              <th className="pb-2 text-right font-medium">{t('receipt.amount')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key} className="border-b border-brand-border/60">
                <td className="py-2 text-brand-dark">
                  {tp(item)}
                  {item.sizeId && (
                    <span className="text-brand-muted"> ({t(`sizes.${item.sizeId}`)})</span>
                  )}
                </td>
                <td className="py-2 text-center tabular-nums text-brand-dark">{item.quantity}</td>
                <td className="py-2 text-right tabular-nums text-brand-dark">
                  {formatPrice(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-brand-muted">{t('common.subtotal')}</dt>
            <dd className="tabular-nums text-brand-dark">{formatPrice(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-brand-muted">{t('common.delivery')}</dt>
            <dd className="tabular-nums text-brand-dark">
              {totals.delivery ? formatPrice(totals.delivery) : t('common.free')}
            </dd>
          </div>
          <div className="flex justify-between border-t border-brand-border pt-2 text-base font-semibold">
            <dt className="text-brand-dark">{t('common.total')}</dt>
            <dd className="tabular-nums text-brand-dark">{formatPrice(totals.total)}</dd>
          </div>
        </dl>

        <p className="mt-5 border-t border-brand-border pt-4 text-xs leading-relaxed text-brand-muted">
          {t('receipt.legal', {
            weekdayHours: HOURS_DISPLAY[0].time,
            saturdayHours: HOURS_DISPLAY[1].time,
          })}
        </p>
      </div>
    </>
  );
}
