export default function StrategyCohorts(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          🎯 Strategy Cohorts
        </h1>
        <p className="text-gray-400">
          Deep competitive analysis and strategic insights
        </p>
      </div>

      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Stress-test your strategy against competitors. Get AI-powered insights
          in under 2 minutes with confidence scores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">⚡ Quick Queries</h3>
          <p className="text-sm text-gray-400">
            Get answers in under 2 minutes
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">🎲 Confidence</h3>
          <p className="text-sm text-gray-400">AI confidence scoring</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">🔍 Deep Analysis</h3>
          <p className="text-sm text-gray-400">
            Comprehensive competitive intel
          </p>
        </div>
      </div>
    </div>
  );
}
