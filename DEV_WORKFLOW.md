# Development Workflow & Error Prevention

This document outlines the comprehensive development workflow designed to prevent deep bugs and ensure seamless code development.

## Quick Start (Recommended)

### Start Development Safely

```bash
npm run dev:safe
```

This command:

1. ✅ Auto-fixes common issues
2. ✅ Validates your environment
3. ✅ Starts the dev server

### Manual Workflow

```bash
# Step 1: Fix common issues
npm run fix

# Step 2: Validate environment
npm run validate

# Step 3: Start development
npm run dev
```

---

## Available Commands

### Automated Tools

| Command            | Purpose                         | When to Use                             |
| ------------------ | ------------------------------- | --------------------------------------- |
| `npm run fix`      | Auto-fix common issues          | Before starting development, after pull |
| `npm run validate` | Comprehensive environment check | Before committing, after setup changes  |
| `npm run dev:safe` | Fix + Validate + Start server   | Every development session start         |

### Standard Commands

| Command              | Purpose                      |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm run build`      | Production build             |
| `npm run type-check` | TypeScript compilation check |
| `npm run lint`       | ESLint check                 |
| `npm run format`     | Format code with Prettier    |

---

## What Gets Checked

### 1. Environment Variables ✅

- DATABASE_URL
- DIRECT_URL
- REDIS_URL
- All LLM API keys
- NextAuth configuration

**Auto-Fix**: ❌ Prompts you to add missing vars

### 2. Prisma Client Usage ✅

- No direct `new PrismaClient()` instantiation
- All imports use singleton pattern
- Dynamic imports use singleton

**Auto-Fix**: ✅ Replaces with singleton imports automatically

### 3. TypeScript Compilation ✅

- Full type check
- No compilation errors

**Auto-Fix**: ❌ Shows errors with line numbers

### 4. Next.js Route Structure ✅

- Pages have default exports
- No metadata exports in client components
- Proper "use client" directives

**Auto-Fix**: ✅ Removes metadata from client pages

### 5. Database Connection ✅

- Supabase is reachable
- Can execute queries

**Auto-Fix**: ❌ Check connection strings in .env.local

### 6. Prisma Client Generation ✅

- Client exists in node_modules
- Up to date with schema

**Auto-Fix**: ✅ Regenerates Prisma Client

### 7. Import Path Consistency ✅

- Uses @ alias instead of deep ../../../
- Consistent import style

**Auto-Fix**: ⚠️ Warns but doesn't block

### 8. Build Test ✅

- Production build succeeds
- No build-time errors

**Auto-Fix**: ❌ Shows build errors

---

## Common Issues & Automated Fixes

### Issue: Page shows 404

**Detection**: Route structure validator
**Auto-Fix**:

- Clears Next.js cache
- Removes conflicting metadata exports
- Regenerates Prisma Client

**Manual Fix** (if auto-fix fails):

```bash
rm -rf .next
npm run dev
```

### Issue: PrismaClientInitializationError

**Detection**: Prisma usage scanner
**Auto-Fix**:

- Replaces all `new PrismaClient()` with singleton import
- Updates dynamic imports

**Result**: ✅ Automatically fixed in all files

### Issue: "Cannot find module '@/components/...'"

**Detection**: Import path consistency check
**Auto-Fix**: ❌ Manual fix required

**Manual Fix**:

1. Check if file exists: `ls src/components/intelligence/ComponentName.tsx`
2. Verify export: `grep "export" src/components/intelligence/ComponentName.tsx`
3. Restart TypeScript server in VS Code

### Issue: Build fails with type errors

**Detection**: TypeScript compilation check
**Auto-Fix**: ❌ Manual fix required

**Manual Fix**: Review error messages and fix type issues

---

## Development Protocol

### Every Development Session

```bash
# Option A: Automated (Recommended)
npm run dev:safe

# Option B: Manual
npm run fix
npm run validate
npm run dev
```

### Before Committing

```bash
npm run validate
npm run type-check
npm run lint
```

### After Pulling Changes

```bash
npm install          # Update dependencies
npm run fix          # Fix any issues
npm run validate     # Ensure environment is ready
```

### After Schema Changes

```bash
npx prisma generate  # Regenerate client
npm run fix          # Clear cache and regenerate
```

---

## Validation Reports

### Example: All Checks Pass

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

### Example: Issues Found

```
============================================================
🚀 Refleqt Development Environment Validator
============================================================

📋 Checking environment variables...
✅ All environment variables present

🔍 Checking Prisma client usage...
❌ checkPrismaUsage FAILED
   Error: Found 2 Prisma singleton violations:
     ./src/lib/jobs/queues.ts:104 - Direct PrismaClient instantiation found
     ./src/app/api/test/route.ts:5 - Direct PrismaClient import
   💡 Fix: Replace with: import prisma from "@/lib/db/prisma";

============================================================
Validation Summary
============================================================
✅ Passed: 1
❌ Failed: 1
⚠️  Warnings: 0
============================================================

⛔ Please fix the errors above before continuing development
```

---

## Auto-Fix Reports

### Example: Auto-Fix Run

```
============================================================
🔧 Refleqt Auto-Fixer
============================================================

📝 Fixing Prisma Client usage...
  ✅ Fixed: ./src/lib/jobs/queues.ts
  ✅ Fixed: ./src/app/api/test/route.ts

✅ Fixed Prisma usage in 2 file(s)

📝 Fixing metadata in client pages...
  ✅ Fixed: ./src/app/portal/intelligence-feed/page.tsx

✅ Fixed metadata exports in 1 file(s)

🗑️  Clearing Next.js cache...
  ✅ Cleared .next directory

⚙️  Regenerating Prisma Client...
  ✅ Prisma Client regenerated

✨ Formatting code...
  ✅ Code formatted

============================================================
Summary
============================================================

✅ Applied 5 fix(es):
  • Fixed Prisma Client usage in 2 files
  • Fixed metadata in 1 client pages
  • Cleared Next.js cache
  • Regenerated Prisma Client
  • Formatted code with Prettier

Next steps:
  1. Run: npm run dev
  2. Visit: http://localhost:3000/portal/intelligence-feed
```

---

## Integration with Git Workflow

### Pre-Commit Hook (Recommended)

Add to `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run validation before commit
npm run validate || exit 1

# Run type check
npm run type-check || exit 1
```

This ensures:

- ✅ No broken code is committed
- ✅ All checks pass before push
- ✅ Consistent code quality

---

## Troubleshooting

### Validation fails with network errors

**Cause**: WSL networking issues or Supabase unreachable

**Fix**:

1. Check internet connection
2. Verify Supabase is not down
3. Try running from Windows PowerShell instead of WSL

### Auto-fix doesn't resolve issue

**Cause**: Issue requires manual intervention

**Fix**:

1. Read the error message carefully
2. Check `tests/TESTING_PROTOCOL.md` for detailed debugging steps
3. Fix manually and re-run validation

### Build test times out

**Cause**: Large build or slow machine

**Fix**: Skip build test for development:

```bash
# Edit scripts/validate-dev-environment.js
# Comment out the checkBuildQuick validator
```

---

## Best Practices

### DO ✅

- Run `npm run dev:safe` at start of each session
- Run `npm run validate` before committing
- Run `npm run fix` after pulling changes
- Keep environment variables up to date

### DON'T ❌

- Skip validation when you see errors
- Commit code that fails validation
- Ignore auto-fix suggestions
- Use `new PrismaClient()` directly

---

## Performance

### Validation Speed

| Check                  | Typical Time |
| ---------------------- | ------------ |
| Environment variables  | < 1s         |
| Prisma usage scan      | 2-5s         |
| TypeScript compilation | 5-15s        |
| Route structure        | 1-2s         |
| Database connection    | 1-3s         |
| Build test             | 30-60s       |

**Total**: ~1-2 minutes for full validation

### Auto-Fix Speed

| Fix              | Typical Time |
| ---------------- | ------------ |
| Prisma usage     | 1-3s         |
| Metadata cleanup | < 1s         |
| Cache clear      | < 1s         |
| Prisma generate  | 5-10s        |
| Code format      | 5-15s        |

**Total**: ~15-30 seconds for full auto-fix

---

## Future Enhancements

### Planned Features

- [ ] Parallel validation for faster checks
- [ ] Git pre-push hook integration
- [ ] Database schema drift detection
- [ ] API endpoint health checks
- [ ] Component import circular dependency detection
- [ ] Bundle size monitoring
- [ ] Performance regression detection

---

## Support

### Getting Help

1. **Check documentation**: `tests/TESTING_PROTOCOL.md`
2. **Run diagnostics**: `npm run validate`
3. **Auto-fix**: `npm run fix`
4. **Review errors**: Read error messages and suggested fixes

### Reporting Issues

If validation reports a false positive:

1. Document the scenario
2. Note the validator that failed
3. Provide the error message
4. Submit feedback with reproduction steps
