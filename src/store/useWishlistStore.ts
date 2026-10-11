import { create } from 'zustand';

export interface WishlistItemData {
  productId: string;
  name: string;
  slug: string;
  priceXOF: number;
  imageUrl?: string;
  shopSlug?: string;
}

interface WishlistState {
  items: WishlistItemData[];
  addItem: (item: WishlistItemData) => void;
  removeItem: (productId: string) => void;
  toggleItem: (item: WishlistItemData) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      if (state.items.some((i) => i.productId === item.productId)) return state;
      const updated = [...state.items, item];
      if (typeof window !== 'undefined') {
        localStorage.setItem('mahugnon_wishlist', JSON.stringify(updated));
      }
      return { items: updated };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const updated = state.items.filter((i) => i.productId !== productId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mahugnon_wishlist', JSON.stringify(updated));
      }
      return { items: updated };
    });
  },

  toggleItem: (item) => {
    if (get().isInWishlist(item.productId)) {
      get().removeItem(item.productId);
    } else {
      get().addItem(item);
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.productId === productId);
  },

  clearWishlist: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mahugnon_wishlist');
    }
    set({ items: [] });
  },
}));
