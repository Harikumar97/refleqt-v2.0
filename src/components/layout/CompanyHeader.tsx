"use client";

/**
 * Company Header Component
 * Displays company logo and branding in sidebar
 *
 * Backend Integration:
 * - Company name from UserContext → profile.companyName
 * - Logo initial calculated from company name
 * - Falls back to "Refleqt" for branding consistency
 */

import { useUser } from "@/contexts/UserContext";

export function CompanyHeader() {
  const { profile, loading } = useUser();

  // Use user's company name or default to "Refleqt"
  const companyName = profile?.companyName ?? "Refleqt";
  const logoInitial = companyName[0]?.toUpperCase() ?? "R";

  return (
    <div className="p-5 border-b border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 gradient-funnel rounded-xl flex items-center justify-center font-bold text-white shadow-md">
          {loading ? "..." : logoInitial}
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            {loading ? "Loading..." : companyName}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>🧠</span>
            <span>Intelligence Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
