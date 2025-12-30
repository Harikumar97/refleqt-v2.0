import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

/**
 * PATCH /api/user/obsession-score
 * Update user's obsession score (1-10)
 * This affects monitoring frequency and max insights for Smart Trackers
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId, obsessionScore } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID required" },
        { status: 400 }
      );
    }

    // Validate obsession score (1-10)
    const score = Number(obsessionScore);
    if (isNaN(score) || score < 1 || score > 10) {
      return NextResponse.json(
        { success: false, error: "Obsession score must be between 1 and 10" },
        { status: 400 }
      );
    }

    // Update or create user profile
    const userProfile = await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        obsessionScore: score,
        companyName: "",
        industry: "",
      },
      update: {
        obsessionScore: score,
      },
    });

    // Update existing Smart Trackers with new frequency
    const { interval, maxItems } = calculateUpdateFrequency(score);

    await prisma.smartTracker.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        updateInterval: interval,
        maxInsights: maxItems,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        obsessionScore: Number(userProfile.obsessionScore),
        monitoring: {
          interval,
          maxItems,
        },
      },
    });
  } catch (error) {
    console.error("Error updating obsession score:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update obsession score" },
      { status: 500 }
    );
  }
}

/**
 * Helper: Calculate update frequency based on obsession score
 */
function calculateUpdateFrequency(obsessionScore: number): {
  interval: number;
  maxItems: number;
} {
  const frequencies: Record<string, { interval: number; maxItems: number }> = {
    low: { interval: 86400, maxItems: 5 }, // Daily, 5 items (score 1-3)
    medium: { interval: 3600, maxItems: 7 }, // Hourly, 7 items (score 4-6)
    high: { interval: 900, maxItems: 9 }, // 15 min, 9 items (score 7-8)
    extreme: { interval: 300, maxItems: 10 }, // 5 min, 10 items (score 9-10)
  };

  if (obsessionScore >= 9) return frequencies["extreme"]!;
  if (obsessionScore >= 7) return frequencies["high"]!;
  if (obsessionScore >= 4) return frequencies["medium"]!;
  return frequencies["low"]!;
}
