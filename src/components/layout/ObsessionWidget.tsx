"use client";

/**
 * Obsession Widget Component
 * Displays current obsession score from global state
 */

import { useGlobalState } from "@/contexts/GlobalStateContext";

export function ObsessionWidget() {
  const { state } = useGlobalState();

  return (
    <div className="mx-5 mb-4">
      <div className="glass rounded-xl p-3 text-center backdrop-blur-lg">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
          Obsession Score
        </div>
        <div className="text-2xl font-black gradient-text-funnel mb-0.5">
          {state.obsessionScore.toFixed(1)}
        </div>
        <div className="text-[10px] font-semibold text-green-400 uppercase tracking-wide">
          {state.obsessionLevel}
        </div>
      </div>
    </div>
  );
}
