"use client";

/**
 * Add Source Dialog Component
 * Modal dialog for adding new intelligence sources
 */

import { useState } from "react";

interface AddSourceDialogProps {
  userId: string;
}

export function AddSourceDialog({ userId }: AddSourceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceType, setSourceType] = useState<string>("rss");
  const [sourceUrl, setSourceUrl] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [category, setCategory] = useState<string>("industry");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/intelligence/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sourceType,
          sourceUrl,
          sourceName: sourceName || null,
          category,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error ?? "Failed to add source");
      }

      // Success - close dialog and reload
      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add source");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
      >
        + Add Source
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-800 border-2 border-slate-600 rounded-lg shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            Add Intelligence Source
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Source Type */}
          <div>
            <label
              htmlFor="sourceType"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Source Type
            </label>
            <select
              id="sourceType"
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border-2 border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="rss">RSS Feed</option>
              <option value="twitter" disabled>
                Twitter (Coming Soon)
              </option>
              <option value="linkedin" disabled>
                LinkedIn (Coming Soon)
              </option>
              <option value="youtube" disabled>
                YouTube (Coming Soon)
              </option>
              <option value="website" disabled>
                Website (Coming Soon)
              </option>
            </select>
          </div>

          {/* Source URL */}
          <div>
            <label
              htmlFor="sourceUrl"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Feed URL
            </label>
            <input
              id="sourceUrl"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://hnrss.org/frontpage"
              className="w-full px-3 py-2 bg-slate-900 border-2 border-slate-600 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Source Name */}
          <div>
            <label
              htmlFor="sourceName"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Name (Optional)
            </label>
            <input
              id="sourceName"
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="Hacker News"
              className="w-full px-3 py-2 bg-slate-900 border-2 border-slate-600 text-white placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2 text-gray-300"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border-2 border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="competitor">Competitor</option>
              <option value="industry">Industry News</option>
              <option value="geopolitical">Geopolitical</option>
              <option value="news">General News</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-950 border-2 border-red-800 rounded-md text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 bg-slate-700 border-2 border-slate-600 text-white rounded-md hover:bg-slate-600"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 border-2 border-blue-500 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Source"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
