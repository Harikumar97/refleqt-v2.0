/**
 * Research Swarm System - Main Exports
 * MCP-based architecture for intelligent business research
 */

export { MCPOrchestrator } from "./mcp-orchestrator";
export { MCPChainBuilder } from "./mcp-chain-builder";
export { SwarmExecutor } from "./swarm-executor";
export { SynthesisEngine } from "./synthesis-engine";

export type {
  MCPChain,
  MCPChainStep,
  SwarmAgentConfig,
  SwarmExecutionConfig,
  AgentResult,
  SwarmResult,
  RawFinding,
  SynthesisResult,
  SynthesizedInsight,
  KnowledgeHierarchyNode,
  UserContext,
  FiniteIntrospectConfig,
} from "./types";
