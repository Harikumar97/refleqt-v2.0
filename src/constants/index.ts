/**
 * Application Constants
 * Centralized constants following Power of Ten principles
 */

/**
 * Iteration bounds (Rule 2: Fixed upper bounds)
 */
export const BOUNDS = {
  MAX_ITERATIONS: 10000,
  MAX_FEED_ITEMS: 1000,
  MAX_RESEARCH_ITEMS: 500,
  MAX_COHORT_SIZE: 100,
  MAX_SEARCH_RESULTS: 50,
  MAX_FILE_SIZE: 10485760, // 10MB
  MAX_STRING_LENGTH: 10000,
} as const;

/**
 * Score ranges
 */
export const SCORE_RANGES = {
  MIN_SCORE: 0,
  MAX_SCORE: 10,
  MIN_CONFIDENCE: 0,
  MAX_CONFIDENCE: 100,
} as const;

/**
 * Feature limits
 */
export const FEATURE_LIMITS = {
  FREE: {
    feedItems: 100,
    researchSwarms: 5,
    cohorts: 3,
  },
  PRO: {
    feedItems: 500,
    researchSwarms: 20,
    cohorts: 10,
  },
  ENTERPRISE: {
    feedItems: 1000,
    researchSwarms: 100,
    cohorts: 50,
  },
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * Application metadata
 */
export const APP_METADATA = {
  NAME: "Refleqt",
  TAGLINE: "Stop Drowning in Data. Start Obsessing Smart.",
  VERSION: "2.0.0",
} as const;
