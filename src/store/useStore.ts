import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  CryptoState,
  CryptoCurrency,
  PriceChange,
  HistoricalPriceItem,
} from "@/types/cryptoTypes";

type ServerState = {
  topCryptos: CryptoCurrency[];
  changesMap: Map<string, PriceChange>;
};

export const useStore = create<CryptoState>()(
  devtools((set) => ({
    cryptocurrencies: [],
    priceChanges: new Map(),
    loading: false,
    initialized: false,
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
    hydrate: (serverData: ServerState) => {
      set({
        cryptocurrencies: serverData.topCryptos,
        priceChanges: new Map(serverData.changesMap),
        loading: false,
        initialized: true,
      });
    },
  }))
);

export const getServerSideStore = async () => {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const { setLoading, setError } = useStore.getState();

  try {
    setLoading(true);
    const res = await fetch(`${API_BASE}/assets?limit=10`);
    if (!res.ok) throw new Error("Failed to fetch top cryptocurrencies");
    const data = await res.json();
    const topCryptos = data.data;

    const today = Date.now();
    const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = today - 30 * 24 * 60 * 60 * 1000;

    const priceChanges = await Promise.all(
      topCryptos.map(async (crypto: CryptoCurrency) => {
        try {
          const historyRes = await fetch(
            `${API_BASE}/assets/${crypto.id}/history?interval=d1`
          );
          if (!historyRes.ok)
            throw new Error(`Failed to fetch history for ${crypto.id}`);

          const historyData = await historyRes.json();
          const history: HistoricalPriceItem[] = historyData.data;

          const price7DaysAgo = history.find(
            (entry) => Math.abs(entry.time - sevenDaysAgo) < 86400000
          )?.priceUsd;

          const price30DaysAgo = history.find(
            (entry) => Math.abs(entry.time - thirtyDaysAgo) < 86400000
          )?.priceUsd;

          const changePercent7d = price7DaysAgo
            ? (
                ((parseFloat(crypto.priceUsd) - parseFloat(price7DaysAgo)) /
                  parseFloat(price7DaysAgo)) *
                100
              ).toFixed(2)
            : "";

          const changePercent30d = price30DaysAgo
            ? (
                ((parseFloat(crypto.priceUsd) - parseFloat(price30DaysAgo)) /
                  parseFloat(price30DaysAgo)) *
                100
              ).toFixed(2)
            : "";

          return {
            id: crypto.id,
            changePercent7d,
            changePercent30d,
          };
        } catch (error: any) {
          console.error(error);
          return { id: crypto.id, changePercent7d: "", changePercent30d: "" };
        }
      })
    );

    const changesMap = new Map(
      priceChanges.map(({ id, ...rest }) => [id, rest])
    );
    return { topCryptos, changesMap };
  } catch (error: any) {
    console.error("Error fetching server-side store:", error);
    setError(error);
    return { topCryptos: [], changesMap: new Map() };
  } finally {
    setLoading(false);
  }
};
