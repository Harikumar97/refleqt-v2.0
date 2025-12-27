"use client";

/**
 * Sprint 1 Test Page
 * Comprehensive testing for design system, global state, and toast notifications
 */

import { useGlobalState } from "@/contexts/GlobalStateContext";
import { useEventBus, EVENTS } from "@/contexts/EventBusContext";
import { useToast } from "@/hooks/useToast";
import { Badge, NavStatus, StatusDot, LiveIndicator } from "@/components/ui";
import { useState, useEffect } from "react";

export default function TestSprint1Page() {
  const { state, updateObsessionScore } = useGlobalState();
  const { emit, on } = useEventBus();
  const toast = useToast();
  const [eventLog, setEventLog] = useState<string[]>([]);

  useEffect(() => {
    // Listen to all events
    const unsubAnalysis = on(EVENTS.ANALYSIS_STARTED, () => {
      addToEventLog("Analysis started");
    });
    const unsubBrew = on(EVENTS.BREW_STARTED, () => {
      addToEventLog("Brew started");
    });
    const unsubObsession = on(EVENTS.OBSESSION_UPDATED, (data) => {
      addToEventLog(`Obsession updated: ${JSON.stringify(data)}`);
    });

    return () => {
      unsubAnalysis();
      unsubBrew();
      unsubObsession();
    };
  }, [on]);

  const addToEventLog = (message: string) => {
    setEventLog((prev) => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev.slice(0, 9),
    ]);
  };

  // Test functions
  const testToastSuccess = () => {
    toast.success("Success! Your data has been saved successfully.");
  };

  const testToastError = () => {
    toast.error("Error! Failed to connect to the server.");
  };

  const testToastWarning = () => {
    toast.warning("Warning! Your session will expire in 5 minutes.");
  };

  const testToastInfo = () => {
    toast.info("Info: New updates are available for your dashboard.");
  };

  const testMultipleToasts = () => {
    toast.info("Toast 1: Starting batch process...");
    setTimeout(() => toast.warning("Toast 2: Processing data..."), 200);
    setTimeout(() => toast.success("Toast 3: Batch process completed!"), 400);
  };

  const testRapidToasts = () => {
    for (let i = 1; i <= 5; i++) {
      setTimeout(() => {
        toast.info(`Rapid toast #${i}`);
      }, i * 100);
    }
  };

  const testLongMessage = () => {
    toast.info(
      "This is a very long notification message to test how the toast component handles text overflow and wrapping. It should display properly without breaking the layout or causing visual issues in the notification container."
    );
  };

  const increaseObsession = () => {
    updateObsessionScore(0.5, "Manual increase test");
    emit(EVENTS.OBSESSION_UPDATED, { change: 0.5, action: "Manual increase" });
    toast.success(
      `Obsession increased to ${(state.obsessionScore + 0.5).toFixed(1)}`
    );
  };

  const decreaseObsession = () => {
    updateObsessionScore(-0.5, "Manual decrease test");
    emit(EVENTS.OBSESSION_UPDATED, { change: -0.5, action: "Manual decrease" });
    toast.warning(
      `Obsession decreased to ${(state.obsessionScore - 0.5).toFixed(1)}`
    );
  };

  const testMaxObsession = () => {
    updateObsessionScore(10, "Max obsession test");
    emit(EVENTS.OBSESSION_UPDATED, { change: 10, action: "Max test" });
    toast.info("Set obsession to maximum (10.0)");
  };

  const testMinObsession = () => {
    updateObsessionScore(-10, "Min obsession test");
    emit(EVENTS.OBSESSION_UPDATED, { change: -10, action: "Min test" });
    toast.warning("Set obsession to minimum (0.0)");
  };

  const testResetObsession = () => {
    updateObsessionScore(8.4 - state.obsessionScore, "Reset obsession");
    emit(EVENTS.OBSESSION_UPDATED, { change: 0, action: "Reset" });
    toast.info("Reset obsession to default (8.4)");
  };

  const testEventBus = () => {
    emit(EVENTS.ANALYSIS_STARTED, { type: "Market Research", id: "test-001" });
    toast.info("Analysis event emitted");
  };

  const testBrewEvent = () => {
    emit(EVENTS.BREW_STARTED, { contentType: "Article", topic: "AI Trends" });
    toast.info("Brew event emitted");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black gradient-text-funnel mb-2">
          Sprint 1 Test Dashboard
        </h1>
        <p className="text-gray-400">
          Comprehensive testing for design system, global state management, and
          UI components
        </p>
      </div>

      {/* Current Global State */}
      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">📊 Global State</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/10 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Obsession Score</div>
            <div className="text-3xl font-black gradient-text-funnel">
              {state.obsessionScore.toFixed(1)}
            </div>
            <div className="text-sm font-semibold text-green-400 mt-1">
              {state.obsessionLevel}
            </div>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">
              Active Notifications
            </div>
            <div className="text-3xl font-black text-purple-300">
              {state.notifications.length}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {state.activeFeature || "None"}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Tests */}
      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          🔔 Toast Notifications
        </h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Basic Variants
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testToastSuccess}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
            >
              ✓ Success Toast
            </button>
            <button
              onClick={testToastError}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
            >
              ✕ Error Toast
            </button>
            <button
              onClick={testToastWarning}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-medium transition-colors"
            >
              ⚠ Warning Toast
            </button>
            <button
              onClick={testToastInfo}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              ℹ Info Toast
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Edge Case Tests
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testMultipleToasts}
              className="px-4 py-2 glass rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
            >
              📚 Multiple Toasts (3)
            </button>
            <button
              onClick={testRapidToasts}
              className="px-4 py-2 glass rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
            >
              ⚡ Rapid Fire (5 toasts)
            </button>
            <button
              onClick={testLongMessage}
              className="px-4 py-2 glass rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
            >
              📝 Long Message
            </button>
          </div>
        </div>
      </div>

      {/* Obsession Score Tests */}
      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          🎯 Obsession Score Tests
        </h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Incremental Changes
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={increaseObsession}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
            >
              ↑ Increase (+0.5)
            </button>
            <button
              onClick={decreaseObsession}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors"
            >
              ↓ Decrease (-0.5)
            </button>
            <button
              onClick={testResetObsession}
              className="px-4 py-2 glass rounded-lg font-medium text-white hover:bg-white/10 transition-colors"
            >
              🔄 Reset to 8.4
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Boundary Tests
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testMaxObsession}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              🔝 Max (10.0)
            </button>
            <button
              onClick={testMinObsession}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
            >
              ⬇️ Min (0.0)
            </button>
          </div>
        </div>
      </div>

      {/* Event Bus Tests */}
      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          📡 Event Bus Tests
        </h2>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={testEventBus}
              className="px-4 py-2 gradient-funnel text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              🔬 Emit Analysis Event
            </button>
            <button
              onClick={testBrewEvent}
              className="px-4 py-2 gradient-brewery text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              🍺 Emit Brew Event
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Event Log
          </h3>
          <div className="bg-gray-900/50 rounded-lg p-4 h-48 overflow-y-auto custom-scrollbar-dark">
            {eventLog.length === 0 ? (
              <div className="text-gray-500 text-sm italic">
                No events yet...
              </div>
            ) : (
              <div className="space-y-1">
                {eventLog.map((log, idx) => (
                  <div key={idx} className="text-xs text-gray-300 font-mono">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UI Components Showcase */}
      <div className="glass-dark rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">🎨 UI Components</h2>

        <div className="space-y-6">
          {/* Badges */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Badges</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="new">NEW</Badge>
              <Badge variant="new">3</Badge>
              <Badge variant="count">12</Badge>
              <Badge variant="count">99+</Badge>
            </div>
          </div>

          {/* Status Indicators */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Status Indicators
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <NavStatus status="running" />
                <span className="text-sm text-gray-300">Running</span>
              </div>
              <div className="flex items-center gap-2">
                <NavStatus status="processing" />
                <span className="text-sm text-gray-300">Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <NavStatus status="completed" />
                <span className="text-sm text-gray-300">Completed</span>
              </div>
            </div>
          </div>

          {/* Status Dots */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Status Dots
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <StatusDot status="success" />
                <span className="text-sm text-gray-300">Success</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="error" />
                <span className="text-sm text-gray-300">Error</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="warning" />
                <span className="text-sm text-gray-300">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="processing" />
                <span className="text-sm text-gray-300">Processing</span>
              </div>
            </div>
          </div>

          {/* Live Indicators */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Live Indicators
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              <LiveIndicator active={true} label="LIVE" />
              <LiveIndicator active={true} label="ACTIVE" />
              <LiveIndicator active={true} label="Processing" />
            </div>
          </div>

          {/* Gradients */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Gradient System
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="gradient-primary h-16 rounded-lg flex items-center justify-center text-white font-bold">
                Primary
              </div>
              <div className="gradient-funnel h-16 rounded-lg flex items-center justify-center text-white font-bold">
                Funnel
              </div>
              <div className="gradient-brewery h-16 rounded-lg flex items-center justify-center text-white font-bold">
                Brewery
              </div>
              <div className="gradient-success h-16 rounded-lg flex items-center justify-center text-white font-bold">
                Success
              </div>
              <div className="gradient-warning h-16 rounded-lg flex items-center justify-center text-white font-bold">
                Warning
              </div>
              <div className="gradient-error h-16 rounded-lg flex items-center justify-center text-white font-bold">
                Error
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="glass rounded-xl p-6 border border-blue-500/30">
        <h2 className="text-xl font-bold text-blue-300 mb-4">
          📋 Test Checklist
        </h2>
        <div className="space-y-2 text-sm text-gray-300">
          <div>✓ Enhanced sidebar with gradients (visible in left sidebar)</div>
          <div>✓ Company header displaying "Refleqt" logo</div>
          <div>✓ Obsession widget showing live score from global state</div>
          <div>✓ Sub-navigation for Intelligence Feed (expandable)</div>
          <div>✓ Badges and status indicators throughout sidebar</div>
          <div>✓ All 4 toast notification variants</div>
          <div>✓ Multiple simultaneous toasts</div>
          <div>✓ Obsession score boundaries (0.0 - 10.0)</div>
          <div>✓ Event bus publish/subscribe system</div>
          <div>✓ Global state management across components</div>
          <div>✓ Design system gradients and animations</div>
        </div>
      </div>
    </div>
  );
}
