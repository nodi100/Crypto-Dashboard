import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import type { CryptoCurrency } from "@/types/cryptoTypes";
import type { WebSocketData, WebSocketHandlers } from "@/types/webSocketTypes";

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<WebSocketHandlers | null>(null);
  const { setCryptocurrencies, setError } = useStore();
  const lastPricesRef = useRef<Record<string, string>>({});
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualClose = useRef(false);

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    isManualClose.current = false;

    try {
      const ws = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
      wsRef.current = ws;

      const handleMessage = (event: MessageEvent) => {
        const data: WebSocketData = JSON.parse(event.data);
        setCryptocurrencies((prevCryptos: CryptoCurrency[]) =>
          prevCryptos.map((crypto) => {
            const newPrice = data[crypto.id];
            if (newPrice && newPrice !== lastPricesRef.current[crypto.id]) {
              lastPricesRef.current[crypto.id] = newPrice;
              return { ...crypto, priceUsd: newPrice };
            }
            return crypto;
          })
        );
      };

      const handleError = (error: Event) => {
        setError("WebSocket connection error");
        console.error("WebSocket error:", error);
        if (!isManualClose.current) handleReconnect();
      };

      const handleClose = () => {
        console.log("WebSocket connection closed");
        if (!isManualClose.current) handleReconnect();
      };

      const handleOpen = () => {
        console.log("WebSocket connected");
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      // Store handlers in ref
      handlersRef.current = {
        handleMessage,
        handleError,
        handleClose,
        handleOpen,
      };

      // Add event listeners
      ws.addEventListener("message", handleMessage);
      ws.addEventListener("error", handleError);
      ws.addEventListener("close", handleClose);
      ws.addEventListener("open", handleOpen);
    } catch (error) {
      console.error("WebSocket connection failed:", error);
      handleReconnect();
    }
  };

  const handleReconnect = () => {
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (isManualClose.current) return;

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log("Attempting to reconnect...");
      connectWebSocket();
    }, 5000);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      isManualClose.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        const ws = wsRef.current;

        // Remove listeners using stored handlers
        if (handlersRef.current) {
          const { handleMessage, handleError, handleClose, handleOpen } =
            handlersRef.current;
          ws.removeEventListener("message", handleMessage);
          ws.removeEventListener("error", handleError);
          ws.removeEventListener("close", handleClose);
          ws.removeEventListener("open", handleOpen);
        }

        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
        wsRef.current = null;
      }

      lastPricesRef.current = {};
      handlersRef.current = null;
    };
  }, [setCryptocurrencies, setError]);

  const isConnected = wsRef.current?.readyState === WebSocket.OPEN;

  return {
    webSocket: wsRef.current,
    isConnected,
    reconnect: connectWebSocket,
  };
};
