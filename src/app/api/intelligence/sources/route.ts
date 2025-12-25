/**
 * Intelligence Sources API
 * Manage RSS feeds, social media sources, and other intelligence inputs
 */

import { NextRequest, NextResponse } from "next/server";
import { assert } from "@/utils/assert";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/intelligence/sources
 * List all intelligence sources for a user
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from session after NextAuth is set up
    const userId = request.nextUrl.searchParams.get("userId");
    assert(userId !== null, "userId is required");

    const sources = await prisma.intelligenceSource.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { intelligenceItems: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: sources,
    });
  } catch (error) {
    console.error("Error fetching intelligence sources:", error);
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
 * POST /api/intelligence/sources
 * Add a new intelligence source
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sourceType, sourceUrl, sourceName, category } = body;

    // Validation
    assert(userId, "userId is required");
    assert(sourceType, "sourceType is required");
    assert(sourceUrl, "sourceUrl is required");
    assert(
      ["rss", "twitter", "linkedin", "youtube", "website"].includes(sourceType),
      "Invalid sourceType"
    );

    // Create source
    const source = await prisma.intelligenceSource.create({
      data: {
        userId,
        sourceType,
        sourceUrl,
        sourceName: sourceName ?? null,
        category: category ?? null,
        isActive: true,
      },
    });

    // TODO: Trigger initial fetch job via BullMQ

    return NextResponse.json({
      success: true,
      data: source,
    });
  } catch (error) {
    console.error("Error creating intelligence source:", error);
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
 * DELETE /api/intelligence/sources
 * Remove an intelligence source
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sourceId = searchParams.get("sourceId");
    const userId = searchParams.get("userId");

    assert(sourceId !== null, "sourceId is required");
    assert(userId !== null, "userId is required");

    // Verify ownership before deleting
    const source = await prisma.intelligenceSource.findFirst({
      where: {
        id: sourceId,
        userId,
      },
    });

    assert(source !== null, "Source not found or unauthorized");

    // Delete (will cascade to intelligence items)
    await prisma.intelligenceSource.delete({
      where: { id: sourceId },
    });

    return NextResponse.json({
      success: true,
      message: "Source deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting intelligence source:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
