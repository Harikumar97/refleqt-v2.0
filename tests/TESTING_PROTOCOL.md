# Refleqt v2.0 Testing Protocol

## Pre-Development Checklist

### 1. Environment Setup Verification

```bash
# Verify all required environment variables are set
node -e "
const required = [
  'DATABASE_URL',
  'DIRECT_URL',
  'REDIS_URL',
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'GOOGLE_API_KEY',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('❌ Missing env vars:', missing.join(', '));
  process.exit(1);
}
console.log('✅ All environment variables configured');
"
```

### 2. Database Connection Test

```bash
# Test database connectivity
npx prisma db execute --stdin <<< "SELECT 1;" && echo "✅ Database connected" || echo "❌ Database connection failed"
```

### 3. TypeScript Compilation Test

```bash
# Full type check before starting
npx tsc --noEmit && echo "✅ TypeScript compilation successful" || echo "❌ TypeScript errors found"
```

### 4. Prisma Client Generation

```bash
# Ensure Prisma Client is up to date
npx prisma generate && echo "✅ Prisma Client generated" || echo "❌ Prisma generation failed"
```

---

## Intelligence Feed Specific Tests

### Test Suite 1: Database Layer

#### 1.1 Table Existence Check

```sql
-- Run in Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'users',
  'user_profiles',
  'intelligence_sources',
  'intelligence_items'
)
ORDER BY table_name;

-- Expected: 4 rows returned
```

#### 1.2 Test User Creation

```sql
-- Create test user
INSERT INTO users (id, email, name, created_at, updated_at)
VALUES (
  'test-user-001',
  'test@refleqt.com',
  'Test User',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT id, email, name FROM users WHERE id = 'test-user-001';

-- Expected: 1 row with test user data
```

#### 1.3 Test Intelligence Source Creation

```sql
-- Add test RSS source
INSERT INTO intelligence_sources (
  id,
  user_id,
  source_type,
  source_url,
  source_name,
  category,
  is_active,
  created_at
)
VALUES (
  'test-source-001',
  'test-user-001',
  'rss',
  'https://techcrunch.com/feed/',
  'TechCrunch Test',
  'industry',
  true,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify
SELECT * FROM intelligence_sources WHERE id = 'test-source-001';

-- Expected: 1 row with test source data
```

### Test Suite 2: API Routes

#### 2.1 Test Sources API (GET)

```bash
# List all sources for test user
curl -s http://localhost:3000/api/intelligence/sources?userId=test-user-001 | jq '.'

# Expected output:
# {
#   "success": true,
#   "data": [...]
# }
```

#### 2.2 Test Sources API (POST)

```bash
# Add a new source
curl -s -X POST http://localhost:3000/api/intelligence/sources \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-001",
    "sourceType": "rss",
    "sourceUrl": "https://venturebeat.com/feed/",
    "sourceName": "VentureBeat",
    "category": "industry"
  }' | jq '.'

# Expected: success: true, with source data
```

#### 2.3 Test Items API (GET)

```bash
# Fetch intelligence items
curl -s "http://localhost:3000/api/intelligence/items?userId=test-user-001&limit=10" | jq '.'

# Expected output:
# {
#   "success": true,
#   "data": {
#     "items": [...],
#     "pagination": {...}
#   }
# }
```

#### 2.4 Test Refresh API (POST)

```bash
# Trigger manual refresh
curl -s -X POST http://localhost:3000/api/intelligence/refresh \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-001"}' | jq '.'

# Expected: success: true with queued count
```

### Test Suite 3: Frontend Components

#### 3.1 Route Availability Test

```bash
# Test page loads
curl -s -I http://localhost:3000/portal/intelligence-feed | grep "HTTP"

# Expected: HTTP/1.1 200 OK
```

#### 3.2 Component Render Test

```bash
# Check if page contains expected elements
curl -s http://localhost:3000/portal/intelligence-feed | grep -o "Intelligence Feed"

# Expected: "Intelligence Feed" appears in HTML
```

### Test Suite 4: Background Jobs

#### 4.1 Redis Connection Test

```bash
# Test Redis connectivity
node -e "
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});
redis.ping().then(() => {
  console.log('✅ Redis connected');
  redis.disconnect();
}).catch(err => {
  console.error('❌ Redis error:', err.message);
  process.exit(1);
});
"
```

#### 4.2 Queue Creation Test

```bash
# Verify BullMQ queues can be created
node -e "
const { Queue } = require('bullmq');
const Redis = require('ioredis');
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});
const queue = new Queue('test-queue', { connection });
queue.add('test-job', { data: 'test' }).then(() => {
  console.log('✅ Queue job added successfully');
  queue.close();
  connection.disconnect();
}).catch(err => {
  console.error('❌ Queue error:', err.message);
  process.exit(1);
});
"
```

### Test Suite 5: LLM Integration

#### 5.1 LLM Router Initialization

```bash
# Test LLM router can initialize
npx tsx scripts/test-llm-connections.ts 2>&1 | grep "initialized"

# Expected: "✅ LLM Router initialized successfully"
```

#### 5.2 Provider Availability

```bash
# Check which providers are configured
node -e "
const providers = [
  { name: 'Anthropic', key: 'ANTHROPIC_API_KEY' },
  { name: 'OpenAI', key: 'OPENAI_API_KEY' },
  { name: 'Google', key: 'GOOGLE_API_KEY' }
];
providers.forEach(p => {
  const status = process.env[p.key] ? '✅' : '❌';
  console.log(\`\${status} \${p.name}: \${process.env[p.key] ? 'configured' : 'missing'}\`);
});
"
```

---

## Development Workflow Protocol

### Before Starting Development

1. **Pull latest changes** (if working across machines):

   ```bash
   git pull origin claude/refleqt-web-app-planning-Jc7VE
   ```

2. **Install/update dependencies**:

   ```bash
   npm install
   ```

3. **Run pre-flight checks**:

   ```bash
   npm run type-check
   npx prisma generate
   ```

4. **Clear Next.js cache if needed**:

   ```bash
   rm -rf .next
   ```

5. **Start dev server**:
   ```bash
   npm run dev
   ```

### During Development

1. **After adding new features**, run:

   ```bash
   # Type check
   npx tsc --noEmit

   # Lint
   npm run lint
   ```

2. **Before committing**, verify:

   ```bash
   # Build test
   npx next build

   # If build fails, fix errors before committing
   ```

3. **After database schema changes**:

   ```bash
   # Generate new migration
   npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > prisma/migrations/$(date +%Y%m%d_%H%M%S)_description/migration.sql

   # Regenerate client
   npx prisma generate
   ```

### After Making Changes

1. **Commit checklist**:
   - [ ] TypeScript compilation passes (`npx tsc --noEmit`)
   - [ ] No lint errors (`npm run lint`)
   - [ ] Code formatted (`npm run format`)
   - [ ] Build succeeds (`npx next build`)
   - [ ] Tests pass (if applicable)

2. **Push to remote**:
   ```bash
   git push
   ```

---

## Debugging Checklist

### When Page Shows 404

1. **Check file exists**:

   ```bash
   ls -la src/app/portal/intelligence-feed/page.tsx
   ```

2. **Check for compilation errors**:

   ```bash
   # Look for TypeScript errors
   npx tsc --noEmit | grep intelligence
   ```

3. **Clear Next.js cache**:

   ```bash
   rm -rf .next && npm run dev
   ```

4. **Check import paths**:

   ```bash
   # Verify component exists
   ls -la src/components/intelligence/IntelligenceFeed.tsx
   ```

5. **Check for syntax errors**:
   ```bash
   npx next build 2>&1 | grep -A 5 "intelligence-feed"
   ```

### When API Returns Errors

1. **Check Prisma Client**:

   ```bash
   # Verify Prisma is generated
   ls -la node_modules/.prisma/client/

   # Regenerate if missing
   npx prisma generate
   ```

2. **Check environment variables**:

   ```bash
   node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING')"
   ```

3. **Test database connection**:

   ```bash
   npx prisma db execute --stdin <<< "SELECT 1;"
   ```

4. **Check API route logs**:
   - Look at terminal where `npm run dev` is running
   - Check for error stack traces

### When Components Don't Render

1. **Check browser console** for errors

2. **Verify client components** have `"use client"` directive

3. **Check import paths** match tsconfig.json paths

4. **Verify data fetching**:
   ```bash
   # Test API endpoint directly
   curl http://localhost:3000/api/intelligence/items?userId=test-user-001
   ```

---

## Performance Benchmarks

### Expected Response Times

| Operation          | Expected Time | Alert Threshold |
| ------------------ | ------------- | --------------- |
| Page load (cold)   | < 2s          | > 5s            |
| Page load (hot)    | < 500ms       | > 2s            |
| API call (items)   | < 300ms       | > 1s            |
| API call (sources) | < 200ms       | > 800ms         |
| RSS feed fetch     | < 10s         | > 30s           |

### Resource Usage Limits

| Resource             | Normal  | Warning | Critical |
| -------------------- | ------- | ------- | -------- |
| Memory               | < 500MB | > 800MB | > 1GB    |
| CPU                  | < 30%   | > 60%   | > 80%    |
| Database connections | < 10    | > 20    | > 50     |

---

## Common Issues & Solutions

### Issue: "Cannot find module '@/components/...'"

**Root Cause**: TypeScript path mapping not resolved or component not exported

**Solution**:

```bash
# 1. Verify tsconfig.json has correct paths
cat tsconfig.json | grep -A 5 "paths"

# 2. Restart TS server in VSCode (Cmd+Shift+P -> "TypeScript: Restart TS Server")

# 3. Check component export
grep "export" src/components/intelligence/IntelligenceFeed.tsx
```

### Issue: "PrismaClientInitializationError"

**Root Cause**: PrismaClient created without datasource URL in Prisma 7

**Solution**:

```typescript
// ❌ Wrong
const prisma = new PrismaClient();

// ✅ Correct
import prisma from "@/lib/db/prisma";
```

### Issue: Page shows 404 after creating route

**Root Cause**: Next.js cache outdated

**Solution**:

```bash
# Stop dev server (Ctrl+C)
rm -rf .next
npm run dev
```

### Issue: Redis connection errors

**Root Cause**: REDIS_URL not set or Redis server unreachable

**Solution**:

```bash
# 1. Verify env var
echo $REDIS_URL

# 2. Test connection
redis-cli -u "$REDIS_URL" PING

# 3. Check Upstash console for server status
```

---

## Integration Test Script

Create `/home/user/refleqt-v2.0/tests/integration-test.sh`:

```bash
#!/bin/bash

echo "🧪 Running Refleqt Integration Tests..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test counter
PASSED=0
FAILED=0

# Test function
test() {
  local name=$1
  local command=$2

  echo -n "Testing: $name... "
  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
  else
    echo -e "${RED}❌ FAIL${NC}"
    ((FAILED++))
  fi
}

# Run tests
test "Database connection" "npx prisma db execute --stdin <<< 'SELECT 1;'"
test "TypeScript compilation" "npx tsc --noEmit"
test "Prisma Client exists" "test -f node_modules/.prisma/client/index.js"
test "Environment variables" "test -n '$DATABASE_URL' && test -n '$REDIS_URL'"
test "Dev server builds" "timeout 30 npx next build --no-lint"

echo ""
echo "Results: ${GREEN}$PASSED passed${NC}, ${RED}$FAILED failed${NC}"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
```

Make it executable:

```bash
chmod +x tests/integration-test.sh
```

Run before deploying:

```bash
./tests/integration-test.sh
```

---

## Continuous Monitoring

### Health Check Endpoint

Create `/home/user/refleqt-v2.0/src/app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    // Database check failed
  }

  const status = checks.database ? 200 : 503;

  return NextResponse.json(checks, { status });
}
```

Test with:

```bash
curl http://localhost:3000/api/health | jq '.'
```

---

## Release Checklist

Before deploying to production:

- [ ] All integration tests pass
- [ ] No TypeScript errors
- [ ] Production build succeeds
- [ ] Database migrations applied
- [ ] Environment variables set in production
- [ ] Health check endpoint returns 200
- [ ] Performance benchmarks met
- [ ] Error tracking configured
- [ ] Backup strategy in place
