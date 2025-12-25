/**
 * Feed Ingestion Service
 * Fetches and processes RSS feeds, generates embeddings, and stores items
 */

import Parser from "rss-parser";
import prisma from "@/lib/db/prisma";
import { assert } from "@/utils/assert";
import { LLMRouter } from "@/lib/llm/router/llm-router";
import type { SafeResult } from "@/utils/safety";
const rssParser = new Parser({
  timeout: 10000,
  maxRedirects: 3,
});

export interface FeedItem {
  title: string;
  content: string;
  url?: string;
  author?: string;
  publishedAt?: Date;
}

export interface IngestionResult {
  sourceId: string;
  itemsProcessed: number;
  itemsAdded: number;
  itemsSkipped: number;
  errors: string[];
}

/**
 * Ingest RSS feed for a source
 */
export async function ingestRSSFeed(
  sourceId: string,
  userId: string,
  _llmRouter: LLMRouter
): Promise<SafeResult<IngestionResult>> {
  assert(sourceId.length > 0, "sourceId must not be empty");
  assert(userId.length > 0, "userId must not be empty");

  const errors: string[] = [];
  let itemsProcessed = 0;
  let itemsAdded = 0;
  let itemsSkipped = 0;

  try {
    // Get source details
    const source = await prisma.intelligenceSource.findUnique({
      where: { id: sourceId },
    });

    assert(source !== null, `Source not found: ${sourceId}`);
    assert(source.userId === userId, "Unauthorized access to source");
    assert(source.isActive, "Source is inactive");
    assert(source.sourceType === "rss", "Source is not an RSS feed");

    // Fetch and parse RSS feed
    const feed = await rssParser.parseURL(source.sourceUrl);

    // Process items (limit to 50 items per fetch to avoid quota issues)
    const MAX_ITEMS = 50;
    const itemsToProcess = feed.items.slice(0, MAX_ITEMS);

    for (const item of itemsToProcess) {
      itemsProcessed++;

      try {
        // Extract item data
        const title = item.title ?? "Untitled";
        const content =
          item.contentSnippet ?? item.content ?? item.summary ?? "";
        const url = item.link ?? source.sourceUrl;
        const author = item.creator ?? item["author"] ?? null;
        const publishedAt = item.pubDate ? new Date(item.pubDate) : null;

        // Skip if content is too short
        if (content.length < 50) {
          itemsSkipped++;
          continue;
        }

        // Check if item already exists (by URL)
        const existingItem = await prisma.intelligenceItem.findFirst({
          where: {
            sourceId,
            url,
          },
        });

        if (existingItem) {
          itemsSkipped++;
          continue;
        }

        // TODO: Generate embedding for semantic search
        // Disabled for now - will add via raw SQL once pgvector is set up
        // const embeddingText = `${title}\n\n${content}`.slice(0, 8000);
        // const embeddingResult = await llmRouter.embed(embeddingText);

        // Calculate basic relevance score (will be enhanced with user preferences later)
        const relevanceScore = calculateRelevanceScore(title, content, source);

        // Store item in database
        // TODO: Add embedding separately via raw SQL once pgvector is set up
        await prisma.intelligenceItem.create({
          data: {
            sourceId,
            userId,
            title,
            content,
            url,
            author,
            publishedAt,
            relevanceScore,
            metadata: {
              feedTitle: feed.title,
              feedDescription: feed.description,
            },
          },
        });

        itemsAdded++;
      } catch (itemError) {
        errors.push(
          `Error processing item: ${itemError instanceof Error ? itemError.message : "Unknown error"}`
        );
      }
    }

    // Update source last fetched time
    await prisma.intelligenceSource.update({
      where: { id: sourceId },
      data: {
        lastFetchedAt: new Date(),
      },
    });

    return {
      success: true,
      value: {
        sourceId,
        itemsProcessed,
        itemsAdded,
        itemsSkipped,
        errors,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error : new Error("Unknown ingestion error"),
    };
  }
}

/**
 * Calculate basic relevance score for an item
 * Range: 0.0 to 1.0
 */
function calculateRelevanceScore(
  title: string,
  content: string,
  source: { category: string | null }
): number {
  let score = 0.5; // Base score

  // Boost for longer content (more substantial)
  if (content.length > 500) score += 0.1;
  if (content.length > 1500) score += 0.1;

  // Boost for specific categories
  if (source.category === "competitor") score += 0.15;
  if (source.category === "industry") score += 0.1;

  // Boost for key competitive intelligence terms
  const keyTerms = [
    "launch",
    "funding",
    "acquisition",
    "partnership",
    "strategy",
    "revenue",
    "growth",
    "market share",
  ];

  const textLower = `${title} ${content}`.toLowerCase();
  const matchedTerms = keyTerms.filter((term) => textLower.includes(term));
  score += matchedTerms.length * 0.05;

  // Clamp to 0.0 - 1.0
  return Math.min(1.0, Math.max(0.0, score));
}

/**
 * Batch ingest all active RSS feeds for a user
 */
export async function ingestAllFeedsForUser(
  userId: string,
  llmRouter: LLMRouter
): Promise<SafeResult<IngestionResult[]>> {
  assert(userId.length > 0, "userId must not be empty");

  try {
    const sources = await prisma.intelligenceSource.findMany({
      where: {
        userId,
        sourceType: "rss",
        isActive: true,
      },
    });

    const results: IngestionResult[] = [];

    for (const source of sources) {
      const result = await ingestRSSFeed(source.id, userId, llmRouter);

      if (result.success) {
        results.push(result.value);
      } else {
        results.push({
          sourceId: source.id,
          itemsProcessed: 0,
          itemsAdded: 0,
          itemsSkipped: 0,
          errors: [result.error?.message ?? "Unknown error"],
        });
      }
    }

    return {
      success: true,
      value: results,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown batch ingestion error"),
    };
  }
}
