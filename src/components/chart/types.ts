export type ChartDataItem = {
  time: string;
  price: number;
};

export interface ChartProps {
  chartData: ChartDataItem[];
}
