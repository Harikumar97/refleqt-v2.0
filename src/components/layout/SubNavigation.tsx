"use client";

/**
 * Sub-Navigation Component
 * Collapsible sub-navigation for main navigation items
 */

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SubNavItem {
  name: string;
  href: string;
  icon: string;
}

interface SubNavigationProps {
  items: SubNavItem[];
  variant?: "default" | "funnel" | "brewery";
}

export function SubNavigation({
  items,
  variant = "default",
}: SubNavigationProps) {
  const pathname = usePathname();

  const variantClasses = {
    default: "bg-blue-500/10",
    funnel: "bg-blue-500/10",
    brewery: "bg-pink-500/10",
  };

  const activeClasses = {
    default: "bg-blue-500/20 font-semibold",
    funnel: "bg-blue-500/20 font-semibold",
    brewery: "bg-pink-500/20 font-semibold",
  };

  return (
    <div
      className={`mx-6 mb-1 rounded-lg ${variantClasses[variant]} p-3 space-y-0.5`}
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md
              text-sm transition-all duration-200
              ${
                isActive
                  ? `${activeClasses[variant]} text-blue-300`
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            <span className="text-base">{item.icon}</span>
            <span className="flex-1">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

interface NavItemWithSubProps {
  icon: string;
  name: string;
  href: string;
  badge?: React.ReactNode;
  status?: React.ReactNode;
  subItems?: SubNavItem[];
  variant?: "default" | "funnel" | "brewery";
}

export function NavItemWithSub({
  icon,
  name,
  href,
  badge,
  status,
  subItems,
  variant = "default",
}: NavItemWithSubProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(pathname.startsWith(href));
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          transition-all duration-200
          ${
            isActive
              ? "bg-blue-500/15 text-blue-300 border-r-2 border-blue-400"
              : "text-gray-300 hover:bg-white/5 hover:text-white hover:translate-x-1"
          }
        `}
      >
        <span className="text-lg">{icon}</span>
        <span className="flex-1 text-left text-sm font-medium">{name}</span>
        {badge}
        {status}
        {subItems && (
          <span
            className={`text-xs transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            ⌄
          </span>
        )}
      </button>

      {isExpanded && subItems && (
        <div className="mt-1">
          <SubNavigation items={subItems} variant={variant} />
        </div>
      )}
    </div>
  );
}
