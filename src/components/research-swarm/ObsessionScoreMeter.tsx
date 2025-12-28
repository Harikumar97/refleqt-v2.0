"use client";

import { useState } from "react";

/**
 * ObsessionScoreMeter Component
 * Displays and controls user's obsession score (1-10)
 * Shows monitoring frequency and max insights based on score
 */

interface ObsessionScoreMeterProps {
  userId: string;
  initialScore: number;
  onScoreChange?: (newScore: number) => void;
}

interface FrequencyInfo {
  interval: string;
  maxItems: number;
  color: string;
  emoji: string;
  description: string;
}

export function ObsessionScoreMeter({
  userId,
  initialScore,
  onScoreChange,
}: ObsessionScoreMeterProps) {
  const [score, setScore] = useState(initialScore);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  function getFrequencyInfo(obsessionScore: number): FrequencyInfo {
    if (obsessionScore >= 9) {
      return {
        interval: "Every 5 minutes",
        maxItems: 10,
        color: "#ef4444",
        emoji: "🔥",
        description: "Extreme: Real-time intelligence",
      };
    }
    if (obsessionScore >= 7) {
      return {
        interval: "Every 15 minutes",
        maxItems: 9,
        color: "#f97316",
        emoji: "⚡",
        description: "High: Frequent updates",
      };
    }
    if (obsessionScore >= 4) {
      return {
        interval: "Hourly",
        maxItems: 7,
        color: "#eab308",
        emoji: "📊",
        description: "Medium: Regular monitoring",
      };
    }
    return {
      interval: "Daily",
      maxItems: 5,
      color: "#22c55e",
      emoji: "🌱",
      description: "Low: Daily summaries",
    };
  }

  async function handleScoreChange(newScore: number) {
    setScore(newScore);
    setIsUpdating(true);

    try {
      // Update obsession score in database
      const response = await fetch("/api/user/obsession-score", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, obsessionScore: newScore }),
      });

      if (!response.ok) {
        throw new Error("Failed to update score");
      }

      onScoreChange?.(newScore);
    } catch (error) {
      console.error("Error updating obsession score:", error);
      // Revert on error
      setScore(initialScore);
      alert("Failed to update obsession score");
    } finally {
      setIsUpdating(false);
    }
  }

  const frequencyInfo = getFrequencyInfo(score);
  const percentage = (score / 10) * 100;

  return (
    <div className="obsession-meter-container">
      <div className="meter-header">
        <div className="meter-title">
          <span className="meter-icon">🎯</span>
          <h3>Obsession Score</h3>
          <button
            className="info-button"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            ℹ️
          </button>
        </div>
        <div className="score-display">
          <span className="score-number">{score}</span>
          <span className="score-max">/10</span>
        </div>
      </div>

      {showTooltip && (
        <div className="tooltip">
          <p>
            <strong>Obsession Score</strong> determines how frequently your
            research swarms run and how many insights you receive.
          </p>
          <ul>
            <li>
              <strong>1-3:</strong> Daily updates, 5 items
            </li>
            <li>
              <strong>4-6:</strong> Hourly updates, 7 items
            </li>
            <li>
              <strong>7-8:</strong> 15-min updates, 9 items
            </li>
            <li>
              <strong>9-10:</strong> 5-min updates, 10 items
            </li>
          </ul>
        </div>
      )}

      {/* Visual Meter */}
      <div className="meter-bar-container">
        <div className="meter-bar">
          <div
            className="meter-fill"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, #22c55e 0%, #eab308 40%, #f97316 70%, #ef4444 100%)`,
            }}
          >
            <div className="meter-pulse"></div>
          </div>
        </div>
        <div className="meter-markers">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div
              key={num}
              className={`marker ${num === score ? "active" : ""}`}
              onClick={() => handleScoreChange(num)}
            >
              <div className="marker-dot"></div>
              <span className="marker-label">{num}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency Info Card */}
      <div
        className="frequency-card"
        style={{
          background: `linear-gradient(135deg, ${frequencyInfo.color}15 0%, ${frequencyInfo.color}05 100%)`,
          borderColor: frequencyInfo.color,
        }}
      >
        <div className="frequency-header">
          <span className="frequency-emoji">{frequencyInfo.emoji}</span>
          <span className="frequency-level">{frequencyInfo.description}</span>
        </div>
        <div className="frequency-details">
          <div className="frequency-item">
            <span className="frequency-label">Update Frequency:</span>
            <span className="frequency-value">{frequencyInfo.interval}</span>
          </div>
          <div className="frequency-item">
            <span className="frequency-label">Max Insights:</span>
            <span className="frequency-value">{frequencyInfo.maxItems}</span>
          </div>
        </div>
      </div>

      {/* Slider Control */}
      <div className="slider-container">
        <label className="slider-label">
          Adjust your obsession level:
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={score}
          onChange={(e) => handleScoreChange(Number(e.target.value))}
          disabled={isUpdating}
          className="slider"
          style={{
            background: `linear-gradient(to right,
              #22c55e 0%,
              #eab308 40%,
              #f97316 70%,
              #ef4444 100%)`,
          }}
        />
      </div>

      {isUpdating && (
        <div className="updating-overlay">
          <div className="updating-spinner"></div>
          <span>Updating...</span>
        </div>
      )}

      <style jsx>{`
        .obsession-meter-container {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 2px solid transparent;
          background-image: linear-gradient(white, white),
            linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .meter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .meter-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .meter-icon {
          font-size: 28px;
        }

        .meter-title h3 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .info-button {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .info-button:hover {
          transform: scale(1.1);
        }

        .score-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .score-number {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .score-max {
          font-size: 20px;
          font-weight: 600;
          color: #9ca3af;
        }

        .tooltip {
          position: absolute;
          top: 80px;
          right: 28px;
          background: white;
          border: 2px solid #8b5cf6;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-width: 300px;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tooltip p {
          font-size: 13px;
          color: #374151;
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        .tooltip ul {
          margin: 0;
          padding-left: 20px;
          font-size: 12px;
          color: #6b7280;
        }

        .tooltip li {
          margin-bottom: 6px;
          line-height: 1.4;
        }

        .meter-bar-container {
          margin-bottom: 24px;
        }

        .meter-bar {
          height: 20px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .meter-fill {
          height: 100%;
          border-radius: 10px;
          position: relative;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .meter-pulse {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 100%
          );
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        .meter-markers {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          padding: 0 5px;
        }

        .marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .marker:hover .marker-dot {
          transform: scale(1.3);
        }

        .marker.active .marker-dot {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
          transform: scale(1.4);
        }

        .marker-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d1d5db;
          transition: all 0.2s;
        }

        .marker-label {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          transition: color 0.2s;
        }

        .marker.active .marker-label {
          color: #667eea;
          font-weight: 700;
        }

        .frequency-card {
          padding: 20px;
          border-radius: 16px;
          border: 2px solid;
          margin-bottom: 24px;
          transition: all 0.4s;
        }

        .frequency-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .frequency-emoji {
          font-size: 32px;
        }

        .frequency-level {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .frequency-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .frequency-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .frequency-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .frequency-value {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }

        .slider-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .slider-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .slider {
          width: 100%;
          height: 12px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
          transition: opacity 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 3px rgba(102, 126, 234, 0.3);
          transition: all 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 0 0 4px rgba(102, 126, 234, 0.4);
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 3px rgba(102, 126, 234, 0.3);
          transition: all 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 0 0 4px rgba(102, 126, 234, 0.4);
        }

        .slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .updating-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 5;
        }

        .updating-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .updating-overlay span {
          font-size: 14px;
          font-weight: 600;
          color: #667eea;
        }
      `}</style>
    </div>
  );
}
