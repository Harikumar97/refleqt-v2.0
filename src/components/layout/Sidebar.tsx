"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/portal",
    icon: "📊",
    description: "Overview",
  },
  {
    name: "Intelligence Feed",
    href: "/portal/intelligence-feed",
    icon: "📡",
    description: "Live competitive intel",
  },
  {
    name: "Research Swarms",
    href: "/portal/research-swarms",
    icon: "🔬",
    description: "AI-powered research",
  },
  {
    name: "Strategy Cohorts",
    href: "/portal/strategy-cohorts",
    icon: "🎯",
    description: "Competitive analysis",
  },
  {
    name: "Psychographics",
    href: "/portal/psychographics",
    icon: "🧠",
    description: "Customer psychology",
  },
  {
    name: "The Brewery",
    href: "/portal/brewery",
    icon: "🍺",
    description: "AI content creation",
  },
  {
    name: "Expert Writers",
    href: "/portal/expert-writers",
    icon: "✍️",
    description: "Premium content",
  },
];

export default function Sidebar(): React.ReactElement {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-40 overflow-y-auto overflow-x-hidden ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Refleqt
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {item.description}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="text-xs text-gray-400">
            <div className="font-semibold text-white mb-1">TaskFlow Demo</div>
            <div>Obsession Score: 8.2/10</div>
          </div>
        </div>
      )}
    </aside>
  );
}
