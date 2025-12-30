"use client";

/**
 * Strategy Cohorts Page
 * Quick competitive analysis with AI-powered insights in under 2 minutes
 */

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";

interface CohortResult {
  swarmId: string;
  query: string;
  insights: Array<{
    id: string;
    title: string;
    content: string;
    hierarchyLevel: string;
    priorityScore: number;
    relevanceScore: number;
    isActionable: boolean;
    actionItems: string[];
  }>;
  executionTimeMs: number;
  confidenceScore: number;
}

export default function StrategyCohortsPage() {
  const { user } = useUser();
  const [query, setQuery] = useState("");
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<CohortResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id || "00000000-0000-0000-0000-000000000001";

  const exampleQueries = [
    "How does our pricing compare to top 3 competitors?",
    "What are emerging trends in the SaaS market?",
    "What are our main competitors' recent product launches?",
    "What marketing strategies are our competitors using?",
    "What customer pain points are we missing?",
    "How can we differentiate from market leaders?",
  ];

  async function handleExecute() {
    if (!query.trim()) {
      alert("Please enter a query");
      return;
    }

    setExecuting(true);
    setError(null);
    setResult(null);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/research-swarm/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          query,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to execute strategy cohort");
      }

      const data = await response.json();
      if (data.success) {
        const executionTime = Date.now() - startTime;

        // Calculate confidence based on insight relevance
        const avgRelevance =
          data.data.insights.length > 0
            ? data.data.insights.reduce(
                (sum: number, i: any) => sum + i.relevanceScore,
                0
              ) / data.data.insights.length
            : 0.5;

        setResult({
          swarmId: data.data.swarmId,
          query: data.data.query || query,
          insights: data.data.insights || [],
          executionTimeMs: executionTime,
          confidenceScore: avgRelevance,
        });
      }
    } catch (err) {
      console.error("Error executing strategy cohort:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setExecuting(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        .strategy-cohorts-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 32px;
          margin: -32px;
        }

        .cohorts-header {
          background: white;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .cohorts-title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .cohorts-description {
          color: #6b7280;
          font-size: 15px;
          margin-bottom: 24px;
        }

        .query-section {
          background: white;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .query-label {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 12px;
          display: block;
        }

        .query-textarea {
          width: 100%;
          min-height: 120px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          resize: vertical;
          transition: all 0.2s;
        }

        .query-textarea:focus {
          outline: none;
          border-color: #f5576c;
          box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
        }

        .examples-section {
          margin-top: 16px;
        }

        .examples-label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .examples-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 10px;
        }

        .example-chip {
          padding: 10px 14px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 13px;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .example-chip:hover {
          border-color: #f5576c;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          transform: translateY(-2px);
        }

        .execute-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 16px;
        }

        .execute-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 87, 108, 0.4);
        }

        .execute-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .executing-state {
          background: white;
          border-radius: 16px;
          padding: 64px 32px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .executing-spinner {
          width: 64px;
          height: 64px;
          border: 6px solid rgba(245, 87, 108, 0.2);
          border-top-color: #f5576c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 24px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .executing-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .executing-subtitle {
          color: #6b7280;
          font-size: 14px;
        }

        .result-container {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .result-header {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e5e7eb;
        }

        .result-query {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
        }

        .result-meta {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .confidence-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }

        .confidence-high {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }

        .confidence-medium {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .insight-card {
          padding: 20px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-radius: 12px;
          border-left: 4px solid #f5576c;
        }

        .insight-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .insight-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }

        .insight-badges {
          display: flex;
          gap: 6px;
        }

        .insight-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge-strategic {
          background: #667eea;
          color: white;
        }

        .badge-tactical {
          background: #f5576c;
          color: white;
        }

        .badge-operational {
          background: #00f2fe;
          color: white;
        }

        .insight-content {
          color: #4b5563;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .action-items {
          padding: 12px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-radius: 8px;
        }

        .action-items-title {
          font-size: 12px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 8px;
        }

        .action-items-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .action-item {
          font-size: 13px;
          color: #78350f;
          padding-left: 16px;
          position: relative;
        }

        .action-item::before {
          content: "→";
          position: absolute;
          left: 0;
          color: #f59e0b;
          font-weight: 700;
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
          .examples-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="strategy-cohorts-container">
        <div className="cohorts-header">
          <h1 className="cohorts-title">🎯 Strategy Cohorts</h1>
          <p className="cohorts-description">
            Get AI-powered competitive insights in under 2 minutes. Ask any
            strategic question and receive analyzed intelligence with confidence
            scores.
          </p>
        </div>

        <div className="query-section">
          <label className="query-label">
            What strategic question do you have?
          </label>
          <textarea
            className="query-textarea"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., How does our pricing compare to top 3 competitors?"
            disabled={executing}
          />

          <div className="examples-section">
            <div className="examples-label">Try these example queries:</div>
            <div className="examples-grid">
              {exampleQueries.map((example, i) => (
                <button
                  key={i}
                  className="example-chip"
                  onClick={() => setQuery(example)}
                  disabled={executing}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            className="execute-button"
            onClick={handleExecute}
            disabled={executing || !query.trim()}
          >
            {executing ? (
              <>
                <div
                  className="executing-spinner"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderWidth: "3px",
                  }}
                ></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Execute Strategy Cohort</span>
              </>
            )}
          </button>
        </div>

        {executing && (
          <div className="executing-state">
            <div className="executing-spinner"></div>
            <h3 className="executing-title">Deploying Research Swarm...</h3>
            <p className="executing-subtitle">
              AI agents are analyzing competitive intelligence. This typically
              takes under 2 minutes.
            </p>
          </div>
        )}

        {error && (
          <div className="error-card">
            <h3 className="error-title">Execution Failed</h3>
            <p className="error-message">{error}</p>
          </div>
        )}

        {result && !executing && (
          <div className="result-container">
            <div className="result-header">
              <div className="result-query">"{result.query}"</div>
              <div className="result-meta">
                <div className="meta-item">
                  <span className="meta-label">Execution Time</span>
                  <span className="meta-value">
                    {(result.executionTimeMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Insights Found</span>
                  <span className="meta-value">{result.insights.length}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Confidence</span>
                  <span
                    className={`confidence-badge ${result.confidenceScore >= 0.8 ? "confidence-high" : "confidence-medium"}`}
                  >
                    <span>{result.confidenceScore >= 0.8 ? "🎯" : "⚡"}</span>
                    <span>{(result.confidenceScore * 100).toFixed(0)}%</span>
                  </span>
                </div>
              </div>
            </div>

            {result.insights.length > 0 ? (
              <div className="insights-list">
                {result.insights.map((insight) => (
                  <div key={insight.id} className="insight-card">
                    <div className="insight-header">
                      <h4 className="insight-title">{insight.title}</h4>
                      <div className="insight-badges">
                        <span
                          className={`insight-badge badge-${insight.hierarchyLevel}`}
                        >
                          {insight.hierarchyLevel}
                        </span>
                      </div>
                    </div>
                    <p className="insight-content">{insight.content}</p>
                    {insight.isActionable && insight.actionItems.length > 0 && (
                      <div className="action-items">
                        <div className="action-items-title">
                          Recommended Actions:
                        </div>
                        <ul className="action-items-list">
                          {insight.actionItems.map((item, i) => (
                            <li key={i} className="action-item">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#6b7280",
                }}
              >
                No insights generated. Try refining your query.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
