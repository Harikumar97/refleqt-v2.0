/**
 * Research Goal API
 * Create and manage research goals (replaces simple RSS sources)
 */

import { NextRequest, NextResponse } from "next/server";
import { assert } from "@/utils/assert";
import prisma from "@/lib/db/prisma";
import { MCPOrchestrator } from "@/lib/research-swarm/mcp-orchestrator";

/**
 * GET /api/research-goal
 * List all research goals for a user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    assert(userId !== null, "userId is required");

    const goals = await prisma.researchGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        swarms: {
          select: {
            id: true,
            executionStatus: true,
            _count: {
              select: {
                insights: true,
              },
            },
          },
        },
        trackers: {
          select: {
            id: true,
            updateInterval: true,
            maxInsights: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        goals: goals.map((goal) => ({
          id: goal.id,
          goalTitle: goal.goalTitle,
          goalQuery: goal.goalQuery,
          goalType: goal.goalType,
          monitoringLevel: goal.monitoringLevel,
          isActive: goal.isActive,
          createdAt: goal.createdAt.toISOString(),
          swarms: goal.swarms.map((s) => ({
            id: s.id,
            executionStatus: s.executionStatus,
            insightCount: s._count.insights,
          })),
          trackers: goal.trackers,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching research goals:", error);
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
 * POST /api/research-goal
 * Create a new research goal with optional Smart Tracker
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, goalTitle, goalQuery, goalType, enableTracking } = body;

    assert(userId, "userId is required");
    assert(goalTitle, "goalTitle is required");
    assert(goalQuery, "goalQuery is required");
    assert(
      ["competitive", "market", "customer", "industry"].includes(goalType),
      "Invalid goalType"
    );

    // Get user's obsession score
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    const obsessionScore = userProfile?.obsessionScore
      ? Number(userProfile.obsessionScore)
      : 5.0;

    // Determine monitoring level based on obsession score
    const monitoringLevel =
      obsessionScore >= 9
        ? "realtime"
        : obsessionScore >= 7
          ? "hourly"
          : "daily";

    // Create research goal
    const goal = await prisma.researchGoal.create({
      data: {
        userId,
        goalTitle,
        goalQuery,
        goalType,
        monitoringLevel,
        isActive: true,
      },
    });

    // Create Smart Tracker if requested
    let tracker = null;
    if (enableTracking) {
      const { interval, maxItems } =
        MCPOrchestrator.calculateUpdateFrequency(obsessionScore);

      tracker = await prisma.smartTracker.create({
        data: {
          goalId: goal.id,
          userId,
          updateInterval: interval,
          maxInsights: maxItems,
          nextExecutionAt: new Date(Date.now() + interval * 1000),
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        goal: {
          id: goal.id,
          goalTitle: goal.goalTitle,
          goalQuery: goal.goalQuery,
          goalType: goal.goalType,
          monitoringLevel: goal.monitoringLevel,
        },
        tracker: tracker
          ? {
              id: tracker.id,
              updateInterval: tracker.updateInterval,
              maxInsights: tracker.maxInsights,
              nextExecutionAt: tracker.nextExecutionAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Error creating research goal:", error);
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
 * DELETE /api/research-goal
 * Delete a research goal and its trackers
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const goalId = searchParams.get("goalId");
    const userId = searchParams.get("userId");

    assert(goalId !== null, "goalId is required");
    assert(userId !== null, "userId is required");

    // Verify ownership
    const goal = await prisma.researchGoal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    assert(goal !== null, "Goal not found or unauthorized");

    // Delete goal (will cascade to trackers and swarms)
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
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
