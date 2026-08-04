/**
 * Browser-side calls to our own serverless functions. The Wolt token lives on
 * the server only — nothing here ever sees it.
 */

async function post(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    // A non-JSON body means the /api function isn't there: a static preview,
    // or `npm run dev` instead of `vercel dev`.
    throw new Error(
      'Servis za dostavu nije dostupan na ovoj adresi. Radi na Vercel deploy-u ' +
        '(lokalno: `vercel dev`). Porudžbine možete primiti i telefonom.'
    );
  }

  if (!res.ok) throw new Error(data.error || 'Greška u komunikaciji sa Woltom.');
  return data;
}

export const fetchDeliveryQuote = (address) => post('/api/wolt/quote', address);
export const submitOrder = (payload) => post('/api/wolt/delivery', payload);
