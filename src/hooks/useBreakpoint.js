import { useEffect, useState } from 'react';

const QUERIES = {
  desktop: '(min-width: 1024px)',
  tablet: '(min-width: 640px)',
};

/** Returns 'desktop' | 'tablet' | 'mobile', updating on resize. */
export function useBreakpoint() {
  const read = () => {
    if (typeof window === 'undefined') return 'desktop';
    if (window.matchMedia(QUERIES.desktop).matches) return 'desktop';
    if (window.matchMedia(QUERIES.tablet).matches) return 'tablet';
    return 'mobile';
  };

  const [breakpoint, setBreakpoint] = useState(read);

  useEffect(() => {
    const lists = Object.values(QUERIES).map((q) => window.matchMedia(q));
    const onChange = () => setBreakpoint(read());
    lists.forEach((l) => l.addEventListener('change', onChange));
    onChange();
    return () => lists.forEach((l) => l.removeEventListener('change', onChange));
  }, []);

  return breakpoint;
}
