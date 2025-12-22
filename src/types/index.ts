/**
 * Core Type Definitions for Refleqt
 * All types are explicitly defined for type safety (Rule 8)
 */

/**
 * User-related types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  company: Company | null;
}

export interface Company {
  id: string;
  name: string;
  settings: CompanySettings;
}

export interface CompanySettings {
  features: FeatureFlags;
  obsessionScore: number;
}

export interface FeatureFlags {
  intelligenceFeed: FeatureConfig;
  researchSwarms: FeatureConfig;
  strategyCohorts: FeatureConfig;
  psychographics: FeatureConfig;
  brewery: FeatureConfig;
}

export interface FeatureConfig {
  enabled: boolean;
  tier: "free" | "pro" | "enterprise";
}

/**
 * Intelligence Feed types
 */
export interface FeedItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: Date;
  category: FeedCategory;
  priority: Priority;
}

export type FeedCategory = "competitive" | "market" | "technology" | "customer";

export type Priority = "low" | "medium" | "high" | "critical";

/**
 * Research Swarm types
 */
export interface ResearchSwarm {
  id: string;
  name: string;
  status: SwarmStatus;
  createdAt: Date;
  completedAt: Date | null;
  results: ResearchResult[];
}

export type SwarmStatus = "pending" | "running" | "completed" | "failed";

export interface ResearchResult {
  id: string;
  swarmId: string;
  title: string;
  summary: string;
  confidence: number;
  sources: string[];
}

/**
 * Strategy Cohort types
 */
export interface StrategyCohort {
  id: string;
  name: string;
  query: string;
  insights: Insight[];
  createdAt: Date;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  impact: "low" | "medium" | "high";
}

/**
 * Metrics and Analytics
 */
export interface Metrics {
  engagement: number;
  frequency: number;
  retention: number;
}

export interface ObsessionScore {
  overall: number;
  breakdown: {
    engagement: number;
    frequency: number;
    depth: number;
  };
}
