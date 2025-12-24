/**
 * OpenAI Provider
 * Optimized for embeddings and general-purpose completions
 */

import OpenAI from "openai";
import { assert } from "@/utils/assert";
import { SafeResult } from "@/utils/safety";
import type { LLMRequest, LLMResponse, LLMProvider } from "../types";
import { BaseLLMProvider } from "./base-provider";

export class OpenAIProvider extends BaseLLMProvider {
  readonly provider: LLMProvider = "openai-gpt";
  private client: OpenAI;
  private defaultModel: string = "gpt-4-turbo-preview";
  private embeddingModel: string = "text-embedding-3-small";

  constructor(apiKey: string, dailyLimit: number = 1000000) {
    super(apiKey, dailyLimit);

    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  /**
   * Generate text completion with GPT
   */
  async complete(request: LLMRequest): Promise<SafeResult<LLMResponse>> {
    this.validateRequest(request);

    if (!(await this.hasQuota())) {
      return {
        success: false,
        error: new Error("OpenAI daily quota exceeded"),
      };
    }

    const startTime = Date.now();

    try {
      // Use GPT-3.5 for fast filtering tasks, GPT-4 for others
      const model =
        request.task === "content_filtering"
          ? "gpt-3.5-turbo"
          : this.defaultModel;

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

      if (request.systemPrompt) {
        messages.push({
          role: "system",
          content: request.systemPrompt,
        });
      }

      messages.push({
        role: "user",
        content: request.prompt,
      });

      const response = await this.client.chat.completions.create({
        model,
        messages,
        max_tokens: request.maxTokens ?? 4096,
        temperature: request.temperature ?? 0.7,
      });

      const latencyMs = Date.now() - startTime;

      const content = response.choices[0]?.message?.content ?? "";
      assert(content.length > 0, "Response content is empty");

      const tokensUsed = response.usage?.total_tokens ?? 0;
      this.trackUsage(tokensUsed);

      const llmResponse: LLMResponse = {
        content,
        provider: this.provider,
        model,
        tokensUsed,
        latencyMs,
        cost: this.calculateCost(tokensUsed, model),
      };

      return { success: true, value: llmResponse };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Unknown OpenAI error"),
      };
    }
  }

  /**
   * Generate embeddings with text-embedding-3-small
   */
  async embed(text: string): Promise<SafeResult<number[]>> {
    assert(text.length > 0, "Text cannot be empty");
    assert(text.length <= 8000, "Text too long for embedding");

    if (!(await this.hasQuota())) {
      return {
        success: false,
        error: new Error("OpenAI daily quota exceeded"),
      };
    }

    try {
      const response = await this.client.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });

      const embedding = response.data[0]?.embedding;
      assert(embedding !== undefined, "Embedding is undefined");
      assert(embedding.length === 1536, "Embedding dimension mismatch");

      // Track minimal tokens for embeddings
      this.trackUsage(100); // Approximate token usage

      return { success: true, value: embedding };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Unknown OpenAI error"),
      };
    }
  }

  /**
   * Calculate cost based on model and tokens
   * Pricing as of Dec 2024:
   * - GPT-4: $10/MTok input, $30/MTok output
   * - GPT-3.5: $0.50/MTok input, $1.50/MTok output
   * - Embeddings: $0.02/MTok
   */
  private calculateCost(tokensUsed: number, model: string): number {
    let avgCostPerToken: number;

    if (model.includes("gpt-4")) {
      avgCostPerToken = (10 + 30) / 2 / 1000000;
    } else if (model.includes("gpt-3.5")) {
      avgCostPerToken = (0.5 + 1.5) / 2 / 1000000;
    } else {
      avgCostPerToken = 0.02 / 1000000;
    }

    return tokensUsed * avgCostPerToken;
  }
}
