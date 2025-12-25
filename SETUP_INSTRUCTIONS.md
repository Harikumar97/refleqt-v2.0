# Setup Instructions - Fixing Intelligence Feed 404

## What Happened

The Intelligence Feed was returning 404 errors due to several issues:

1. **Prisma 7 Configuration** - Missing `engineType = "binary"` in schema
2. **PrismaClient Initialization** - Multiple instances being created instead of singleton
3. **Development Workflow** - No automated error prevention system

All these issues have been fixed and pushed to the `claude/refleqt-web-app-planning-Jc7VE` branch.

## Quick Fix (3 Steps)

### Step 1: Pull Latest Changes

```bash
git pull origin claude/refleqt-web-app-planning-Jc7VE
```

### Step 2: Verify Setup

```bash
bash scripts/verify-setup.sh
```

This will confirm all files are in place and configured correctly.

### Step 3: Start Development

```bash
npm run dev:safe
```

This will:

- Auto-fix common issues
- Validate your environment
- Start the dev server

Visit: `http://localhost:3000/portal/intelligence-feed`

---

## What You're Getting

### New Files Created

1. **`DEV_WORKFLOW.md`**
   - Complete development workflow documentation
   - Commands for every scenario (daily dev, before commit, after pull, etc.)
   - Troubleshooting guide

2. **`scripts/validate-dev-environment.js`**
   - 8 comprehensive validators:
     - Environment variables
     - Prisma client usage
     - TypeScript compilation
     - Next.js route structure
     - Database connection
     - Prisma client generation
     - Import path consistency
     - Build test
   - Run with: `npm run validate`

3. **`scripts/auto-fix-common-issues.js`**
   - Automatic fixer for common problems:
     - Replaces direct PrismaClient with singleton
     - Removes conflicting metadata exports
     - Clears Next.js cache
     - Regenerates Prisma Client
     - Formats code
   - Run with: `npm run fix`

4. **`scripts/verify-setup.sh`**
   - Quick verification script
   - Confirms all changes were pulled correctly
   - Run after pulling: `bash scripts/verify-setup.sh`

### Updated Files

1. **`package.json`** - New scripts:

   ```json
   {
     "validate": "node scripts/validate-dev-environment.js",
     "fix": "node scripts/auto-fix-common-issues.js",
     "dev:safe": "npm run fix && npm run validate && npm run dev"
   }
   ```

2. **`prisma/schema.prisma`** - Fixed Prisma 7 config:

   ```prisma
   generator client {
     provider        = "prisma-client-js"
     previewFeatures = ["postgresqlExtensions"]
     engineType      = "binary"  // ← Added this
   }
   ```

3. **`src/lib/db/prisma.ts`** - Fixed singleton pattern:

   ```typescript
   const prismaClientSingleton = () => {
     return new PrismaClient({
       log:
         process.env["NODE_ENV"] === "development"
           ? ["error", "warn"]
           : ["error"],
     });
   };

   const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
   export default prisma;
   ```

4. **`src/lib/jobs/queues.ts`** - Fixed dynamic import:

   ```typescript
   // Before: const { PrismaClient } = await import("@prisma/client");
   //         const prisma = new PrismaClient();

   // After:
   const prisma = (await import("@/lib/db/prisma")).default;
   ```

---

## Available Commands

### Recommended Daily Workflow

```bash
# Start every dev session with this
npm run dev:safe
```

### Individual Commands

```bash
# Auto-fix common issues
npm run fix

# Validate environment
npm run validate

# Standard dev server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Format code
npm run format
```

---

## Troubleshooting

### Issue: "npm scripts not found"

**Symptom**: `npm error Missing script: "dev:safe"`

**Fix**:

```bash
# 1. Verify you pulled the latest changes
git log --oneline -3

# Should show:
# 0a2c558 Add setup verification script
# dd4c295 Fix Prisma 7 engine configuration
# 9c29df8 Add comprehensive error handling

# 2. If not, pull again
git pull origin claude/refleqt-web-app-planning-Jc7VE

# 3. Clear npm cache
npm cache clean --force

# 4. Verify scripts exist
npm run
```

### Issue: "Intelligence Feed still shows 404"

**Fix**:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Run auto-fix
npm run fix

# 3. Run validation
npm run validate

# 4. Start fresh
npm run dev
```

### Issue: "PrismaClientInitializationError"

**Fix**:

```bash
# Regenerate Prisma Client
npx prisma generate

# Or use auto-fix
npm run fix
```

### Issue: "WSL crashed or VS Code disconnected"

**Fix**:

```bash
# In PowerShell
wsl --shutdown
wsl

# Then navigate back to project
cd ~/refleqt-v2.0
```

---

## Validation Report Example

When you run `npm run validate`, you'll see:

```
============================================================
🚀 Refleqt Development Environment Validator
============================================================

📋 Checking environment variables...
✅ All environment variables present

🔍 Checking Prisma client usage...
✅ All Prisma usage follows singleton pattern

📝 Checking TypeScript compilation...
✅ TypeScript compilation successful

🗂️  Checking Next.js route structure...
✅ Next.js route structure is valid

🗄️  Checking database connection...
✅ Database connection successful

⚙️  Checking Prisma Client...
✅ Prisma Client is generated

🔗 Checking import path consistency...
✅ Import paths are consistent

🏗️  Running quick build test...
✅ Build test passed

============================================================
Validation Summary
============================================================
✅ Passed: 8
❌ Failed: 0
⚠️  Warnings: 0
============================================================

✨ All checks passed! You're ready to develop.
```

---

## Next Steps After Setup

Once the Intelligence Feed loads successfully:

1. **Set up test user in database** (see database setup in Supabase)
2. **Add RSS sources** via the UI
3. **Test feed refresh** to see new items
4. **Test semantic search** with queries

---

## Why This Workflow Matters

This comprehensive error prevention system prevents:

- ❌ Prisma singleton violations
- ❌ TypeScript compilation errors
- ❌ Next.js routing issues
- ❌ Database connection failures
- ❌ Build failures in production

By running `npm run dev:safe` at the start of each session, you catch issues **before** they become deep bugs.

---

## Questions?

Check `DEV_WORKFLOW.md` for complete development workflow documentation.
