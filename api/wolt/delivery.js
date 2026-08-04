import { createDelivery, isMock, WoltError } from '../_lib/wolt.js';

/**
 * POST /api/wolt/delivery
 * Body: { promiseId, customer: { name, phone, street, city }, items, comment }
 *
 * Books the courier. Note there is no order store or payment yet: this
 * dispatches the delivery and returns its tracking info, nothing more.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { promiseId, customer, items, comment } = req.body ?? {};

  if (!promiseId) {
    return res.status(400).json({ error: 'Nedostaje ponuda za dostavu.' });
  }
  if (!customer?.name || !customer?.phone || !customer?.street || !customer?.city) {
    return res.status(400).json({ error: 'Ime, telefon i adresa su obavezni.' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Korpa je prazna.' });
  }

  const orderReference = `CT-${Date.now().toString(36).toUpperCase()}`;

  try {
    const delivery = await createDelivery({ promiseId, customer, orderReference, comment });
    return res.status(201).json({ ...delivery, orderReference });
  } catch (err) {
    if (err instanceof WoltError) {
      // An expired promise is the common case — the quote only holds ~15 min.
      const expired = err.status === 404 || /promise/i.test(err.message);
      return res.status(expired ? 409 : 502).json({
        error: expired
          ? 'Ponuda za dostavu je istekla. Osvežite cenu dostave i pokušajte ponovo.'
          : 'Wolt nije prihvatio porudžbinu. Pozovite nas da je završimo telefonom.',
        detail: err.message,
        mock: isMock(),
      });
    }
    console.error('wolt/delivery failed', err);
    return res.status(500).json({ error: 'Greška pri slanju porudžbine.' });
  }
}
