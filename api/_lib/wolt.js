/**
 * Wolt Drive client.
 *
 * Wolt Drive is a last-mile carrier: the customer orders on our site, and Wolt
 * dispatches a courier from the shop to their door. It is NOT the Wolt
 * marketplace — nothing here lists us in the Wolt app.
 *
 * Verified against Wolt's public docs:
 *   base URL   https://daas-public-api.wolt.com
 *   auth       Authorization: Bearer <token>
 *   endpoints  POST /v1/venues/{venueId}/shipment-promises
 *              POST /v1/venues/{venueId}/deliveries
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOT verified: the exact request/response FIELD NAMES below. Wolt's endpoint
 * reference is behind an authenticated portal, so the payload shapes are built
 * from the documented description ("pickup and dropoff location, plus an ISO
 * 8601 expiry") rather than read off the spec.
 *
 * Everything uncertain is confined to buildPromiseBody / readPromise /
 * buildDeliveryBody / readDelivery below. When the dev token arrives, check
 * those four against the real docs — the rest of the app talks only to the
 * normalised shape they return.
 * ─────────────────────────────────────────────────────────────────────────
 */

// Read env per call rather than into module-level constants: consts freeze at
// cold start, which hides later config changes and makes the module untestable.
const base = () => process.env.WOLT_API_BASE || 'https://daas-public-api.wolt.com';
const token = () => process.env.WOLT_API_TOKEN;
const venueId = () => process.env.WOLT_VENUE_ID;

/** No token configured means we run in mock mode instead of failing. */
export const isMock = () => !token() || !venueId();

export class WoltError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'WoltError';
    this.status = status;
    this.body = body;
  }
}

async function call(path, body) {
  const res = await fetch(`${base()}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { raw: text };
  }

  if (!res.ok) {
    throw new WoltError(
      parsed?.error_message || parsed?.message || `Wolt returned ${res.status}`,
      res.status,
      parsed
    );
  }
  return parsed;
}

// ── Payload mapping — the part to check against the real docs ──────────────

const buildPromiseBody = ({ street, city, postCode, lat, lon }) => ({
  street,
  city,
  post_code: postCode,
  // Coordinates make the promise binding; without them Wolt returns a
  // non-binding estimate that can change when the courier is assigned.
  ...(lat != null && lon != null ? { lat, lon } : {}),
  min_preparation_time_minutes: 15,
});

const readPromise = (data) => ({
  promiseId: data.id ?? data.shipment_promise_id,
  price: data.price?.amount ?? data.price_amount,
  currency: data.price?.currency ?? data.price_currency ?? 'RSD',
  etaMinutes: data.estimated_delivery_time_minutes ?? data.eta_minutes,
  expiresAt: data.expires_at,
  binding: data.binding ?? false,
});

const buildDeliveryBody = ({ promiseId, customer, orderReference, comment }) => ({
  pickup: { comment: `Porudžbina ${orderReference}` },
  dropoff: {
    location: {
      formatted_address: `${customer.street}, ${customer.city}`,
    },
    comment: comment || '',
    contact_details: {
      name: customer.name,
      phone_number: customer.phone,
    },
  },
  shipment_promise_id: promiseId,
  merchant_order_reference_id: orderReference,
  is_no_contact: false,
});

const readDelivery = (data) => ({
  deliveryId: data.id ?? data.delivery_id,
  trackingUrl: data.tracking?.url ?? data.tracking_url,
  status: data.status,
});

// ── Public surface ─────────────────────────────────────────────────────────

/** Price and ETA for delivering to `address`. */
export async function getShipmentPromise(address) {
  if (isMock()) return mockPromise(address);
  const data = await call(`/v1/venues/${venueId()}/shipment-promises`, buildPromiseBody(address));
  return { ...readPromise(data), mock: false };
}

/** Books the courier against a promise returned by getShipmentPromise. */
export async function createDelivery(payload) {
  if (isMock()) return mockDelivery(payload);
  const data = await call(`/v1/venues/${venueId()}/deliveries`, buildDeliveryBody(payload));
  return { ...readDelivery(data), mock: false };
}

// ── Mock mode ──────────────────────────────────────────────────────────────
// Used until real credentials exist. Every response carries `mock: true` so
// the UI can say so out loud — nobody should think a courier was dispatched.

function mockPromise(address) {
  // Rough Belgrade-ish pricing so the checkout maths is exercised properly.
  const flat = 390;
  const variable = Math.min(((address.street || '').length % 7) * 45, 270);
  return {
    promiseId: `mock-promise-${Date.now()}`,
    price: flat + variable,
    currency: 'RSD',
    etaMinutes: 35 + (variable % 20),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    binding: false,
    mock: true,
  };
}

function mockDelivery({ orderReference }) {
  return {
    deliveryId: `mock-delivery-${Date.now()}`,
    trackingUrl: null,
    status: 'MOCK_ACCEPTED',
    orderReference,
    mock: true,
  };
}
