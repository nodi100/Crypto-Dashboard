import { useCallback } from "react";
import { useStore } from "@/store/useStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const useApi = () => {
  const { setLoading, setError, setCryptocurrencies } = useStore();

  const apiCall = useCallback(
    async (endpoint: string, method: string, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          method,
          ...options,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          new Error("Failed to fetch top cryptocurrencies");
        }
        return response.json();
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, setLoading, setError]
  );

  const get = useCallback(
    (endpoint: string, options = {}) => apiCall(endpoint, "GET", options),
    [apiCall]
  );

  const post = useCallback(
    (endpoint: string, body: Object, options = {}) =>
      apiCall(endpoint, "POST", { ...options, body: JSON.stringify(body) }),
    [apiCall]
  );

  const fetchTop10Cryptocurrencies = useCallback(async () => {
    try {
      const response = await get(`/assets?limit=10`);
      setCryptocurrencies(response.data);
    } catch (error) {
      setError("Failed to fetch cryptocurrency data");
      console.error("API error:", error);
    }
  }, [setError, setCryptocurrencies]);

  const fetchHistoricalData = useCallback(
    async (timeRange: string, selectedCrypto?: string | string[]) => {
      const interval = timeRange === "24h" ? "h1" : "d1";
      try {
        const response = await get(
          `/assets/${selectedCrypto}/history?interval=${interval}`
        );
        return response.data;
      } catch (error) {
        setError("Failed to fetch historical data");
        console.error("Historical data error:", error);
        return [];
      }
    },
    [setError]
  );

  const convertCrypto = useCallback(
    async (fromId: string, toId: string, amount: number) => {
      try {
        const fromData = await get(`/assets/${fromId}`);
        const toData = await get(`/assets/${toId}`);

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
    get,
    post,
  };
};
