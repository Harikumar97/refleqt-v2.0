"use client";

/**
 * Intelligence Feed Component
 * Main feed display for competitive intelligence items
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
    <div className="intelligence-feed space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Intelligence Feed
          </h1>
          <p className="text-sm text-gray-400">
            Real-time competitive intelligence and market trends
          </p>
        </div>
        <div className="flex gap-3">
          <AddSourceDialog userId={userId} />
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Refreshing..." : "Refresh All"}
          </button>
        </div>
      </div>

      <FeedControls
        category={category}
        onCategoryChange={setCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {error && (
        <div className="p-4 mb-4 bg-red-900/20 border border-red-800 rounded-md text-red-400">
          {error}
        </div>
      )}

      {loading && !error && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No intelligence items yet</p>
          <p className="text-sm">
            Add an intelligence source to start tracking competitive
            intelligence
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="feed-items space-y-4">
          {items.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
