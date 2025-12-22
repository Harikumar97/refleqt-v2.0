# Power of Ten Rules Implementation

This project implements NASA's Power of Ten rules for safety-critical code development.

## Rules Implementation

### Rule 1: Simple Control Flow - No Recursion ✅

**Enforcement:**

- ESLint rule: `no-restricted-syntax` (blocks setjmp/longjmp)
- Manual code review required for recursion
- All algorithms must use iterative approaches with bounded loops

**Example:**

```typescript
// ❌ BAD - Recursive
function traverse(node: Node): void {
  if (node.children) {
    node.children.forEach((child) => traverse(child));
  }
}

// ✅ GOOD - Iterative with bounds
function traverse(root: Node): void {
  const queue: Node[] = [root];
  let iterations = 0;

  while (queue.length > 0 && iterations < MAX_ITERATIONS) {
    const node = queue.shift()!;
    // Process node...
    iterations++;
  }
}
```

### Rule 2: Fixed Loop Bounds ✅

**Enforcement:**

- All loops must have explicit upper bounds
- Use constants from `src/constants/index.ts`
- Utility: `safeIterate()` in `src/utils/safety.ts`

**Example:**

```typescript
import { BOUNDS } from "@/constants";
import { safeIterate } from "@/utils/safety";

// ✅ GOOD - Bounded iteration
const result = safeIterate(
  items,
  (item, index) => {
    processItem(item);
  },
  BOUNDS.MAX_FEED_ITEMS
);
```

### Rule 3: No Dynamic Memory After Init ✅

**Enforcement:**

- Pre-allocated buffers using `FixedBuffer<T>` class
- Located in `src/utils/safety.ts`

**Example:**

```typescript
import { FixedBuffer } from "@/utils/safety";

const feedBuffer = new FixedBuffer<FeedItem>(MAX_FEED_ITEMS);
const result = feedBuffer.add(newItem);

if (!result.success) {
  console.error("Buffer full:", result.error);
}
```

### Rule 4: Function Length ≤ 60 Lines ✅

**Enforcement:**

- ESLint rule: `max-lines-per-function` set to 60 lines
- Automatic checking on save and pre-commit

### Rule 5: Minimum 2 Assertions Per Function ✅

**Enforcement:**

- Assertion utilities in `src/utils/assert.ts`
- Manual verification during code review

**Available Assertions:**

- `assert(condition, message)` - Basic assertion
- `assertDefined(value, message)` - Null/undefined check
- `assertInRange(value, min, max, message)` - Range validation
- `assertMaxLength(array, max, message)` - Array bounds
- `assertNonEmptyString(value, message)` - String validation

**Example:**

```typescript
import { assert, assertInRange } from "@/utils/assert";

function calculateScore(engagement: number): number {
  // Assertion 1: Validate input range
  assertInRange(engagement, 0, 100, "Engagement must be 0-100");

  const score = engagement * 0.1;

  // Assertion 2: Validate output range
  assertInRange(score, 0, 10, "Score must be 0-10");

  return score;
}
```

### Rule 6: Smallest Scope ✅

**Enforcement:**

- ESLint rules: `block-scoped-var`, `no-var`, `prefer-const`, `no-shadow`
- TypeScript strict mode enforces proper scoping

### Rule 7: Check All Return Values ✅

**Enforcement:**

- TypeScript rules: `@typescript-eslint/no-floating-promises`
- `SafeResult<T, E>` type in `src/utils/safety.ts`
- All functions return explicit success/error states

**Example:**

```typescript
import { SafeResult } from "@/utils/safety";

function processData(input: string): SafeResult<Data> {
  if (!input) {
    return { success: false, error: new Error("Input required") };
  }

  return { success: true, value: parseData(input) };
}

// Usage
const result = processData(userInput);
if (!result.success) {
  console.error("Processing failed:", result.error);
  return;
}

// Safe to use result.value here
const data = result.value;
```

### Rule 8: Limited Metaprogramming ✅

**Enforcement:**

- ESLint rules: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/ban-ts-comment`
- Avoid complex TypeScript type gymnastics
- No conditional compilation beyond standard NODE_ENV checks

### Rule 9: Limit Indirection ✅

**Enforcement:**

- ESLint rules: `max-depth` (max 3), `complexity` (max 10)
- Avoid deep object nesting
- Use explicit checks instead of optional chaining

### Rule 10: Zero Warnings ✅

**Enforcement:**

- TypeScript strict mode (all strict flags enabled)
- ESLint with `--max-warnings 0`
- Pre-commit hooks enforce zero warnings
- Scripts: `npm run safety-check`

## Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Full safety check
npm run safety-check
```

### Pre-Commit

The pre-commit hook automatically runs:

1. TypeScript type checking
2. ESLint with zero warnings
3. Prettier formatting
4. lint-staged for changed files

### VS Code Setup

Required extensions (auto-recommended):

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens (shows errors inline)
- SonarLint (additional static analysis)

Settings are configured in `.vscode/settings.json` for:

- Format on save
- Auto-fix ESLint on save
- Strict type checking

## Safety Utilities

All safety utilities are located in `src/utils/`:

- `assert.ts` - Assertion functions (Rule 5)
- `safety.ts` - Safe iteration, buffers, bounds checking (Rules 2, 3, 9)

## Type Safety

All types are defined in `src/types/index.ts` with:

- No `any` types allowed
- Explicit return types required
- Strict null checks enabled
- No implicit type coercion

## Constants

All magic numbers and bounds are defined in `src/constants/index.ts`:

- `BOUNDS` - Iteration and size limits
- `SCORE_RANGES` - Valid score ranges
- `FEATURE_LIMITS` - Feature tier limits
- `API_CONFIG` - API timeouts and retries

## Testing (TODO)

Testing framework will follow same safety principles:

- Unit tests for all utilities
- Integration tests for API routes
- E2E tests for critical user flows
- 100% coverage requirement for safety-critical paths

## Continuous Integration (TODO)

CI pipeline will enforce:

- Zero TypeScript errors
- Zero ESLint warnings
- All tests passing
- Code coverage thresholds
- Build success

## Additional Resources

- [NASA Power of Ten Rules (PDF)](http://spinroot.com/gerard/pdf/P10.pdf)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
