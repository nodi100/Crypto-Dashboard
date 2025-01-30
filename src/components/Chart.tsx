// /app/components/Chart.tsx
import React from "react";
import { Line } from "react-chartjs-2";

type ChartProps = {
  chartData: { labels: string[]; datasets: any[] } | null;
};

const Chart = ({ chartData }: ChartProps) => {
  if (!chartData) return <p>Loading chart...</p>;

  return <Line data={chartData} />;
};

export default Chart;
