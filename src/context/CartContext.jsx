import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { SHOP } from '../data/shop.js';

const STORAGE_KEY = 'cvecara-trofej:cart';
const MAX_QTY = 99;

const CartContext = createContext(null);

function reducer(items, action) {
  switch (action.type) {
    case 'add': {
      const { product, quantity = 1 } = action;
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QTY) }
            : item
        );
      }
      return [
        ...items,
        {
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
        return items.filter((item) => item.id !== action.id);
      }
      return items.map((item) =>
        item.id === action.id
          ? { ...item, quantity: Math.min(action.quantity, MAX_QTY) }
          : item
      );
    }

    case 'remove':
      return items.filter((item) => item.id !== action.id);

    case 'clear':
      return [];

    default:
      return items;
  }
}

/** Reads persisted cart lazily so SSR/first paint never touches localStorage twice. */
function init() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
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
    const qualifiesForFreeDelivery = subtotal >= SHOP.freeDeliveryThreshold;
    const delivery = items.length === 0 || qualifiesForFreeDelivery ? 0 : SHOP.deliveryFee;

    return {
      items,
      isOpen,
      totalItems,
      subtotal,
      delivery,
      total: subtotal + delivery,
      qualifiesForFreeDelivery,
      amountToFreeDelivery: Math.max(SHOP.freeDeliveryThreshold - subtotal, 0),
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
      addItem: (product, quantity) => {
        dispatch({ type: 'add', product, quantity });
        setIsOpen(true);
      },
      increment: (id, current) => dispatch({ type: 'setQuantity', id, quantity: current + 1 }),
      decrement: (id, current) => dispatch({ type: 'setQuantity', id, quantity: current - 1 }),
      removeItem: (id) => dispatch({ type: 'remove', id }),
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
