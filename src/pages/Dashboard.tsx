"use client";

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useApi } from "@/hooks/useApi";

import { wantedRates } from "@/utils/constants";
import Table from "@/components/table/Table";
import Loading from "@/components/Loading";
import Select from "@/components/select/Select";

export default function Dashboard() {
  const {
    cryptocurrencies,
    priceChanges,
    rates,
    selectedPriceUnit,
    loading,
    error,
    setSelectedPriceUnit,
  } = useStore();
  const { fetchTop10Cryptocurrencies, getRates } = useApi();
  const { isConnected, reconnect } = useWebSocket();

  const [sortConfig, setSortConfig] = useState<{
    key: "name" | "price" | null;
    direction: "asc" | "desc";
  }>({ key: "price", direction: "desc" });

  const filterdRates = useMemo(() => {
    const filtered = rates.filter((item) => wantedRates.includes(item.symbol));
    const finalData = filtered.filter(
      (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
    );
    return finalData;
  }, [rates]);

  useEffect(() => {
    getRates();
  }, []);

  useEffect(() => {
    const connectionCheckInterval = setInterval(() => {
      if (!isConnected) {
        console.warn("WebSocket disconnected, attempting reconnect...");
        reconnect();
      }
    }, 30000);

    const pollInterval = setInterval(() => {
      if (!isConnected) {
        fetchTop10Cryptocurrencies();
      }
    }, 60000); // use pooling as backup method if websocket broke down.

    return () => {
      clearInterval(connectionCheckInterval);
      clearInterval(pollInterval);
    };
  }, [isConnected, reconnect, fetchTop10Cryptocurrencies]);

  const handleSort = (key: "name" | "price") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSelectPriceUnit = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    const selectedText = event.target.options[event.target.selectedIndex].text;
    const symbol = filterdRates.find(
      (item) => item.symbol === selectedText
    )?.currencySymbol;

    setSelectedPriceUnit({
      symbol: symbol || "₾",
      rateUsd: selectedValue,
      name: selectedText,
    });
  };

  const sortedCryptos = cryptocurrencies ? [...cryptocurrencies] : [];
  if (sortConfig.key) {
    sortedCryptos.sort((a, b) => {
      if (sortConfig.key === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
        if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      } else if (sortConfig.key === "price") {
        const priceA = parseFloat(a.priceUsd);
        const priceB = parseFloat(b.priceUsd);
        return sortConfig.direction === "asc"
          ? priceA - priceB
          : priceB - priceA;
      }
      return 0;
    });
  }

  const tableData = sortedCryptos.map((item) => ({
    ...item,
    changePercent7d: priceChanges?.get(item.id)?.changePercent7d || "",
    changePercent30d: priceChanges?.get(item.id)?.changePercent30d || "",
  }));

  const selectOtions = filterdRates.map((rate) => ({
    label: rate.symbol,
    value: rate.rateUsd,
  }));

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading && cryptocurrencies.length === 0) {
    return <Loading />;
  }

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Top 10 Cryptocurrencies</h2>
        <Select
          options={selectOtions}
          label="Price Unit"
          className="w-[60px] border rounded-md"
          value={selectedPriceUnit.rateUsd}
          onChange={(e) => handleSelectPriceUnit(e)}
        />
      </div>
      <Table
        cryptocurrencies={tableData}
        onSort={handleSort}
        sortConfig={sortConfig}
      />
    </div>
  );
}
