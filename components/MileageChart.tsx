"use client";

import type { Complaint } from "@/lib/types";

const BUCKETS = [
  { label: "0–10K", min: 1, max: 10000 },
  { label: "10K–30K", min: 10001, max: 30000 },
  { label: "30K–50K", min: 30001, max: 50000 },
  { label: "50K–75K", min: 50001, max: 75000 },
  { label: "75K–100K", min: 75001, max: 100000 },
  { label: "100K+", min: 100001, max: Infinity },
];

export function MileageChart({ complaints }: { complaints: Complaint[] }) {
  const withMileage = complaints.filter((c) => c.mileage && c.mileage > 0);
  if (withMileage.length < 3) return null;

  const counts = BUCKETS.map((b) => ({
    ...b,
    count: withMileage.filter((c) => c.mileage >= b.min && c.mileage <= b.max).length,
  }));

  const max = Math.max(...counts.map((b) => b.count), 1);

  // Find the bucket with the most complaints for the summary
  const peakIdx = counts.reduce((best, b, i) => (b.count > counts[best].count ? i : best), 0);
  const peak = counts[peakIdx];

  const rangeLabel =
    peak.max === Infinity
      ? "over 100,000"
      : `${peak.min.toLocaleString()} and ${peak.max.toLocaleString()}`;

  return (
    <section className="mb-10">
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        When Problems Occur
      </h2>
      <div className="space-y-2">
        {counts.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span
              className="text-sm w-20 shrink-0 text-right tabular-nums"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {b.label}
            </span>
            <div
              className="flex-1 h-6 rounded-full overflow-hidden"
              style={{ background: "var(--color-surface)" }}
            >
              {b.count > 0 && (
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(b.count / max) * 100}%`,
                    background: "#f59e0b",
                    minWidth: "4px",
                  }}
                />
              )}
            </div>
            <span
              className="text-sm tabular-nums w-8 text-right shrink-0"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {b.count}
            </span>
          </div>
        ))}
      </div>
      {peak.count > 0 && (
        <p
          className="mt-3 text-sm"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Most issues reported between {rangeLabel} miles
        </p>
      )}
    </section>
  );
}
