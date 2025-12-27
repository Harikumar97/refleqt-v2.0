"use client";

/**
 * Event Bus Context
 * Enables cross-component and cross-feature communication
 */

import React, { createContext, useContext, useCallback, useRef } from "react";

type EventCallback = (data: any) => void;

interface EventBusContextValue {
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: EventCallback) => () => void;
}

const EventBusContext = createContext<EventBusContextValue | undefined>(
  undefined
);

export function EventBusProvider({ children }: { children: React.ReactNode }) {
  const listeners = useRef<Record<string, EventCallback[]>>({});

  const emit = useCallback((event: string, data?: any) => {
    const eventListeners = listeners.current[event];
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }

    // Log event for debugging
    console.log(`[EventBus] ${event}`, data);
  }, []);

  const on = useCallback((event: string, callback: EventCallback) => {
    if (!listeners.current[event]) {
      listeners.current[event] = [];
    }

    listeners.current[event].push(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = listeners.current[event];
      if (eventListeners) {
        listeners.current[event] = eventListeners.filter(
          (cb) => cb !== callback
        );
      }
    };
  }, []);

  const value: EventBusContextValue = {
    emit,
    on,
  };

  return (
    <EventBusContext.Provider value={value}>
      {children}
    </EventBusContext.Provider>
  );
}

export function useEventBus() {
  const context = useContext(EventBusContext);
  if (context === undefined) {
    throw new Error("useEventBus must be used within an EventBusProvider");
  }
  return context;
}

/**
 * Common Event Types
 * Standardized events used across the application
 */
export const EVENTS = {
  // Analysis Events
  ANALYSIS_STARTED: "analysis_started",
  ANALYSIS_COMPLETED: "analysis_completed",
  ANALYSIS_FAILED: "analysis_failed",

  // Brew Events
  BREW_STARTED: "brew_started",
  BREW_COMPLETED: "brew_completed",
  BREW_FAILED: "brew_failed",

  // Research Events
  SWARM_STARTED: "swarm_started",
  SWARM_COMPLETED: "swarm_completed",
  SWARM_PROGRESS: "swarm_progress",

  // Obsession Events
  OBSESSION_UPDATED: "obsession_updated",
  OBSESSION_MILESTONE: "obsession_milestone",

  // Navigation Events
  FEATURE_ACTIVATED: "feature_activated",
  FEATURE_DEACTIVATED: "feature_deactivated",

  // Data Events
  DATA_REFRESHED: "data_refreshed",
  DATA_UPDATED: "data_updated",

  // UI Events
  TOAST_SHOW: "toast_show",
  MODAL_OPEN: "modal_open",
  MODAL_CLOSE: "modal_close",
} as const;
