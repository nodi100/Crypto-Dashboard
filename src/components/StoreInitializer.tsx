"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export default function StoreInitializer({
  serverState,
}: {
  serverState: any;
}) {
  const hydrate = useStore((state) => state.hydrate);

  useEffect(() => {
    if (serverState) {
      hydrate(serverState);
    }
  }, [serverState, hydrate]);

  return null;
}
