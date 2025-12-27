"use client";

/**
 * Feed Item Component
 * Display a single intelligence feed item
 */

import type { IntelligenceItem } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

interface FeedItemProps {
  item: IntelligenceItem & {
    source?: {
      sourceName: string | null;
      sourceType: string;
      category: string | null;
    };
  };
}

export function FeedItem({ item }: FeedItemProps) {
  const publishedDate = item.publishedAt
    ? formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })
    : "Unknown date";

  // Helper to convert relevanceScore to number (handles both Decimal objects and numbers)
  const getRelevanceScore = (): number | null => {
    if (!item.relevanceScore) return null;
    if (typeof item.relevanceScore === "number") return item.relevanceScore;
    if (
      typeof item.relevanceScore === "object" &&
      "toNumber" in item.relevanceScore
    ) {
      return item.relevanceScore.toNumber();
    }
    return Number(item.relevanceScore);
  };

  const relevanceScore = getRelevanceScore();
  const relevanceColor =
    relevanceScore !== null && relevanceScore >= 0.8
      ? "text-green-600"
      : relevanceScore !== null && relevanceScore >= 0.5
        ? "text-yellow-600"
        : "text-gray-600";

  return (
    <div className="feed-item bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h3>

          <p className="text-gray-700 mb-4 line-clamp-3">{item.content}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {item.source?.sourceName && (
              <span className="font-medium">{item.source.sourceName}</span>
            )}

            {item.source?.category && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {item.source.category}
              </span>
            )}

            {item.author && <span>By {item.author}</span>}

            <span>{publishedDate}</span>
          </div>
        </div>

        <div className="ml-4">
          {relevanceScore !== null && (
            <div className={`text-lg font-bold ${relevanceColor}`}>
              {(relevanceScore * 10).toFixed(1)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
