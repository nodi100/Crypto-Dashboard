"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Chart from "@/components/chart/Chart";
import { useApi } from "@/hooks/useApi";
import { timeRangeOptions } from "@/utils/constants";
import type { HistoricalPriceItem } from "@/types/cryptoTypes";
import type { ChartDataItem } from "@/components/chart/types";

export default function History() {
  const params = useParams();
  const id = params?.id || "";

  const { fetchHistoricalData } = useApi();
  const [historyData, setHistoryData] = useState<HistoricalPriceItem[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [timeRange, setTimeRange] = useState<string>("24h");

  useEffect(() => {
    loadChartData(timeRange);
  }, []);

  const loadChartData = async (timeRange: string) => {
    try {
      const data = await fetchHistoricalData(timeRange, id);
      setHistoryData(data);
      convertToChartData(timeRange, data);
    } catch (error) {
      console.error("Failed to load chart data:", error);
    }
  };

  const handleChangePeriod = (newRange: string) => {
    setTimeRange(newRange);
    if (
      newRange === "24h" ||
      (timeRange === "24h" && (newRange === "7d" || newRange === "30d"))
    ) {
      loadChartData(newRange);
    } else {
      convertToChartData(newRange, historyData);
    }
  };

  const convertToChartData = (range: string, data: HistoricalPriceItem[]) => {
    const finalData =
      range === "24h"
        ? data?.slice(-24) || []
        : range === "7d"
        ? data.slice(-7)
        : data.slice(-30);

    const chartData = finalData.map((item: HistoricalPriceItem) => ({
      time:
        range === "24h"
          ? new Date(item.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(item.time).toLocaleDateString(),
      price: parseFloat(item.priceUsd),
    }));

    setChartData(chartData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base sm:text-xl font-semibold">Price History</h2>
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChangePeriod(option.value)}
              className={`px-2 py-1 rounded-md text-sm sm:px-4 sm:py-2 sm:text-base ${
                timeRange === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <Chart chartData={chartData} />
    </div>
  );
}
