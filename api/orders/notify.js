/**
 * POST /api/orders/notify
 *
 * Emails the shop a finished order. This is how an order actually reaches the
 * florist while we're on the Wolt Drive **web app** flow: the site takes the
 * order, the florist reads this mail and books the courier by hand in Wolt's
 * dashboard. When the Drive API is live this becomes a notification rather
 * than the delivery mechanism.
 *
 * Uses Resend (https://resend.com) — a free key, no business verification.
 * Without RESEND_API_KEY the endpoint reports mock: true and sends nothing,
 * so checkout still works end to end in development.
 */

const ENDPOINT = 'https://api.resend.com/emails';

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const rsd = (n) => `${Number(n).toLocaleString('sr-RS')} RSD`;

function buildHtml({ reference, customer, items, schedule, personalisation, totals }) {
  const rows = items
    .map(
      (i) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #E5E7EB">${esc(i.name)}${
          i.size ? ` <span style="color:#6B7280">(${esc(i.size)})</span>` : ''
        }</td>
        <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;text-align:center">${Number(i.quantity)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;text-align:right">${rsd(i.price * i.quantity)}</td>
      </tr>`
    )
    .join('');

  const line = (label, value) =>
    value ? `<p style="margin:2px 0"><strong>${label}:</strong> ${esc(value)}</p>` : '';

  return `<div style="font-family:system-ui,-apple-system,sans-serif;color:#1C2826;max-width:640px">
    <h2 style="font-family:Georgia,serif;color:#3D7A73;margin:0 0 4px">Nova porudžbina ${esc(reference)}</h2>
    <p style="color:#6B7280;margin:0 0 20px">Sa sajta Cvećara Trofej</p>

    <h3 style="margin:20px 0 6px">Kupac</h3>
    ${line('Ime', customer.name)}
    ${line('Telefon', customer.phone)}
    ${line('Adresa', customer.street && `${customer.street}, ${customer.city}`)}

    <h3 style="margin:20px 0 6px">Termin</h3>
    ${line('Način', schedule?.mode)}
    ${line('Datum', schedule?.date)}
    ${line('Vreme', schedule?.time)}

    <h3 style="margin:20px 0 6px">Artikli</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>

    <p style="margin:14px 0 2px"><strong>Međuzbir:</strong> ${rsd(totals.subtotal)}</p>
    ${totals.discount ? `<p style="margin:2px 0"><strong>Popust:</strong> −${rsd(totals.discount)}</p>` : ''}
    <p style="margin:2px 0"><strong>Dostava:</strong> ${totals.delivery ? rsd(totals.delivery) : 'Besplatno'}</p>
    <p style="margin:2px 0;font-size:16px"><strong>Ukupno: ${rsd(totals.total)}</strong></p>

    ${
      personalisation?.occasion || personalisation?.cardMessage || personalisation?.wishes
        ? `<h3 style="margin:20px 0 6px">Personalizacija</h3>
           ${line('Povod', personalisation.occasion)}
           ${line('Čestitka', personalisation.cardMessage)}
           ${line('Želje', personalisation.wishes)}`
        : ''
    }
    ${line('Napomena', customer.comment)}
    ${line('Vaučer', totals.voucherCode)}
  </div>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customer, items, schedule, personalisation, totals } = req.body ?? {};

  if (!customer?.name || !customer?.phone) {
    return res.status(400).json({ error: 'Ime i telefon su obavezni.', code: 'orderFields' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Korpa je prazna.', code: 'cartEmpty' });
  }

  const reference = `CT-${Date.now().toString(36).toUpperCase()}`;
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_EMAIL_TO || 'cvecaratrofej@gmail.com';
  const from = process.env.ORDER_EMAIL_FROM || 'Cvecara Trofej <onboarding@resend.dev>';

  if (!key) {
    // Nothing configured: report honestly rather than pretending it was sent.
    return res.status(200).json({ reference, mock: true });
  }

  try {
    const upstream = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: customer.email || undefined,
        subject: `Nova porudžbina ${reference} — ${customer.name}`,
        html: buildHtml({ reference, customer, items, schedule, personalisation, totals }),
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error('resend failed', upstream.status, detail);
      return res.status(502).json({
        error: 'Porudžbina nije poslata mejlom. Pozovite nas da je potvrdimo.',
        code: 'mailFailed',
        reference,
      });
    }

    return res.status(201).json({ reference, mock: false });
  } catch (err) {
    console.error('orders/notify failed', err);
    return res.status(500).json({ error: 'Greška pri slanju porudžbine.', code: 'orderFailed', reference });
  }
}
