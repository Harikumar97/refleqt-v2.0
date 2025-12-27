"use client";

/**
 * Toast Notification Component
 * Displays toast notifications from global state
 */

import { useGlobalState } from "@/contexts/GlobalStateContext";
import { useEffect, useState } from "react";

export function ToastContainer() {
  const { state, removeNotification } = useGlobalState();
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Show new notifications
    state.notifications.forEach((notification) => {
      if (!visible[notification.id]) {
        setVisible((prev) => ({ ...prev, [notification.id]: true }));
      }
    });
  }, [state.notifications, visible]);

  const handleClose = (id: string) => {
    setVisible((prev) => ({ ...prev, [id]: false }));
    setTimeout(() => {
      removeNotification(id);
    }, 300); // Wait for animation
  };

  return (
    <div className="fixed top-5 right-5 z-[2000] flex flex-col gap-3 pointer-events-none">
      {state.notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          visible={visible[notification.id] ?? false}
          onClose={() => handleClose(notification.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  notification: {
    id: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  };
  visible: boolean;
  onClose: () => void;
}

function Toast({ notification, visible, onClose }: ToastProps) {
  const typeStyles = {
    success: "gradient-success",
    error: "gradient-error",
    warning: "gradient-warning",
    info: "gradient-primary",
  };

  const typeIcons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ⓘ",
  };

  return (
    <div
      className={`
        ${typeStyles[notification.type]}
        text-white px-5 py-3 rounded-lg shadow-xl
        font-medium text-sm max-w-sm
        flex items-center gap-3
        transition-all duration-300
        pointer-events-auto
        ${visible ? "animate-slide-in opacity-100" : "animate-slide-out opacity-0"}
      `}
      onClick={onClose}
      style={{ cursor: "pointer" }}
    >
      <span className="text-lg font-bold">{typeIcons[notification.type]}</span>
      <span className="flex-1">{notification.message}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="text-white/80 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
