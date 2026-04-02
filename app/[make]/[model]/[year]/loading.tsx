export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs shimmer */}
      <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />

      {/* H1 shimmer */}
      <div className="mt-6 mb-8">
        <div className="h-9 w-96 max-w-full rounded bg-gray-200 animate-pulse" />
        <div className="h-5 w-72 max-w-full rounded bg-gray-200 animate-pulse mt-3" />
      </div>

      {/* StatBar skeleton */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 sm:p-5 flex flex-col items-center gap-2 animate-pulse"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <div className="h-8 w-12 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Recalls heading + placeholder cards */}
      <div className="mb-10">
        <div className="h-6 w-24 rounded bg-gray-200 animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse"
              style={{ background: "var(--color-surface)" }}
            >
              <div className="h-4 w-48 rounded bg-gray-200 mb-3" />
              <div className="h-3 w-full rounded bg-gray-200 mb-2" />
              <div className="h-3 w-3/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
