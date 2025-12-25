/**
 * Intelligence Feed Page
 * Main intelligence feed dashboard for competitive intelligence
 */

import { IntelligenceFeed } from "@/components/intelligence/IntelligenceFeed";

export default function IntelligencePage() {
  // TODO: Get userId from NextAuth session
  const userId = "demo-user-id";

  return (
    <div className="container mx-auto px-4 py-8">
      <IntelligenceFeed userId={userId} />
    </div>
  );
}

export const metadata = {
  title: "Intelligence Feed - Refleqt",
  description: "Competitive intelligence feed and analysis",
};
