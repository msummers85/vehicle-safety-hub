"use client";

import { useState, useMemo } from "react";
import type { Complaint } from "@/lib/types";

type SortField = "dateOfIncident" | "mileage";
type SortDir = "asc" | "desc";

export function ComplaintTable({
  complaints,
}: {
  complaints: Complaint[];
}) {
  const [sortField, setSortField] = useState<SortField>("dateOfIncident");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [showAll, setShowAll] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const copy = [...complaints];
    copy.sort((a, b) => {
      let cmp: number;
      if (sortField === "mileage") {
        cmp = (a.mileage ?? 0) - (b.mileage ?? 0);
      } else {
        cmp =
          new Date(a.dateOfIncident).getTime() -
          new Date(b.dateOfIncident).getTime();
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [complaints, sortField, sortDir]);

  const visible = showAll ? sorted : sorted.slice(0, 20);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return "";
    return sortDir === "asc" ? " \u2191" : " \u2193";
  }

  function truncate(text: string, max: number) {
    if (text.length <= max) return text;
    return text.slice(0, max) + "...";
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (complaints.length === 0) {
    return (
      <p
        className="text-sm py-4"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        No complaints on record.
      </p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr
              style={{
                borderBottom: "2px solid var(--color-border)",
              }}
            >
              <th
                className="text-left py-2.5 px-3 font-medium cursor-pointer select-none"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={() => handleSort("dateOfIncident")}
              >
                Date{sortIndicator("dateOfIncident")}
              </th>
              <th
                className="text-left py-2.5 px-3 font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Component
              </th>
              <th
                className="text-right py-2.5 px-3 font-medium cursor-pointer select-none"
                style={{ color: "var(--color-text-secondary)" }}
                onClick={() => handleSort("mileage")}
              >
                Mileage{sortIndicator("mileage")}
              </th>
              <th
                className="text-left py-2.5 px-3 font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Summary
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c, i) => {
              const isExpanded = expandedRow === c.odiNumber;
              return (
                <tr
                  key={c.odiNumber || i}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    background:
                      i % 2 === 0 ? "transparent" : "var(--color-surface)",
                  }}
                  onClick={() =>
                    setExpandedRow(isExpanded ? null : c.odiNumber)
                  }
                >
                  <td
                    className="py-2.5 px-3 whitespace-nowrap align-top"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {formatDate(c.dateOfIncident)}
                  </td>
                  <td
                    className="py-2.5 px-3 align-top"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {c.components}
                  </td>
                  <td
                    className="py-2.5 px-3 text-right whitespace-nowrap align-top"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {c.mileage ? c.mileage.toLocaleString() : "—"}
                  </td>
                  <td
                    className="py-2.5 px-3 align-top"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {isExpanded ? c.summary : truncate(c.summary, 100)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!showAll && complaints.length > 20 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-sm font-medium cursor-pointer transition-colors"
          style={{ color: "#0071e3" }}
        >
          Show all {complaints.length} complaints
        </button>
      )}
    </div>
  );
}
