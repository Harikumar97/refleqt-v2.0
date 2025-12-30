# Refleqt v2.0 - Prioritized Next Steps
## From Test Research Plan to Implementation

**Date:** December 30, 2025
**Current Phase:** Planning → Foundation
**Next Milestone:** Monorepo Setup (Week 1)

---

## Quick Summary

You now have **two comprehensive planning documents**:

1. **TEST_RESEARCH_PLAN.md** (18,000+ words)
   - 300+ test cases across 8 domains
   - OWASP Top 10 security testing
   - GDPR, CCPA, SOC2, PCI-DSS compliance
   - Attack resistance strategies
   - Quality metrics framework

2. **SECURITY_ARCHITECTURE_ROADMAP.md** (12,000+ words)
   - 7-layer security architecture
   - 26-week implementation timeline
   - Complete technology stack
   - Code examples for each layer
   - Risk mitigation strategies

---

## What to Do Next (Prioritized)

### Immediate Actions (This Week)

#### 1. Review & Approve Plans (1-2 days)
- [ ] Read both documents thoroughly
- [ ] Share with technical co-founder / security advisor
- [ ] Identify any missing requirements
- [ ] Get stakeholder sign-off

#### 2. Set Up Development Environment (1 day)
```bash
# Install required tools
brew install node pnpm postgresql redis

# Verify installations
node --version   # Should be >= 20.x
pnpm --version   # Should be >= 8.x
psql --version   # Should be >= 17.x
redis-server --version  # Should be >= 7.x
```

#### 3. Initialize Monorepo (2-3 days)
```bash
# Create monorepo structure
npx create-turbo@latest refleqt-v2.0-monorepo

cd refleqt-v2.0-monorepo

# Set up workspaces
pnpm init

# Install dependencies
pnpm add -D turbo typescript @types/node eslint prettier

# Create workspace structure
mkdir -p apps/{web,api,worker,admin}
mkdir -p packages/{database,auth,security,compliance,ui,testing}
mkdir -p services/{payment,email,storage,analytics}
mkdir -p infrastructure/{docker,k8s,terraform}
```

**File to create:** `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/*"
```

---

### Phase 1: Foundation (Weeks 1-4)

#### Week 1: Monorepo + Next.js Frontend
**Priority: CRITICAL**

**Tasks:**
1. Initialize Turborepo
2. Set up Next.js 15 (App Router)
3. Configure TypeScript, ESLint, Prettier
4. Create basic layout from HTML prototypes
5. Set up shared UI package

**Acceptance Criteria:**
- [ ] `pnpm build` succeeds across all packages
- [ ] `pnpm lint` passes with zero errors
- [ ] Next.js app runs on `localhost:3000`
- [ ] Hot reload working for development

**Estimated Time:** 5-7 days

---

#### Week 2: Database + FastAPI Backend
**Priority: CRITICAL**

**Tasks:**
1. Define Prisma schema (16 models from plan)
2. Set up PostgreSQL + pgvector extension
3. Create initial migration
4. Set up FastAPI backend
5. Create first API route (`/api/health`)

**Prisma Models (Priority Order):**
```prisma
1. User + UserProfile (authentication foundation)
2. Account + Session + VerificationToken (OAuth support)
3. IntelligenceSource + IntelligenceItem (core feature)
4. ResearchSwarm + SwarmFinding (core feature)
5. StrategyCohort + CohortAnalysis
6. PsychographicSegment + SegmentInsight
7. BreweryOutput (content generation)
8. ObsessionScore
9. AuditLog (compliance)
```

**Database Setup:**
```bash
# Install Prisma
pnpm add -D prisma
pnpm add @prisma/client

# Initialize Prisma
cd packages/database
pnpm prisma init

# Create schema, then:
pnpm prisma migrate dev --name init
pnpm prisma generate
```

**FastAPI Setup:**
```bash
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic

# Create main.py
uvicorn main:app --reload
```

**Acceptance Criteria:**
- [ ] Database migrations run successfully
- [ ] Prisma client generates without errors
- [ ] FastAPI returns `{"status": "healthy"}` on `/api/health`
- [ ] Database connection pooling works

**Estimated Time:** 7-10 days

---

#### Week 3: Authentication (NextAuth.js)
**Priority: CRITICAL (Blocks all subsequent work)**

**Tasks:**
1. Install NextAuth.js
2. Configure Google OAuth provider
3. Create login/signup pages
4. Implement JWT token generation
5. Add session middleware
6. Test authentication flow

**Implementation:**
```bash
cd apps/web
pnpm add next-auth @auth/prisma-adapter

# Create .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
```

**Files to Create:**
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- `apps/web/src/app/auth/login/page.tsx`
- `apps/web/src/app/auth/signup/page.tsx`
- `packages/auth/src/config.ts`

**Testing:**
```typescript
// Test Google OAuth login
cy.visit('/auth/login')
cy.get('[data-testid=google-login-button]').click()
// ... continue OAuth flow
cy.url().should('include', '/portal/dashboard')
```

**Acceptance Criteria:**
- [ ] Google OAuth login works end-to-end
- [ ] JWT tokens are signed with RS256
- [ ] Session persists after page refresh
- [ ] Logout clears session
- [ ] Unauthenticated users redirected to login

**Estimated Time:** 5-7 days

---

#### Week 4: Authorization (RBAC)
**Priority: CRITICAL**

**Tasks:**
1. Add `role` field to User model
2. Create permission matrix
3. Implement RBAC middleware
4. Protect API routes
5. Test privilege escalation

**Permission Matrix:**
```typescript
const PERMISSIONS = {
  "intelligence.sources.create": ["ADMIN", "CLIENT"],
  "intelligence.sources.read": ["ADMIN", "CLIENT", "VIEWER"],
  "research.swarms.execute": ["ADMIN", "CLIENT"],
  "brewery.create": ["ADMIN", "WRITER"],
  "admin.users.read": ["ADMIN"],
}
```

**Middleware:**
```typescript
// apps/web/middleware.ts
export function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const path = req.nextUrl.pathname

  // Admin-only routes
  if (path.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403", req.url))
  }

  return NextResponse.next()
}
```

**Acceptance Criteria:**
- [ ] Admins can access `/admin` routes
- [ ] Non-admins get 403 on `/admin` routes
- [ ] Writers can create content in `/brewery`
- [ ] Clients cannot access `/brewery` creation
- [ ] API returns 403 for unauthorized requests

**Estimated Time:** 5-7 days

---

### Phase 2: Security Hardening (Weeks 5-8)

#### Week 5: Input Validation + Sanitization
**Priority: HIGH**

**Tasks:**
1. Set up Zod schemas for all API inputs
2. Add DOMPurify for HTML sanitization
3. Implement XSS protection
4. Test with malicious inputs (XSS, SQL injection)

**Implementation:**
```typescript
// Zod validation
import { z } from "zod"

const createSourceSchema = z.object({
  source_type: z.enum(["RSS", "TWITTER", "REDDIT"]),
  source_url: z.string().url().max(2000),
  category: z.string().max(50),
})

// API route
export async function POST(req: Request) {
  const body = await req.json()
  const validated = createSourceSchema.parse(body) // Throws if invalid
  // ... proceed with validated data
}
```

**Test Cases:**
```typescript
// XSS attempt
it("should block XSS in source_url", async () => {
  const response = await fetch("/api/intelligence/sources", {
    method: "POST",
    body: JSON.stringify({
      source_url: "javascript:alert('XSS')"
    })
  })
  expect(response.status).toBe(400)
})

// SQL injection attempt
it("should block SQL injection", async () => {
  const response = await fetch("/api/users/profile", {
    method: "PUT",
    body: JSON.stringify({
      name: "'; DROP TABLE users; --"
    })
  })
  expect(response.status).toBe(400)
})
```

**Acceptance Criteria:**
- [ ] All API routes have Zod validation
- [ ] XSS attempts return 400 Bad Request
- [ ] SQL injection blocked by Prisma (parameterized queries)
- [ ] HTML content sanitized with DOMPurify

**Estimated Time:** 5-7 days

---

#### Week 6: Rate Limiting
**Priority: HIGH**

**Tasks:**
1. Set up Redis (Upstash)
2. Implement rate limiting middleware
3. Configure rate limit tiers
4. Add rate limit headers
5. Test with load testing tools

**Implementation:**
```typescript
// packages/security/src/rate-limit.ts
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function rateLimit(identifier: string, limit: number, windowMs: number) {
  const key = `rate-limit:${identifier}`
  const current = await redis.incr(key)

  if (current === 1) {
    await redis.pexpire(key, windowMs)
  }

  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    reset: Date.now() + windowMs
  }
}
```

**Rate Limit Tiers:**
- Anonymous: 20 req/min
- Authenticated: 100 req/min
- Premium: 500 req/min
- Admin: 1000 req/min

**Testing:**
```bash
# Load test with k6
k6 run tests/performance/rate-limit.js
```

**Acceptance Criteria:**
- [ ] Rate limiting works for unauthenticated users
- [ ] Authenticated users get higher limits
- [ ] 429 status code returned when limit exceeded
- [ ] `Retry-After` header included in response

**Estimated Time:** 3-5 days

---

#### Week 7: Encryption
**Priority: HIGH**

**Tasks:**
1. Implement field-level encryption (AES-256)
2. Set up TLS 1.3 (nginx)
3. Add password hashing (Argon2)
4. Implement secrets management
5. Test encryption performance

**Implementation:**
```typescript
// packages/security/src/encryption.ts
import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex")

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(plaintext, "utf8", "hex")
  encrypted += cipher.final("hex")
  const authTag = cipher.getAuthTag()
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
}

export function decrypt(ciphertext: string): string {
  const [ivHex, authTagHex, encrypted] = ciphertext.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const authTag = Buffer.from(authTagHex, "hex")
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}
```

**Acceptance Criteria:**
- [ ] Sensitive fields encrypted in database (email, phone, API keys)
- [ ] TLS 1.3 enforced (no TLS 1.2 or below)
- [ ] Passwords hashed with Argon2 (not bcrypt)
- [ ] Secrets loaded from AWS Secrets Manager (not .env in production)

**Estimated Time:** 5-7 days

---

#### Week 8: Security Scanning
**Priority: MEDIUM**

**Tasks:**
1. Set up SAST (Semgrep)
2. Set up DAST (OWASP ZAP)
3. Set up SCA (Snyk)
4. Configure GitHub Advanced Security
5. Run first security scan

**GitHub Actions Workflow:**
```yaml
# .github/workflows/security.yml
name: Security Scan

on: [push, pull_request]

jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Semgrep
        run: |
          pip install semgrep
          semgrep --config auto --error

  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Snyk
        run: |
          npm install -g snyk
          snyk test --severity-threshold=high

  dast:
    runs-on: ubuntu-latest
    steps:
      - name: OWASP ZAP Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'http://localhost:3000'
```

**Acceptance Criteria:**
- [ ] SAST scans run on every PR
- [ ] Zero critical vulnerabilities
- [ ] Dependency vulnerabilities auto-fixed (Dependabot)
- [ ] DAST scan passes (0 high-severity issues)

**Estimated Time:** 3-5 days

---

### Phase 3: Compliance (Weeks 9-12)

**See SECURITY_ARCHITECTURE_ROADMAP.md for full details**

Key deliverables:
- GDPR data export/deletion endpoints
- Consent management system
- Audit logging infrastructure
- SOC 2 controls documentation
- PCI-DSS compliance (Stripe integration)

---

### Phase 4: Testing (Weeks 13-16)

**See TEST_RESEARCH_PLAN.md for full details**

Key deliverables:
- 500+ unit tests (90% coverage)
- 100+ integration tests
- 20+ E2E tests (Playwright)
- Performance tests (k6)

---

## Critical Decisions Needed

Before starting, you need to decide:

### 1. Hosting & Infrastructure
**Options:**
- **AWS** (recommended for SOC 2 compliance)
- **Vercel** (frontend only, use AWS for backend)
- **Railway** (fast MVP, but compliance harder)

**Recommendation:** AWS for production, Vercel for frontend preview deployments

### 2. Database Hosting
**Options:**
- **Supabase** (PostgreSQL + pgvector, easy GDPR compliance)
- **Neon** (serverless PostgreSQL, auto-scaling)
- **AWS RDS** (full control, SOC 2 ready)

**Recommendation:** Supabase for MVP (fast), migrate to AWS RDS for SOC 2

### 3. Monorepo Tool
**Options:**
- **Turborepo** (recommended, fastest builds)
- **Nx** (more features, steeper learning curve)
- **pnpm workspaces** (minimal, manual)

**Recommendation:** Turborepo (best DX, used by Vercel)

### 4. Backend Language
**Options:**
- **TypeScript** (Next.js API routes + tRPC, simpler monorepo)
- **Python** (FastAPI, better for AI/ML features)
- **Both** (Next.js for simple CRUD, FastAPI for research swarms)

**Recommendation:** Start with Next.js API routes, add FastAPI later for AI features

---

## Cost Estimates (Monthly)

### Development Phase (6 months)
- **Developers**: $15,000-30,000/month (3-5 engineers)
- **Infrastructure**: $200-500/month (staging environment)
- **Tools**: $500-1,000/month (GitHub, Vercel, Supabase, Sentry)
- **Security**: $2,000-5,000 (one-time penetration test)

**Total**: ~$18,000-36,000/month

### Production Phase (After Launch)
- **Infrastructure**: $1,000-3,000/month (AWS, Cloudflare, Supabase)
- **Monitoring**: $500-1,000/month (Datadog, Sentry)
- **Compliance**: $5,000-15,000/year (SOC 2 audit)
- **Security**: $10,000-20,000/year (bug bounty, pen tests)

**Total**: ~$2,500-5,000/month + $15,000-35,000/year one-time costs

---

## Success Metrics (6-Month Checkpoints)

### Month 1 (Foundation)
- [ ] Monorepo set up and building
- [ ] Authentication working (Google OAuth)
- [ ] First 3 database models migrated
- [ ] First API route deployed

### Month 2 (Security Hardening)
- [ ] Input validation on all routes
- [ ] Rate limiting implemented
- [ ] Encryption at rest working
- [ ] First security scan passed

### Month 3 (Compliance)
- [ ] GDPR endpoints functional
- [ ] Audit logging complete
- [ ] SOC 2 controls documented
- [ ] Stripe integration live

### Month 4 (Testing)
- [ ] 90% code coverage
- [ ] 100+ integration tests
- [ ] 20+ E2E tests
- [ ] Load tests passing (1M users)

### Month 5 (Production Prep)
- [ ] Monitoring dashboards live
- [ ] Terraform infrastructure working
- [ ] CI/CD pipeline complete
- [ ] Staging environment stable

### Month 6 (Launch)
- [ ] External penetration test passed
- [ ] Bug bounty program launched
- [ ] Production deployment successful
- [ ] Zero critical bugs in first week

---

## Immediate Next Actions (Today)

1. **Review Both Documents** (2-3 hours)
   - Read TEST_RESEARCH_PLAN.md
   - Read SECURITY_ARCHITECTURE_ROADMAP.md
   - Highlight any unclear sections

2. **Make Infrastructure Decisions** (1 hour)
   - Choose hosting provider (AWS vs Vercel vs Railway)
   - Choose database (Supabase vs Neon vs RDS)
   - Choose monorepo tool (Turborepo vs Nx)

3. **Set Up Accounts** (1-2 hours)
   - AWS account (or Vercel)
   - Supabase account
   - GitHub organization
   - Google Cloud Console (for OAuth)

4. **Initialize Monorepo** (Tomorrow)
   - Follow Week 1 tasks above
   - Set up Turborepo
   - Create Next.js app
   - Push to GitHub

---

## Questions? Blockers?

**Common Questions:**

**Q: Should I start with monorepo or migrate later?**
A: Start with monorepo NOW. Migration later is painful.

**Q: Can I skip authentication and build features first?**
A: NO. Authentication is the foundation. All features depend on it.

**Q: Do I need all 7 security layers for MVP?**
A: Yes, for these reasons:
- GDPR compliance is legally required (EU users)
- Security breaches destroy trust (bad for gig platform)
- Fixing security bugs later costs 10x more

**Q: Can I use AI to generate the code?**
A: Yes, but:
- ✅ Use Claude/ChatGPT for boilerplate (schemas, routes, tests)
- ❌ Don't use AI for security-critical code (auth, encryption) without review
- ✅ Use AI to explain complex security concepts
- ❌ Don't blindly copy-paste AI code without understanding

**Q: How long will this actually take?**
A: Realistic timeline:
- Solo developer: 9-12 months (not recommended for security reasons)
- 2 developers: 6-8 months
- 3-5 developers: 4-6 months (recommended)

**Q: What if I run out of budget?**
A: Prioritize in this order:
1. Authentication + Authorization (CRITICAL)
2. Input validation + Rate limiting (CRITICAL)
3. Encryption + Audit logging (HIGH)
4. GDPR compliance (HIGH for EU, MEDIUM for US-only)
5. SOC 2 compliance (only if selling to enterprises)

---

## Get Started Now

```bash
# Step 1: Create new directory for monorepo
mkdir refleqt-v2.0-monorepo
cd refleqt-v2.0-monorepo

# Step 2: Initialize Turborepo
npx create-turbo@latest

# Step 3: Follow prompts:
# - Package manager: pnpm
# - Include example apps: No (we'll create our own)

# Step 4: Set up workspaces (see Week 1 tasks above)

# Step 5: Come back to this file and check off Week 1 tasks!
```

---

## Document Control

- **Created**: December 30, 2025
- **Owner**: Technical Lead
- **Status**: Active
- **Next Review**: Weekly during Phase 1

**Related Documents:**
- [TEST_RESEARCH_PLAN.md](./TEST_RESEARCH_PLAN.md)
- [SECURITY_ARCHITECTURE_ROADMAP.md](./SECURITY_ARCHITECTURE_ROADMAP.md)

---

**Remember:** Security is not a feature you add later. It's the foundation you build on.

Start with Week 1, and let's build a platform that users can trust. 🚀
