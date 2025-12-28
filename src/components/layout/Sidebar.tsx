"use client";

/**
 * Enhanced Sidebar Component
 * Features company header, obsession widget, and sub-navigation
 *
 * Backend Integration:
 * - User data from UserContext (useUser hook)
 * - Profile data from Prisma UserProfile
 * - Real-time status updates (TODO: integrate system status API)
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CompanyHeader } from "./CompanyHeader";
import { ObsessionWidget } from "./ObsessionWidget";
import { NavItemWithSub } from "./SubNavigation";
import { Badge, NavStatus } from "@/components/ui";
import { useUser } from "@/contexts/UserContext";

export default function Sidebar(): React.ReactElement {
  const pathname = usePathname();
  const { user, profile, loading: userLoading } = useUser();

  // Calculate avatar initial from user data
  const avatarInitial =
    user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white z-40 overflow-y-auto overflow-x-hidden custom-scrollbar-dark flex flex-col shadow-2xl border-r border-gray-700">
      {/* Company Header */}
      <CompanyHeader />

      {/* Obsession Widget */}
      <ObsessionWidget />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {/* Dashboard */}
        <Link
          href="/portal"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            pathname === "/portal"
              ? "bg-blue-500/15 text-blue-300 border-r-2 border-blue-400"
              : "text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1"
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="flex-1 text-sm font-medium">Dashboard</span>
        </Link>

        {/* Intelligence Feed with Sub-Nav */}
        <NavItemWithSub
          icon="📡"
          name="Intelligence Feed"
          href="/portal/intelligence-feed"
          badge={<Badge variant="new">3</Badge>}
          subItems={[
            {
              name: "Live Feed",
              href: "/portal/intelligence-feed",
              icon: "📊",
            },
            {
              name: "Smart Alerts",
              href: "/portal/intelligence-feed/alerts",
              icon: "🚨",
            },
            {
              name: "Market Trends",
              href: "/portal/intelligence-feed/trends",
              icon: "📈",
            },
            {
              name: "Obsession Tracker",
              href: "/portal/intelligence-feed/obsession",
              icon: "🎯",
            },
          ]}
          variant="funnel"
        />

        {/* Research Swarms */}
        <Link
          href="/portal/research-swarms"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            pathname === "/portal/research-swarms"
              ? "bg-blue-500/15 text-blue-300 border-r-2 border-blue-400"
              : "text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1"
          }`}
        >
          <span className="text-lg">🔬</span>
          <span className="flex-1 text-sm font-medium">Research Swarms</span>
          <Badge variant="count">12</Badge>
        </Link>

        {/* Strategy Cohorts */}
        <Link
          href="/portal/strategy-cohorts"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            pathname === "/portal/strategy-cohorts"
              ? "bg-blue-500/15 text-blue-300 border-r-2 border-blue-400"
              : "text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1"
          }`}
        >
          <span className="text-lg">🎯</span>
          <span className="flex-1 text-sm font-medium">Strategy Cohorts</span>
          <NavStatus status="running" label="Analysis running" />
        </Link>

        {/* Psychographics */}
        <Link
          href="/portal/psychographics"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            pathname === "/portal/psychographics"
              ? "bg-blue-500/15 text-blue-300 border-r-2 border-blue-400"
              : "text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1"
          }`}
        >
          <span className="text-lg">🧠</span>
          <span className="flex-1 text-sm font-medium">Funnel-lytics</span>
          <Badge variant="count">4</Badge>
        </Link>

        {/* The Brewery */}
        <Link
          href="/portal/brewery"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            pathname === "/portal/brewery"
              ? "bg-blue-500/15 text-blue-300 border-r-2 border-blue-400"
              : "text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1"
          }`}
        >
          <span className="text-lg">🍺</span>
          <span className="flex-1 text-sm font-medium">The Brewery</span>
          <Badge variant="new">2</Badge>
        </Link>

        {/* Expert Writers */}
        <Link
          href="/portal/expert-writers"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-500 opacity-60 cursor-not-allowed"
        >
          <span className="text-lg">✍️</span>
          <span className="flex-1 text-sm font-medium">Expert Writers</span>
          <span className="text-xs">🔒</span>
        </Link>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 gradient-brewery rounded-full flex items-center justify-center text-white text-xs font-bold">
            {userLoading ? "..." : avatarInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">
              {userLoading ? "Loading..." : (user?.name ?? "User")}
            </div>
            <div className="text-[10px] text-gray-400 truncate">
              {userLoading ? "..." : (profile?.companyName ?? "Company")}
            </div>
          </div>
        </div>

        {/* Platform Status */}
        <div className="glass-dark rounded-lg p-2.5 text-[10px]">
          <div className="font-semibold text-white/80 mb-1.5">
            Platform Status
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Research Swarm</span>
              <NavStatus status="running" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Strategy Cohort</span>
              <NavStatus status="running" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Data Pipeline</span>
              <NavStatus status="processing" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
