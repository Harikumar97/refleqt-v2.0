/**
 * Stub Providers for future LLMs
 * DeepSeek, Perplexity, Grok - To be implemented when API keys are available
 */

import { SafeResult } from "@/utils/safety";
import type { LLMRequest, LLMResponse, LLMProvider } from "../types";
import { BaseLLMProvider } from "./base-provider";

/**
 * DeepSeek Provider - Optimized for code generation and data transformation
 * API: https://platform.deepseek.com/api-docs/
 */
export class DeepSeekProvider extends BaseLLMProvider {
  readonly provider: LLMProvider = "deepseek";

  constructor(apiKey: string, dailyLimit: number = 1000000) {
    super(apiKey, dailyLimit);
  }

  async complete(_request: LLMRequest): Promise<SafeResult<LLMResponse>> {
    // TODO: Implement DeepSeek API integration
    // Using OpenAI-compatible API: https://api.deepseek.com
    return {
      success: false,
      error: new Error("DeepSeek provider not yet implemented"),
    };
  }

  async embed(_text: string): Promise<SafeResult<number[]>> {
    return {
      success: false,
      error: new Error("DeepSeek embeddings not yet implemented"),
    };
  }
}

/**
 * Perplexity Provider - Optimized for web search and research
 * API: https://docs.perplexity.ai/
 */
export class PerplexityProvider extends BaseLLMProvider {
  readonly provider: LLMProvider = "perplexity";

  constructor(apiKey: string, dailyLimit: number = 1000000) {
    super(apiKey, dailyLimit);
  }

  async complete(_request: LLMRequest): Promise<SafeResult<LLMResponse>> {
    // TODO: Implement Perplexity API integration
    // Using chat completions: https://api.perplexity.ai/chat/completions
    return {
      success: false,
      error: new Error("Perplexity provider not yet implemented"),
    };
  }

  async embed(_text: string): Promise<SafeResult<number[]>> {
    return {
      success: false,
      error: new Error("Perplexity embeddings not supported"),
    };
  }
}

/**
 * Grok Provider - Optimized for X/Twitter analysis (native to X platform)
 * API: https://docs.x.ai/
 */
export class GrokProvider extends BaseLLMProvider {
  readonly provider: LLMProvider = "grok";

  constructor(apiKey: string, dailyLimit: number = 1000000) {
    super(apiKey, dailyLimit);
  }

  async complete(_request: LLMRequest): Promise<SafeResult<LLMResponse>> {
    // TODO: Implement Grok API integration
    // Requires X Premium+ subscription
    return {
      success: false,
      error: new Error("Grok provider not yet implemented"),
    };
  }

  async embed(_text: string): Promise<SafeResult<number[]>> {
    return {
      success: false,
      error: new Error("Grok embeddings not supported"),
    };
  }
}
