import { Suspense } from "react";
import Dashboard from "@/pages/Dashboard";
import Loading from "@/components/Loading";

export default function DashboardPage() {
  return (
    <main className="w-full">
      <div>
        <Suspense fallback={<Loading />}>
          <Dashboard />
        </Suspense>
      </div>
    </main>
  );
}
