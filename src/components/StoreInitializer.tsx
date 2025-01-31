"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { CryptoCurrency, PriceChange } from "@/types/cryptoTypes";

export default function StoreInitializer({
  serverState,
}: {
  serverState: {
    topCryptos: CryptoCurrency[];
    changesMap: Map<string, PriceChange>;
  };
}) {
  const hydrate = useStore((state) => state.hydrate);

  useEffect(() => {
    if (serverState) {
      hydrate(serverState);
    }
  }, [serverState, hydrate]);

  return null;
}
