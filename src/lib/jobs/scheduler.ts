/**
 * Job Scheduler
 * Schedules recurring jobs for automatic feed refreshes
 */

import { feedFetchQueue } from "./queues";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Schedule automatic feed refreshes for all users
 * Runs every 4 hours to stay within LLM free tier limits
 */
export async function scheduleAutomaticFeedRefreshes() {
  console.log("[Scheduler] Setting up automatic feed refresh schedules...");

  try {
    // Get all unique users with active intelligence sources
    const users = await prisma.user.findMany({
      where: {
        intelligenceSources: {
          some: {
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    console.log(`[Scheduler] Found ${users.length} users with active sources`);

    // Schedule repeating jobs for each user
    // Stagger users across the 4-hour window to spread load
    const intervalMinutes = 240; // 4 hours
    const staggerMinutes = Math.floor(
      intervalMinutes / Math.max(users.length, 1)
    );

    for (const [index, user] of users.entries()) {
      const delayMinutes = index * staggerMinutes;

      await feedFetchQueue.add(
        "scheduled-refresh",
        {
          sourceId: "all", // Special marker for all sources
          userId: user.id,
        },
        {
          jobId: `scheduled-${user.id}`,
          repeat: {
            every: intervalMinutes * 60 * 1000, // Convert to milliseconds
          },
          delay: delayMinutes * 60 * 1000, // Stagger initial start
        }
      );

      console.log(
        `[Scheduler] Scheduled feeds for user ${user.email} (delay: ${delayMinutes}m, repeat: ${intervalMinutes}m)`
      );
    }

    console.log("[Scheduler] All feed refresh schedules created");
  } catch (error) {
    console.error("[Scheduler] Error setting up schedules:", error);
    throw error;
  }
}

/**
 * Remove all scheduled jobs (cleanup)
 */
export async function clearAllSchedules() {
  console.log("[Scheduler] Clearing all scheduled jobs...");

  const repeatableJobs = await feedFetchQueue.getRepeatableJobs();

  for (const job of repeatableJobs) {
    await feedFetchQueue.removeRepeatableByKey(job.key);
  }

  console.log(`[Scheduler] Cleared ${repeatableJobs.length} scheduled jobs`);
}

/**
 * Get status of all scheduled jobs
 */
export async function getScheduleStatus() {
  const repeatableJobs = await feedFetchQueue.getRepeatableJobs();

  return {
    scheduledJobs: repeatableJobs.length,
    jobs: repeatableJobs.map((job) => ({
      key: job.key,
      name: job.name,
      pattern: job.pattern,
      next: job.next,
    })),
  };
}

/**
 * Initialize scheduler on startup
 */
export async function initializeScheduler() {
  console.log("[Scheduler] Initializing job scheduler...");

  try {
    // Clear old schedules
    await clearAllSchedules();

    // Create new schedules
    await scheduleAutomaticFeedRefreshes();

    console.log("[Scheduler] Initialization complete");
  } catch (error) {
    console.error("[Scheduler] Initialization failed:", error);
    throw error;
  }
}

// Auto-initialize if run directly
if (require.main === module) {
  console.log("[Scheduler] Starting scheduler process...");

  initializeScheduler()
    .then(() => {
      console.log("[Scheduler] Scheduler running");
    })
    .catch((error) => {
      console.error("[Scheduler] Failed to start:", error);
      process.exit(1);
    });

  // Handle graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("[Scheduler] Received SIGTERM, shutting down...");
    await prisma.$disconnect();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("[Scheduler] Received SIGINT, shutting down...");
    await prisma.$disconnect();
    process.exit(0);
  });
}
