import { Suspense } from "react";
import DashboardPage from "./dashboard/page";
import { Loading } from "@/components/Loading";
import type {
  CryptoCurrency,
  HistoricalPriceItem,
  PriceChange,
} from "@/types/cryptoTypes";

async function getData() {
  const API_BASE = "https://api.coincap.io/v2";

  const res = await fetch(`${API_BASE}/assets?limit=10`, { cache: "no-store" });
  const data = await res.json();
  const topCryptos = data.data;

  const today = Date.now();
  const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = today - 30 * 24 * 60 * 60 * 1000;

  const priceChanges: PriceChange[] = await Promise.all(
    topCryptos.map(async (crypto: CryptoCurrency) => {
      const historyRes = await fetch(
        `${API_BASE}/assets/${crypto.id}/history?interval=d1`
      );
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
    })
  );

  const changesMap = new Map(priceChanges.map(({ id, ...rest }) => [id, rest]));
  return { topCryptos, changesMap };
}

export default async function Home() {
  const initialData = await getData();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crypto Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<Loading />}>
          <DashboardPage
            topCryptos={initialData.topCryptos}
            priceChanges={initialData.changesMap}
          />
        </Suspense>
      </div>
    </main>
  );
}
