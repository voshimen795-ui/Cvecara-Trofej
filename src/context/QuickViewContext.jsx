import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ProductQuickView from '../components/ProductQuickView.jsx';

const QuickViewContext = createContext(null);

/**
 * One modal for the whole app. Any grid can open it, so the size choice is
 * always one tap away no matter which page the product was seen on.
 */
export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null);

  const open = useCallback((next) => setProduct(next), []);
  const close = useCallback(() => setProduct(null), []);

  const value = useMemo(() => ({ open, close, product }), [open, close, product]);

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <ProductQuickView product={product} onClose={close} />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) throw new Error('useQuickView must be used within a <QuickViewProvider>');
  return context;
}
