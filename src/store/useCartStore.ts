import { create } from 'zustand';

export interface CartItem {
  id: string; // unique identifier (productId or productId-variantId)
  productId: string;
  shopId: string;
  name: string;
  slug: string;
  priceXOF: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotalXOF: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.id === item.id);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += item.quantity;
      } else {
        updatedItems = [...state.items, item];
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('mahugnon_cart', JSON.stringify(updatedItems));
      }
      return { items: updatedItems };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const updatedItems = state.items.filter((i) => i.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mahugnon_cart', JSON.stringify(updatedItems));
      }
      return { items: updatedItems };
    });
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => {
      const updatedItems = state.items.map((i) => (i.id === id ? { ...i, quantity } : i));
      if (typeof window !== 'undefined') {
        localStorage.setItem('mahugnon_cart', JSON.stringify(updatedItems));
      }
      return { items: updatedItems };
    });
  },

  clearCart: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mahugnon_cart');
    }
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },

  getSubtotalXOF: () => {
    return get().items.reduce((acc, item) => acc + item.priceXOF * item.quantity, 0);
  },
}));
