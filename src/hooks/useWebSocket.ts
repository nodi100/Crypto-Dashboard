import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import type { CryptoCurrency } from "@/types/cryptoTypes";
import type { WebSocketData } from "@/types/webSocketTypes";

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const { setCryptocurrencies, setError } = useStore();
  const lastPricesRef = useRef<Record<string, string>>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const data: WebSocketData = JSON.parse(event.data);

        setCryptocurrencies((prevCryptos: CryptoCurrency[]) => {
          return prevCryptos.map((crypto) => {
            const newPrice = data[crypto.id];

            if (newPrice && newPrice !== lastPricesRef.current[crypto.id]) {
              lastPricesRef.current[crypto.id] = newPrice;
              return { ...crypto, priceUsd: newPrice };
            }

            return crypto;
          });
        });
      };

      ws.onerror = (error) => {
        setError("WebSocket connection error");
        console.error("WebSocket error:", error);
        handleReconnect();
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        handleReconnect();
      };

      ws.onopen = () => {
        console.log("WebSocket connected");
        // Clear any pending reconnection attempts when successfully connected
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      handleReconnect();
    }
  };

  const handleReconnect = () => {
    // Clear any existing WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Clear any existing reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Attempt to reconnect after 5 seconds
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log("Attempting to reconnect WebSocket...");
      connectWebSocket();
    }, 5000);
  };

  useEffect(() => {
    connectWebSocket();

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      // Clear the last prices when unmounting
      lastPricesRef.current = {};
    };
  }, [setCryptocurrencies, setError]);

  // Add a function to check connection status
  const isConnected = () => {
    return wsRef.current?.readyState === WebSocket.OPEN;
  };

  return {
    webSocket: wsRef.current,
    isConnected,
    reconnect: connectWebSocket,
  };
};
