"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useApi } from "@/hooks/useApi";

import CryptoTable from "@/components/CryptoTable";
import { Loading } from "@/components/Loading";

export default function Dashboard() {
  const { cryptocurrencies, priceChanges, loading, error } = useStore();
  const { fetchTop10Cryptocurrencies } = useApi();
  const { isConnected, reconnect } = useWebSocket();

  useEffect(() => {
    const connectionCheckInterval = setInterval(() => {
      if (!isConnected()) {
        console.warn("WebSocket disconnected, attempting reconnect...");
        reconnect();
      }
    }, 30000);

    return () => {
      clearInterval(connectionCheckInterval);
    };
  }, [fetchTop10Cryptocurrencies, isConnected, reconnect]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading && cryptocurrencies.length === 0) {
    return <Loading />;
  }

  const tableData = cryptocurrencies
    ? cryptocurrencies.map((item) => ({
        ...item,
        changePercent7d: priceChanges?.get(item.id)?.changePercent7d || "",
        changePercent30d: priceChanges?.get(item.id)?.changePercent30d || "",
      }))
    : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Top 10 Cryptocurrencies</h2>
      <CryptoTable cryptocurrencies={tableData} />
    </div>
  );
}
