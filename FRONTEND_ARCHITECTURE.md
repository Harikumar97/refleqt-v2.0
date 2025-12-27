# Frontend Architecture Guide

## Overview

This document explains the frontend architecture for Refleqt v2.0, including component structure, styling conventions, and how to develop features in parallel.

## Fixed Issues

### Layout & Overflow

- ✅ Fixed sidebar/main content overlap
- ✅ Added proper z-index stacking (sidebar z-40)
- ✅ Implemented scroll containers for proper overflow handling
- ✅ Prevented horizontal scrolling at root level

### Component Structure

- ✅ Created reusable UI component library
- ✅ Standardized page headers and empty states
- ✅ Consistent card and loading components
- ✅ MOSIP Inclusive UI Guidelines compliance

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (body, html)
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Landing page
│   └── portal/
│       ├── layout.tsx          # Portal layout (sidebar + main)
│       ├── page.tsx            # Dashboard
│       ├── intelligence-feed/  # Feature: Intelligence Feed
│       ├── research-swarms/    # Feature: Research Swarms
│       ├── strategy-cohorts/   # Feature: Strategy Cohorts
│       ├── psychographics/     # Feature: Psychographics
│       ├── brewery/            # Feature: The Brewery
│       └── expert-writers/     # Feature: Expert Writers
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── PageHeader.tsx
│   │   ├── Card.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   └── Sidebar.tsx
│   └── intelligence/           # Feature-specific components
│       ├── IntelligenceFeed.tsx
│       ├── FeedItem.tsx
│       ├── FeedControls.tsx
│       └── AddSourceDialog.tsx
└── lib/                        # Utilities and API clients
```

## Reusable UI Components

### PageHeader

Consistent header for all portal pages with title, description, and actions.

```tsx
import { PageHeader } from "@/components/ui";

<PageHeader
  title="Page Title"
  description="Brief description of the page"
  actions={
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
      Action Button
    </button>
  }
  info={/* Optional info banner */}
/>;
```

### Card

Reusable card component with variants and padding options.

```tsx
import { Card } from "@/components/ui";

<Card variant="default" padding="md">
  {/* Card content */}
</Card>;

// Variants: default | info | warning | error | success
// Padding: sm | md | lg
```

### EmptyState

Consistent empty state display across pages.

```tsx
import { EmptyState } from "@/components/ui";

<EmptyState
  icon={<div className="text-6xl">🚧</div>}
  title="No items yet"
  description="Add your first item to get started"
  action={<button>+ Add Item</button>}
/>;
```

### LoadingSpinner

Consistent loading indicator.

```tsx
import { LoadingSpinner } from "@/components/ui";

<LoadingSpinner size="md" message="Loading..." />;
```

## Layout Architecture

### Portal Layout (src/app/portal/layout.tsx)

```tsx
<div className="flex min-h-screen bg-gray-950 overflow-hidden">
  <Sidebar /> {/* Fixed left sidebar, z-40 */}
  <main className="flex-1 ml-64 overflow-y-auto overflow-x-hidden">
    <div className="p-8 max-w-7xl mx-auto">{children}</div>
  </main>
</div>
```

**Key Features:**

- Sidebar is fixed at 256px width (w-64)
- Main content has ml-64 to avoid overlap
- Proper overflow handling (y-scroll, no x-scroll)
- z-index: sidebar (40) > main content (auto)

### Responsive Considerations

Currently optimized for desktop. For mobile:

- Consider collapsible sidebar
- Adjust ml-64 for smaller screens
- Use Tailwind breakpoints (sm:, md:, lg:, xl:)

## Styling Conventions

### Color Palette

```css
/* Background Colors */
--background: #0a0a0f;      /* Body background */
bg-gray-950                  /* Main background */
bg-gray-900                  /* Sidebar background */
bg-gray-800                  /* Card background */

/* Text Colors */
--foreground: #ededed;       /* Main text */
text-white                   /* Headers */
text-gray-300                /* Descriptions */
text-gray-400                /* Muted text */

/* Accent Colors */
bg-blue-600                  /* Primary actions */
bg-purple-600                /* Research Swarms */
bg-orange-600                /* Strategy Cohorts */
bg-green-600                 /* Success states */
bg-red-600                   /* Error states */
```

### Spacing

```css
space-y-6    /* Vertical spacing between sections */
space-y-3    /* Vertical spacing between items */
gap-4        /* Grid gap */
p-6          /* Card padding (medium) */
p-8          /* Page padding */
```

## Developing Features in Parallel

### Step 1: Create Page Structure

Each feature should have its own directory under `src/app/portal/`.

```tsx
// src/app/portal/your-feature/page.tsx
import { PageHeader, Card, EmptyState } from "@/components/ui";

export default function YourFeature() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Feature Title"
        description="Feature description"
        actions={<button>Action</button>}
      />

      {/* Your feature content */}
    </div>
  );
}
```

### Step 2: Create Feature Components

Create feature-specific components in `src/components/your-feature/`.

```tsx
// src/components/your-feature/YourComponent.tsx
"use client";

export function YourComponent() {
  // Component logic
  return <div>{/* Component UI */}</div>;
}
```

### Step 3: Create API Routes

Create API endpoints in `src/app/api/your-feature/`.

```tsx
// src/app/api/your-feature/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // API logic
  return NextResponse.json({ success: true, data: {} });
}
```

### Step 4: Add Navigation

Navigation is automatically generated from `navigationItems` in `src/components/layout/Sidebar.tsx`.

```tsx
const navigationItems: NavItem[] = [
  {
    name: "Your Feature",
    href: "/portal/your-feature",
    icon: "🔥",
    description: "Feature tagline",
  },
];
```

## Best Practices

### 1. Use TypeScript

Always define interfaces for props and data structures.

```tsx
interface YourComponentProps {
  title: string;
  data: DataType[];
  onAction: () => void;
}
```

### 2. Client vs Server Components

- Use `"use client"` for interactive components
- Keep server components for data fetching
- Minimize client-side JavaScript

### 3. Error Handling

Always handle loading and error states.

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

if (loading) return <LoadingSpinner />;
if (error) return <Card variant="error">{error}</Card>;
```

### 4. MOSIP UI Guidelines

Follow these principles:

1. **Detailed task information upfront** - Use PageHeader
2. **Clear progression cues** - Show loading states
3. **Explain warnings clearly** - Use error Card variants
4. **Avoid cluttering** - Use EmptyState for zero states
5. **Adequate feedback** - Loading spinners and success messages

## Testing Frontend Changes

### Start Dev Server

```bash
npm run dev
```

### Check for TypeScript Errors

```bash
npm run type-check
```

### Format Code

```bash
npm run format
```

### Validate Build

```bash
npm run validate  # Runs type-check + build
```

## Parallel Development Workflow

### Option 1: Feature Branch per Developer

```bash
# Developer 1: Research Swarms
git checkout -b feature/research-swarms
# Work on src/app/portal/research-swarms/
# Work on src/components/research-swarms/

# Developer 2: Strategy Cohorts
git checkout -b feature/strategy-cohorts
# Work on src/app/portal/strategy-cohorts/
# Work on src/components/strategy-cohorts/
```

### Option 2: Page-by-Page Development

1. **Intelligence Feed** (✅ Complete)
   - Page: src/app/portal/intelligence-feed/
   - Components: src/components/intelligence/
   - API: src/app/api/intelligence/

2. **Research Swarms** (🚧 Template Ready)
   - Page: src/app/portal/research-swarms/
   - Components: src/components/research-swarms/ (to create)
   - API: src/app/api/research-swarms/ (to create)

3. **Strategy Cohorts** (🚧 Template Ready)
   - Page: src/app/portal/strategy-cohorts/
   - Components: src/components/strategy-cohorts/ (to create)
   - API: src/app/api/strategy-cohorts/ (to create)

4. **Psychographics** (🏗️ Needs Template)
5. **The Brewery** (🏗️ Needs Template)
6. **Expert Writers** (🏗️ Needs Template)

## Common Issues & Solutions

### Issue: Text Overlapping

**Solution:** Check that parent containers have proper overflow handling:

```css
overflow-y-auto overflow-x-hidden
```

### Issue: Sidebar Covering Content

**Solution:** Ensure main content has margin-left equal to sidebar width:

```css
ml-64  /* Matches sidebar w-64 */
```

### Issue: Scrolling Not Working

**Solution:** Ensure parent has defined height:

```css
min-h-screen  /* or h-screen for fixed height */
```

### Issue: Components Not Found

**Solution:** Use path aliases defined in tsconfig.json:

```tsx
import { Component } from "@/components/ui"; // ✅ Correct
import { Component } from "../../components/ui"; // ❌ Avoid
```

## Next Steps

1. ✅ Intelligence Feed - Fully functional
2. 🚧 Add source management UI improvements
3. 🚧 Implement Research Swarms backend + frontend
4. 🚧 Implement Strategy Cohorts backend + frontend
5. 🏗️ Build Psychographics feature
6. 🏗️ Build The Brewery feature
7. 🏗️ Build Expert Writers feature

## Resources

- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Next.js App Router:** https://nextjs.org/docs/app
- **MOSIP UI Guidelines:** See ARCHITECTURE_PLAN.md
- **TypeScript:** https://www.typescriptlang.org/docs

## Questions?

Refer to existing implementations:

- **Complete Feature:** `src/app/portal/intelligence-feed/`
- **Template:** `src/app/portal/research-swarms/`
- **UI Components:** `src/components/ui/`
