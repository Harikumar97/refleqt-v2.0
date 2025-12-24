export default function ExpertWriters(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          ✍️ Expert Writers
        </h1>
        <p className="text-gray-400">Premium content with industry experts</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-semibold text-white mb-2">Coming Soon</h2>
        <p className="text-gray-300 max-w-md mx-auto">
          Hybrid AI + human expertise. Get professional content created by
          industry experts and AI working together.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">👥 Expert Network</h3>
          <p className="text-sm text-gray-400">Industry professionals</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">🤝 Hybrid Model</h3>
          <p className="text-sm text-gray-400">AI + human expertise</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">📝 Premium Content</h3>
          <p className="text-sm text-gray-400">Professional execution</p>
        </div>
      </div>
    </div>
  );
}
