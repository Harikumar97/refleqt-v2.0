import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/knowledge-hierarchy
 * Fetch knowledge hierarchy nodes for a user (optionally filtered by swarmId)
 * Returns Strategic/Tactical/Operational structure
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Fetch knowledge nodes
    const nodes = await prisma.knowledgeNode.findMany({
      where: { userId },
      orderBy: [
        { depth: "asc" }, // Strategic (0) → Tactical (1) → Operational (2)
        { relevanceScore: "desc" },
      ],
    });

    // Convert Prisma Decimal to number for JSON serialization
    const serializedNodes = nodes.map((node) => ({
      id: node.id,
      userId: node.userId,
      parentNodeId: node.parentId,
      nodeTitle: node.nodeTitle,
      nodeContent: node.nodeContent || "",
      hierarchyLevel: node.hierarchyLevel,
      depth: node.depth,
      insightIds: node.insightIds,
      relevanceScore: Number(node.relevanceScore),
      createdAt: node.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        nodes: serializedNodes,
        count: serializedNodes.length,
      },
    });
  } catch (error) {
    console.error("Error fetching knowledge hierarchy:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch knowledge hierarchy" },
      { status: 500 }
    );
  }
}
