import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

/**
 * DELETE /api/synthesized-insights/[insightId]
 * Dismiss (soft delete) a synthesized insight
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ insightId: string }> }
) {
  try {
    const { insightId } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const insight = await prisma.synthesizedInsight.findFirst({
      where: {
        id: insightId,
        userId,
      },
    });

    if (!insight) {
      return NextResponse.json(
        { success: false, error: "Insight not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting dismissedAt timestamp
    await prisma.synthesizedInsight.update({
      where: { id: insightId },
      data: { dismissedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Insight dismissed successfully",
    });
  } catch (error) {
    console.error("Error dismissing insight:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dismiss insight" },
      { status: 500 }
    );
  }
}
