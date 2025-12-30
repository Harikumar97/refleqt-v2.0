/**
 * MCP Chain Builder
 * Constructs Multi-Chain Prompting configurations from research goals
 */

import type { MCPChain, UserContext } from "./types";

export class MCPChainBuilder {
  /**
   * Pre-built MCP chain templates for common research patterns
   */
  private static readonly CHAIN_TEMPLATES: Record<string, MCPChain> = {
    competitive_analysis: {
      goal: "analyze_competitor_positioning",
      steps: [
        { type: "fetch", target: "competitor_pages" },
        { type: "extract", target: "pricing_signals" },
        { type: "extract", target: "feature_positioning" },
        { type: "extract", target: "messaging_strategy" },
        { type: "synthesize", target: "comparative_matrix" },
        { type: "format", target: "finite_insights" },
      ],
      maxOutput: 10,
      swarmSize: "small",
    },

    market_trends: {
      goal: "identify_market_shifts",
      steps: [
        { type: "fetch", target: "industry_news" },
        { type: "fetch", target: "social_signals" },
        { type: "extract", target: "trend_indicators" },
        { type: "synthesize", target: "trend_analysis" },
        { type: "format", target: "finite_insights" },
      ],
      maxOutput: 10,
      swarmSize: "small",
    },

    customer_intelligence: {
      goal: "understand_customer_behavior",
      steps: [
        { type: "fetch", target: "customer_feedback" },
        { type: "fetch", target: "support_tickets" },
        { type: "extract", target: "pain_points" },
        { type: "extract", target: "feature_requests" },
        { type: "synthesize", target: "psychographic_profile" },
        { type: "format", target: "finite_insights" },
      ],
      maxOutput: 10,
      swarmSize: "small",
    },

    strategy_cohort: {
      goal: "competitive_scenario_analysis",
      steps: [
        { type: "fetch", target: "competitor_moves" },
        { type: "extract", target: "strategic_signals" },
        { type: "synthesize", target: "scenario_matrix" },
        { type: "synthesize", target: "recommended_responses" },
        { type: "format", target: "finite_insights" },
      ],
      maxOutput: 10,
      swarmSize: "large", // Strategy cohorts use larger swarms
    },
  };

  /**
   * Construct MCP chain from research goal query
   */
  static constructChain(query: string, userContext: UserContext): MCPChain {
    // Determine goal type from query
    const goalType = this.inferGoalType(query);

    // Get base template
    const template =
      this.CHAIN_TEMPLATES[goalType] ||
      this.CHAIN_TEMPLATES["competitive_analysis"]!;

    // Customize based on obsession score
    const swarmSize = userContext.obsessionScore >= 7 ? "large" : "small";

    // Customize max output based on obsession score
    const maxOutput = Math.min(10, Math.floor(userContext.obsessionScore) + 3);

    return {
      goal: query,
      steps: template.steps,
      maxOutput,
      swarmSize,
    };
  }

  /**
   * Infer goal type from natural language query
   */
  private static inferGoalType(query: string): string {
    const queryLower = query.toLowerCase();

    if (
      queryLower.includes("competitor") ||
      queryLower.includes("competition")
    ) {
      return "competitive_analysis";
    }

    if (queryLower.includes("trend") || queryLower.includes("market shift")) {
      return "market_trends";
    }

    if (
      queryLower.includes("customer") ||
      queryLower.includes("user feedback")
    ) {
      return "customer_intelligence";
    }

    if (queryLower.includes("strategy") || queryLower.includes("scenario")) {
      return "strategy_cohort";
    }

    // Default to competitive analysis
    return "competitive_analysis";
  }

  /**
   * Build custom MCP chain for advanced users
   */
  static buildCustomChain(
    goal: string,
    steps: string[],
    userContext: UserContext
  ): MCPChain {
    const mcpSteps = steps.map((step) => {
      if (step.startsWith("fetch:")) {
        return { type: "fetch" as const, target: step.replace("fetch:", "") };
      } else if (step.startsWith("extract:")) {
        return {
          type: "extract" as const,
          target: step.replace("extract:", ""),
        };
      } else if (step.startsWith("synthesize:")) {
        return {
          type: "synthesize" as const,
          target: step.replace("synthesize:", ""),
        };
      } else {
        return { type: "format" as const, target: "finite_insights" };
      }
    });

    return {
      goal,
      steps: mcpSteps,
      maxOutput: Math.min(10, Math.floor(userContext.obsessionScore) + 3),
      swarmSize: userContext.obsessionScore >= 7 ? "large" : "small",
    };
  }

  /**
   * Get swarm execution config based on chain
   */
  static getSwarmConfig(chain: MCPChain): {
    agents: number;
    timeout: number;
    depth: "shallow" | "deep";
  } {
    const configs = {
      small: { agents: 3, timeout: 30, depth: "shallow" as const },
      large: { agents: 8, timeout: 60, depth: "deep" as const },
    };

    return configs[chain.swarmSize ?? "small"];
  }
}
