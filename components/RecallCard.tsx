"use client";

import { useState } from "react";
import type { Recall } from "@/lib/types";

export function RecallCard({ recall }: { recall: Recall }) {
  const [expanded, setExpanded] = useState(false);
  const truncatedSummary =
    recall.Summary.length > 150
      ? recall.Summary.slice(0, 150) + "..."
      : recall.Summary;

  return (
    <div
      className="rounded-lg p-4 sm:p-5 transition-shadow hover:shadow-sm"
      style={{
        borderLeft: "4px solid #d32f2f",
        border: "1px solid var(--color-border)",
        borderLeftColor: "#d32f2f",
        borderLeftWidth: "4px",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-xs font-medium mb-1"
            style={{ color: "#d32f2f" }}
          >
            {recall.NHTSACampaignNumber}
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {recall.Component}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-xs px-2 py-1 rounded-md transition-colors cursor-pointer"
          style={{
            color: "var(--color-text-secondary)",
            background: "var(--color-surface)",
          }}
          aria-expanded={expanded}
        >
          {expanded ? "Less" : "More"}
        </button>
      </div>

      <p
        className="text-sm mt-2 leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {expanded ? recall.Summary : truncatedSummary}
      </p>

      {expanded && (
        <div
          className="mt-3 pt-3 space-y-2 text-sm"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          {recall.Consequence && (
            <div>
              <span
                className="font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Consequence:{" "}
              </span>
              <span style={{ color: "var(--color-text-secondary)" }}>
                {recall.Consequence}
              </span>
            </div>
          )}
          {recall.Remedy && (
            <div>
              <span
                className="font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Remedy:{" "}
              </span>
              <span style={{ color: "var(--color-text-secondary)" }}>
                {recall.Remedy}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
