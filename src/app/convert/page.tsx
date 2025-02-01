import { Suspense } from "react";
import Converter from "@/pages/Converter";
import Loading from "@/components/Loading";

export default function ConvertPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cryptocurrency Converter</h1>

      <div className="w-full">
        <Suspense fallback={<Loading />}>
          <Converter />
        </Suspense>
      </div>
    </main>
  );
}
