interface StatBarProps {
  recalls: number;
  complaints: number;
  investigations: number;
}

const stats = [
  { key: "recalls", label: "Recalls", color: "#d32f2f" },
  { key: "complaints", label: "Complaints", color: "#f59e0b" },
  { key: "investigations", label: "Investigations", color: "#0071e3" },
] as const;

export function StatBar({ recalls, complaints, investigations }: StatBarProps) {
  const counts = { recalls, complaints, investigations };

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map(({ key, label, color }) => (
        <div
          key={key}
          className="rounded-xl p-4 sm:p-5 text-center"
          style={{ background: "var(--color-surface)" }}
        >
          <div
            className="mx-auto mb-2 h-2.5 w-2.5 rounded-full"
            style={{ background: color }}
          />
          <p className="text-2xl sm:text-3xl font-bold" style={{ color }}>
            {counts[key]}
          </p>
          <p
            className="text-xs sm:text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
