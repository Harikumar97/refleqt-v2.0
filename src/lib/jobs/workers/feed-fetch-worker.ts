/**
 * Feed Fetch Worker
 * Processes RSS feed ingestion jobs from BullMQ
 */

import { Worker, Job } from "bullmq";
import { Redis } from "ioredis";
import { FeedFetchJobData } from "../queues";
import { ingestRSSFeed } from "@/lib/intelligence/feed-ingestion";
import { LLMRouter } from "@/lib/llm/router/llm-router";
import { assert } from "@/utils/assert";

// Redis connection for BullMQ worker
const connection = new Redis(process.env["REDIS_URL"] ?? "", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

/**
 * Process feed fetch job
 */
async function processFeedFetch(
  job: Job<FeedFetchJobData>
): Promise<{ success: boolean; itemsAdded: number }> {
  const { sourceId, userId } = job.data;

  assert(sourceId.length > 0, "sourceId is required");
  assert(userId.length > 0, "userId is required");

  console.log(
    `[FeedFetchWorker] Processing job ${job.id}: sourceId=${sourceId}, userId=${userId}`
  );

  try {
    // Initialize LLM router for embeddings
    const llmRouter = LLMRouter.fromEnv();

    // Ingest RSS feed
    const result = await ingestRSSFeed(sourceId, userId, llmRouter);

    if (result.success) {
      console.log(
        `[FeedFetchWorker] Job ${job.id} completed: ${result.value.itemsAdded} items added, ${result.value.itemsSkipped} skipped`
      );

      if (result.value.errors.length > 0) {
        console.warn(
          `[FeedFetchWorker] Job ${job.id} had ${result.value.errors.length} errors:`,
          result.value.errors
        );
      }

      return {
        success: true,
        itemsAdded: result.value.itemsAdded,
      };
    } else {
      throw result.error ?? new Error("Unknown ingestion error");
    }
  } catch (error) {
    console.error(`[FeedFetchWorker] Job ${job.id} failed:`, error);
    throw error;
  }
}

/**
 * Create and start the feed fetch worker
 */
export function createFeedFetchWorker(): Worker<FeedFetchJobData> {
  const worker = new Worker<FeedFetchJobData>("feed-fetch", processFeedFetch, {
    connection,
    concurrency: 5, // Process up to 5 feeds concurrently
    limiter: {
      max: 20, // Max 20 jobs per duration
      duration: 60000, // Per minute
    },
  });

  worker.on("completed", (job) => {
    console.log(`[FeedFetchWorker] Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[FeedFetchWorker] Job ${job?.id} failed:`, err);
  });

  worker.on("error", (err) => {
    console.error("[FeedFetchWorker] Worker error:", err);
  });

  console.log("[FeedFetchWorker] Started and ready to process jobs");

  return worker;
}

// Auto-start worker if this file is run directly
if (require.main === module) {
  console.log("[FeedFetchWorker] Starting worker process...");
  createFeedFetchWorker();

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    console.log("[FeedFetchWorker] Received SIGTERM, shutting down...");
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("[FeedFetchWorker] Received SIGINT, shutting down...");
    process.exit(0);
  });
}
