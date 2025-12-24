import Link from "next/link";

export default function HomePage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-4">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Refleqt
          </span>
        </h1>
        <p className="text-2xl text-gray-300 mb-4">
          Stop Drowning in Data. Start Obsessing Smart.
        </p>
        <p className="text-lg text-gray-400 mb-12">
          AI-Powered Business Intelligence for SaaS Founders
        </p>

        <div className="space-y-4 mb-12">
          <Link
            href="/portal"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105"
          >
            Enter Portal →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-3">📡</div>
            <h3 className="text-white font-semibold mb-2">Intelligence Feed</h3>
            <p className="text-sm text-gray-400">
              Real-time competitive intelligence
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="text-white font-semibold mb-2">Research Swarms</h3>
            <p className="text-sm text-gray-400">
              AI-powered multi-agent research
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-white font-semibold mb-2">Strategy Cohorts</h3>
            <p className="text-sm text-gray-400">Deep competitive analysis</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-12">
          Built with safety-critical Next.js | Power of Ten compliance | 100%
          free tools
        </p>
      </div>
    </main>
  );
}
