import { getShipmentPromise, isMock, WoltError } from '../_lib/wolt.js';

/**
 * POST /api/wolt/quote
 * Body: { street, city, postCode?, lat?, lon? }
 *
 * Runs server-side so the Wolt bearer token never reaches the browser.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { street, city, postCode, lat, lon } = req.body ?? {};

  if (!street || !city) {
    return res.status(400).json({ error: 'Adresa i grad su obavezni.' });
  }

  try {
    const promise = await getShipmentPromise({ street, city, postCode, lat, lon });
    return res.status(200).json(promise);
  } catch (err) {
    if (err instanceof WoltError) {
      // Wolt's own 4xx usually means the address is outside the delivery area.
      const status = err.status >= 400 && err.status < 500 ? 422 : 502;
      return res.status(status).json({
        error:
          status === 422
            ? 'Wolt trenutno ne pokriva ovu adresu. Pozovite nas i dogovorićemo dostavu.'
            : 'Wolt trenutno ne odgovara. Pokušajte ponovo za koji minut.',
        detail: err.message,
        mock: isMock(),
      });
    }
    console.error('wolt/quote failed', err);
    return res.status(500).json({ error: 'Greška pri računanju dostave.' });
  }
}
