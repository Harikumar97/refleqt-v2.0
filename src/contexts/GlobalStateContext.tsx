"use client";

/**
 * Global State Context
 * Manages application-wide state like obsession score, notifications, etc.
 */

import React, { createContext, useContext, useState, useCallback } from "react";

interface GlobalState {
  obsessionScore: number;
  obsessionLevel: string;
  notifications: Notification[];
  activeFeature: string | null;
}

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timestamp: number;
}

interface GlobalStateContextValue {
  state: GlobalState;
  updateObsessionScore: (increase: number, action: string) => void;
  addNotification: (message: string, type: Notification["type"]) => void;
  removeNotification: (id: string) => void;
  setActiveFeature: (feature: string | null) => void;
  getObsessionLevel: (score: number) => string;
}

const GlobalStateContext = createContext<GlobalStateContextValue | undefined>(
  undefined
);

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GlobalState>({
    obsessionScore: 8.4,
    obsessionLevel: "Highly Focused",
    notifications: [],
    activeFeature: null,
  });

  const getObsessionLevel = useCallback((score: number): string => {
    if (score < 3) return "Curious";
    if (score < 5) return "Engaged";
    if (score < 7) return "Focused";
    if (score < 9) return "Obsessed";
    return "Hyper-Obsessed";
  }, []);

  const updateObsessionScore = useCallback(
    (increase: number, action: string) => {
      setState((prev) => {
        const newScore = Math.min(
          10,
          Math.max(0, prev.obsessionScore + increase)
        );
        const newLevel = getObsessionLevel(newScore);

        return {
          ...prev,
          obsessionScore: newScore,
          obsessionLevel: newLevel,
        };
      });

      // Add notification about score update
      addNotification(
        `${action} completed! Obsession score ${increase > 0 ? "increased" : "decreased"} by ${Math.abs(increase).toFixed(1)}`,
        "success"
      );
    },
    [getObsessionLevel]
  );

  const addNotification = useCallback(
    (message: string, type: Notification["type"]) => {
      const id = `notif-${Date.now()}-${Math.random()}`;
      const notification: Notification = {
        id,
        message,
        type,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        notifications: [...prev.notifications, notification],
      }));

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  }, []);

  const setActiveFeature = useCallback((feature: string | null) => {
    setState((prev) => ({
      ...prev,
      activeFeature: feature,
    }));
  }, []);

  const value: GlobalStateContextValue = {
    state,
    updateObsessionScore,
    addNotification,
    removeNotification,
    setActiveFeature,
    getObsessionLevel,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
