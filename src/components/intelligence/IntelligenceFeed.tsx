"use client";

/**
 * Intelligence Feed Component
 * Redesigned following MOSIP Inclusive UI Design Guidelines
 * - Guideline #1: Detailed task information upfront
 * - Guideline #3: Adequate progression cues
 * - Guideline #7: Clear warnings and negative outcomes
 * - Guideline #9: Avoid cluttering, provide necessary info
 * - Guideline #10: Adequate feedback
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
    <div className="intelligence-feed max-w-4xl mx-auto space-y-6">
      {/* Guideline #1: Provide detailed task information upfront */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Intelligence Feed
        </h1>
        <p className="text-sm text-gray-300 mb-4">
          Track competitive intelligence from RSS feeds, blogs, and news sources
        </p>

        {/* Guideline #1: Clear next steps for new users */}
        {items.length === 0 && !loading && !error && (
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-200 mb-2">
                  Getting Started - Follow These Steps:
                </h3>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>
                    Click <strong>"+ Add Source"</strong> button below to add
                    your first intelligence source
                  </li>
                  <li>
                    Enter an RSS feed URL (example: https://hnrss.org/frontpage)
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

        {/* Action buttons - Guideline #6: External consistency (familiar actions) */}
        <div className="flex gap-3">
          <AddSourceDialog userId={userId} />
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            title="Fetch latest items from all your sources"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5"
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

      {/* Guideline #7: Explain warnings and negative outcomes clearly */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <div className="flex gap-3">
            <svg
              className="h-5 w-5 text-red-400 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-300 mb-1">
                Error Loading Intelligence Items
              </h3>
              <p className="text-sm text-red-200 mb-2">{error}</p>
              <p className="text-xs text-red-300">
                <strong>What to do:</strong> Try refreshing the page. If the
                problem persists, check your network connection or contact
                support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guideline #10: Provide adequate feedback */}
      {loading && !error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <svg
            className="animate-spin h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-400 text-sm">Loading intelligence items...</p>
        </div>
      )}

      {/* Empty state with clear guidance */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-16 bg-gray-800 border border-gray-700 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-600 mb-4"
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
          <h3 className="text-lg font-medium text-gray-300 mb-2">
            No Intelligence Items Yet
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Add sources using the "+ Add Source" button above, then click
            "Refresh All" to fetch items
          </p>
        </div>
      )}

      {/* Feed items */}
      {!loading && !error && items.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400">
              Showing {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          {items.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
