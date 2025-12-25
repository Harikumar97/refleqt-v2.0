/**
 * Intelligence Items API
 * Fetch and search intelligence feed items with semantic search
 */

import { NextRequest, NextResponse } from "next/server";
import { assert } from "@/utils/assert";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

/**
 * GET /api/intelligence/items
 * List intelligence items for a user with filtering and semantic search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const sourceId = searchParams.get("sourceId");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const searchQuery = searchParams.get("query");

    assert(userId !== null, "userId is required");
    assert(limit > 0 && limit <= 100, "limit must be between 1 and 100");

    // Build filter conditions
    const where: Prisma.IntelligenceItemWhereInput = {
      userId,
    };

    if (sourceId) {
      where.sourceId = sourceId;
    }

    if (category) {
      where.source = {
        category,
      };
    }

    // If semantic search query provided
    if (searchQuery) {
      // TODO: Generate embedding for query using LLM Router
      // TODO: Use pgvector similarity search
      // For now, fall back to text search
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Fetch items
    const items = await prisma.intelligenceItem.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
      include: {
        source: {
          select: {
            sourceName: true,
            sourceType: true,
            category: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await prisma.intelligenceItem.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + items.length < total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching intelligence items:", error);
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
 * POST /api/intelligence/items/search
 * Semantic search across intelligence items using embeddings
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, query, limit = 20, minRelevance = 0.7 } = body;

    assert(userId, "userId is required");
    assert(query, "query is required");
    assert(
      typeof minRelevance === "number" &&
        minRelevance >= 0 &&
        minRelevance <= 1,
      "minRelevance must be between 0 and 1"
    );

    // TODO: Generate embedding for query
    // TODO: Use pgvector cosine similarity search
    // For now, return empty results with TODO note

    return NextResponse.json({
      success: true,
      data: {
        items: [],
        message:
          "Semantic search not yet implemented. Run LLM embedding generation first.",
      },
      meta: {
        query,
        limit,
        minRelevance,
      },
    });
  } catch (error) {
    console.error("Error in semantic search:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
