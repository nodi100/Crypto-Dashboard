"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import History from "@/pages/History";
import { Loading } from "@/components/Loading";

export default function HistoryPage() {
  const params = useParams();
  const { id } = params;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{`${id} history`}</h1>

      <div className="max-w-2xl mx-auto">
        <Suspense fallback={<Loading />}>
          <History />
        </Suspense>
      </div>
    </main>
  );
}
