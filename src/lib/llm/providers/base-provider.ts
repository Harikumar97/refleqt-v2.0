/**
 * Base LLM Provider
 * Abstract class with common functionality for all providers
 */

import { assert } from "@/utils/assert";
import { SafeResult } from "@/utils/safety";
import type {
  ILLMProvider,
  LLMProvider,
  LLMRequest,
  LLMResponse,
  ProviderUsage,
} from "../types";

export abstract class BaseLLMProvider implements ILLMProvider {
  abstract readonly provider: LLMProvider;
  protected apiKey: string;
  protected dailyLimit: number;
  protected tokensUsedToday: number = 0;
  protected requestsToday: number = 0;
  protected lastResetDate: Date;

  constructor(apiKey: string, dailyLimit: number = 1000000) {
    assert(apiKey.length > 0, "API key cannot be empty");
    assert(dailyLimit > 0, "Daily limit must be positive");

    this.apiKey = apiKey;
    this.dailyLimit = dailyLimit;
    this.lastResetDate = new Date();
  }

  get isAvailable(): boolean {
    return this.apiKey.length > 0 && this.tokensUsedToday < this.dailyLimit;
  }

  /**
   * Abstract methods - must be implemented by providers
   */
  abstract complete(request: LLMRequest): Promise<SafeResult<LLMResponse>>;
  abstract embed(text: string): Promise<SafeResult<number[]>>;

  /**
   * Check if provider has quota available
   */
  async hasQuota(): Promise<boolean> {
    this.resetDailyCountersIfNeeded();
    return this.tokensUsedToday < this.dailyLimit;
  }

  /**
   * Get current usage stats
   */
  async getUsage(): Promise<ProviderUsage> {
    this.resetDailyCountersIfNeeded();

    return {
      provider: this.provider,
      tokensUsedToday: this.tokensUsedToday,
      requestsToday: this.requestsToday,
      lastUsed: this.lastResetDate,
      isAvailable: this.isAvailable,
    };
  }

  /**
   * Track token usage
   */
  protected trackUsage(tokensUsed: number): void {
    assert(tokensUsed >= 0, "Tokens used must be non-negative");

    this.tokensUsedToday += tokensUsed;
    this.requestsToday += 1;
  }

  /**
   * Reset daily counters if new day
   */
  protected resetDailyCountersIfNeeded(): void {
    const now = new Date();
    const daysSinceReset = Math.floor(
      (now.getTime() - this.lastResetDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceReset >= 1) {
      this.tokensUsedToday = 0;
      this.requestsToday = 0;
      this.lastResetDate = now;
    }
  }

  /**
   * Validate request parameters
   */
  protected validateRequest(request: LLMRequest): void {
    assert(request.prompt.length > 0, "Prompt cannot be empty");
    assert(request.prompt.length <= 100000, "Prompt exceeds maximum length");

    if (request.maxTokens !== undefined) {
      assert(request.maxTokens > 0, "Max tokens must be positive");
      assert(request.maxTokens <= 8192, "Max tokens exceeds limit");
    }

    if (request.temperature !== undefined) {
      assert(
        request.temperature >= 0 && request.temperature <= 2,
        "Temperature must be between 0 and 2"
      );
    }
  }
}
