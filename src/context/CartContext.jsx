import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
// Bumped when the stored shape changes. v3 dropped bouquet sizes and changed
// every price, so older lines would carry a stale price into checkout.
const STORAGE_KEY = 'cvecara-trofej:cart:v3';
const MAX_QTY = 99;

const CartContext = createContext(null);

function reducer(items, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity = 1 } = action;
      const key = product.id;

      const existing = items.find((item) => item.key === key);
      if (existing) {
        return items.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QTY) }
            : item
        );
      }

      return [
        ...items,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: Math.min(quantity, MAX_QTY),
        },
      ];
    }

    case 'setQuantity': {
      // Dropping to zero removes the line rather than leaving an empty row.
      if (action.quantity < 1) {
        return items.filter((item) => item.key !== action.key);
      }
      return items.map((item) =>
        item.key === action.key
          ? { ...item, quantity: Math.min(action.quantity, MAX_QTY) }
          : item
      );
    }

    case 'remove':
      return items.filter((item) => item.key !== action.key);

    case 'clear':
      return [];

    default:
      return items;
  }
}

/** Reads persisted cart lazily so first paint never touches localStorage twice. */
function init() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Guard against a hand-edited or partially migrated payload.
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.key) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, init);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked (private mode) — the cart still works in memory.
    }
  }, [items]);

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      isOpen,
      totalItems,
      subtotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
      addItem: (product, quantity) => {
        dispatch({ type: 'add', product, quantity });
        setIsOpen(true);
      },
      increment: (key, current) => dispatch({ type: 'setQuantity', key, quantity: current + 1 }),
      decrement: (key, current) => dispatch({ type: 'setQuantity', key, quantity: current - 1 }),
      removeItem: (key) => dispatch({ type: 'remove', key }),
      clearCart: () => dispatch({ type: 'clear' }),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return context;
}
