/**
 * Seed Demo Data for Refleqt v2.0
 * Populates database with sample research goals, swarms, insights, and trackers
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding demo data for Refleqt v2.0...\n");

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: "demo@refleqt.com" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      email: "demo@refleqt.com",
      name: "Demo User",
    },
  });
  console.log("✓ Created test user:", testUser.email);

  // Create user profile
  const userProfile = await prisma.userProfile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      companyName: "Refleqt Demo Inc",
      industry: "SaaS & AI",
      obsessionScore: 7.5,
      businessChallenge: "Competitive intelligence automation",
    },
  });
  console.log("✓ Created user profile for:", userProfile.companyName);

  // Create research goals
  const competitiveGoal = await prisma.researchGoal.create({
    data: {
      userId: testUser.id,
      goalTitle: "Monitor OpenAI Product Launches",
      goalQuery:
        "Track all OpenAI product announcements, pricing changes, and feature releases",
      goalType: "competitive",
      monitoringLevel: "hourly",
      isActive: true,
    },
  });
  console.log("✓ Created research goal:", competitiveGoal.goalTitle);

  const marketGoal = await prisma.researchGoal.create({
    data: {
      userId: testUser.id,
      goalTitle: "AI Market Trends 2025",
      goalQuery:
        "Monitor emerging AI trends, market size predictions, and industry reports for 2025",
      goalType: "market",
      monitoringLevel: "daily",
      isActive: true,
    },
  });
  console.log("✓ Created research goal:", marketGoal.goalTitle);

  const customerGoal = await prisma.researchGoal.create({
    data: {
      userId: testUser.id,
      goalTitle: "Enterprise AI Adoption Patterns",
      goalQuery:
        "Research how Fortune 500 companies are adopting AI tools and what features they prioritize",
      goalType: "customer",
      monitoringLevel: "daily",
      isActive: true,
    },
  });
  console.log("✓ Created research goal:", customerGoal.goalTitle);

  // Create Smart Trackers
  await prisma.smartTracker.create({
    data: {
      goalId: competitiveGoal.id,
      userId: testUser.id,
      updateInterval: 3600, // 1 hour
      maxInsights: 9,
      nextExecutionAt: new Date(Date.now() + 3600000),
      isActive: true,
    },
  });
  console.log("✓ Created Smart Tracker for:", competitiveGoal.goalTitle);

  await prisma.smartTracker.create({
    data: {
      goalId: marketGoal.id,
      userId: testUser.id,
      updateInterval: 86400, // 24 hours
      maxInsights: 7,
      nextExecutionAt: new Date(Date.now() + 86400000),
      isActive: true,
    },
  });
  console.log("✓ Created Smart Tracker for:", marketGoal.goalTitle);

  // Create sample research swarms
  const swarm1 = await prisma.researchSwarm.create({
    data: {
      goalId: competitiveGoal.id,
      userId: testUser.id,
      query: "What are OpenAI's latest pricing changes for GPT-4?",
      swarmType: "competitive",
      swarmSize: "small",
      status: "completed",
      progressPct: 100,
      synthesisApplied: true,
      executionTimeMs: 87000,
      startedAt: new Date(Date.now() - 90000),
      completedAt: new Date(Date.now() - 3000),
    },
  });
  console.log("✓ Created research swarm:", swarm1.query);

  const swarm2 = await prisma.researchSwarm.create({
    data: {
      goalId: marketGoal.id,
      userId: testUser.id,
      query: "What are the top AI trends predicted for 2025?",
      swarmType: "market",
      swarmSize: "large",
      status: "completed",
      progressPct: 100,
      synthesisApplied: true,
      executionTimeMs: 112000,
      startedAt: new Date(Date.now() - 120000),
      completedAt: new Date(Date.now() - 8000),
    },
  });
  console.log("✓ Created research swarm:", swarm2.query);

  // Create synthesized insights
  const insights = [
    {
      swarmId: swarm1.id,
      userId: testUser.id,
      title: "OpenAI Reduces GPT-4 API Pricing by 50%",
      content:
        "OpenAI announced a major price reduction for GPT-4 API access, cutting costs from $0.03 to $0.015 per 1K tokens for input. This move aims to make advanced AI more accessible to developers and compete with cheaper alternatives from Anthropic and Google.",
      hierarchyLevel: "strategic",
      priorityScore: 0.95,
      relevanceScore: 0.92,
      isActionable: true,
      actionItems: [
        "Review current AI infrastructure costs",
        "Evaluate switching to GPT-4 for cost savings",
        "Update pricing models for AI-powered features",
      ],
      psychographicTags: ["cost-conscious", "enterprise", "developers"],
      displayPosition: 1,
    },
    {
      swarmId: swarm1.id,
      userId: testUser.id,
      title: "GPT-4 Turbo Supports 128K Context Window",
      content:
        "The latest GPT-4 Turbo model now supports a massive 128,000 token context window, allowing developers to process entire codebases or lengthy documents in a single API call. This represents a 16x increase from the original GPT-4.",
      hierarchyLevel: "tactical",
      priorityScore: 0.87,
      relevanceScore: 0.88,
      isActionable: true,
      actionItems: [
        "Test long-context use cases with GPT-4 Turbo",
        "Redesign chunking strategies for RAG systems",
      ],
      psychographicTags: ["technical", "developers", "RAG-users"],
      displayPosition: 2,
    },
    {
      swarmId: swarm2.id,
      userId: testUser.id,
      title: "AI Agents Expected to Replace 40% of Knowledge Work by 2025",
      content:
        "Industry analysts predict that AI agents capable of multi-step reasoning and tool use will automate up to 40% of knowledge worker tasks by end of 2025. Key areas include data analysis, content creation, customer support, and software development.",
      hierarchyLevel: "strategic",
      priorityScore: 0.93,
      relevanceScore: 0.9,
      isActionable: true,
      actionItems: [
        "Identify automatable workflows in organization",
        "Pilot AI agent tools for customer support",
        "Upskill team on AI collaboration",
      ],
      psychographicTags: ["enterprise", "automation", "future-focused"],
      displayPosition: 1,
    },
    {
      swarmId: swarm2.id,
      userId: testUser.id,
      title: "Multimodal AI Market to Reach $40B by 2026",
      content:
        "The market for multimodal AI systems (text + image + audio + video) is projected to grow from $8B in 2024 to $40B by 2026, driven by adoption in healthcare, education, and enterprise applications.",
      hierarchyLevel: "operational",
      priorityScore: 0.78,
      relevanceScore: 0.82,
      isActionable: false,
      actionItems: [],
      psychographicTags: ["market-research", "investors", "strategic-planning"],
      displayPosition: 3,
    },
    {
      swarmId: swarm1.id,
      userId: testUser.id,
      title: "OpenAI Launches Custom GPTs Marketplace",
      content:
        "OpenAI unveiled the GPT Store, allowing developers to create and monetize custom GPT applications. Top performing GPTs can earn revenue share, creating a new ecosystem similar to mobile app stores.",
      hierarchyLevel: "operational",
      priorityScore: 0.72,
      relevanceScore: 0.75,
      isActionable: true,
      actionItems: [
        "Explore creating custom GPTs for specific use cases",
        "Research monetization potential",
      ],
      psychographicTags: ["developers", "entrepreneurs", "monetization"],
      displayPosition: 4,
    },
  ];

  for (const insightData of insights) {
    const insight = await prisma.synthesizedInsight.create({
      data: insightData,
    });
    console.log("✓ Created insight:", insight.title);
  }

  // Create knowledge hierarchy nodes
  const strategicNode = await prisma.knowledgeNode.create({
    data: {
      userId: testUser.id,
      nodeTitle: "AI Market Competitive Landscape 2025",
      nodeContent:
        "Strategic overview of AI market dynamics, key players, and competitive positioning",
      hierarchyLevel: "strategic",
      depth: 0,
      insightIds: [
        insights[0]?.title ?? "insight-0",
        insights[2]?.title ?? "insight-2",
      ],
      relevanceScore: 0.95,
    },
  });
  console.log("✓ Created strategic knowledge node");

  const tacticalNode = await prisma.knowledgeNode.create({
    data: {
      userId: testUser.id,
      parentId: strategicNode.id,
      nodeTitle: "OpenAI Product Strategy",
      nodeContent:
        "Tactical analysis of OpenAI's product development and pricing strategy",
      hierarchyLevel: "tactical",
      depth: 1,
      insightIds: [
        insights[1]?.title ?? "insight-1",
        insights[4]?.title ?? "insight-4",
      ],
      relevanceScore: 0.88,
    },
  });
  console.log("✓ Created tactical knowledge node");

  await prisma.knowledgeNode.create({
    data: {
      userId: testUser.id,
      parentId: tacticalNode.id,
      nodeTitle: "GPT-4 API Implementation Details",
      nodeContent: "Operational guidance for implementing GPT-4 API features",
      hierarchyLevel: "operational",
      depth: 2,
      insightIds: [insights[1]?.title ?? "insight-1"],
      relevanceScore: 0.76,
    },
  });
  console.log("✓ Created operational knowledge node");

  console.log("\n✅ Seed data creation complete!");
  console.log("\nDemo account:");
  console.log("  Email:", testUser.email);
  console.log("  User ID:", testUser.id);
  console.log("\nCreated:");
  console.log("  - 3 Research Goals");
  console.log("  - 2 Smart Trackers");
  console.log("  - 2 Research Swarms");
  console.log("  - 5 Synthesized Insights");
  console.log("  - 3 Knowledge Hierarchy Nodes");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
