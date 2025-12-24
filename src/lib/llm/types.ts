/**
 * Multi-LLM Router Types
 * Defines interfaces for provider-agnostic LLM interactions
 */

import { SafeResult } from "@/utils/safety";

/**
 * Supported LLM providers
 */
export type LLMProvider =
  | "anthropic-claude"
  | "openai-gpt"
  | "google-gemini"
  | "deepseek"
  | "perplexity"
  | "grok";

/**
 * LLM task types - each optimized for specific providers
 */
export type LLMTask =
  | "competitive_analysis" // Claude excels
  | "insight_generation" // Claude excels
  | "text_embeddings" // OpenAI best
  | "research_search" // Perplexity
  | "social_media_analysis" // Grok (X native)
  | "data_transformation" // DeepSeek
  | "long_document_summary" // Gemini (large context)
  | "content_filtering"; // GPT-3.5 (fast/cheap)

/**
 * LLM request parameters
 */
export interface LLMRequest {
  task: LLMTask;
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  context?: Record<string, unknown>;
}

/**
 * LLM response with metadata
 */
export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  cost?: number; // in USD
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  provider: LLMProvider;
  apiKey: string;
  enabled: boolean;
  dailyLimit?: number; // tokens per day
  costPerToken?: number; // in USD
  priority?: number; // higher = preferred (0-10)
}

/**
 * Provider usage stats
 */
export interface ProviderUsage {
  provider: LLMProvider;
  tokensUsedToday: number;
  requestsToday: number;
  lastUsed: Date;
  isAvailable: boolean;
}

/**
 * Abstract LLM provider interface
 * All providers must implement this
 */
export interface ILLMProvider {
  readonly provider: LLMProvider;
  readonly isAvailable: boolean;

  /**
   * Generate text completion
   */
  complete(request: LLMRequest): Promise<SafeResult<LLMResponse>>;

  /**
   * Generate embeddings (vector representations)
   */
  embed(text: string): Promise<SafeResult<number[]>>;

  /**
   * Check if provider has quota available
   */
  hasQuota(): Promise<boolean>;

  /**
   * Get current usage stats
   */
  getUsage(): Promise<ProviderUsage>;
}

/**
 * Router configuration
 */
export interface RouterConfig {
  defaultProvider?: LLMProvider;
  fallbackProviders?: LLMProvider[];
  enableAutoFallback: boolean;
  maxRetries: number;
  taskMapping: Map<LLMTask, LLMProvider>;
}
