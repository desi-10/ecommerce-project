"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string; // variantId or productId
  name: string;
  price: number;
  image: string;
  brand?: string;
};

type WishlistState = {
  items: WishlistItem[];

  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  toggle: (item: WishlistItem) => void;

  has: (id: string) => boolean;
  clear: () => void;
  count: () => number;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        if (get().items.some((i) => i.id === item.id)) return;
        set({ items: [item, ...get().items] });
      },

      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        if (exists) set({ items: get().items.filter((i) => i.id !== item.id) });
        else set({ items: [item, ...get().items] });
      },

      has: (id) => get().items.some((i) => i.id === id),

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    { name: "wishlist-storage" },
  ),
);
