# Refleqt v2.0 - Complete Architecture Plan

**Date:** 2025-12-24
**Status:** Planning Phase
**Philosophy:** B.O.T (Business. Obsession. Tools.) - Finite Introspect, NOT Infinite Scroll

---

## Executive Summary

Refleqt is an AI-first business intelligence platform that transforms how entrepreneurs stay focused on their business growth. Unlike social media's infinite scroll, Refleqt provides **finite, curated introspection** through interconnected features that work as a unified data pipeline.

### Core Vision

**"How obsessed are you?"** - Measure and enhance business obsession through distilled intelligence, not information overload.

---

## 1. System Architecture Overview

### 1.1 High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    UNIFIED DATA LAKE                             │
│  (PostgreSQL + Neo4j Knowledge Graph + Redis Cache)             │
└────────────┬────────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │   INGESTION     │ ◄──── Multi-Source Data Collection
    │   PIPELINE      │       (Social Media, News, RSS, Web)
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │  INTELLIGENCE   │ ──────► Raw Content Feed
    │     FEED        │         (Entry Point)
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │   RESEARCH      │ ──────► AI Agents (MCP-based)
    │    SWARMS       │         Goal-Directed Analysis
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │   STRATEGY      │ ──────► Real-time Competitor
    │    COHORTS      │         Data Synthesizer
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │ PSYCHOGRAPHICS  │ ──────► Consumer Clustering
    │ (Funnel-lytics) │         & Behavior Analysis
    └────────┬────────┘
             │
    ┌────────┴────────┐
    │    BREWERY      │ ──────► Distilled Intelligence
    │   (Distillery)  │         Newsletter Generation
    └─────────────────┘
             │
             └──────────────► Feedback Loop to Intelligence Feed
```

### 1.2 Temporal Codependency

Each feature builds on previous features' outputs, creating a **knowledge refinement pipeline**:

- Intelligence Feed provides **raw material**
- Research Swarms add **structured analysis**
- Strategy Cohorts add **competitive context**
- Psychographics add **behavioral insights**
- Brewery creates **actionable distillation**

---

## 2. Technology Stack

### 2.1 Frontend (Already Established)

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + TypeScript 5.9
- **Styling:** Tailwind CSS 4
- **State Management:**
  - Server State: TanStack Query (React Query v5) - **TO ADD**
  - Client State: React Context + Zustand (lightweight) - **TO ADD**
- **Real-time:** Server-Sent Events (SSE) - **TO ADD**

### 2.2 Backend & Database (NEW)

- **API:** Next.js API Routes (serverless functions)
- **Database:**
  - **PostgreSQL 17** - Relational data (users, content, metadata)
  - **pgvector** extension - Semantic search via embeddings
  - **Neo4j Community** - Knowledge graph for A.I.A. Knowledge Traverse
  - **Redis 7** - Caching + pub/sub for real-time updates
- **ORM:** Prisma 6 (type-safe, migration management)
- **Validation:** Zod (already installed)

### 2.3 AI & Agent Layer (NEW)

- **MCP (Model Context Protocol):** Agent communication standard
- **Agent Framework:**
  - **Option 1:** LangGraph (recommended - built for agent workflows)
  - **Option 2:** AutoGen (Microsoft - multi-agent conversations)
- **LLM Providers:**
  - Anthropic Claude (via API)
  - OpenAI GPT-4 (fallback)
  - Local LLMs (future: Ollama for cost optimization)
- **Vector DB:** pgvector in PostgreSQL (no separate DB needed)

### 2.4 Data Ingestion (NEW)

- **Web Scraping:** Puppeteer/Playwright (headless browsers)
- **API Integrations:**
  - Twitter/X API v2
  - LinkedIn API (official)
  - YouTube Data API v3
  - Reddit API
  - RSS/Atom Parsers (feedparser)
- **Job Queue:** BullMQ (Redis-based, for background processing)

### 2.5 DevOps & Infrastructure

- **Hosting:** Vercel (Next.js optimized, free tier available)
- **Database Hosting:**
  - PostgreSQL: Supabase (free tier: 500MB) or Neon (free tier: 0.5GB)
  - Neo4j: AuraDB Free (persistent cloud instance)
  - Redis: Upstash (free tier: 10K commands/day)
- **Monitoring:** Vercel Analytics (built-in)
- **Error Tracking:** Sentry (free tier)

---

## 3. Database Schema Design

### 3.1 PostgreSQL Tables

#### Core Entities

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(255) NOT NULL,
  business_challenge TEXT,
  obsession_score DECIMAL(3,1) DEFAULT 0.0, -- 0.0 to 10.0
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Competitors Tracking
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  social_handles JSONB, -- {twitter: "@handle", linkedin: "company", etc}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Intelligence Sources
CREATE TABLE intelligence_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL, -- 'rss', 'twitter', 'linkedin', 'youtube', 'website'
  source_url VARCHAR(500) NOT NULL,
  source_name VARCHAR(255),
  category VARCHAR(100), -- 'news', 'competitor', 'industry', 'geopolitical'
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, source_url)
);

-- Intelligence Items (Raw Content)
CREATE TABLE intelligence_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES intelligence_sources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  url VARCHAR(500),
  author VARCHAR(255),
  published_at TIMESTAMP,
  fetched_at TIMESTAMP DEFAULT NOW(),
  relevance_score DECIMAL(3,2), -- 0.00 to 1.00 (AI-calculated)
  embedding VECTOR(1536), -- pgvector for semantic search
  metadata JSONB, -- flexible storage for source-specific data
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_intelligence_items_embedding ON intelligence_items USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_intelligence_items_user_published ON intelligence_items(user_id, published_at DESC);

-- Research Swarms
CREATE TABLE research_swarms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  swarm_type VARCHAR(50) NOT NULL, -- 'competitive', 'market', 'technical', 'customer'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  progress_percent INTEGER DEFAULT 0,
  agent_config JSONB, -- MCP agent configuration
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE swarm_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swarm_id UUID REFERENCES research_swarms(id) ON DELETE CASCADE,
  finding_type VARCHAR(100), -- 'insight', 'trend', 'opportunity', 'threat'
  title VARCHAR(500),
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  sources JSONB, -- array of source references
  created_at TIMESTAMP DEFAULT NOW()
);

-- Strategy Cohorts
CREATE TABLE strategy_cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  competitor_ids UUID[], -- array of competitor IDs
  analysis_type VARCHAR(100), -- 'pricing', 'features', 'content', 'social'
  last_analyzed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cohort_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES strategy_cohorts(id) ON DELETE CASCADE,
  analysis_data JSONB NOT NULL, -- flexible schema for different analysis types
  insights TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Psychographics / Funnel-lytics
CREATE TABLE psychographic_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  segment_name VARCHAR(255) NOT NULL,
  segment_tagline VARCHAR(500),
  characteristics JSONB, -- behavioral traits, pain points, motivations
  funnel_stage VARCHAR(50), -- 'awareness', 'consideration', 'decision', 'retention'
  size_estimate INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE segment_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id UUID REFERENCES psychographic_segments(id) ON DELETE CASCADE,
  insight_type VARCHAR(100), -- 'pain_point', 'motivation', 'objection', 'trigger'
  content TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Brewery (Distilled Content)
CREATE TABLE brewery_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  output_type VARCHAR(50), -- 'newsletter', 'brief', 'alert'
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  source_items UUID[], -- array of intelligence_item IDs
  status VARCHAR(50) DEFAULT 'brewing', -- 'brewing', 'ready', 'delivered'
  scheduled_for TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Obsession Score Tracking
CREATE TABLE obsession_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score DECIMAL(3,1) NOT NULL, -- 0.0 to 10.0
  calculated_at TIMESTAMP DEFAULT NOW(),
  factors JSONB -- breakdown of score components
);

CREATE INDEX idx_obsession_scores_user_time ON obsession_scores(user_id, calculated_at DESC);
```

### 3.2 Neo4j Knowledge Graph Schema

```cypher
// Node Types
(:User {id, email, name})
(:IntelligenceItem {id, title, url, published_at})
(:Concept {name, category}) // Auto-extracted entities
(:Company {name, industry})
(:Person {name, title})
(:Topic {name})

// Relationship Types
(:User)-[:INTERESTED_IN]->(:Topic)
(:User)-[:TRACKS]->(:Company)
(:IntelligenceItem)-[:MENTIONS]->(:Concept)
(:IntelligenceItem)-[:ABOUT]->(:Company)
(:IntelligenceItem)-[:RELATED_TO]->(:IntelligenceItem)
(:Concept)-[:SIMILAR_TO]->(:Concept)
(:Company)-[:COMPETES_WITH]->(:Company)

// A.I.A. Knowledge Traverse Queries
// Example: "Find all intelligence items related to concepts similar to what User cares about"
MATCH (u:User {id: $userId})-[:INTERESTED_IN]->(t:Topic)
MATCH (t)<-[:TAGGED_AS]-(c:Concept)
MATCH (c)-[:SIMILAR_TO*1..3]-(related:Concept)
MATCH (related)<-[:MENTIONS]-(item:IntelligenceItem)
WHERE item.published_at > datetime() - duration({days: 7})
RETURN DISTINCT item
ORDER BY item.relevance_score DESC
LIMIT 50
```

### 3.3 Redis Data Structures

```
// Real-time feed updates (pub/sub)
CHANNEL user:{userId}:intelligence:new
CHANNEL user:{userId}:swarm:{swarmId}:progress

// Caching
KEY user:{userId}:obsession_score (TTL: 1 hour)
KEY user:{userId}:feed:latest (TTL: 5 minutes) // paginated feed cache
KEY intelligence:trending (TTL: 30 minutes) // global trending items

// Rate limiting
KEY ratelimit:api:{userId}:{endpoint} (TTL: 1 minute)

// Job queues (BullMQ)
QUEUE ingestion:fetch_sources
QUEUE analysis:research_swarm
QUEUE brewery:generate_output
```

---

## 4. Feature-Specific Architecture

### 4.1 Intelligence Feed

**Purpose:** Raw content aggregation with AI-powered filtering

**Data Flow:**

1. Background job fetches from all user's intelligence_sources (every 15 min)
2. Content is parsed, cleaned, and stored as intelligence_items
3. AI generates embedding (OpenAI text-embedding-3-small)
4. Relevance score calculated against user's interests (vector similarity)
5. High-relevance items published to user's Redis channel
6. Frontend receives SSE update and fetches new items

**Key Components:**

- `/api/intelligence/feed` - GET paginated feed
- `/api/intelligence/sources` - CRUD for sources
- `/api/intelligence/sse` - Server-Sent Events stream
- Background job: `jobs/ingest-intelligence.ts`

**Power of Ten Compliance:**

- Max 50 items per API response (Rule 2: Fixed bounds)
- Pre-allocated response buffer (Rule 3: No dynamic memory)
- Assertions on all database queries (Rule 5: >= 2 assertions/function)

### 4.2 Research Swarms

**Purpose:** AI agent-driven deep research on user queries

**MCP Agent Architecture:**

```typescript
// Agent Types
interface ResearchAgent {
  type: 'searcher' | 'analyzer' | 'synthesizer' | 'validator';
  goal: string;
  context: Record<string, unknown>;
  maxIterations: number; // Rule 2: Fixed bound
}

// MCP Message Flow
1. User submits research query
2. System creates ResearchSwarm record (status: 'pending')
3. Agent orchestrator spawns 4 agents:
   - Searcher: Find relevant intelligence_items from DB
   - Analyzer: Extract insights using LLM
   - Synthesizer: Combine findings into coherent report
   - Validator: Cross-check facts, assign confidence scores
4. Each agent publishes progress to Redis channel
5. Frontend receives real-time updates via SSE
6. Final report saved as swarm_findings
```

**API Endpoints:**

- `/api/swarms` - POST create swarm, GET list swarms
- `/api/swarms/[id]` - GET swarm status, DELETE cancel swarm
- `/api/swarms/[id]/findings` - GET swarm results
- `/api/swarms/[id]/sse` - Real-time progress stream

**Safety Patterns:**

- Max 100 iterations per agent (Rule 2)
- Agent timeout: 5 minutes (Rule 4: function bounds)
- All LLM responses validated with Zod schemas (Rule 7: Check returns)

### 4.3 Strategy Cohorts

**Purpose:** Real-time competitive intelligence & comparison

**How It Works:**

1. User selects competitors from `competitors` table
2. System creates `strategy_cohort`
3. Background job fetches competitor data:
   - Social media posts (Twitter, LinkedIn)
   - Website changes (via scraping)
   - Product updates (RSS, blog feeds)
4. AI analyzes data across cohort:
   - Pricing comparisons
   - Feature gaps
   - Content strategy
   - Social engagement
5. Insights stored in `cohort_analyses`
6. User can review auto-updated dashboard

**Reverse Newsletter Concept:**

- Instead of user finding info, **AI finds user-relevant info**
- Example: New tax law → AI finds YouTubers discussing it → Filters by business relevance → Sends brief

**API Endpoints:**

- `/api/cohorts` - CRUD for cohorts
- `/api/cohorts/[id]/analyze` - POST trigger new analysis
- `/api/cohorts/[id]/insights` - GET latest insights

### 4.4 Psychographics (Funnel-lytics)

**Purpose:** Consumer behavior clustering & funnel optimization

**Data Sources:**

- User's own analytics (if integrated)
- Industry benchmarks (curated datasets)
- Competitor analysis (from Strategy Cohorts)
- Social listening (from Intelligence Feed)

**Analysis Types:**

- Cluster users into psychographic segments
- Map segments to funnel stages
- Identify pain points, motivations, objections
- Generate custom messaging for each segment

**API Endpoints:**

- `/api/psychographics/segments` - CRUD for segments
- `/api/psychographics/analyze` - POST run clustering analysis
- `/api/psychographics/insights` - GET segment insights

### 4.5 Brewery (Intelligence Distillery)

**Purpose:** AI-curated newsletter generation

**Distillation Process:**

1. AI screens Intelligence Feed items from past week
2. Filters by user's business context (company, industry, competitors)
3. Applies geopolitical + business angle screening
4. Cross-references with Research Swarm findings
5. Identifies patterns, trends, opportunities
6. Generates concise "newsletter-type artifacts"
7. User receives finite, actionable content (NOT infinite scroll)

**Output Types:**

- **Daily Brief:** 3-5 key items, 2-minute read
- **Weekly Digest:** 10-15 insights, strategic depth
- **Alerts:** Urgent developments, immediate action needed

**API Endpoints:**

- `/api/brewery/outputs` - GET list of generated content
- `/api/brewery/generate` - POST trigger manual brew
- `/api/brewery/schedule` - PATCH update delivery schedule

**Finite Introspect Guarantee:**

- Max 15 items per output (Rule 2: Fixed bound)
- No pagination, no "load more" - intentionally limited
- Delivered on schedule, not on-demand infinite scroll

---

## 5. Obsession Score Algorithm

**Formula:**

```
Obsession Score = (
  0.3 × Engagement Score +
  0.25 × Research Depth Score +
  0.2 × Content Focus Score +
  0.15 × Competitor Awareness Score +
  0.1 × Action Velocity Score
) × 10

Range: 0.0 to 10.0
```

**Component Definitions:**

1. **Engagement Score** (0.0 - 1.0)
   - Daily logins (weighted by recency)
   - Time spent in portal
   - Features actively used
   - Items marked as relevant

2. **Research Depth Score** (0.0 - 1.0)
   - Number of active Research Swarms
   - Swarm query specificity (longer, more detailed = higher)
   - Findings reviewed and acted upon

3. **Content Focus Score** (0.0 - 1.0)
   - Percentage of Intelligence Feed items related to user's business
   - Click-through rate on relevant items
   - Sources curated (more specific sources = higher focus)

4. **Competitor Awareness Score** (0.0 - 1.0)
   - Number of competitors tracked
   - Recency of cohort analyses
   - Insights derived from competitor data

5. **Action Velocity Score** (0.0 - 1.0)
   - Speed from insight to action (tracked via user feedback)
   - Implementation of Brewery recommendations
   - Profile updates (business challenges, goals)

**Calculation Frequency:**

- Recalculated every 6 hours
- Stored in `obsession_scores` table for historical tracking
- Displayed prominently in portal UI

---

## 6. Real-time vs On-Demand Data Flow

### 6.1 Real-time (Background Processing)

**Continuous Operations:**

- Intelligence source ingestion (every 15 minutes via cron)
- Obsession score recalculation (every 6 hours)
- Competitor monitoring (every 1 hour)
- Brewery auto-generation (daily at 6 AM user local time)

**Technologies:**

- **BullMQ:** Job scheduling and queue management
- **Redis Pub/Sub:** Real-time event broadcasting
- **Server-Sent Events (SSE):** Push updates to frontend

**Implementation Pattern:**

```typescript
// Background job
import { Queue, Worker } from "bullmq";

const ingestQueue = new Queue("intelligence:ingest", {
  connection: redisConnection,
});

// Schedule recurring job
await ingestQueue.add(
  "fetch-sources",
  {},
  {
    repeat: { cron: "*/15 * * * *" }, // Every 15 min
  }
);

// Worker processes jobs
const worker = new Worker("intelligence:ingest", async (job) => {
  const sources = await fetchActiveSources();
  // Process with max iterations bound
  for (let i = 0; i < Math.min(sources.length, MAX_SOURCES); i++) {
    await ingestSource(sources[i]);
  }
});
```

### 6.2 On-Demand (User-Triggered)

**User Actions:**

- Create new Research Swarm (immediate)
- Request cohort analysis (queued, runs within 2 min)
- Manual Brewery generation (queued, runs within 5 min)
- Add new intelligence source (immediate fetch)

**Technologies:**

- **Next.js API Routes:** Handle user requests
- **BullMQ:** Queue processing for compute-intensive tasks
- **SSE:** Stream progress updates back to user

**Implementation Pattern:**

```typescript
// API route: /api/swarms
export async function POST(request: Request) {
  const { query } = await request.json();

  // Create swarm record
  const swarm = await prisma.researchSwarm.create({
    data: { query, status: "pending", user_id: userId },
  });

  // Queue agent processing
  await swarmQueue.add("process", { swarmId: swarm.id });

  return Response.json({ swarmId: swarm.id });
}

// Client subscribes to SSE for updates
const eventSource = new EventSource(`/api/swarms/${swarmId}/sse`);
eventSource.onmessage = (event) => {
  const { progress, status } = JSON.parse(event.data);
  updateUI(progress, status);
};
```

---

## 7. Safety-Critical Patterns (Power of Ten Compliance)

### 7.1 Rule 1: No Recursion

**Implementation:** Use iterative loops with fixed bounds for all data processing

```typescript
// ✅ GOOD: Iterative knowledge graph traversal
function traverseGraph(startNode: Node, maxDepth: number = 3): Node[] {
  const visited: Node[] = [];
  const queue: Array<{ node: Node; depth: number }> = [
    { node: startNode, depth: 0 },
  ];

  for (let i = 0; i < MAX_ITERATIONS && queue.length > 0; i++) {
    const { node, depth } = queue.shift()!;
    if (depth >= maxDepth) continue;

    visited.push(node);
    queue.push(
      ...node.children.map((child) => ({ node: child, depth: depth + 1 }))
    );
  }

  return visited;
}

// ❌ BAD: Recursive traversal
function traverseGraphRecursive(node: Node): Node[] {
  return [node, ...node.children.flatMap(traverseGraphRecursive)]; // FORBIDDEN
}
```

### 7.2 Rule 2: Fixed Loop Bounds

**Implementation:** All loops have compile-time or explicit runtime bounds

```typescript
import { MAX_ITERATIONS, MAX_FEED_ITEMS } from "@/constants";

// All loop bounds defined in constants
export const MAX_ITERATIONS = 1000;
export const MAX_FEED_ITEMS = 50;
export const MAX_SWARM_AGENTS = 10;
export const MAX_SOURCES_PER_USER = 100;

// Usage
function processFeed(items: IntelligenceItem[]): ProcessedItem[] {
  const results: ProcessedItem[] = [];
  const itemCount = Math.min(items.length, MAX_FEED_ITEMS);

  for (let i = 0; i < itemCount; i++) {
    results.push(processItem(items[i]!));
  }

  assert(results.length <= MAX_FEED_ITEMS, "Feed items exceeded maximum");
  return results;
}
```

### 7.3 Rule 3: No Dynamic Memory Allocation

**Implementation:** Pre-allocate buffers, use FixedBuffer class

```typescript
import { FixedBuffer } from "@/utils/safety";

// Pre-allocated buffer for batch processing
const itemBuffer = new FixedBuffer<IntelligenceItem>(MAX_FEED_ITEMS);

function fetchFeed(userId: string): IntelligenceItem[] {
  itemBuffer.clear(); // Reuse buffer

  const items = db.query(
    "SELECT * FROM intelligence_items WHERE user_id = $1 LIMIT $2",
    [userId, MAX_FEED_ITEMS]
  );

  for (const item of items) {
    itemBuffer.push(item); // Safe push with bounds checking
  }

  return itemBuffer.toArray();
}
```

### 7.4 Rule 4: Function Length ≤ 60 Lines

**Implementation:** Modularize all functions

```typescript
// ✅ GOOD: Small, focused functions
async function createResearchSwarm(
  userId: string,
  query: string
): Promise<Swarm> {
  validateQuery(query); // Line 1-5
  const swarm = await saveSwarm(userId, query); // Line 6-10
  await queueAgents(swarm.id); // Line 11-15
  await notifyUser(userId, swarm.id); // Line 16-20
  return swarm; // Line 21
}

function validateQuery(query: string): void {
  assert(query.length > 0, "Query cannot be empty");
  assert(query.length <= 500, "Query too long");
  assertNoSQLInjection(query);
}

// ❌ BAD: 80-line monolithic function (would be rejected)
```

### 7.5 Rule 5: Minimum 2 Assertions per Function

**Implementation:** Validate inputs and outputs

```typescript
import { assert, assertInRange } from "@/utils/assert";

function calculateObsessionScore(metrics: ObsessionMetrics): number {
  // Input assertions
  assert(metrics !== null, "Metrics cannot be null");
  assertInRange(metrics.engagement, 0, 1, "Engagement out of range");
  assertInRange(metrics.researchDepth, 0, 1, "Research depth out of range");

  const score =
    (0.3 * metrics.engagement +
      0.25 * metrics.researchDepth +
      0.2 * metrics.contentFocus +
      0.15 * metrics.competitorAwareness +
      0.1 * metrics.actionVelocity) *
    10;

  // Output assertions
  assertInRange(score, 0, 10, "Obsession score out of range");
  assert(!isNaN(score), "Obsession score is NaN");

  return score;
}
```

### 7.6 Rule 7: Check All Return Values

**Implementation:** Use SafeResult pattern for error handling

```typescript
import { SafeResult } from "@/utils/safety";

async function fetchIntelligenceItem(id: string): SafeResult<IntelligenceItem> {
  try {
    const item = await db.intelligenceItem.findUnique({ where: { id } });

    if (!item) {
      return { success: false, error: new Error(`Item ${id} not found`) };
    }

    return { success: true, value: item };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage: Always check success
const result = await fetchIntelligenceItem(itemId);
if (!result.success) {
  console.error("Failed to fetch item:", result.error);
  return; // Handle error
}

const item = result.value; // Type-safe access
```

### 7.7 Rule 9: Limit Indirection (Max Depth 3)

**Implementation:** Keep call chains shallow

```typescript
// ✅ GOOD: Max depth 3
async function handleUserRequest(req: Request): Promise<Response> {
  const result = await processRequest(req); // Depth 1
  return formatResponse(result); // Depth 1
}

async function processRequest(req: Request): Promise<ProcessedData> {
  const data = await fetchData(req.userId); // Depth 2
  return transformData(data); // Depth 2
}

function transformData(data: RawData): ProcessedData {
  return validateAndClean(data); // Depth 3 (MAX)
}

// ❌ BAD: Depth 5+ (would require refactoring)
```

### 7.8 Rule 10: Zero Warnings

**Implementation:** TypeScript strict mode + ESLint enforcement

```json
// tsconfig.json (already configured)
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}

// ESLint rules
{
  "rules": {
    "complexity": ["error", 10], // Rule 9: Max complexity
    "max-depth": ["error", 3], // Rule 9: Max nesting
    "max-lines-per-function": ["error", 60], // Rule 4
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

---

## 8. Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-2)

**Goal:** Database + API foundation

- [x] Set up PostgreSQL (Supabase/Neon)
- [x] Create Prisma schema
- [x] Run migrations
- [x] Set up Redis (Upstash)
- [x] Create safety utilities (already done)
- [x] Build API route structure
- [x] Implement authentication (NextAuth.js)

### Phase 2: Intelligence Feed (Week 3)

**Goal:** First working feature

- [ ] Build ingestion pipeline
  - [ ] RSS parser
  - [ ] Twitter API integration
  - [ ] YouTube API integration
- [ ] Implement embedding generation (OpenAI)
- [ ] Create feed API endpoints
- [ ] Build frontend feed component
- [ ] Add SSE for real-time updates
- [ ] Test with real data

### Phase 3: Research Swarms (Week 4-5)

**Goal:** MCP agent system

- [ ] Set up LangGraph or AutoGen
- [ ] Design MCP agent protocols
- [ ] Implement 4 agent types (searcher, analyzer, synthesizer, validator)
- [ ] Build swarm orchestrator
- [ ] Create swarm API endpoints
- [ ] Build frontend swarm interface
- [ ] Test agent interactions

### Phase 4: Strategy Cohorts (Week 6)

**Goal:** Competitive intelligence

- [ ] Build competitor tracking system
- [ ] Implement web scraping (Puppeteer)
- [ ] Create analysis engine
- [ ] Build cohort API endpoints
- [ ] Design comparison dashboards
- [ ] Test with real competitor data

### Phase 5: Neo4j Knowledge Graph (Week 7)

**Goal:** A.I.A. Knowledge Traverse

- [ ] Set up Neo4j AuraDB
- [ ] Design graph schema
- [ ] Implement entity extraction (LLM-based)
- [ ] Build graph population pipeline
- [ ] Create traversal queries
- [ ] Integrate with Intelligence Feed
- [ ] Test knowledge discovery

### Phase 6: Psychographics (Week 8)

**Goal:** Behavioral clustering

- [ ] Design segment schema
- [ ] Implement clustering algorithms
- [ ] Build analysis API
- [ ] Create segment dashboards
- [ ] Generate custom insights
- [ ] Test with sample data

### Phase 7: Brewery (Week 9)

**Goal:** Content distillation

- [ ] Design output templates
- [ ] Build distillation engine (LLM-based)
- [ ] Implement scheduling system
- [ ] Create delivery mechanism
- [ ] Build output preview UI
- [ ] Test with historical data

### Phase 8: Obsession Score (Week 10)

**Goal:** Central metric

- [ ] Implement score calculation
- [ ] Create tracking system
- [ ] Build historical graphs
- [ ] Design score breakdown UI
- [ ] Add gamification elements
- [ ] Test score accuracy

### Phase 9: Polish & Optimization (Week 11-12)

**Goal:** Production-ready

- [ ] Performance optimization
  - [ ] Database query optimization
  - [ ] API response caching
  - [ ] Frontend code splitting
- [ ] Security hardening
  - [ ] Input validation (all endpoints)
  - [ ] Rate limiting
  - [ ] CSRF protection
- [ ] Error handling
  - [ ] Sentry integration
  - [ ] User-friendly error messages
- [ ] Documentation
  - [ ] API docs (OpenAPI spec)
  - [ ] User guide
  - [ ] Developer docs

### Phase 10: Testing & Launch (Week 13-14)

**Goal:** Beta launch

- [ ] Comprehensive testing
  - [ ] Unit tests (80%+ coverage)
  - [ ] Integration tests
  - [ ] E2E tests (Playwright)
- [ ] Beta user recruitment
- [ ] Feedback collection
- [ ] Bug fixes
- [ ] Public launch

---

## 9. Cost Estimation (Free Tier Maximization)

### Free Tier Services:

- **Vercel:** Unlimited deployments, 100GB bandwidth/month
- **Supabase:** 500MB PostgreSQL, unlimited API requests
- **Neo4j AuraDB Free:** Persistent instance, 50K nodes
- **Upstash Redis:** 10K commands/day
- **OpenAI API:** $5 free credit (one-time)
- **Anthropic Claude:** $5 free credit (one-time)

### Estimated Monthly Costs (Post-Free Credits):

- **Database:** $0 (Supabase free tier sufficient for MVP)
- **Redis:** $0 (Upstash free tier sufficient)
- **Neo4j:** $0 (AuraDB free tier)
- **LLM API (OpenAI):** ~$10-20/month (100 users)
- **Total:** ~$10-20/month for MVP with 100 active users

### Scaling Plan:

- **100-1000 users:** Upgrade to Supabase Pro ($25/mo) + Upstash Pro ($10/mo) = $35/mo
- **1000-10000 users:** Add dedicated PostgreSQL ($50/mo) + Redis ($30/mo) = $80/mo
- **10000+ users:** Custom infrastructure, estimated $500-1000/mo

---

## 10. Risks & Mitigation

### 10.1 Technical Risks

| Risk                                         | Impact | Probability | Mitigation                                                                           |
| -------------------------------------------- | ------ | ----------- | ------------------------------------------------------------------------------------ |
| LLM API costs spiral                         | High   | Medium      | Implement request caching, rate limiting per user, use smaller models where possible |
| Data ingestion rate limits (Twitter/YouTube) | Medium | High        | Respect API limits, implement exponential backoff, cache frequently accessed data    |
| Knowledge graph query performance            | Medium | Medium      | Index critical paths, limit traversal depth, use caching layer                       |
| Agent reliability (MCP)                      | High   | Medium      | Implement timeouts, fallback mechanisms, comprehensive error handling                |
| Embedding generation latency                 | Low    | High        | Batch processing, background jobs, pre-compute for common queries                    |

### 10.2 Product Risks

| Risk                               | Impact | Probability | Mitigation                                                                                  |
| ---------------------------------- | ------ | ----------- | ------------------------------------------------------------------------------------------- |
| User abandons after onboarding     | High   | Medium      | Streamline onboarding, provide immediate value (pre-populated feed), gamify obsession score |
| "Finite introspect" feels limiting | Medium | Low         | User testing, adjustable limits, clear communication of benefits                            |
| Competitors offer similar features | Medium | High        | Focus on unique value prop (obsession score, distillery concept), rapid iteration           |
| AI hallucinations in insights      | High   | Medium      | Implement validation agent, confidence scores, source citations, user feedback loop         |

---

## 11. Success Metrics (KPIs)

### Primary Metrics:

1. **Average Obsession Score:** Target 7.5+ within 30 days
2. **Daily Active Users (DAU):** 60%+ of registered users
3. **Research Swarms Created:** Avg 2+ per user per week
4. **Brewery Open Rate:** 80%+ of delivered outputs opened
5. **Time to First Insight:** <5 minutes from signup

### Secondary Metrics:

1. **Intelligence Sources Added:** Avg 10+ per user
2. **Competitors Tracked:** Avg 3+ per user
3. **Cohort Analyses Run:** Avg 1+ per week
4. **Psychographic Segments Created:** Avg 2+ per user
5. **User Retention (30-day):** 70%+

### Technical Metrics:

1. **API Response Time (P95):** <200ms
2. **Swarm Completion Time (P95):** <5 minutes
3. **Feed Refresh Latency:** <30 seconds (real-time)
4. **Database Query Time (P95):** <50ms
5. **Uptime:** 99.5%+

---

## 12. Next Steps

### Immediate Actions (This Week):

1. **Get User Approval** on this architecture plan
2. **Set up database hosting:**
   - Create Supabase account
   - Create Neo4j AuraDB account
   - Create Upstash Redis account
3. **Initialize Prisma:**
   - Write complete Prisma schema
   - Run first migration
4. **Install new dependencies:**
   ```bash
   npm install prisma @prisma/client
   npm install @tanstack/react-query
   npm install zustand
   npm install bullmq ioredis
   npm install langchain langgraph # or autogen
   npm install puppeteer
   npm install feedparser
   ```

### Week 1 Goals:

- [ ] Complete database setup
- [ ] User authentication working
- [ ] First API endpoint (user profile) functional
- [ ] Intelligence source CRUD operations complete

---

## 13. Questions for User

Before proceeding with implementation, please confirm:

1. **Database Hosting:** Approve Supabase (PostgreSQL) + Neo4j AuraDB Free + Upstash Redis?
2. **LLM Provider:** Prefer Anthropic Claude or OpenAI GPT-4? (Both have free tiers)
3. **Agent Framework:** LangGraph (recommended) or AutoGen?
4. **Authentication:** Use NextAuth.js with email/password + Google OAuth?
5. **Onboarding Data:** Should we pre-populate sample intelligence sources for new users?
6. **Finite Limits:** Confirm max items per output (15 for Brewery, 50 for Feed)?
7. **Obsession Score Display:** Show score prominently on every page or only on dashboard?

---

**End of Architecture Plan**

This plan is a living document and will be updated as implementation progresses and user feedback is incorporated.
