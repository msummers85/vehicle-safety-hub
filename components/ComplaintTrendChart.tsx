"use client";

import { useState } from "react";

interface YearCount {
  year: string;
  count: number;
}

export function ComplaintTrendChart({ data }: { data: YearCount[] }) {
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  if (data.every((d) => d.count === 0)) return null;

  const max = Math.max(...data.map((d) => d.count), 1);

  const highest = data.reduce((a, b) => (b.count > a.count ? b : a));
  const lowest = data.reduce((a, b) => (b.count < a.count ? b : a));

  return (
    <section className="mb-10">
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Complaint History
      </h2>

      <div className="flex items-end gap-1 sm:gap-1.5" style={{ height: "160px" }}>
        {data.map((d) => {
          const pct = max > 0 ? (d.count / max) * 100 : 0;
          const isHovered = hoveredYear === d.year;

          return (
            <div
              key={d.year}
              className="flex-1 flex flex-col items-center justify-end h-full relative"
              onMouseEnter={() => setHoveredYear(d.year)}
              onMouseLeave={() => setHoveredYear(null)}
              onTouchStart={() => setHoveredYear(d.year)}
            >
              {isHovered && d.count > 0 && (
                <div
                  className="absolute -top-6 text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--color-text-primary)",
                    color: "white",
                  }}
                >
                  {d.count}
                </div>
              )}
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: d.count > 0 ? `${Math.max(pct, 3)}%` : "2px",
                  background: d.count > 0 ? "#f59e0b" : "var(--color-border)",
                  opacity: isHovered ? 1 : 0.8,
                  minHeight: d.count > 0 ? "4px" : "2px",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Year labels */}
      <div className="flex gap-1 sm:gap-1.5 mt-1">
        {data.map((d) => (
          <div
            key={d.year}
            className="flex-1 text-center text-[10px] sm:text-xs tabular-nums"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {d.year.slice(-2)}
          </div>
        ))}
      </div>

      <p
        className="mt-3 text-sm"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Highest complaints: {highest.year} ({highest.count}). Lowest: {lowest.year} ({lowest.count}).
      </p>
    </section>
  );
}
