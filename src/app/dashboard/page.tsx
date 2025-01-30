"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Suspense } from "react";
import Dashboard from "@/pages/Dashboard";
import { Loading } from "@/components/Loading";
import { CryptoCurrency } from "@/types/cryptoTypes";

export default function DashboardPage({
  topCryptos,
  priceChanges,
}: {
  topCryptos: CryptoCurrency[];
  priceChanges: any;
}) {
  const { setCryptocurrencies, setPriceChanges } = useStore();

  useEffect(() => {
    setCryptocurrencies(topCryptos);
    setPriceChanges(priceChanges);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cryptocurrency Converter</h1>

      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<Loading />}>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  );
}
