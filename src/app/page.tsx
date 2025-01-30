import { Suspense } from "react";
import DashboardPage from "./dashboard/page";
import { Loading } from "@/components/Loading";

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crypto Dashboard</h1>
      <div>
        <Suspense fallback={<Loading />}>
          <DashboardPage />
        </Suspense>
      </div>
    </main>
  );
}
