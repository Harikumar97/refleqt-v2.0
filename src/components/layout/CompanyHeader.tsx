/**
 * Company Header Component
 * Displays company logo and branding in sidebar
 */

export function CompanyHeader() {
  return (
    <div className="p-5 border-b border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 gradient-funnel rounded-xl flex items-center justify-center font-bold text-white shadow-md">
          R
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Refleqt</h2>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>🧠</span>
            <span>Intelligence Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
