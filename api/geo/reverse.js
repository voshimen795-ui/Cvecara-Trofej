/**
 * POST /api/geo/reverse  { lat, lon }
 *
 * Turns browser coordinates into a street address via OpenStreetMap's
 * Nominatim. Server-side so the browser makes no cross-origin call and so a
 * paid geocoder can be swapped in later without touching the frontend.
 *
 * Nominatim's usage policy requires an identifying User-Agent and allows at
 * most 1 request/second — fine for a checkout form, not for bulk lookups.
 */
const ENDPOINT = 'https://nominatim.openstreetmap.org/reverse';
const UA = process.env.GEOCODER_USER_AGENT || 'CvecaraTrofej/1.0 (cvecaratrofej@gmail.com)';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lat = Number(req.body?.lat);
  const lon = Number(req.body?.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return res.status(400).json({ error: 'Nedostaju koordinate.' });
  }
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ error: 'Koordinate su van opsega.' });
  }

  const url = `${ENDPOINT}?lat=${lat}&lon=${lon}&format=jsonv2&addressdetails=1&accept-language=sr`;

  try {
    const upstream = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!upstream.ok) throw new Error(`Nominatim ${upstream.status}`);

    const data = await upstream.json();
    const a = data.address ?? {};
    const houseNumber = a.house_number ? ` ${a.house_number}` : '';
    const road = a.road || a.pedestrian || a.footway || '';

    return res.status(200).json({
      street: road ? `${road}${houseNumber}`.trim() : '',
      city: a.city || a.town || a.village || a.municipality || '',
      postCode: a.postcode || '',
      formatted: data.display_name || '',
      lat,
      lon,
    });
  } catch (err) {
    console.error('geo/reverse failed', err);
    // Not fatal: the caller still has coordinates, which are what Wolt needs.
    return res.status(502).json({ error: 'Nije uspelo prepoznavanje adrese.' });
  }
}
