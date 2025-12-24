/**
 * Google Gemini Provider
 * Optimized for long document summarization (large context window)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { assert } from "@/utils/assert";
import { SafeResult } from "@/utils/safety";
import type { LLMRequest, LLMResponse, LLMProvider } from "../types";
import { BaseLLMProvider } from "./base-provider";

export class GoogleProvider extends BaseLLMProvider {
  readonly provider: LLMProvider = "google-gemini";
  private client: GoogleGenerativeAI;
  private defaultModel: string = "gemini-1.5-pro";

  constructor(apiKey: string, dailyLimit: number = 1000000) {
    super(apiKey, dailyLimit);

    this.client = new GoogleGenerativeAI(this.apiKey);
  }

  /**
   * Generate text completion with Gemini
   */
  async complete(request: LLMRequest): Promise<SafeResult<LLMResponse>> {
    this.validateRequest(request);

    if (!(await this.hasQuota())) {
      return {
        success: false,
        error: new Error("Google Gemini daily quota exceeded"),
      };
    }

    const startTime = Date.now();

    try {
      const model = this.client.getGenerativeModel({
        model: this.defaultModel,
      });

      const prompt = request.systemPrompt
        ? `${request.systemPrompt}\n\n${request.prompt}`
        : request.prompt;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: request.maxTokens ?? 4096,
          temperature: request.temperature ?? 0.7,
        },
      });

      const latencyMs = Date.now() - startTime;

      const response = result.response;
      const content = response.text();

      assert(content.length > 0, "Response content is empty");

      // Approximate token usage (Gemini doesn't always provide exact counts)
      const tokensUsed = Math.ceil(
        (request.prompt.length + content.length) / 4
      );
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
          error instanceof Error ? error : new Error("Unknown Gemini error"),
      };
    }
  }

  /**
   * Generate embeddings (Gemini supports embeddings)
   */
  async embed(text: string): Promise<SafeResult<number[]>> {
    assert(text.length > 0, "Text cannot be empty");

    if (!(await this.hasQuota())) {
      return {
        success: false,
        error: new Error("Google Gemini daily quota exceeded"),
      };
    }

    try {
      const model = this.client.getGenerativeModel({
        model: "text-embedding-004",
      });

      const result = await model.embedContent(text);
      const embedding = result.embedding.values;

      assert(embedding.length > 0, "Embedding is empty");

      this.trackUsage(50); // Approximate token usage

      return { success: true, value: embedding };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Unknown Gemini error"),
      };
    }
  }

  /**
   * Calculate cost based on tokens
   * Pricing as of Dec 2024: Gemini has free tier, then $0.50-$7/MTok
   */
  private calculateCost(tokensUsed: number): number {
    const avgCostPerToken = 2 / 1000000; // Average estimate
    return tokensUsed * avgCostPerToken;
  }
}
