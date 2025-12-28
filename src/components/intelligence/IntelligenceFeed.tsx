"use client";

/**
 * Intelligence Feed Component
 * Beautiful competitive intelligence dashboard with inline CSS styling
 */

import { useState, useEffect } from "react";
import { FeedItem } from "./FeedItem";
import { FeedControls } from "./FeedControls";
import { AddSourceDialog } from "./AddSourceDialog";
import type { IntelligenceItem } from "@prisma/client";

interface IntelligenceFeedProps {
  userId: string;
}

export function IntelligenceFeed({ userId }: IntelligenceFeedProps) {
  const [items, setItems] = useState<IntelligenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch intelligence items
  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          userId,
          limit: "50",
          offset: "0",
        });

        if (category) {
          params.append("category", category);
        }

        if (searchQuery) {
          params.append("query", searchQuery);
        }

        const response = await fetch(
          `/api/intelligence/items?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setItems(result.data.items);
        } else {
          throw new Error(result.error ?? "Unknown error");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [userId, category, searchQuery]);

  // Refresh all feeds
  async function handleRefresh() {
    setLoading(true);

    try {
      const response = await fetch("/api/intelligence/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Refresh failed");
      }

      // Wait a few seconds then reload items
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed");
      setLoading(false);
    }
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
      `}</style>

      <div className="intelligence-feed-container">
        <div className="feed-header-card">
          <h1>Intelligence Feed 📡</h1>
          <p>
            Track competitive intelligence from RSS feeds, blogs, and news
            sources
          </p>

          {/* Getting started info box for new users */}
          {items.length === 0 && !loading && !error && (
            <div className="info-box">
              <div className="info-box-header">
                <svg
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "#3b82f6",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div style={{ flex: 1 }}>
                  <h3>Getting Started - Follow These Steps:</h3>
                  <ol>
                    <li>
                      Click <strong>"+ Add Source"</strong> button below to add
                      your first intelligence source
                    </li>
                    <li>
                      Enter an RSS feed URL (example:
                      https://hnrss.org/frontpage)
                    </li>
                    <li>Give it a name and select a category</li>
                    <li>
                      Click <strong>"Refresh All"</strong> to fetch the latest
                      items from your sources
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="action-buttons">
            <AddSourceDialog userId={userId} />
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="refresh-button"
              title="Fetch latest items from all your sources"
            >
              {loading ? (
                <>
                  <div
                    className="loading-spinner"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderWidth: "3px",
                    }}
                  ></div>
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <svg
                    style={{ width: "20px", height: "20px" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Refresh All</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search and filter controls */}
        <FeedControls
          category={category}
          onCategoryChange={setCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

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
                <h3>Error Loading Intelligence Items</h3>
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
            <p className="loading-text">Loading intelligence items...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="empty-state">
            <svg
              className="empty-state-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3>No Intelligence Items Yet</h3>
            <p>
              Add sources using the "+ Add Source" button above, then click
              "Refresh All" to fetch items
            </p>
          </div>
        )}

        {/* Feed items */}
        {!loading && !error && items.length > 0 && (
          <div className="feed-items-container">
            <div className="feed-items-header">
              <p className="feed-items-count">
                Showing {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="feed-items-list">
              {items.map((item) => (
                <FeedItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
