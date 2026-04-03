export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />

      <div className="mt-6 mb-8">
        <div className="h-9 w-80 max-w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-64 max-w-full rounded bg-gray-200 animate-pulse mt-3" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-4 py-4 rounded-xl animate-pulse"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
