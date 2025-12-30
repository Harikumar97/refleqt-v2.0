"use client";

/**
 * Research Swarms Management Page
 * Manage research goals, view swarm executions, and monitor Smart Trackers
 */

import { useState, useEffect } from "react";
import { ConfigureResearchGoalDialog } from "@/components/research-swarm/ConfigureResearchGoalDialog";
import { useUser } from "@/contexts/UserContext";

interface ResearchGoal {
  id: string;
  goalTitle: string;
  goalQuery: string;
  goalType: string;
  monitoringLevel: string;
  isActive: boolean;
  createdAt: string;
  swarms: Array<{
    id: string;
    executionStatus: string;
    insightCount: number;
  }>;
  trackers: Array<{
    id: string;
    updateInterval: number;
    maxInsights: number;
  }>;
}

export default function ResearchSwarmsPage() {
  const { user, profile } = useUser();
  const [goals, setGoals] = useState<ResearchGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obsessionScore = Number(profile?.obsessionScore) || 5;
  const userId = user?.id || "00000000-0000-0000-0000-000000000001";

  useEffect(() => {
    fetchResearchGoals();
  }, [userId]);

  async function fetchResearchGoals() {
    setLoading(true);
    try {
      const response = await fetch(`/api/research-goal?userId=${userId}`);
      if (!response.ok) {
        console.warn("Could not fetch research goals:", response.status);
        setGoals([]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setGoals(data.data.goals);
      } else {
        console.warn("Research goals API returned unsuccessful response");
        setGoals([]);
      }
    } catch (err) {
      console.warn(
        "Error fetching research goals (database may be empty):",
        err
      );
      setGoals([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecuteSwarm(goalId: string, query: string) {
    try {
      const response = await fetch("/api/research-swarm/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, goalId, query }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute swarm");
      }

      // Refresh goals to show new swarm
      await fetchResearchGoals();
    } catch (err) {
      console.error("Error executing swarm:", err);
      alert("Failed to execute research swarm");
    }
  }

  async function handleDeleteGoal(goalId: string) {
    if (!confirm("Are you sure you want to delete this research goal?")) {
      return;
    }

    try {
      const response = await fetch(`/api/research-goal/${goalId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }

      // Refresh goals list
      await fetchResearchGoals();
    } catch (err) {
      console.error("Error deleting goal:", err);
      alert("Failed to delete research goal");
    }
  }

  function getMonitoringFrequency(interval: number): string {
    if (interval <= 300) return "Every 5 minutes";
    if (interval <= 900) return "Every 15 minutes";
    if (interval <= 3600) return "Hourly";
    return "Daily";
  }

  function getGoalTypeConfig(type: string) {
    switch (type) {
      case "competitive":
        return {
          icon: "🎯",
          color: "#667eea",
          label: "Competitive Analysis",
        };
      case "market":
        return {
          icon: "📊",
          color: "#4facfe",
          label: "Market Intelligence",
        };
      case "customer":
        return {
          icon: "👥",
          color: "#f5576c",
          label: "Customer Intelligence",
        };
      case "industry":
        return {
          icon: "🏭",
          color: "#00f2fe",
          label: "Industry Trends",
        };
      default:
        return {
          icon: "🔍",
          color: "#9ca3af",
          label: "General Research",
        };
    }
  }

  return (
    <>
      <style jsx global>{`
        .research-swarms-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 32px;
          margin: -32px;
        }

        .page-header-section {
          background: white;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .page-title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .page-description {
          color: #6b7280;
          font-size: 15px;
          margin-bottom: 24px;
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }

        .goal-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .goal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.12);
          border-color: #8b5cf6;
        }

        .goal-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .goal-type-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .goal-info {
          flex: 1;
        }

        .goal-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }

        .goal-type-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 4px 10px;
          border-radius: 12px;
          display: inline-block;
        }

        .goal-query {
          color: #4b5563;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 16px;
          padding: 12px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 10px;
          border-left: 3px solid #8b5cf6;
        }

        .goal-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .goal-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .goal-stat-label {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .goal-stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .goal-actions {
          display: flex;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .goal-action-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .goal-action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
        }

        .goal-action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .goal-action-btn.danger {
          background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
          color: #991b1b;
        }

        .goal-action-btn.danger:hover {
          background: linear-gradient(135deg, #fca5a5 0%, #f87171 100%);
        }

        .monitoring-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #fbbf24;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 16px;
        }

        .monitoring-badge.active {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-color: #10b981;
          color: #065f46;
        }

        .empty-state-card {
          background: white;
          border-radius: 16px;
          padding: 64px 32px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .empty-state-description {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 80px 20px;
          gap: 16px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .error-card {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 2px solid #ef4444;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
        }

        .error-title {
          font-size: 18px;
          font-weight: 700;
          color: #991b1b;
          margin-bottom: 8px;
        }

        .error-message {
          color: #7f1d1d;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .goals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="research-swarms-container">
        <div className="page-header-section">
          <h1 className="page-title">🔬 Research Swarms</h1>
          <p className="page-description">
            AI-powered multi-agent research system for comprehensive competitive
            and market intelligence
          </p>
          <ConfigureResearchGoalDialog
            userId={userId}
            obsessionScore={obsessionScore}
          />
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading research goals...</p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <h3 className="error-title">Error Loading Research Goals</h3>
            <p className="error-message">{error}</p>
          </div>
        )}

        {!loading && !error && goals.length === 0 && (
          <div className="empty-state-card">
            <div className="empty-state-icon">🎯</div>
            <h3 className="empty-state-title">No Research Goals Yet</h3>
            <p className="empty-state-description">
              Create your first research goal using the "Configure Research
              Goal" button above. The AI will deploy research swarms to gather
              comprehensive intelligence.
            </p>
          </div>
        )}

        {!loading && !error && goals.length > 0 && (
          <div className="goals-grid">
            {goals.map((goal) => {
              const typeConfig = getGoalTypeConfig(goal.goalType);
              const tracker = goal.trackers[0];

              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <div
                      className="goal-type-icon"
                      style={{ background: typeConfig.color }}
                    >
                      {typeConfig.icon}
                    </div>
                    <div className="goal-info">
                      <h3 className="goal-title">{goal.goalTitle}</h3>
                      <span
                        className="goal-type-label"
                        style={{
                          background: `${typeConfig.color}15`,
                          color: typeConfig.color,
                        }}
                      >
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="goal-query">{goal.goalQuery}</div>

                  {tracker && (
                    <div className="monitoring-badge active">
                      <span>🔔</span>
                      <span>
                        Smart Tracker:{" "}
                        {getMonitoringFrequency(tracker.updateInterval)}
                      </span>
                      <span>• Max {tracker.maxInsights} insights</span>
                    </div>
                  )}

                  <div className="goal-stats">
                    <div className="goal-stat">
                      <span className="goal-stat-label">Swarms Run</span>
                      <span className="goal-stat-value">
                        {goal.swarms.length}
                      </span>
                    </div>
                    <div className="goal-stat">
                      <span className="goal-stat-label">Total Insights</span>
                      <span className="goal-stat-value">
                        {goal.swarms.reduce(
                          (sum, s) => sum + s.insightCount,
                          0
                        )}
                      </span>
                    </div>
                    <div className="goal-stat">
                      <span className="goal-stat-label">Status</span>
                      <span className="goal-stat-value">
                        {goal.isActive ? "🟢 Active" : "🔴 Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="goal-actions">
                    <button
                      className="goal-action-btn primary"
                      onClick={() =>
                        handleExecuteSwarm(goal.id, goal.goalQuery)
                      }
                    >
                      <span>⚡</span>
                      <span>Execute Now</span>
                    </button>
                    <button
                      className="goal-action-btn danger"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
