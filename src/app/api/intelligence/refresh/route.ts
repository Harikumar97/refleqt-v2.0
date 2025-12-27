/**
 * Intelligence Feed Refresh API
 * Trigger manual refresh of intelligence sources
 * MVP: Direct ingestion (synchronous), will add BullMQ background processing later
 */

import { NextRequest, NextResponse } from "next/server";
import { assert } from "@/utils/assert";
import prisma from "@/lib/db/prisma";
import {
  ingestRSSFeed,
  ingestAllFeedsForUser,
} from "@/lib/intelligence/feed-ingestion";
import { LLMRouter } from "@/lib/llm/router/llm-router";

// Initialize LLM router from environment variables
const llmRouter = LLMRouter.fromEnv();

/**
 * POST /api/intelligence/refresh
 * Trigger refresh of one or all intelligence sources
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sourceId } = body;

    assert(userId, "userId is required");

    if (sourceId) {
      // Refresh specific source
      const source = await prisma.intelligenceSource.findFirst({
        where: {
          id: sourceId,
          userId,
          isActive: true,
        },
      });

      assert(source !== null, "Source not found or inactive");

      // Directly ingest the feed (synchronous for MVP)
      const result = await ingestRSSFeed(sourceId, userId, llmRouter);

      if (!result.success) {
        throw result.error;
      }

      return NextResponse.json({
        success: true,
        message: `Refreshed ${source.sourceName ?? source.sourceUrl}`,
        data: {
          sourceId: source.id,
          itemsProcessed: result.value.itemsProcessed,
          itemsAdded: result.value.itemsAdded,
          itemsSkipped: result.value.itemsSkipped,
          errors: result.value.errors,
        },
      });
    } else {
      // Refresh all sources for user
      const sources = await prisma.intelligenceSource.findMany({
        where: {
          userId,
          isActive: true,
        },
      });

      assert(sources.length > 0, "No active sources found");

      // Directly ingest all feeds (synchronous for MVP)
      const result = await ingestAllFeedsForUser(userId, llmRouter);

      if (!result.success) {
        throw result.error;
      }

      const totalAdded = result.value.reduce((sum, r) => sum + r.itemsAdded, 0);
      const totalProcessed = result.value.reduce(
        (sum, r) => sum + r.itemsProcessed,
        0
      );

      return NextResponse.json({
        success: true,
        message: `Refreshed ${sources.length} sources, added ${totalAdded} items`,
        data: {
          sourcesRefreshed: sources.length,
          totalItemsProcessed: totalProcessed,
          totalItemsAdded: totalAdded,
          results: result.value,
        },
      });
    }
  } catch (error) {
    console.error("Error refreshing feeds:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/intelligence/refresh/status
 * Check refresh status for a source
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");
    const sourceId = searchParams.get("sourceId");

    assert(userId !== null, "userId is required");

    if (sourceId) {
      const source = await prisma.intelligenceSource.findFirst({
        where: {
          id: sourceId,
          userId,
        },
        select: {
          id: true,
          sourceName: true,
          sourceUrl: true,
          lastFetchedAt: true,
          isActive: true,
          _count: {
            select: { intelligenceItems: true },
          },
        },
      });

      assert(source !== null, "Source not found");

      return NextResponse.json({
        success: true,
        data: {
          sourceId: source.id,
          sourceName: source.sourceName,
          lastFetchedAt: source.lastFetchedAt,
          itemCount: source._count.intelligenceItems,
          isActive: source.isActive,
        },
      });
    } else {
      // Get status for all sources
      const sources = await prisma.intelligenceSource.findMany({
        where: { userId },
        select: {
          id: true,
          sourceName: true,
          sourceUrl: true,
          lastFetchedAt: true,
          isActive: true,
          _count: {
            select: { intelligenceItems: true },
          },
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          totalSources: sources.length,
          activeSources: sources.filter((s) => s.isActive).length,
          sources: sources.map((s) => ({
            sourceId: s.id,
            sourceName: s.sourceName,
            lastFetchedAt: s.lastFetchedAt,
            itemCount: s._count.intelligenceItems,
            isActive: s.isActive,
          })),
        },
      });
    }
  } catch (error) {
    console.error("Error fetching refresh status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
