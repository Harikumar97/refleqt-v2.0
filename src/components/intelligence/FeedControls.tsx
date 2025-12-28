"use client";

/**
 * Feed Controls Component
 * Beautiful search and filter controls for intelligence feed
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
    <>
      <style jsx>{`
        .controls-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 2px solid #e2e8f0;
        }

        .controls-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .search-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .search-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .search-label {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .search-hint {
          font-size: 12px;
          color: #94a3b8;
        }

        .search-form {
          display: flex;
          gap: 12px;
        }

        .search-input {
          flex: 1;
          padding: 12px 16px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #1e293b;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: #94a3b8;
        }

        .search-input:focus {
          outline: none;
          border-color: #4facfe;
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }

        .search-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
        }

        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }

        .filter-section {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding-top: 16px;
          border-top: 2px solid #f1f5f9;
          flex-wrap: wrap;
        }

        .category-wrapper {
          flex: 1;
          min-width: 200px;
          max-width: 300px;
        }

        .category-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 6px;
        }

        .category-select {
          width: 100%;
          padding: 10px 14px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          color: #1e293b;
          border-radius: 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-select:focus {
          outline: none;
          border-color: #4facfe;
          background: white;
          box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
        }

        .clear-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          color: #475569;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-button:hover {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .active-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          padding: 12px 16px;
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          border-radius: 10px;
          border: 1px solid #bfdbfe;
        }

        .filter-icon {
          width: 16px;
          height: 16px;
          color: #3b82f6;
          flex-shrink: 0;
        }

        .filter-text {
          color: #1e40af;
          font-weight: 500;
        }
      `}</style>

      <div className="controls-container">
        <div className="controls-content">
          {/* Search section */}
          <div className="search-section">
            <div className="search-header">
              <label htmlFor="search" className="search-label">
                Search Intelligence Items
              </label>
              <span className="search-hint">Search by title or content</span>
            </div>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                id="search"
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Enter keywords to search..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>

          {/* Filter section */}
          <div className="filter-section">
            <div className="category-wrapper">
              <label htmlFor="category" className="category-label">
                Filter by Category (optional)
              </label>
              <select
                id="category"
                value={category ?? ""}
                onChange={(e) => onCategoryChange(e.target.value || null)}
                className="category-select"
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
                className="clear-button"
                title="Remove all search and filter criteria"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Active filters indicator */}
          {(category || searchQuery) && (
            <div className="active-filters">
              <svg
                className="filter-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="filter-text">
                Active filters: {searchQuery && `Search: "${searchQuery}"`}
                {searchQuery && category && " • "}
                {category &&
                  `Category: ${categories.find((c) => c.value === category)?.label}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
