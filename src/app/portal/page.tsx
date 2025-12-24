import Link from "next/link";

interface FeatureCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

const features: FeatureCard[] = [
  {
    title: "Intelligence Feed",
    description: "Real-time competitive intelligence and market trends",
    href: "/portal/intelligence-feed",
    icon: "📡",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Research Swarms",
    description: "AI-powered multi-agent research at scale",
    href: "/portal/research-swarms",
    icon: "🔬",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Strategy Cohorts",
    description: "Deep competitive analysis and insights",
    href: "/portal/strategy-cohorts",
    icon: "🎯",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Psychographics",
    description: "Customer psychology and funnel analytics",
    href: "/portal/psychographics",
    icon: "🧠",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "The Brewery",
    description: "AI-powered content generation engine",
    href: "/portal/brewery",
    icon: "🍺",
    color: "from-yellow-500 to-amber-500",
  },
  {
    title: "Expert Writers",
    description: "Premium content with industry experts",
    href: "/portal/expert-writers",
    icon: "✍️",
    color: "from-indigo-500 to-purple-500",
  },
];

export default function PortalDashboard(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to Refleqt
        </h1>
        <p className="text-gray-400 text-lg">
          Stop Drowning in Data. Start Obsessing Smart.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">
            Business Obsession Score
          </div>
          <div className="text-3xl font-bold text-white">8.2/10</div>
          <div className="text-xs text-green-400 mt-1">↑ 0.3 this week</div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Active Research</div>
          <div className="text-3xl font-bold text-white">12</div>
          <div className="text-xs text-blue-400 mt-1">3 pending review</div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="text-gray-400 text-sm mb-1">Intelligence Items</div>
          <div className="text-3xl font-bold text-white">47</div>
          <div className="text-xs text-purple-400 mt-1">8 new today</div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Your Intelligence Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-all hover:scale-105 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div
                    className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Ready to dive deeper?
        </h3>
        <p className="text-blue-100 mb-4">
          Start with Intelligence Feed to see what your competitors are up to
          right now.
        </p>
        <Link
          href="/portal/intelligence-feed"
          className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          View Intelligence Feed →
        </Link>
      </div>
    </div>
  );
}
