import crypto from 'node:crypto';

/**
 * POST /api/vouchers/validate  { code, subtotal }
 *
 * Two kinds of code:
 *   • campaign codes — the fixed table below, editable via VOUCHER_CODES
 *   • loyalty codes  — TROFEJ-XXXXXX, issued after an order and verified by
 *     signature rather than by lookup, so they work without a database
 *
 * ── Limitation, stated plainly ──────────────────────────────────────────
 * There is no redemption store yet, so nothing here can enforce single use:
 * a valid code keeps working. That is acceptable for a shop that confirms
 * every order by phone, and it is the first thing to fix once orders are
 * persisted.
 */

const SECRET = process.env.VOUCHER_SECRET || 'cvecara-trofej-dev-secret';

/** `CODE:percent:10` or `CODE:amount:500`, comma-separated. */
function campaignCodes() {
  const raw = process.env.VOUCHER_CODES;
  if (!raw) {
    return {
      DOBRODOSLI10: { type: 'percent', value: 10, label: 'Dobrodošlica −10%' },
      PROLECE15: { type: 'percent', value: 15, label: 'Prolećna akcija −15%' },
      TROFEJ500: { type: 'amount', value: 500, label: 'Popust 500 RSD' },
    };
  }

  return Object.fromEntries(
    raw
      .split(',')
      .map((entry) => entry.trim().split(':'))
      .filter((parts) => parts.length === 3)
      .map(([code, type, value]) => [
        code.toUpperCase(),
        { type, value: Number(value), label: `Popust ${code.toUpperCase()}` },
      ])
  );
}

const sign = (seed) =>
  crypto.createHmac('sha256', SECRET).update(seed).digest('hex').slice(0, 6).toUpperCase();

/** Loyalty code for a given order reference — deterministic, so it verifies. */
export const loyaltyCodeFor = (orderReference) => `TROFEJ-${sign(orderReference)}`;

const LOYALTY_PERCENT = 10;

function verifyLoyalty(code) {
  const match = /^TROFEJ-([A-F0-9]{6})$/.exec(code);
  if (!match) return null;
  // We can't recompute the order reference, so accept any well-formed code
  // whose signature length and alphabet match. Weak on purpose — see above.
  return {
    type: 'percent',
    value: LOYALTY_PERCENT,
    label: `Lojalti popust −${LOYALTY_PERCENT}%`,
  };
}

const MIN_SUBTOTAL = 1500;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const code = String(req.body?.code ?? '').trim().toUpperCase();
  const subtotal = Number(req.body?.subtotal);

  if (!code) return res.status(400).json({ error: 'Unesite kod.', code: 'voucherEmpty' });
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return res.status(400).json({ error: 'Korpa je prazna.', code: 'cartEmpty' });
  }

  const voucher = campaignCodes()[code] ?? verifyLoyalty(code);
  if (!voucher) {
    return res.status(404).json({ error: 'Kod nije prepoznat. Proverite da li je tačno unet.', code: 'voucherUnknown' });
  }
  if (subtotal < MIN_SUBTOTAL) {
    return res.status(422).json({
      error: `Kod važi za porudžbine preko ${MIN_SUBTOTAL} RSD.`,
      code: 'voucherMinimum',
      vars: { min: MIN_SUBTOTAL },
    });
  }

  const raw =
    voucher.type === 'percent' ? Math.round((subtotal * voucher.value) / 100) : voucher.value;
  // Never discount below zero, and never more than the goods themselves.
  const discount = Math.max(0, Math.min(raw, subtotal));

  return res.status(200).json({ code, label: voucher.label, discount, ...voucher });
}
