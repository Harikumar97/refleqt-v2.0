/**
 * Test LLM API Connections
 * Verifies all configured LLM providers are working
 */

import { config } from "dotenv";
import { LLMRouter } from "@/lib/llm/router/llm-router";

// Load environment variables
config({ path: ".env.local" });

async function testLLMConnections() {
  console.log("🧪 Testing LLM API Connections...\n");

  try {
    // Initialize router from environment
    const router = LLMRouter.fromEnv();
    console.log("✅ LLM Router initialized successfully\n");

    // Test 1: Competitive Analysis (Claude)
    console.log("📊 Test 1: Competitive Analysis (Anthropic Claude)");
    const analysisResult = await router.complete({
      task: "competitive_analysis",
      prompt: "List 3 key competitive advantages of a SaaS product.",
      maxTokens: 150,
    });

    if (analysisResult.success) {
      console.log(`✅ Success! Provider: ${analysisResult.value.provider}`);
      console.log(`   Tokens used: ${analysisResult.value.tokensUsed}`);
      console.log(`   Latency: ${analysisResult.value.latencyMs}ms`);
      console.log(
        `   Response preview: ${analysisResult.value.content.slice(0, 100)}...\n`
      );
    } else {
      console.log(`❌ Failed: ${analysisResult.error?.message}\n`);
    }

    // Test 2: Text Embeddings (OpenAI)
    console.log("🔍 Test 2: Text Embeddings (OpenAI)");
    const embeddingResult = await router.embed(
      "Artificial intelligence is transforming competitive intelligence"
    );

    if (embeddingResult.success) {
      console.log(
        `✅ Success! Generated ${embeddingResult.value.length}-dimensional embedding`
      );
      console.log(
        `   First 5 values: ${embeddingResult.value.slice(0, 5).join(", ")}\n`
      );
    } else {
      console.log(`❌ Failed: ${embeddingResult.error?.message}\n`);
    }

    // Test 3: Long Document Summary (Google Gemini)
    console.log("📄 Test 3: Long Document Summary (Google Gemini)");
    const summaryResult = await router.complete({
      task: "long_document_summary",
      prompt:
        "Summarize in one sentence: Competitive intelligence involves gathering and analyzing information about competitors to gain strategic advantages.",
      maxTokens: 100,
    });

    if (summaryResult.success) {
      console.log(`✅ Success! Provider: ${summaryResult.value.provider}`);
      console.log(`   Tokens used: ${summaryResult.value.tokensUsed}`);
      console.log(`   Response: ${summaryResult.value.content}\n`);
    } else {
      console.log(`❌ Failed: ${summaryResult.error?.message}\n`);
    }

    // Get usage stats
    console.log("📈 Usage Statistics:");
    const stats = await router.getUsageStats();
    for (const [provider, usage] of stats) {
      console.log(`   ${provider}:`);
      console.log(`     - Tokens used today: ${usage.tokensUsedToday}`);
      console.log(`     - Requests today: ${usage.requestsToday}`);
      console.log(`     - Available: ${usage.isAvailable}`);
    }

    console.log("\n✅ All LLM connection tests completed!");
  } catch (error) {
    console.error("❌ Error during testing:", error);
    process.exit(1);
  }
}

testLLMConnections();
