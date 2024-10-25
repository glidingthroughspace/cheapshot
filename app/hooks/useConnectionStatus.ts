import { useState } from "react";

export type ConnectionStatus = "disconnected" | "connecting" | "connected";

export function useConnectionStatus() {
  const [currentConnectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  return [currentConnectionStatus, setConnectionStatus] as const;
}
