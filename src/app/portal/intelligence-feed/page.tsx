export default function IntelligenceFeed(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          📡 Intelligence Feed
        </h1>
        <p className="text-gray-400">
          Real-time competitive intelligence and market trends
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          This feature will show live competitive intelligence, market trends,
          and alerts to help you stay ahead of the competition.
        </p>
      </div>

      {/* Preview of what it will contain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">📊 Live Feed</h3>
          <p className="text-sm text-gray-400">
            Real-time updates from competitors
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">🔔 Alerts</h3>
          <p className="text-sm text-gray-400">
            Custom notifications for key events
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">📈 Trends</h3>
          <p className="text-sm text-gray-400">
            Market trend analysis and insights
          </p>
        </div>
      </div>
    </div>
  );
}
