import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CryptoState } from "@/types/cryptoTypes";

export const useStore = create<CryptoState>()(
  devtools((set) => ({
    cryptocurrencies: [],
    priceChanges: null,
    loading: false,
    error: null,
    setCryptocurrencies: (data) => {
      set((state) => ({
        cryptocurrencies:
          typeof data === "function" ? data(state.cryptocurrencies) : data,
      }));
    },
    setPriceChanges(data) {
      set({ priceChanges: data });
    },
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  }))
);
