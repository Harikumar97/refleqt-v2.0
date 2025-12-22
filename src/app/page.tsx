export default function HomePage(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          Welcome to <span className="text-blue-500">Refleqt</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Stop Drowning in Data. Start Obsessing Smart.
        </p>
        <p className="text-sm text-gray-500">
          Safety-critical Next.js setup with Power of Ten compliance
        </p>
      </div>
    </main>
  );
}
