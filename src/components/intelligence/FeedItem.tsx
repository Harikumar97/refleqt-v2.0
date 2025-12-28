"use client";

/**
 * Feed Item Component
 * Beautiful individual intelligence feed item card
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
      ? "#10b981" // green
      : relevanceScore !== null && relevanceScore >= 0.5
        ? "#f59e0b" // amber
        : "#6b7280"; // gray

  return (
    <>
      <style jsx>{`
        .feed-item-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .feed-item-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #4facfe;
        }

        .feed-item-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feed-item-card:hover::before {
          opacity: 1;
        }

        .feed-item-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .feed-item-main {
          flex: 1;
        }

        .feed-item-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .feed-item-link {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .feed-item-link:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        .feed-item-description {
          color: #475569;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .feed-item-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #64748b;
        }

        .feed-item-source {
          font-weight: 600;
          color: #334155;
        }

        .feed-item-category {
          padding: 4px 12px;
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          color: #1e40af;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #bfdbfe;
        }

        .feed-item-author {
          color: #64748b;
        }

        .feed-item-date {
          color: #94a3b8;
        }

        .feed-item-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 60px;
        }

        .score-value {
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
        }

        .score-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94a3b8;
          font-weight: 600;
        }

        .score-indicator {
          width: 40px;
          height: 4px;
          border-radius: 2px;
          margin-top: 4px;
        }
      `}</style>

      <div className="feed-item-card">
        <div className="feed-item-content">
          <div className="feed-item-main">
            <h3 className="feed-item-title">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="feed-item-link"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>

            <p className="feed-item-description">{item.content}</p>

            <div className="feed-item-meta">
              {item.source?.sourceName && (
                <span className="feed-item-source">
                  {item.source.sourceName}
                </span>
              )}

              {item.source?.category && (
                <span className="feed-item-category">
                  {item.source.category}
                </span>
              )}

              {item.author && (
                <span className="feed-item-author">By {item.author}</span>
              )}

              <span className="feed-item-date">{publishedDate}</span>
            </div>
          </div>

          {relevanceScore !== null && (
            <div className="feed-item-score">
              <div className="score-value" style={{ color: relevanceColor }}>
                {(relevanceScore * 10).toFixed(1)}
              </div>
              <div className="score-label">Score</div>
              <div
                className="score-indicator"
                style={{ backgroundColor: relevanceColor }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
