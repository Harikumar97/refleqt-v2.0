# Research Swarm Architecture

**Complete rebuild of the Intelligence Feed based on Refleqt's true vision**

## Architecture Overview

This implementation replaces the simple RSS reader with a sophisticated **Research Swarm System** based on Multi-Chain Prompting (MCP) architecture as defined in `Refleqt Startup Sept 1.pdf`.

## Key Concepts

### 1. **Research Goals** (replaces RSS Sources)
- Goal-based research configuration
- Natural language queries: "Show me how competitors respond to sustainability regulations"
- MCP chain templates for common patterns
- Smart Tracker integration for continuous monitoring

### 2. **Research Swarms** (MCP Execution)
- Parallel AI agent swarms (3-8 agents)
- Agent roles: Fetcher, Analyzer, Synthesizer
- 2-minute execution windows
- Size based on Obsession Score:
  - Score 1-6: Small swarms (3 agents, 30s timeout)
  - Score 7-10: Large swarms (8 agents, 60s timeout)

### 3. **Finite Introspect** (Max 10 Insights)
- **Absolute maximum: 10 synthesized insights**
- Progressive disclosure based on Obsession Score
- Ranked by priority and relevance
- Display positions 1-10

### 4. **Knowledge Traverse Hierarchy**
- Strategic → Tactical → Operational organization
- Tree-based knowledge structure
- Prevents infinite scroll paralysis

### 5. **Smart Trackers** (Continuous Monitoring)
- Update frequency based on Obsession Score:
  - Score 1-3: Daily, 5 items
  - Score 4-6: Hourly, 7 items
  - Score 7-8: Every 15min, 9 items
  - Score 9-10: Every 5min, 10 items

## Database Schema

### New Models

```prisma
model ResearchGoal {
  id              String
  userId          String
  goalTitle       String
  goalQuery       String
  goalType        String // 'competitive', 'market', 'customer', 'industry'
  mcpChainConfig  Json
  isActive        Boolean
  monitoringLevel String // 'realtime', 'hourly', 'daily'
}

model SmartTracker {
  id              String
  goalId          String
  userId          String
  updateInterval  Int    // seconds between checks
  maxInsights     Int    // finite bound
  nextExecutionAt DateTime
  isActive        Boolean
}

model ResearchSwarm {
  id               String
  goalId           String
  userId           String
  query            String
  swarmType        String
  swarmSize        String // 'small' | 'large'
  status           String
  mcpChainUsed     Json
  executionTimeMs  Int
}

model SynthesizedInsight {
  id               String
  swarmId          String
  userId           String
  title            String
  content          String
  hierarchyLevel   String // 'strategic', 'tactical', 'operational'
  priorityScore    Decimal
  relevanceScore   Decimal
  isActionable     Boolean
  actionItems      String[]
  displayPosition  Int // 1-10
  dismissedAt      DateTime
}

model KnowledgeNode {
  id             String
  userId         String
  parentId       String
  nodeTitle      String
  hierarchyLevel String
  depth          Int
  insightIds     String[]
  children       KnowledgeNode[]
}
```

## Backend Components

### 1. MCP Chain Builder (`/src/lib/research-swarm/mcp-chain-builder.ts`)
- Constructs MCP chains from natural language queries
- Pre-built templates for common patterns:
  - `competitive_analysis`
  - `market_trends`
  - `customer_intelligence`
  - `strategy_cohort`
- Customizes based on Obsession Score

### 2. Swarm Executor (`/src/lib/research-swarm/swarm-executor.ts`)
- Executes parallel AI agent swarms
- Agent role distribution:
  - Small swarms: 2 fetchers, 1 analyzer
  - Large swarms: 4 fetchers, 3 analyzers, 1 synthesizer
- Timeout management and error handling

### 3. Synthesis Engine (`/src/lib/research-swarm/synthesis-engine.ts`)
- Mass synthesis: Combines raw findings
- RAG processing with LLM
- Finite introspect enforcement (max 10)
- Knowledge hierarchy building
- Priority ranking and filtering

### 4. MCP Orchestrator (`/src/lib/research-swarm/mcp-orchestrator.ts`)
- Main coordinator
- Strategy Cohort execution
- Research Goal execution
- Update frequency calculation

## API Endpoints

### Research Swarm Execution
```
POST /api/research-swarm/execute
GET  /api/research-swarm/execute/status?swarmId={id}
```

### Research Goals
```
GET    /api/research-goal?userId={id}
POST   /api/research-goal
DELETE /api/research-goal?goalId={id}&userId={id}
```

### Synthesized Insights
```
GET  /api/synthesized-insights?userId={id}&hierarchyLevel={level}
POST /api/synthesized-insights/dismiss
```

## Frontend Components (To Be Built)

### 1. Research Goal Configuration Dialog
- Replaces "Add Source" button
- Natural language query input
- Goal type selection
- Smart Tracker toggle
- Obsession-based configuration preview

### 2. Finite Introspect Display
- Max 10 insights shown
- Hierarchy badges (Strategic/Tactical/Operational)
- Priority indicators
- Action items expansion
- Dismiss functionality
- Real-time updates via WebSocket

### 3. Knowledge Traverse Hierarchy View
- Tree visualization
- Collapsible nodes
- Depth-based styling
- Click-to-explore insights

### 4. Obsession Score Meter
- Live score display (1-10)
- Update frequency indicator
- Max insights preview
- Visual gradient representation

## Migration Instructions

1. **Generate Prisma migration:**
```bash
npx prisma migrate dev --name add_research_swarm_architecture
```

2. **Generate Prisma client:**
```bash
npx prisma generate
```

3. **Run migration:**
```bash
npx prisma migrate deploy
```

## Key Differences from Old System

| Old (RSS Reader) | New (Research Swarm) |
|-----------------|---------------------|
| Manual URL input | Natural language goals |
| Raw RSS articles | Synthesized insights |
| Infinite scroll | Max 10 finite introspect |
| Static refresh | Obsession-based monitoring |
| No hierarchy | Knowledge Traverse |
| No intelligence | MCP-powered analysis |

## Usage Example

### Old Way:
```
1. Click "Add Source"
2. Enter RSS URL: https://washingtonpost.com/feed
3. Click "Refresh All"
4. See 50+ raw articles
```

### New Way:
```
1. Click "Configure Research Goal"
2. Enter query: "How are competitors responding to AI regulations?"
3. System executes:
   - MCP chain construction
   - 3-8 parallel AI agents
   - Mass synthesis
   - Finite packaging (max 10 insights)
4. See 7 synthesized, actionable insights in 2 minutes
```

## Performance Targets

- **Execution Time:** < 120 seconds (2 minutes)
- **Insights:** 5-10 (based on Obsession Score)
- **Agent Timeout:** 30-60 seconds
- **Update Frequency:** 300-86400 seconds (based on Obsession Score)

## Next Steps

1. ✅ Database schema defined
2. ✅ Backend services implemented
3. ✅ API routes created
4. ⏳ Frontend components (in progress)
5. ⏳ WebSocket real-time updates
6. ⏳ Smart Tracker scheduler
7. ⏳ Migration deployment

## Notes

- TypeScript compilation issues to be resolved (strict mode compatibility)
- LLM Router integration pending (using mock for now)
- Smart Tracker execution scheduler to be implemented
- WebSocket server for real-time updates to be added

---

**This is a complete architectural rebuild** from a simple RSS reader to an AI-powered research intelligence system as envisioned in the Refleqt specification documents.
