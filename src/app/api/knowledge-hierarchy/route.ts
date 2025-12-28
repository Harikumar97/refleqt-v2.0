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
    const swarmId = searchParams.get("swarmId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Build query filter
    const where: any = { userId };
    if (swarmId) {
      where.swarmId = swarmId;
    }

    // Fetch knowledge nodes
    const nodes = await prisma.knowledgeNode.findMany({
      where,
      orderBy: [
        { depth: "asc" }, // Strategic (0) → Tactical (1) → Operational (2)
        { relevanceScore: "desc" },
      ],
    });

    // Convert Prisma Decimal to number for JSON serialization
    const serializedNodes = nodes.map((node: any) => ({
      id: node.id,
      swarmId: node.swarmId,
      userId: node.userId,
      nodeTitle: node.nodeTitle,
      nodeContent: node.nodeContent,
      hierarchyLevel: node.hierarchyLevel,
      depth: node.depth,
      insightIds: node.insightIds,
      relevanceScore: Number(node.relevanceScore),
      parentNodeId: node.parentNodeId,
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
