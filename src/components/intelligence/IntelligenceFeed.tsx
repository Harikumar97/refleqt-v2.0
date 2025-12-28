"use client";

/**
 * Intelligence Feed Component
 * Beautiful competitive intelligence dashboard with Research Swarm integration
 */

import { useState, useEffect } from "react";
import { ConfigureResearchGoalDialog } from "../research-swarm/ConfigureResearchGoalDialog";
import { FiniteIntrospectDisplay } from "../research-swarm/FiniteIntrospectDisplay";
import { ObsessionScoreMeter } from "../research-swarm/ObsessionScoreMeter";
import { KnowledgeTraverseHierarchy } from "../research-swarm/KnowledgeTraverseHierarchy";

interface IntelligenceFeedProps {
  userId: string;
}

export function IntelligenceFeed({ userId }: IntelligenceFeedProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [obsessionScore, setObsessionScore] = useState(5);
  const [activeView, setActiveView] = useState<"insights" | "hierarchy">("insights");

  // Fetch user profile to get obsession score
  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/user/profile?userId=${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const result = await response.json();

        if (result.success && result.data.profile) {
          const score = Number(result.data.profile.obsessionScore) || 5;
          setObsessionScore(score);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId]);

  function handleObsessionScoreChange(newScore: number) {
    setObsessionScore(newScore);
  }

  return (
    <>
      <style jsx global>{`
        .intelligence-feed-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 32px;
          margin: -32px;
        }

        .feed-header-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .feed-header-card h1 {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .feed-header-card p {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 24px;
        }

        .info-box {
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .info-box-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .info-box h3 {
          color: #1e40af;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .info-box ol {
          color: #334155;
          font-size: 14px;
          line-height: 1.8;
          margin-left: 20px;
        }

        .info-box ol li {
          margin-bottom: 8px;
        }

        .info-box strong {
          color: #1e40af;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .refresh-button {
          padding: 14px 24px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-box {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 2px solid #ef4444;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .error-box-content {
          display: flex;
          gap: 12px;
        }

        .error-box h3 {
          color: #991b1b;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .error-box p {
          color: #7f1d1d;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .error-box .error-help {
          color: #991b1b;
          font-size: 12px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 64px 0;
          gap: 16px;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(79, 172, 254, 0.2);
          border-top-color: #4facfe;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .empty-state {
          background: white;
          border-radius: 16px;
          padding: 64px 32px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .empty-state-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          color: #cbd5e1;
        }

        .empty-state h3 {
          color: #1e293b;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #64748b;
          font-size: 14px;
          max-width: 400px;
          margin: 0 auto;
        }

        .feed-items-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .feed-items-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
        }

        .feed-items-count {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }

        .feed-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 24px;
          align-items: start;
        }

        .left-column {
          position: sticky;
          top: 32px;
        }

        .right-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .view-switcher {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .view-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-button:hover {
          border-color: #8b5cf6;
          transform: translateY(-2px);
        }

        .view-button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
          box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
        }

        .view-icon {
          font-size: 20px;
        }

        @media (max-width: 1200px) {
          .content-grid {
            grid-template-columns: 1fr;
          }

          .left-column {
            position: relative;
            top: 0;
          }
        }
      `}</style>

      <div className="intelligence-feed-container">
        {/* Header Section */}
        <div className="feed-header-card">
          <h1>Intelligence Feed ✨</h1>
          <p>
            AI-powered competitive intelligence with Research Swarm technology
          </p>

          {/* Action buttons */}
          <div className="action-buttons">
            <ConfigureResearchGoalDialog
              userId={userId}
              obsessionScore={obsessionScore}
            />
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="error-box">
            <div className="error-box-content">
              <svg
                style={{
                  width: "20px",
                  height: "20px",
                  color: "#dc2626",
                  flexShrink: 0,
                }}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div style={{ flex: 1 }}>
                <h3>Error Loading Profile</h3>
                <p>{error}</p>
                <p className="error-help">
                  <strong>What to do:</strong> Try refreshing the page. If the
                  problem persists, check your network connection or contact
                  support.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && !error && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading intelligence system...</p>
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        {!loading && !error && (
          <>
            <div className="content-grid">
              {/* Left Column: Obsession Meter */}
              <div className="left-column">
                <ObsessionScoreMeter
                  userId={userId}
                  initialScore={obsessionScore}
                  onScoreChange={handleObsessionScoreChange}
                />
              </div>

              {/* Right Column: View Switcher + Content */}
              <div className="right-column">
                {/* View Switcher */}
                <div className="view-switcher">
                  <button
                    className={`view-button ${activeView === "insights" ? "active" : ""}`}
                    onClick={() => setActiveView("insights")}
                  >
                    <span className="view-icon">✨</span>
                    <span>Finite Insights</span>
                  </button>
                  <button
                    className={`view-button ${activeView === "hierarchy" ? "active" : ""}`}
                    onClick={() => setActiveView("hierarchy")}
                  >
                    <span className="view-icon">🌳</span>
                    <span>Knowledge Traverse</span>
                  </button>
                </div>

                {/* Content based on active view */}
                {activeView === "insights" ? (
                  <FiniteIntrospectDisplay userId={userId} />
                ) : (
                  <KnowledgeTraverseHierarchy userId={userId} />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
