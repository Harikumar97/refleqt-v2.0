# Refleqt v2.0 - Architecture Analysis & Remediation Plan

**Date**: 2025-12-27
**Status**: Critical Issues Identified
**Priority**: High

---

## Executive Summary

This document provides a comprehensive analysis of the current frontend architecture, identifies critical issues with placeholder data, layout concerns, and provides a detailed remediation plan with proper backend integration.

### Critical Issues Identified

1. **Placeholder Data Not Connected to Backend** ❌
2. **No Authentication/User Session Management** ❌
3. **Potential Layout Overlap Issues** ⚠️
4. **Insufficient Visual Hierarchy** ⚠️
5. **Missing Backend Parameter Documentation** ❌

---

## 1. Layout Architecture Analysis

### Current Implementation

**File**: `src/app/portal/layout.tsx`

```tsx
<div className="flex min-h-screen bg-gray-950 overflow-hidden">
  <Sidebar /> {/* Fixed, w-64, z-40 */}
  <main className="flex-1 ml-64 overflow-y-auto overflow-x-hidden">
    <div className="p-8 max-w-7xl mx-auto">{children}</div>
  </main>
  <ToastContainer />
</div>
```

**File**: `src/components/layout/Sidebar.tsx`

```tsx
<aside className="fixed left-0 top-0 h-screen w-64
                bg-gradient-to-b from-gray-800 to-gray-900
                z-40 overflow-y-auto ...">
```

### Analysis

| Aspect              | Current State            | Issue                               | Risk Level |
| ------------------- | ------------------------ | ----------------------------------- | ---------- |
| Sidebar Position    | `fixed left-0 top-0`     | ✅ Correct                          | Low        |
| Sidebar Width       | `w-64` (16rem = 256px)   | ✅ Correct                          | Low        |
| Main Content Offset | `ml-64` (16rem = 256px)  | ✅ Correct                          | Low        |
| Z-Index             | Sidebar: `z-40`          | ⚠️ May conflict with modals/dialogs | Medium     |
| Responsive Design   | ❌ No mobile breakpoints | ❌ Sidebar overlaps on mobile       | **HIGH**   |
| Visual Separation   | Gradient background      | ⚠️ Needs stronger borders           | Low        |

### Root Cause of Overlap

The layout code is **technically correct** for desktop, but:

1. **No responsive breakpoints** - On screens < 1024px, sidebar overlaps content
2. **No sidebar toggle** - Mobile users cannot hide sidebar
3. **Fixed positioning without media queries** - Sidebar always visible

---

## 2. Placeholder Data Audit

### Current Placeholders vs Backend Sources

#### Sidebar User Section (`src/components/layout/Sidebar.tsx` lines 140-175)

| Placeholder     | Current Value          | Backend Source                              | Status       |
| --------------- | ---------------------- | ------------------------------------------- | ------------ |
| Avatar Initial  | `"A"`                  | `user.name[0]` or `user.email[0]`           | ❌ Hardcoded |
| User Name       | `"Alex Chen"`          | `user.name` from Prisma User model          | ❌ Hardcoded |
| User Title      | `"Founder • TaskFlow"` | `user.profile.companyName` from UserProfile | ❌ Hardcoded |
| Obsession Score | From GlobalState (8.4) | `user.profile.obsessionScore` from DB       | ⚠️ Partial   |

#### Platform Status (`src/components/layout/Sidebar.tsx` lines 156-174)

| Item                   | Current Value                       | Backend Source                         | Status       |
| ---------------------- | ----------------------------------- | -------------------------------------- | ------------ |
| Research Swarm Status  | `<NavStatus status="running" />`    | Real-time from ResearchSwarm.status    | ❌ Hardcoded |
| Strategy Cohort Status | `<NavStatus status="running" />`    | Real-time from StrategyCohort activity | ❌ Hardcoded |
| Data Pipeline Status   | `<NavStatus status="processing" />` | System health check API                | ❌ Hardcoded |

#### Company Header (`src/components/layout/CompanyHeader.tsx`)

| Element      | Current Value                | Backend Source                         | Status       |
| ------------ | ---------------------------- | -------------------------------------- | ------------ |
| Company Name | `"Refleqt"`                  | `user.profile.companyName`             | ❌ Hardcoded |
| Logo Initial | `"R"`                        | `user.profile.companyName[0]`          | ❌ Hardcoded |
| Subtitle     | `"🧠 Intelligence Platform"` | Static (OK) or `user.profile.industry` | ✅ Static OK |

---

## 3. Data Flow Architecture

### Required Data Flow: User Authentication → UI

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. NextAuth Session Provider                         │  │
│  │     - Wraps entire app                                │  │
│  │     - Provides: session, user, status                 │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  2. useSession() Hook                                 │  │
│  │     - Returns: { data: session, status: "loading" }   │  │
│  │     - session.user: { id, name, email, image }        │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  3. User Context Provider (NEW - TO CREATE)           │  │
│  │     - Fetches UserProfile from API                    │  │
│  │     - Provides: user, profile, loading, error         │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  4. UI Components                                     │  │
│  │     - Sidebar: useUser() → name, companyName          │  │
│  │     - ObsessionWidget: profile.obsessionScore         │  │
│  │     - CompanyHeader: profile.companyName              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (API Routes)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GET /api/user/profile                                │  │
│  │  - Auth: NextAuth session                             │  │
│  │  - Returns: UserProfile + User                        │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │                                          │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  Prisma Client                                        │  │
│  │  - Query: user.findUnique({ include: { profile } })   │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL + Supabase)                │
│                                                              │
│  ┌──────────────┐      ┌───────────────────┐               │
│  │   users      │──┐   │   user_profiles   │               │
│  ├──────────────┤  │   ├───────────────────┤               │
│  │ id (PK)      │  └──→│ user_id (FK)      │               │
│  │ email        │      │ company_name      │               │
│  │ name         │      │ industry          │               │
│  │ created_at   │      │ obsession_score   │               │
│  └──────────────┘      └───────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Backend Parameter Documentation

### Database Schema: User & UserProfile

#### User Model (`prisma/schema.prisma` lines 18-40)

| Field       | Type          | Required | Purpose           | UI Usage               |
| ----------- | ------------- | -------- | ----------------- | ---------------------- |
| `id`        | String (UUID) | Yes      | Primary key       | Session identification |
| `email`     | String        | Yes      | Unique identifier | Login, display         |
| `name`      | String        | Yes      | Full name         | Sidebar user section   |
| `password`  | String?       | Optional | Hashed password   | Authentication         |
| `createdAt` | DateTime      | Yes      | Registration date | Account age tracking   |
| `updatedAt` | DateTime      | Yes      | Last update       | Data freshness         |

#### UserProfile Model (`prisma/schema.prisma` lines 42-56)

| Field               | Type          | Required | Default | Purpose             | UI Usage                    |
| ------------------- | ------------- | -------- | ------- | ------------------- | --------------------------- |
| `id`                | String (UUID) | Yes      | -       | Primary key         | -                           |
| `userId`            | String (UUID) | Yes      | -       | FK to User          | Relation                    |
| `companyName`       | String        | Yes      | -       | User's company      | **Sidebar, Company Header** |
| `industry`          | String        | Yes      | -       | Business sector     | Context, filtering          |
| `businessChallenge` | String?       | Optional | -       | Onboarding input    | Personalization             |
| `obsessionScore`    | Decimal(3,1)  | Yes      | 0.0     | Engagement metric   | **Obsession Widget**        |
| `createdAt`         | DateTime      | Yes      | now()   | Profile creation    | -                           |
| `updatedAt`         | DateTime      | Yes      | now()   | Last profile update | -                           |

### Data Flow Parameters

#### API Endpoint: `GET /api/user/profile`

**Request**:

```typescript
// Headers
Authorization: Bearer <session-token> // From NextAuth

// No body required - user identified from session
```

**Response**:

```typescript
{
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: string; // ISO 8601
    };
    profile: {
      id: string;
      companyName: string;
      industry: string;
      businessChallenge?: string;
      obsessionScore: number; // 0.0 - 10.0
      createdAt: string; // ISO 8601
      updatedAt: string; // ISO 8601
    };
  };
  error?: string;
}
```

---

## 5. Component-Level Backend Integration Map

### 5.1 Sidebar.tsx

**Current State**: All hardcoded
**Required Integration**:

| UI Element             | Data Source                         | Implementation                                                                              |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| User Avatar Initial    | `user.name[0]` or `user.email[0]`   | `const initial = user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";` |
| User Name              | `user.name`                         | `{user?.name ?? "Loading..."}`                                                              |
| User Company/Title     | `profile.companyName`               | `{profile?.companyName ?? "Company"}`                                                       |
| Research Swarm Status  | API: `/api/research-swarms/status`  | Real-time polling or WebSocket                                                              |
| Strategy Cohort Status | API: `/api/strategy-cohorts/status` | Real-time polling or WebSocket                                                              |
| Data Pipeline Status   | API: `/api/system/health`           | Real-time polling                                                                           |

**Required Context**:

```typescript
import { useUser } from "@/contexts/UserContext";

export default function Sidebar() {
  const { user, profile, loading } = useUser();

  // Use user and profile data instead of hardcoded values
}
```

### 5.2 CompanyHeader.tsx

**Current State**: Hardcoded "Refleqt"
**Required Integration**:

| UI Element           | Data Source              | Implementation                                      |
| -------------------- | ------------------------ | --------------------------------------------------- |
| Company Logo Initial | `profile.companyName[0]` | `{profile?.companyName?.[0]?.toUpperCase() ?? "R"}` |
| Company Name         | `profile.companyName`    | `{profile?.companyName ?? "Refleqt"}`               |

**Required Context**:

```typescript
import { useUser } from "@/contexts/UserContext";

export function CompanyHeader() {
  const { profile } = useUser();

  // Use profile.companyName instead of "Refleqt"
}
```

### 5.3 ObsessionWidget.tsx

**Current State**: Uses GlobalStateContext (score: 8.4)
**Required Integration**:

| Data Point      | Current Source                             | Backend Source                     | Integration                         |
| --------------- | ------------------------------------------ | ---------------------------------- | ----------------------------------- |
| Obsession Score | `globalState.obsessionScore` (default 8.4) | `profile.obsessionScore` (Decimal) | Initialize from DB, sync on updates |
| Obsession Level | Calculated from score                      | Calculated from score              | ✅ Keep current logic               |

**Required Changes**:

1. **Initial load**: Fetch `profile.obsessionScore` from backend
2. **Updates**: When score changes, call API to persist: `PUT /api/user/profile/obsession-score`
3. **Sync**: GlobalState should be initialized from DB, not hardcoded 8.4

---

## 6. Missing Backend Endpoints

### Required API Routes (To Create)

#### 6.1 User Profile

```typescript
// GET /api/user/profile
// Returns current user's profile data

// PUT /api/user/profile
// Updates user profile (companyName, industry, businessChallenge)
// Body: { companyName?: string, industry?: string, businessChallenge?: string }

// PUT /api/user/profile/obsession-score
// Updates obsession score
// Body: { score: number, factors?: Record<string, any> }
```

#### 6.2 System Status

```typescript
// GET /api/system/status
// Returns real-time status of:
// - Research swarms (running count)
// - Strategy cohorts (active count)
// - Data pipeline (health status)

// Response:
{
  researchSwarms: { status: "running" | "idle", activeCount: number },
  strategyCohorts: { status: "running" | "idle", activeCount: number },
  dataPipeline: { status: "healthy" | "processing" | "error" }
}
```

---

## 7. Visual Hierarchy Improvements

### Current Issues

1. **Transparency**: Some backgrounds use transparency when solid is needed
2. **Weak Borders**: Borders are too subtle (`border-gray-700`)
3. **Unclear Zones**: Menu, feed, toolbar areas not distinct

### Proposed Changes

#### Color System Enhancement

```css
/* Add to design-system.css */

/* Layout Zones */
:root {
  /* Sidebar Zone */
  --sidebar-bg: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  --sidebar-border: #374151;

  /* Main Content Zone */
  --content-bg: #0f172a; /* Solid, not transparent */
  --content-border: #1e293b;

  /* Card/Panel Zone */
  --panel-bg: #1e293b; /* Solid */
  --panel-border: #334155;

  /* Toolbar Zone */
  --toolbar-bg: #1e293b;
  --toolbar-border: #334155;

  /* Interactive Areas */
  --interactive-hover: #334155;
  --interactive-active: #3b82f6;
}
```

#### Layout Updates

| Zone         | Current                                      | Proposed                                                  | Reasoning                    |
| ------------ | -------------------------------------------- | --------------------------------------------------------- | ---------------------------- |
| Sidebar      | `bg-gradient-to-b from-gray-800 to-gray-900` | ✅ Keep                                                   | Good visual hierarchy        |
| Main Content | `bg-gray-950` (very dark)                    | `bg-slate-900` (#0f172a)                                  | Better contrast with sidebar |
| Cards/Panels | `bg-gray-800`                                | `bg-slate-800` (#1e293b) with `border-2 border-slate-700` | Stronger definition          |
| Buttons      | Various                                      | Add `ring-2 ring-offset-2` on focus                       | Accessibility                |

---

## 8. Remediation Plan

### Phase 1: Authentication & User Context (Priority: CRITICAL)

**Tasks**:

1. ✅ NextAuth is already configured (verify)
2. ❌ Create `/api/user/profile` endpoint
3. ❌ Create `UserContext` provider
4. ❌ Create `useUser()` hook
5. ❌ Wrap app with `UserProvider`

**Files to Create**:

- `src/contexts/UserContext.tsx`
- `src/hooks/useUser.ts`
- `src/app/api/user/profile/route.ts`

**Estimated Time**: 2-3 hours
**Impact**: HIGH - Unlocks all dynamic data

---

### Phase 2: Replace Placeholder Data (Priority: HIGH)

**Tasks**:

1. ❌ Update `Sidebar.tsx` to use `useUser()`
2. ❌ Update `CompanyHeader.tsx` to use `useUser()`
3. ❌ Update `ObsessionWidget.tsx` to initialize from DB
4. ❌ Add loading states for user data
5. ❌ Add error handling for failed API calls

**Files to Modify**:

- `src/components/layout/Sidebar.tsx`
- `src/components/layout/CompanyHeader.tsx`
- `src/components/layout/ObsessionWidget.tsx`
- `src/contexts/GlobalStateContext.tsx` (initialize from DB)

**Estimated Time**: 1-2 hours
**Impact**: HIGH - Removes all hardcoded data

---

### Phase 3: Layout & Responsiveness (Priority: MEDIUM)

**Tasks**:

1. ❌ Add responsive breakpoints for sidebar
2. ❌ Create sidebar toggle for mobile
3. ❌ Add `SidebarContext` for open/close state
4. ❌ Update z-index hierarchy
5. ❌ Test on mobile/tablet sizes

**Files to Create**:

- `src/contexts/SidebarContext.tsx`

**Files to Modify**:

- `src/components/layout/Sidebar.tsx`
- `src/app/portal/layout.tsx`

**Estimated Time**: 2-3 hours
**Impact**: MEDIUM - Fixes mobile experience

---

### Phase 4: Visual Hierarchy (Priority: MEDIUM)

**Tasks**:

1. ❌ Add stronger borders to cards/panels
2. ❌ Update color system in `design-system.css`
3. ❌ Add zone-specific background colors
4. ❌ Improve focus states for accessibility
5. ❌ Add visual separation between areas

**Files to Modify**:

- `src/styles/design-system.css`
- `src/components/intelligence/IntelligenceFeed.tsx`
- `src/components/intelligence/FeedItem.tsx`

**Estimated Time**: 1-2 hours
**Impact**: LOW - Polish and UX

---

### Phase 5: Real-Time Status Integration (Priority: LOW)

**Tasks**:

1. ❌ Create `/api/system/status` endpoint
2. ❌ Add polling mechanism for system status
3. ❌ Update sidebar platform status section
4. ❌ Consider WebSocket for real-time updates

**Files to Create**:

- `src/app/api/system/status/route.ts`
- `src/hooks/useSystemStatus.ts`

**Estimated Time**: 2-3 hours
**Impact**: LOW - Nice-to-have feature

---

## 9. Implementation Order

### Recommended Sequence

```
1. CREATE: UserContext + API endpoint (Phase 1)
   ↓
2. REPLACE: All placeholder data with real data (Phase 2)
   ↓
3. FIX: Layout responsiveness (Phase 3)
   ↓
4. POLISH: Visual hierarchy (Phase 4)
   ↓
5. ENHANCE: Real-time status (Phase 5)
```

---

## 10. Risk Assessment

| Risk                            | Severity | Mitigation                                |
| ------------------------------- | -------- | ----------------------------------------- |
| Breaking existing functionality | HIGH     | Test thoroughly after each phase          |
| Authentication failures         | HIGH     | Add proper error boundaries and fallbacks |
| Performance degradation         | MEDIUM   | Use React.memo, useMemo, useCallback      |
| Data sync issues                | MEDIUM   | Implement optimistic UI updates           |
| Layout breaks on edge cases     | LOW      | Comprehensive responsive testing          |

---

## 11. Testing Checklist

### After Phase 1 (Auth & Context)

- [ ] User data loads correctly from database
- [ ] API endpoint returns proper data structure
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Session expiry redirects to login

### After Phase 2 (Replace Placeholders)

- [ ] All hardcoded data replaced
- [ ] User name displays correctly
- [ ] Company name displays correctly
- [ ] Obsession score initializes from DB
- [ ] Avatar initial calculated correctly

### After Phase 3 (Layout)

- [ ] No overlap on any screen size
- [ ] Sidebar toggles on mobile
- [ ] Content reflows properly
- [ ] Scrolling works correctly
- [ ] Z-index hierarchy correct

### After Phase 4 (Visual)

- [ ] Clear separation between zones
- [ ] Borders visible and strong enough
- [ ] Solid backgrounds (no transparency)
- [ ] Focus states accessible
- [ ] Color contrast meets WCAG AA

---

## 12. Success Criteria

### Definition of Done

✅ **No hardcoded user data** - All displays driven by backend
✅ **No layout overlap** - Content never covered by sidebar
✅ **Proper authentication** - User sessions managed correctly
✅ **Strong visual hierarchy** - Clear zone separation
✅ **Responsive design** - Works on all screen sizes
✅ **Documented parameters** - All backend fields mapped
✅ **Error handling** - Graceful degradation
✅ **Loading states** - Clear feedback during data fetch

---

## Appendix A: Code Examples

### Example: UserContext Implementation

```typescript
// src/contexts/UserContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface UserProfile {
  companyName: string;
  industry: string;
  businessChallenge?: string;
  obsessionScore: number;
}

interface UserContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/user/profile");
      const result = await response.json();

      if (result.success) {
        setUser(result.data.user);
        setProfile(result.data.profile);
      } else {
        setError(result.error ?? "Failed to load profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserProfile();
    } else if (status === "unauthenticated") {
      setUser(null);
      setProfile(null);
      setLoading(false);
    }
  }, [session, status]);

  return (
    <UserContext.Provider
      value={{ user, profile, loading, error, refetch: fetchUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
```

### Example: Updated Sidebar with Real Data

```typescript
// src/components/layout/Sidebar.tsx (User Section)
import { useUser } from "@/contexts/UserContext";

export default function Sidebar() {
  const { user, profile, loading } = useUser();

  // Calculate avatar initial
  const avatarInitial = user?.name?.[0]?.toUpperCase()
    ?? user?.email?.[0]?.toUpperCase()
    ?? "U";

  return (
    <aside className="...">
      {/* ... other content ... */}

      {/* User Section */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 gradient-brewery rounded-full flex items-center justify-center text-white text-xs font-bold">
            {loading ? "..." : avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {loading ? "Loading..." : user?.name ?? "User"}
            </div>
            <div className="text-[10px] text-gray-400 truncate">
              {loading ? "..." : profile?.companyName ?? "Company"}
            </div>
          </div>
        </div>
        {/* ... platform status ... */}
      </div>
    </aside>
  );
}
```

---

**End of Architecture Analysis**
