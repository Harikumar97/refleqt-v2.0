"use client";

/**
 * Feed Controls Component
 * Filter and search controls for intelligence feed
 */

import { useState } from "react";

interface FeedControlsProps {
  category: string | null;
  onCategoryChange: (category: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FeedControls({
  category,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: FeedControlsProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const categories = [
    { value: null, label: "All Categories" },
    { value: "competitor", label: "Competitors" },
    { value: "industry", label: "Industry News" },
    { value: "geopolitical", label: "Geopolitical" },
    { value: "news", label: "General News" },
  ];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearchChange(localSearch);
  }

  return (
    <div className="feed-controls bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6">
      <div className="space-y-4">
        {/* Search Bar - Primary action */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium mb-2 text-gray-300"
          >
            Search
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              id="search"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search intelligence items..."
              className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <div className="w-56">
            <label
              htmlFor="category"
              className="block text-xs font-medium mb-1.5 text-gray-400"
            >
              Filter by Category
            </label>
            <select
              id="category"
              value={category ?? ""}
              onChange={(e) => onCategoryChange(e.target.value || null)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value ?? "all"} value={cat.value ?? ""}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(category || searchQuery) && (
            <button
              onClick={() => {
                onCategoryChange(null);
                onSearchChange("");
                setLocalSearch("");
              }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors whitespace-nowrap mt-6"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
