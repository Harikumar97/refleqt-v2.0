/**
 * Smart Tracker API
 * Manage automated research goal monitoring
 */

import { NextRequest, NextResponse } from "next/server";
import { assert } from "@/utils/assert";
import prisma from "@/lib/db/prisma";

/**
 * GET /api/smart-tracker
 * List all smart trackers for a user with their research goals
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    assert(userId !== null, "userId is required");

    const trackers = await prisma.smartTracker.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        goal: {
          select: {
            id: true,
            goalTitle: true,
            goalQuery: true,
            goalType: true,
            monitoringLevel: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        trackers: trackers.map((tracker) => ({
          id: tracker.id,
          goalId: tracker.goalId,
          goalTitle: tracker.goal.goalTitle,
          goalQuery: tracker.goal.goalQuery,
          goalType: tracker.goal.goalType,
          monitoringLevel: tracker.goal.monitoringLevel,
          updateInterval: tracker.updateInterval,
          maxInsights: tracker.maxInsights,
          lastExecutedAt: tracker.lastExecutedAt?.toISOString() || null,
          nextExecutionAt: tracker.nextExecutionAt?.toISOString() || null,
          isActive: tracker.isActive,
          goalIsActive: tracker.goal.isActive,
          createdAt: tracker.createdAt.toISOString(),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching smart trackers:", error);
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
 * PATCH /api/smart-tracker
 * Update tracker status (pause/resume)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, trackerId, isActive } = body;

    assert(userId, "userId is required");
    assert(trackerId, "trackerId is required");
    assert(typeof isActive === "boolean", "isActive must be a boolean");

    // Verify ownership
    const tracker = await prisma.smartTracker.findFirst({
      where: {
        id: trackerId,
        userId,
      },
    });

    assert(tracker !== null, "Tracker not found or unauthorized");

    // Update tracker status
    const updatedTracker = await prisma.smartTracker.update({
      where: { id: trackerId },
      data: {
        isActive,
        // If resuming, set next execution to now
        ...(isActive && {
          nextExecutionAt: new Date(Date.now() + tracker.updateInterval * 1000),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        tracker: {
          id: updatedTracker.id,
          isActive: updatedTracker.isActive,
          nextExecutionAt:
            updatedTracker.nextExecutionAt?.toISOString() || null,
        },
      },
    });
  } catch (error) {
    console.error("Error updating smart tracker:", error);
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
 * DELETE /api/smart-tracker
 * Delete a smart tracker
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const trackerId = searchParams.get("trackerId");
    const userId = searchParams.get("userId");

    assert(trackerId !== null, "trackerId is required");
    assert(userId !== null, "userId is required");

    // Verify ownership
    const tracker = await prisma.smartTracker.findFirst({
      where: {
        id: trackerId,
        userId,
      },
    });

    assert(tracker !== null, "Tracker not found or unauthorized");

    // Delete tracker
    await prisma.smartTracker.delete({
      where: { id: trackerId },
    });

    return NextResponse.json({
      success: true,
      message: "Smart tracker deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting smart tracker:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
