/**
 * Anthropic Claude Provider
 * Optimized for structured analysis and insight generation
 */

import Anthropic from "@anthropic-ai/sdk";
import { assert } from "@/utils/assert";
import { SafeResult } from "@/utils/safety";
import type { LLMRequest, LLMResponse, LLMProvider } from "../types";
import { BaseLLMProvider } from "./base-provider";

export class AnthropicProvider extends BaseLLMProvider {
  readonly provider: LLMProvider = "anthropic-claude";
  private client: Anthropic;
  private defaultModel: string = "claude-3-5-sonnet-20241022";

  constructor(apiKey: string, dailyLimit: number = 1000000) {
    super(apiKey, dailyLimit);

    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  /**
   * Generate text completion with Claude
   */
  async complete(request: LLMRequest): Promise<SafeResult<LLMResponse>> {
    this.validateRequest(request);

    if (!(await this.hasQuota())) {
      return {
        success: false,
        error: new Error("Anthropic daily quota exceeded"),
      };
    }

    const startTime = Date.now();

    try {
      const messageParams: Anthropic.MessageCreateParams = {
        model: this.defaultModel,
        max_tokens: request.maxTokens ?? 4096,
        temperature: request.temperature ?? 0.7,
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
      };

      // Only add system if provided
      if (request.systemPrompt) {
        messageParams.system = request.systemPrompt;
      }

      const response = await this.client.messages.create(messageParams);

      const latencyMs = Date.now() - startTime;

      // Extract text content
      const content =
        response.content[0]?.type === "text" ? response.content[0].text : "";

      assert(content.length > 0, "Response content is empty");

      // Calculate tokens used
      const tokensUsed =
        response.usage.input_tokens + response.usage.output_tokens;
      this.trackUsage(tokensUsed);

      const llmResponse: LLMResponse = {
        content,
        provider: this.provider,
        model: this.defaultModel,
        tokensUsed,
        latencyMs,
        cost: this.calculateCost(tokensUsed),
      };

      return { success: true, value: llmResponse };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Unknown Anthropic error"),
      };
    }
  }

  /**
   * Generate embeddings (not natively supported by Claude)
   * Falls back to OpenAI or returns error
   */
  async embed(_text: string): Promise<SafeResult<number[]>> {
    return {
      success: false,
      error: new Error("Claude does not support embeddings natively"),
    };
  }

  /**
   * Calculate cost based on tokens
   * Pricing as of Dec 2024: $3/MTok input, $15/MTok output
   */
  private calculateCost(tokensUsed: number): number {
    // Simplified: assume 50/50 input/output split
    const avgCostPerToken = (3 + 15) / 2 / 1000000;
    return tokensUsed * avgCostPerToken;
  }
}
