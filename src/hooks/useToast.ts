"use client";

/**
 * Toast Hook
 * Simplified interface for showing toast notifications
 */

import { useGlobalState } from "@/contexts/GlobalStateContext";
import { useCallback, useMemo } from "react";

export function useToast() {
  const { addNotification } = useGlobalState();

  const success = useCallback(
    (message: string) => addNotification(message, "success"),
    [addNotification]
  );

  const error = useCallback(
    (message: string) => addNotification(message, "error"),
    [addNotification]
  );

  const warning = useCallback(
    (message: string) => addNotification(message, "warning"),
    [addNotification]
  );

  const info = useCallback(
    (message: string) => addNotification(message, "info"),
    [addNotification]
  );

  return useMemo(
    () => ({
      success,
      error,
      warning,
      info,
    }),
    [success, error, warning, info]
  );
}
