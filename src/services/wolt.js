/**
 * Browser-side calls to our own serverless functions. The Wolt token lives on
 * the server only — nothing here ever sees it.
 *
 * Errors carry a `code` as well as a message. The code is what the UI
 * translates; the message is the server's Serbian original, kept as the
 * fallback for anything we haven't given a key yet.
 */

class ServiceError extends Error {
  constructor(code, message, vars) {
    super(message);
    this.code = code;
    this.vars = vars;
  }
}

async function post(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ServiceError('network', 'Greška u komunikaciji sa serverom.');
  }

  let data;
  try {
    data = await res.json();
  } catch {
    // A non-JSON body means the /api function isn't there: a static preview,
    // or `npm run dev` instead of `vercel dev`.
    throw new ServiceError(
      'offline',
      'Servis nije dostupan na ovoj adresi. Radi na objavljenom sajtu.'
    );
  }

  if (!res.ok) {
    throw new ServiceError(data.code ?? 'network', data.error ?? 'Greška.', data.vars);
  }
  return data;
}

export const fetchDeliveryQuote = (address) => post('/api/wolt/quote', address);
export const submitOrder = (payload) => post('/api/wolt/delivery', payload);
export const reverseGeocode = (coords) => post('/api/geo/reverse', coords);
export const fetchDistance = (where) => post('/api/geo/distance', where);
export const sendOrder = (payload) => post('/api/orders/notify', payload);
