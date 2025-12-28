/**
 * Research Swarm Types
 * Type definitions for MCP-based research swarm architecture
 */

export interface MCPChainStep {
  type: "fetch" | "extract" | "synthesize" | "format";
  target: string;
  parameters?: Record<string, unknown>;
}

export interface MCPChain {
  goal: string;
  steps: MCPChainStep[];
  maxOutput: number; // finite introspect bound
  swarmSize?: "small" | "large";
}

export interface SwarmAgentConfig {
  agentId: string;
  role: "fetcher" | "analyzer" | "synthesizer";
  timeout: number; // seconds
  depth: "shallow" | "deep";
}

export interface SwarmExecutionConfig {
  agents: number;
  timeout: number;
  depth: "shallow" | "deep";
  parallelExecution: boolean;
}

export interface AgentResult {
  agentId: string;
  role: string;
  success: boolean;
  data?: unknown;
  error?: string;
  executionTimeMs: number;
}

export interface SwarmResult {
  swarmId: string;
  query: string;
  agentResults: AgentResult[];
  rawFindings: RawFinding[];
  executionTimeMs: number;
  status: "completed" | "partial" | "failed";
}

export interface RawFinding {
  findingId: string;
  agentId: string;
  findingType: "insight" | "trend" | "opportunity" | "threat";
  title: string;
  content: string;
  confidenceScore: number; // 0.0-1.0
  sources: string[];
}

export interface SynthesisResult {
  insights: SynthesizedInsight[];
  hierarchyNodes: KnowledgeHierarchyNode[];
  synthesisTimeMs: number;
}

export interface SynthesizedInsight {
  title: string;
  content: string;
  hierarchyLevel: "strategic" | "tactical" | "operational";
  priorityScore: number; // 0.0-1.0
  relevanceScore: number; // 0.0-1.0
  isActionable: boolean;
  actionItems: string[]; // max 5
  sourceFindingIds: string[];
  psychographicTags: string[];
  displayPosition: number | null; // 1-10 for finite introspect
}

export interface KnowledgeHierarchyNode {
  nodeTitle: string;
  nodeContent: string;
  hierarchyLevel: "strategic" | "tactical" | "operational";
  depth: number;
  insightIds: string[];
  relevanceScore: number;
  children: KnowledgeHierarchyNode[];
}

export interface UserContext {
  userId: string;
  obsessionScore: number; // 1-10
  goals: string[];
  industry?: string;
  mcpChains?: MCPChain[];
}

export interface FiniteIntrospectConfig {
  maxInsights: number; // absolute max 10
  relevanceThreshold: number; // 0.0-1.0
  prioritizeActionable: boolean;
}
