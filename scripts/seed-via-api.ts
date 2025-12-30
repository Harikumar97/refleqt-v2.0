/**
 * Seed Demo Data via API
 * Populates database through HTTP API calls (works when direct DB access is unavailable)
 */

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:3000";
const TEST_USER_ID = "00000000-0000-0000-0000-000000000001";

async function apiCall(
  endpoint: string,
  method: string = "GET",
  body?: any
): Promise<any> {
  const url = `${API_BASE}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`${method} ${endpoint}`);
  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API call failed: ${response.status} - ${error}`);
  }

  return response.json();
}

async function main() {
  console.log("🌱 Seeding demo data via API...\n");
  console.log(`API Base: ${API_BASE}\n`);

  try {
    // Create research goals
    console.log("Creating research goals...");

    const goal1 = await apiCall("/api/research-goal", "POST", {
      userId: TEST_USER_ID,
      goalTitle: "Monitor OpenAI Product Launches",
      goalQuery:
        "Track all OpenAI product announcements, pricing changes, and feature releases",
      goalType: "competitive",
      enableTracking: true,
    });
    console.log("✓ Created:", goal1.data.goal.goalTitle);

    const goal2 = await apiCall("/api/research-goal", "POST", {
      userId: TEST_USER_ID,
      goalTitle: "AI Market Trends 2025",
      goalQuery:
        "Monitor emerging AI trends, market size predictions, and industry reports for 2025",
      goalType: "market",
      enableTracking: true,
    });
    console.log("✓ Created:", goal2.data.goal.goalTitle);

    const goal3 = await apiCall("/api/research-goal", "POST", {
      userId: TEST_USER_ID,
      goalTitle: "Enterprise AI Adoption Patterns",
      goalQuery:
        "Research how Fortune 500 companies are adopting AI tools and what features they prioritize",
      goalType: "customer",
      enableTracking: false,
    });
    console.log("✓ Created:", goal3.data.goal.goalTitle);

    // Execute research swarms
    console.log("\nExecuting research swarms (this may take a few minutes)...");

    const swarm1 = await apiCall("/api/research-swarm/execute", "POST", {
      userId: TEST_USER_ID,
      goalId: goal1.data.goal.id,
      query: "What are OpenAI's latest pricing changes for GPT-4?",
    });
    console.log("✓ Executed swarm:", swarm1.data.query);

    const swarm2 = await apiCall("/api/research-swarm/execute", "POST", {
      userId: TEST_USER_ID,
      goalId: goal2.data.goal.id,
      query: "What are the top AI trends predicted for 2025?",
    });
    console.log("✓ Executed swarm:", swarm2.data.query);

    // Update user profile
    console.log("\nUpdating user profile...");

    await apiCall("/api/user/profile", "PUT", {
      companyName: "Refleqt Demo Inc",
      industry: "SaaS & AI",
      businessChallenge: "Competitive intelligence automation",
    });
    console.log("✓ Updated profile");

    await apiCall("/api/user/obsession-score", "PATCH", {
      userId: TEST_USER_ID,
      obsessionScore: 7.5,
    });
    console.log("✓ Set obsession score to 7.5");

    // Verify data
    console.log("\nVerifying created data...");

    const goals = await apiCall(`/api/research-goal?userId=${TEST_USER_ID}`);
    console.log(`✓ Total research goals: ${goals.data.goals.length}`);

    const trackers = await apiCall(`/api/smart-tracker?userId=${TEST_USER_ID}`);
    console.log(`✓ Total smart trackers: ${trackers.data.trackers.length}`);

    const insights = await apiCall(
      `/api/synthesized-insights?userId=${TEST_USER_ID}`
    );
    console.log(`✓ Total insights: ${insights.data.insights.length}`);

    console.log("\n✅ Seed data creation complete!");
    console.log("\nYou can now:");
    console.log("  1. Visit http://localhost:3000/portal");
    console.log("  2. View Research Swarms at /portal/research-swarms");
    console.log("  3. Check Smart Trackers at /portal/smart-trackers");
    console.log("  4. Explore Settings at /portal/settings");
  } catch (error) {
    console.error("❌ Seed error:", error);
    throw error;
  }
}

main()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Failed:", error.message);
    process.exit(1);
  });
