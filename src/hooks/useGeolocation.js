import { useCallback, useState } from 'react';

const MESSAGES = {
  1: 'Pristup lokaciji je odbijen. Možete uneti adresu ručno.',
  2: 'Lokacija trenutno nije dostupna. Unesite adresu ručno.',
  3: 'Isteklo je vreme za očitavanje lokacije. Pokušajte ponovo ili unesite adresu.',
};

/**
 * Asks for the browser's location on demand — never on page load, so the
 * permission prompt only appears when the customer taps the button.
 */
export function useGeolocation() {
  const [status, setStatus] = useState('idle'); // idle | asking | granted | error
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');

  const request = useCallback(
    () =>
      new Promise((resolve) => {
        if (!('geolocation' in navigator)) {
          setStatus('error');
          setError('Vaš pregledač ne podržava geolokaciju.');
          return resolve(null);
        }

        setStatus('asking');
        setError('');

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
            setError(MESSAGES[err.code] || 'Nije uspelo očitavanje lokacije.');
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      }),
    []
  );

  return { status, coords, error, request };
}
