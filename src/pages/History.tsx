"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "@/store/useStore";
import { useApi } from "@/hooks/useApi";
import { Loading } from "@/components/Loading";
import { timeRangeOptions } from "@/utils/constants";
import type { HistoricalPriceItem } from "@/types/cryptoTypes";

interface ChartData {
  time: string;
  price: number;
}

export default function History() {
  const params = useParams();
  const id = params?.id || "";

  const { loading } = useStore();
  const { fetchHistoricalData } = useApi();
  const [historyData, setHistoryData] = useState<HistoricalPriceItem[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = useState<string>("24h");

  useEffect(() => {
    loadChartData(timeRange);
  }, []);

  const loadChartData = async (timeRange: string) => {
    try {
      const data = await fetchHistoricalData(timeRange, id);
      setHistoryData(data);
      convertToChartData(data, timeRange);
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
      convertToChartData(historyData, newRange);
    }
  };

  const convertToChartData = (data: HistoricalPriceItem[], range: string) => {
    const finalData =
      range === "24h"
        ? data.slice(-24)
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
        <h2 className="text-xl font-semibold">Price History</h2>
        <div className="flex gap-2">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleChangePeriod(option.value)}
              className={`px-4 py-2 rounded-md ${
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

      <div className="h-[400px]">
        {loading ? (
          <Loading />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={["auto", "auto"]}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
