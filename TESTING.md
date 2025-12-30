# Refleqt v2.0 - Testing Guide

## 🚀 Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

### 2. Seed Demo Data

Since the database connection may be unavailable, we provide two seeding methods:

#### Option A: Direct Database Seed (requires DB connection)

```bash
npm run db:seed
```

#### Option B: API-Based Seed (works without direct DB access)

```bash
# Make sure dev server is running first
npm run db:seed:api
```

This will create:

- **3 Research Goals** (competitive, market, customer)
- **2 Smart Trackers** with automatic monitoring
- **2 Research Swarms** with real LLM execution
- **5 Synthesized Insights** across strategic/tactical/operational levels
- **3 Knowledge Hierarchy Nodes**
- **1 Demo User** (demo@refleqt.com)

---

## 📋 Feature Testing Checklist

### ✅ Research Swarms Management (`/portal/research-swarms`)

**Test Flow:**

1. Navigate to http://localhost:3000/portal/research-swarms
2. Click "Create New Research Goal"
3. Fill in:
   - Goal Title: "Test Competitive Analysis"
   - Query: "Monitor competitor pricing strategies"
   - Goal Type: "Competitive"
   - Enable Smart Tracker: ✓
4. Click "Create Goal"
5. Find your goal in the list
6. Click "Execute Swarm" with query: "What are the latest pricing trends?"
7. Wait ~2 minutes for execution
8. Verify insights appear in the results

**Expected Results:**

- Goal created successfully
- Smart Tracker automatically created
- Swarm executes with real LLM calls (Claude/GPT/Gemini)
- Synthesized insights generated
- Insight count updates on goal card

---

### ✅ Strategy Cohorts (`/portal/strategy-cohorts`)

**Test Flow:**

1. Navigate to http://localhost:3000/portal/strategy-cohorts
2. Try an example query by clicking: "How are competitors pricing AI tools?"
3. Or enter custom query: "What features do enterprise customers value most?"
4. Click "Execute Strategy Cohort"
5. Wait for completion (<2 minutes)
6. Review results:
   - Confidence score
   - Execution time
   - Strategic insights
   - Tactical recommendations
   - Operational action items

**Expected Results:**

- Query executes successfully
- Results show confidence score (0.0-1.0)
- Insights organized by hierarchy level
- Actionable recommendations provided

---

### ✅ Smart Trackers (`/portal/smart-trackers`)

**Test Flow:**

1. Navigate to http://localhost:3000/portal/smart-trackers
2. Verify trackers created from research goals appear
3. Check tracker details:
   - Update frequency (based on Obsession Score)
   - Next execution time (countdown)
   - Last execution timestamp
   - Max insights limit
4. Test controls:
   - Click "⏸ Pause" to pause tracker
   - Verify status changes to "○ PAUSED"
   - Click "▶ Resume" to resume
   - Verify status changes to "● ACTIVE"
5. Test deletion:
   - Click "🗑 Delete" on a tracker
   - Confirm deletion
   - Verify tracker removed

**Expected Results:**

- All active trackers listed
- Status badges accurate (active/paused)
- Pause/resume works correctly
- Next execution countdown updates
- Delete removes tracker

---

### ✅ Settings & Profile (`/portal/settings`)

**Test Flow:**

1. Navigate to http://localhost:3000/portal/settings
2. Update company profile:
   - Company Name: "Test Company"
   - Industry: "Technology"
3. Adjust Obsession Score slider (1-10)
4. Observe real-time updates:
   - Update frequency changes
   - Max insights adjusts
   - Monitoring level updates
5. Click "💾 Save Settings"
6. Verify:
   - Success message appears
   - Settings persist after page refresh
   - Smart Trackers update to new frequency

**Expected Results:**

- Profile updates successfully
- Obsession Score affects tracker settings
- Real-time preview works
- Settings persist after save
- Smart Trackers automatically adjust

---

## 🧪 LLM Integration Testing

### Test Real AI Calls

The system integrates with three LLM providers:

**1. Claude (Anthropic)**

- Task routing: `competitive_analysis`, `insight_generation`
- Default for strategic analysis
- Temperature: 0.7 for agents, 0.3 for synthesis

**2. GPT (OpenAI)**

- Fallback provider
- Used for quick operations
- Temperature: 0.7 for agents, 0.3 for synthesis

**3. Gemini (Google)**

- Alternative provider
- Used based on task routing
- Temperature: 0.7 for agents, 0.3 for synthesis

**Test Steps:**

1. Execute a research swarm
2. Check console logs for LLM calls
3. Verify `llmRouter.complete()` is called
4. Check response format:
   ```typescript
   {
     success: true,
     value: {
       content: "AI-generated content...",
       model: "claude-3-5-sonnet-20241022",
       usage: { input_tokens: 150, output_tokens: 500 }
     }
   }
   ```

**Expected Behavior:**

- No mock responses (all real AI calls)
- SafeResult pattern used
- Automatic fallback on provider failure
- Timeout handling (Promise.race)
- JSON parsing with fallback synthesis

---

## 🐛 Common Issues & Troubleshooting

### Issue: "Failed to fetch insights"

**Cause:** Database not seeded or connection lost

**Fix:**

```bash
npm run db:seed:api
```

---

### Issue: "LLM call failed"

**Cause:** Invalid or missing API keys

**Fix:**

1. Check `.env` file has all keys:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_API_KEY=AIza...
   OPENAI_API_KEY=sk-proj-...
   ```
2. Restart dev server

---

### Issue: Swarm execution hangs

**Cause:** API timeout or network issue

**Fix:**

- Check console for error messages
- Verify API keys are valid
- Check LLM provider status pages
- Default timeout is 120s for agents

---

### Issue: Smart Tracker not executing

**Cause:**

- Tracker paused
- Next execution time not reached
- Database connection issue

**Fix:**

1. Verify tracker status is "ACTIVE"
2. Check "Next Execution" countdown
3. Manual trigger via "Execute Swarm" button

---

## 📊 Performance Benchmarks

### Expected Execution Times

| Task                   | Expected Time | Max Timeout |
| ---------------------- | ------------- | ----------- |
| Small swarm (3 agents) | 60-90s        | 120s        |
| Large swarm (8 agents) | 90-120s       | 180s        |
| Strategy cohort        | 45-90s        | 120s        |
| Synthesis              | 10-20s        | 30s         |

### API Response Times

| Endpoint                         | Expected | Notes                   |
| -------------------------------- | -------- | ----------------------- |
| GET /api/synthesized-insights    | <200ms   | Cached after first call |
| POST /api/research-swarm/execute | 60-120s  | Full LLM execution      |
| GET /api/smart-tracker           | <100ms   | Simple DB query         |
| PATCH /api/user/obsession-score  | <500ms   | Updates trackers        |

---

## 🎯 End-to-End Test Scenario

### Complete User Journey

**Scenario:** Track competitor AI pricing changes

1. **Setup** (5 minutes)
   - Run `npm run db:seed:api`
   - Navigate to `/portal`
   - Review dashboard

2. **Create Research Goal** (2 minutes)
   - Go to `/portal/research-swarms`
   - Create goal: "Monitor AI Pricing"
   - Query: "Track OpenAI, Anthropic, and Google AI pricing"
   - Type: Competitive
   - Enable tracking: Yes

3. **Execute Swarm** (2 minutes)
   - Click "Execute Swarm"
   - Query: "What are the latest pricing changes?"
   - Wait for completion
   - Review insights

4. **Configure Monitoring** (3 minutes)
   - Go to `/portal/settings`
   - Set Obsession Score: 8 (high urgency)
   - Save settings
   - Return to `/portal/smart-trackers`
   - Verify tracker shows 15min update frequency

5. **Quick Analysis** (2 minutes)
   - Go to `/portal/strategy-cohorts`
   - Query: "How do competitors respond to pricing pressure?"
   - Review strategic/tactical/operational insights

6. **Verify Results** (1 minute)
   - Check all pages load correctly
   - Verify data appears
   - Test navigation between pages

**Total Time:** ~15 minutes

**Success Criteria:**

- ✅ All pages accessible
- ✅ Data persists across navigation
- ✅ Real LLM calls succeed
- ✅ Insights generated and displayed
- ✅ Smart Trackers configured correctly
- ✅ Settings persist after save

---

## 🚨 Critical Paths

These flows MUST work for production:

1. **Research Goal Creation → Swarm Execution → Insight Display**
   - Create goal → Execute → View insights
   - No errors at any step
   - Insights appear in Finite Introspect

2. **Obsession Score → Smart Tracker Updates**
   - Change score → Trackers update frequency
   - Next execution recalculated
   - Max insights adjusted

3. **Strategy Cohort → Fast Results**
   - Query → Execute → Results in <2 min
   - Confidence score displayed
   - Actionable recommendations

---

## 📝 Test Data Reference

### Demo User

- **ID:** `00000000-0000-0000-0000-000000000001`
- **Email:** demo@refleqt.com
- **Company:** Refleqt Demo Inc
- **Industry:** SaaS & AI
- **Obsession Score:** 7.5

### Sample Queries

- "What are OpenAI's latest pricing changes for GPT-4?"
- "What are the top AI trends predicted for 2025?"
- "How do competitors position their AI tools?"
- "What features do enterprise customers prioritize?"
- "What are the latest AI regulatory changes?"

---

## ✅ Sign-Off Checklist

Before considering the feature complete:

- [ ] All 4 feature pages load without errors
- [ ] Database seeding works (via API or direct)
- [ ] Research swarms execute with real LLM calls
- [ ] Insights display in Finite Introspect
- [ ] Smart Trackers create, pause, resume, delete
- [ ] Settings page updates obsession score
- [ ] Strategy Cohorts execute queries
- [ ] Navigation works between all pages
- [ ] No console errors on any page
- [ ] TypeScript compiles without errors
- [ ] All API endpoints return proper responses

---

## 🎓 Next Steps

After testing:

1. **Production Deployment**
   - Set up production database
   - Configure environment variables
   - Deploy to hosting platform

2. **User Authentication**
   - Integrate NextAuth
   - Add login/signup flows
   - Protect API routes

3. **Performance Optimization**
   - Add caching layer
   - Implement pagination
   - Optimize LLM calls

4. **Additional Features**
   - Email notifications for trackers
   - Export insights to PDF
   - Team collaboration features
   - Analytics dashboard
