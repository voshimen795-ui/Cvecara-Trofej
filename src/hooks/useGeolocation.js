import { useCallback, useState } from 'react';

/**
 * Positions' own error codes, mapped to our translation keys. The hook hands
 * back a key rather than a sentence — a hook has no locale, and the component
 * that renders the message does.
 */
const CODES = { 1: 'denied', 2: 'unavailable', 3: 'timeout' };

/**
 * Asks for the browser's location on demand — never on page load, so the
 * permission prompt only appears when the customer taps the button.
 */
export function useGeolocation() {
  const [status, setStatus] = useState('idle'); // idle | asking | granted | error
  const [coords, setCoords] = useState(null);
  const [errorCode, setErrorCode] = useState('');

  const request = useCallback(
    () =>
      new Promise((resolve) => {
        if (!('geolocation' in navigator)) {
          setStatus('error');
          setErrorCode('unsupported');
          return resolve(null);
        }

        setStatus('asking');
        setErrorCode('');

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const next = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              accuracy: position.coords.accuracy,
            };
            setCoords(next);
            setStatus('granted');
            resolve(next);
          },
          (err) => {
            setStatus('error');
            setErrorCode(CODES[err.code] ?? 'location');
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }),
    []
  );

  return { status, coords, errorCode, request };
}
