# Database Setup Instructions

Due to WSL networking restrictions, we need to manually run the database migration in Supabase SQL Editor.

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://mpopzdpsdlrtyjqaixvw.supabase.com
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

## Step 2: Run the Migration

Copy and paste the entire SQL script from:

```
prisma/migrations/20241225_init/migration.sql
```

## Step 3: Execute the Script

1. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
2. Wait for confirmation that all tables were created successfully

## Expected Results

After running the migration, you should have these 15 tables created:

### Authentication & Users

- `users` - User accounts
- `user_profiles` - Extended user profile information
- `accounts` - NextAuth.js OAuth accounts
- `sessions` - NextAuth.js sessions
- `verification_tokens` - Email verification tokens

### Intelligence Feed

- `intelligence_sources` - RSS feeds, social media sources
- `intelligence_items` - Individual feed items with embeddings

### Research Swarms

- `research_swarms` - MCP agent swarm jobs
- `swarm_findings` - Research findings from swarms

### Strategy Cohorts

- `competitors` - Competitor tracking
- `strategy_cohorts` - Groups of competitors for analysis
- `cohort_analyses` - Comparative analyses

### Psychographics

- `psychographic_segments` - Customer segments
- `segment_insights` - Behavioral insights per segment

### Brewery & Scoring

- `brewery_outputs` - Distilled content (newsletters, briefs)
- `obsession_scores` - User engagement scoring over time

## Step 4: Verify Installation

Run this query to confirm all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see all 15 tables listed.

## Step 5: Verify pgvector Extension

Run this query to confirm the vector extension is installed:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

You should see one row with `extname = 'vector'`.

## Next Steps

After the database is set up:

1. ✅ Prisma Client is already generated locally
2. Test LLM API connections (may need to run from PowerShell instead of WSL)
3. Build Intelligence Feed API routes
4. Test RSS ingestion pipeline
5. Build Intelligence Feed frontend

## Troubleshooting

### If you get errors about extensions:

Supabase should have pgvector pre-installed. If not, enable it in the Supabase dashboard:

- Go to **Database** → **Extensions**
- Search for "vector"
- Enable it

### If you get constraint errors:

Make sure you're running the script on an empty database. If tables already exist, you may need to drop them first (or use a fresh database).
