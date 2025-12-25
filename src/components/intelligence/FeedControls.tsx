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
    <div className="feed-controls bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            value={category ?? ""}
            onChange={(e) => onCategoryChange(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.value ?? "all"} value={cat.value ?? ""}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Search
          </label>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              id="search"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search intelligence items..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {/* Clear Filters */}
        {(category || searchQuery) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                onCategoryChange(null);
                onSearchChange("");
                setLocalSearch("");
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
