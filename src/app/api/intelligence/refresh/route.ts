/**
 * Intelligence Feed Refresh API
 * Trigger manual refresh of intelligence sources
 */

import { NextRequest, NextResponse } from "next/server";
import { assert } from "@/utils/assert";
import { PrismaClient } from "@prisma/client";
import { queueSingleFeed, queueFeedsForUser } from "@/lib/jobs/queues";

const prisma = new PrismaClient();

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

      // Queue BullMQ job for this source
      await queueSingleFeed(sourceId, userId);

      return NextResponse.json({
        success: true,
        message: `Refresh queued for source: ${source.sourceName ?? source.sourceUrl}`,
        data: {
          sourceId: source.id,
          queuedAt: new Date().toISOString(),
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

      // Queue BullMQ jobs for all sources
      const queuedCount = await queueFeedsForUser(userId);

      return NextResponse.json({
        success: true,
        message: `Refresh queued for ${queuedCount} sources`,
        data: {
          sourcesQueued: queuedCount,
          queuedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Error queueing feed refresh:", error);
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
