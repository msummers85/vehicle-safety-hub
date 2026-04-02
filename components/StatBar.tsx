interface StatBarProps {
  recalls: number;
  complaints: number;
  overallRating: string | null;
}

export function StatBar({ recalls, complaints, overallRating }: StatBarProps) {
  const ratingNum = overallRating ? parseInt(overallRating, 10) : NaN;
  const hasRating = !isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5;

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div
        className="rounded-xl p-4 sm:p-5 text-center"
        style={{ background: "var(--color-surface)" }}
      >
        <div
          className="mx-auto mb-2 h-2.5 w-2.5 rounded-full"
          style={{ background: "#d32f2f" }}
        />
        <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#d32f2f" }}>
          {recalls}
        </p>
        <p
          className="text-xs sm:text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Recalls
        </p>
      </div>
      <div
        className="rounded-xl p-4 sm:p-5 text-center"
        style={{ background: "var(--color-surface)" }}
      >
        <div
          className="mx-auto mb-2 h-2.5 w-2.5 rounded-full"
          style={{ background: "#f59e0b" }}
        />
        <p className="text-2xl sm:text-3xl font-bold" style={{ color: "#f59e0b" }}>
          {complaints}
        </p>
        <p
          className="text-xs sm:text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Complaints
        </p>
      </div>
      <div
        className="rounded-xl p-4 sm:p-5 text-center"
        style={{ background: "var(--color-surface)" }}
      >
        <div
          className="mx-auto mb-2 h-2.5 w-2.5 rounded-full"
          style={{ background: "#248a3d" }}
        />
        {hasRating ? (
          <p className="text-base sm:text-2xl font-bold tracking-wide" style={{ color: "#248a3d" }}>
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} style={{ opacity: i < ratingNum ? 1 : 0.25 }}>
                ★
              </span>
            ))}
          </p>
        ) : (
          <p
            className="text-lg sm:text-xl font-bold mt-1"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            N/A
          </p>
        )}
        <p
          className="text-xs sm:text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Safety Rating
        </p>
      </div>
    </div>
  );
}
