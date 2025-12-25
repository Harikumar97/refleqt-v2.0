/**
 * Intelligence Feed Page
 * Main intelligence feed dashboard for competitive intelligence
 */

import { IntelligenceFeed } from "@/components/intelligence/IntelligenceFeed";

export default function IntelligenceFeedPage() {
  // TODO: Get userId from NextAuth session
  const userId = "demo-user-id";

  return (
    <div className="space-y-6">
      <IntelligenceFeed userId={userId} />
    </div>
  );
}
