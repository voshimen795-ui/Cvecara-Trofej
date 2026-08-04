import { useEffect } from 'react';

/** Calls `handler` on Escape while `active` is true. */
export function useEscapeKey(active, handler) {
  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') handler();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, handler]);
}
