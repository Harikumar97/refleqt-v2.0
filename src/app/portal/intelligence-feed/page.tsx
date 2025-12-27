/**
 * Intelligence Feed Page
 * Main intelligence feed dashboard for competitive intelligence
 */

import { IntelligenceFeed } from "@/components/intelligence/IntelligenceFeed";

export default function IntelligenceFeedPage() {
  // TODO: Get userId from NextAuth session
  // Using test user ID from database setup
  const userId = "00000000-0000-0000-0000-000000000001";

  return <IntelligenceFeed userId={userId} />;
}
