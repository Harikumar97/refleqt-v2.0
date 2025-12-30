import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

/**
 * DELETE /api/research-goal/[goalId]
 * Delete a specific research goal
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const { goalId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const goal = await prisma.researchGoal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!goal) {
      return NextResponse.json(
        { success: false, error: "Research goal not found" },
        { status: 404 }
      );
    }

    // Delete goal (cascades to trackers and swarms)
    await prisma.researchGoal.delete({
      where: { id: goalId },
    });

    return NextResponse.json({
      success: true,
      message: "Research goal deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting research goal:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete research goal" },
      { status: 500 }
    );
  }
}
