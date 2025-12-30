"use client";

/**
 * Smart Trackers Management Page
 * View and manage automated research goal monitoring
 */

import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

interface SmartTracker {
  id: string;
  goalId: string;
  goalTitle: string;
  goalQuery: string;
  goalType: string;
  monitoringLevel: string;
  updateInterval: number;
  maxInsights: number;
  lastExecutedAt: string | null;
  nextExecutionAt: string | null;
  isActive: boolean;
  goalIsActive: boolean;
  createdAt: string;
}

export default function SmartTrackersPage() {
  const { user } = useUser();
  const userId = user?.id ?? "demo-user";

  const [trackers, setTrackers] = useState<SmartTracker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackers();
  }, [userId]);

  async function fetchTrackers() {
    try {
      const response = await fetch(`/api/smart-tracker?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trackers");
      }

      const data = await response.json();
      if (data.success) {
        setTrackers(data.data.trackers);
      }
    } catch (err) {
      console.error("Error fetching trackers:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleTracker(
    trackerId: string,
    currentStatus: boolean
  ) {
    try {
      const response = await fetch("/api/smart-tracker", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          trackerId,
          isActive: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tracker");
      }

      await fetchTrackers();
    } catch (err) {
      console.error("Error updating tracker:", err);
      alert("Failed to update tracker");
    }
  }

  async function handleDeleteTracker(trackerId: string, goalTitle: string) {
    if (!confirm(`Delete Smart Tracker for "${goalTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/smart-tracker?trackerId=${trackerId}&userId=${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete tracker");
      }

      await fetchTrackers();
    } catch (err) {
      console.error("Error deleting tracker:", err);
      alert("Failed to delete tracker");
    }
  }

  function formatInterval(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  }

  function formatNextExecution(nextExecution: string | null): string {
    if (!nextExecution) return "Not scheduled";

    const next = new Date(nextExecution);
    const now = new Date();
    const diffMs = next.getTime() - now.getTime();

    if (diffMs < 0) return "Overdue";
    if (diffMs < 60000) return "In < 1 min";
    if (diffMs < 3600000) return `In ${Math.floor(diffMs / 60000)} min`;
    if (diffMs < 86400000) return `In ${Math.floor(diffMs / 3600000)} hr`;
    return `In ${Math.floor(diffMs / 86400000)} days`;
  }

  function getGoalTypeColor(goalType: string): string {
    switch (goalType) {
      case "competitive":
        return "#ef4444";
      case "market":
        return "#3b82f6";
      case "customer":
        return "#8b5cf6";
      case "industry":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  }

  return (
    <>
      <style jsx global>{`
        .trackers-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f766e 0%, #059669 100%);
          padding: 40px;
        }

        .trackers-header {
          margin-bottom: 32px;
        }

        .trackers-title {
          font-size: 36px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
        }

        .trackers-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
        }

        .tracker-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .tracker-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 6px;
          height: 100%;
          background: linear-gradient(180deg, #0f766e 0%, #059669 100%);
        }

        .tracker-card.inactive::before {
          background: #9ca3af;
        }

        .tracker-card:hover {
          transform: translateX(4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .tracker-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .tracker-title-section {
          flex: 1;
        }

        .tracker-goal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .tracker-goal-type {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-right: 8px;
        }

        .tracker-status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-left: 12px;
        }

        .tracker-status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .tracker-status-badge.paused {
          background: #fef3c7;
          color: #92400e;
        }

        .tracker-query {
          font-size: 14px;
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 16px;
          font-style: italic;
        }

        .tracker-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
        }

        .meta-value.next-execution {
          color: #059669;
        }

        .meta-value.overdue {
          color: #dc2626;
        }

        .tracker-actions {
          display: flex;
          gap: 12px;
        }

        .action-button {
          padding: 10px 20px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button.pause {
          background: #fbbf24;
          color: white;
        }

        .action-button.pause:hover {
          background: #f59e0b;
        }

        .action-button.resume {
          background: #10b981;
          color: white;
        }

        .action-button.resume:hover {
          background: #059669;
        }

        .action-button.delete {
          background: #ef4444;
          color: white;
        }

        .action-button.delete:hover {
          background: #dc2626;
        }

        .loading-state,
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-top: 5px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .empty-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .empty-description {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 24px;
        }

        .create-button {
          display: inline-block;
          padding: 14px 28px;
          background: white;
          color: #0f766e;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .create-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      <div className="trackers-container">
        <div className="trackers-header">
          <h1 className="trackers-title">Smart Trackers</h1>
          <p className="trackers-subtitle">
            Automated monitoring for your research goals • {trackers.length}{" "}
            active trackers
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <div>Loading trackers...</div>
          </div>
        ) : trackers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-title">No Smart Trackers Yet</div>
            <div className="empty-description">
              Smart Trackers automatically monitor your research goals based on
              your Obsession Score.
              <br />
              Create a research goal with tracking enabled to get started.
            </div>
            <a href="/portal/research-swarms" className="create-button">
              Create Research Goal
            </a>
          </div>
        ) : (
          trackers.map((tracker) => (
            <div
              key={tracker.id}
              className={`tracker-card ${tracker.isActive ? "active" : "inactive"}`}
            >
              <div className="tracker-header">
                <div className="tracker-title-section">
                  <h3 className="tracker-goal-title">
                    {tracker.goalTitle}
                    <span
                      className="tracker-status-badge"
                      style={{
                        background: tracker.isActive ? "#d1fae5" : "#fef3c7",
                        color: tracker.isActive ? "#065f46" : "#92400e",
                      }}
                    >
                      {tracker.isActive ? "● ACTIVE" : "○ PAUSED"}
                    </span>
                  </h3>
                  <span
                    className="tracker-goal-type"
                    style={{ background: getGoalTypeColor(tracker.goalType) }}
                  >
                    {tracker.goalType}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      background: "#dbeafe",
                      color: "#1e40af",
                      textTransform: "uppercase",
                    }}
                  >
                    {tracker.monitoringLevel}
                  </span>
                </div>
              </div>

              <div className="tracker-query">"{tracker.goalQuery}"</div>

              <div className="tracker-meta">
                <div className="meta-item">
                  <div className="meta-label">Update Frequency</div>
                  <div className="meta-value">
                    Every {formatInterval(tracker.updateInterval)}
                  </div>
                </div>

                <div className="meta-item">
                  <div className="meta-label">Next Execution</div>
                  <div
                    className={`meta-value ${
                      tracker.isActive
                        ? tracker.nextExecutionAt &&
                          new Date(tracker.nextExecutionAt).getTime() <
                            Date.now()
                          ? "overdue"
                          : "next-execution"
                        : ""
                    }`}
                  >
                    {tracker.isActive
                      ? formatNextExecution(tracker.nextExecutionAt)
                      : "Paused"}
                  </div>
                </div>

                <div className="meta-item">
                  <div className="meta-label">Last Executed</div>
                  <div className="meta-value">
                    {tracker.lastExecutedAt
                      ? new Date(tracker.lastExecutedAt).toLocaleString()
                      : "Never"}
                  </div>
                </div>

                <div className="meta-item">
                  <div className="meta-label">Max Insights</div>
                  <div className="meta-value">{tracker.maxInsights}</div>
                </div>
              </div>

              <div className="tracker-actions">
                <button
                  className={`action-button ${tracker.isActive ? "pause" : "resume"}`}
                  onClick={() =>
                    handleToggleTracker(tracker.id, tracker.isActive)
                  }
                >
                  {tracker.isActive ? "⏸ Pause" : "▶ Resume"}
                </button>

                <button
                  className="action-button delete"
                  onClick={() =>
                    handleDeleteTracker(tracker.id, tracker.goalTitle)
                  }
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
