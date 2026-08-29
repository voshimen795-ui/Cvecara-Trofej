/**
 * POST /api/geo/distance  { lat, lon }  or  { street, city }
 *
 * How far the customer is from the shop, so checkout can price the delivery by
 * zone instead of charging one flat fee.
 *
 * Distance is straight-line (haversine), not driving distance — a router would
 * need a paid API, and for a courier fee banded into 3/6/10/15 km zones the
 * difference almost never changes which band you land in. Said out loud in the
 * response as `method: 'straight-line'` so nobody mistakes it for a road route.
 *
 * The shop's own coordinates are geocoded once and cached rather than typed in
 * by hand: a mistyped shop coordinate would silently mis-price every order.
 */
const SEARCH = 'https://nominatim.openstreetmap.org/search';
const UA = process.env.GEOCODER_USER_AGENT || 'CvecaraTrofej/1.0 (cvecara.trofej@gmail.com)';
const SHOP_ADDRESS = 'Dimitrija Tucovića 128, Beograd, Srbija';

/**
 * Last-resort coordinates for the shop, used only if Nominatim is unreachable.
 * Approximate — Dimitrija Tucovića, Zvezdara. Because it is a guess, a request
 * that falls back to it is flagged `approximate: true` and the UI says the
 * price is an estimate rather than quoting a firm number.
 */
const SHOP_FALLBACK = { lat: 44.7955, lon: 20.4995 };

// Coordinates are not secret and never change, so caching across invocations
// on a warm lambda is a win. (Unlike env vars, which are read per call.)
let shopCoords = null;

async function geocode(query) {
  const url = `${SEARCH}?q=${encodeURIComponent(query)}&format=jsonv2&limit=1&accept-language=sr`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`nominatim ${res.status}`);
  const [hit] = await res.json();
  if (!hit) throw new Error('no match');
  return { lat: Number(hit.lat), lon: Number(hit.lon) };
}

/** Great-circle distance in kilometres. */
function haversine(a, b) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lat, lon, street, city } = req.body ?? {};

  let approximate = false;

  // Where the shop is.
  if (!shopCoords) {
    try {
      shopCoords = await geocode(SHOP_ADDRESS);
    } catch {
      shopCoords = SHOP_FALLBACK;
      approximate = true;
    }
  } else if (shopCoords === SHOP_FALLBACK) {
    approximate = true;
  }

  // Where the customer is: coordinates if the browser gave them, otherwise the
  // typed address. Coordinates are the better signal, so they win.
  let target;
  if (Number.isFinite(Number(lat)) && Number.isFinite(Number(lon))) {
    target = { lat: Number(lat), lon: Number(lon) };
  } else if (street) {
    try {
      target = await geocode(`${street}, ${city || 'Beograd'}, Srbija`);
    } catch {
      return res
        .status(404)
        .json({ error: 'Nije uspelo prepoznavanje adrese.', code: 'geoLookup' });
    }
  } else {
    return res.status(400).json({ error: 'Nedostaju koordinate.', code: 'geoMissing' });
  }

  const km = haversine(shopCoords, target);

  if (!Number.isFinite(km)) {
    return res.status(502).json({ error: 'Nije uspelo prepoznavanje adrese.', code: 'geoLookup' });
  }

  return res.status(200).json({
    km: Math.round(km * 10) / 10,
    method: 'straight-line',
    approximate,
  });
}
