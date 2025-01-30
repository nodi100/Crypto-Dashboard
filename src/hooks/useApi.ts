import { useCallback } from "react";
import { useStore } from "@/store/useStore";

const API_BASE = "https://api.coincap.io/v2";

export const useApi = () => {
  const { setLoading, setError, setCryptocurrencies } = useStore();

  const fetchTop10Cryptocurrencies = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/assets?limit=10`);
      const data = await response.json();

      setCryptocurrencies(data.data);
    } catch (error) {
      setError("Failed to fetch cryptocurrency data");
      console.error("API error:", error);
    }
  }, [setError, setCryptocurrencies]);

  const fetchHistoricalData = useCallback(
    async (timeRange: string, selectedCrypto?: string | string[]) => {
      const interval = timeRange === "24h" ? "h1" : "d1";
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/assets/${selectedCrypto}/history?interval=${interval}`
        );
        const data = await response.json();
        return data.data;
      } catch (error) {
        setError("Failed to fetch historical data");
        console.error("Historical data error:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const convertCrypto = useCallback(
    async (fromId: string, toId: string, amount: number) => {
      try {
        const [fromData, toData] = await Promise.all([
          fetch(`${API_BASE}/assets/${fromId}`).then((res) => res.json()),
          fetch(`${API_BASE}/assets/${toId}`).then((res) => res.json()),
        ]);

        const fromPrice = parseFloat(fromData.data.priceUsd);
        const toPrice = parseFloat(toData.data.priceUsd);

        return (amount * fromPrice) / toPrice;
      } catch (error) {
        setError("Failed to convert cryptocurrency");
        console.error("Conversion error:", error);
        return null;
      }
    },
    [setError]
  );

  return {
    fetchTop10Cryptocurrencies,
    fetchHistoricalData,
    convertCrypto,
  };
};
