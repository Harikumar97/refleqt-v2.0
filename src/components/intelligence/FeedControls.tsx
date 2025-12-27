"use client";

/**
 * Feed Controls Component
 * Following MOSIP Guideline #11: Explain the "why" behind requested details
 * Following Guideline #9: Avoid cluttering, provide necessary information
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

  function handleClearFilters() {
    onCategoryChange(null);
    onSearchChange("");
    setLocalSearch("");
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
      <div className="space-y-4">
        {/* Guideline #11: Explain purpose of search */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-200"
            >
              Search Intelligence Items
            </label>
            <span className="text-xs text-gray-400">
              Search by title or content
            </span>
          </div>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              id="search"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Enter keywords to search..."
              className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Category filter and clear - Guideline #9: Keep secondary actions compact */}
        <div className="flex items-end gap-3 pt-2 border-t border-gray-700">
          <div className="w-64">
            <label
              htmlFor="category"
              className="block text-xs font-medium mb-1.5 text-gray-400"
            >
              Filter by Category (optional)
            </label>
            <select
              id="category"
              value={category ?? ""}
              onChange={(e) => onCategoryChange(e.target.value || null)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value ?? "all"} value={cat.value ?? ""}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear button - only show when filters active */}
          {(category || searchQuery) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Remove all search and filter criteria"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Active filters indicator - Guideline #10: Provide feedback */}
        {(category || searchQuery) && (
          <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
            <svg
              className="h-4 w-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Active filters: {searchQuery && `Search: "${searchQuery}"`}
              {searchQuery && category && " • "}
              {category &&
                `Category: ${categories.find((c) => c.value === category)?.label}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
