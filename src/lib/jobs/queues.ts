/**
 * BullMQ Job Queues
 * Background job processing for Intelligence Feed and other async tasks
 */

import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { assert } from "@/utils/assert";

// Redis connection for BullMQ
const connection = new Redis(process.env["REDIS_URL"] ?? "", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

/**
 * Job data types
 */
export interface FeedFetchJobData {
  sourceId: string;
  userId: string;
}

export interface EmbeddingJobData {
  itemId: string;
  text: string;
}

export interface RelevanceScoreJobData {
  itemId: string;
  userId: string;
}

/**
 * Feed Fetch Queue
 * Processes RSS feed ingestion jobs
 */
export const feedFetchQueue = new Queue<FeedFetchJobData>("feed-fetch", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
    },
  },
});

/**
 * Embedding Generation Queue
 * Generates embeddings for intelligence items
 */
export const embeddingQueue = new Queue<EmbeddingJobData>("embeddings", {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: {
      count: 50,
    },
    removeOnFail: {
      count: 200,
    },
  },
});

/**
 * Relevance Scoring Queue
 * Calculates relevance scores for intelligence items based on user preferences
 */
export const relevanceQueue = new Queue<RelevanceScoreJobData>(
  "relevance-scoring",
  {
    connection,
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: "fixed",
        delay: 500,
      },
      removeOnComplete: {
        count: 50,
      },
    },
  }
);

/**
 * Queue all active feeds for a user
 */
export async function queueFeedsForUser(userId: string): Promise<number> {
  assert(userId.length > 0, "userId must not be empty");

  const prisma = (await import("@/lib/db/prisma")).default;

  try {
    const sources = await prisma.intelligenceSource.findMany({
      where: {
        userId,
        sourceType: "rss",
        isActive: true,
      },
    });

    let queuedCount = 0;
    for (const source of sources) {
      await feedFetchQueue.add(
        "fetch-rss",
        {
          sourceId: source.id,
          userId,
        },
        {
          jobId: `feed-${source.id}-${Date.now()}`,
        }
      );
      queuedCount++;
    }

    return queuedCount;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Queue a single feed for refresh
 */
export async function queueSingleFeed(
  sourceId: string,
  userId: string
): Promise<void> {
  assert(sourceId.length > 0, "sourceId must not be empty");
  assert(userId.length > 0, "userId must not be empty");

  await feedFetchQueue.add(
    "fetch-rss",
    {
      sourceId,
      userId,
    },
    {
      jobId: `feed-${sourceId}-${Date.now()}`,
    }
  );
}

/**
 * Get queue statistics
 */
export async function getQueueStats(queueName: "feed-fetch" | "embeddings") {
  const queue = queueName === "feed-fetch" ? feedFetchQueue : embeddingQueue;

  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    total: waiting + active + completed + failed,
  };
}
