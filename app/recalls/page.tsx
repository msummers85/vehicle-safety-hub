import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getRecalls } from "@/lib/nhtsa";
import { toSlug, formatDate } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecallCard } from "@/components/RecallCard";
import type { Recall } from "@/lib/types";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Recent Vehicle Safety Recalls | Vehicle Safety Hub",
  description:
    "The latest vehicle safety recalls issued by NHTSA across major auto manufacturers. Updated daily.",
  alternates: { canonical: "https://vehiclesafetyhub.com/recalls" },
  openGraph: {
    title: "Recent Vehicle Safety Recalls | Vehicle Safety Hub",
    description:
      "The latest vehicle safety recalls issued by NHTSA across major auto manufacturers.",
    url: "https://vehiclesafetyhub.com/recalls",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

const POPULAR_MAKES = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan",
  "Hyundai", "Kia", "BMW", "Tesla", "Subaru",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [String(CURRENT_YEAR), String(CURRENT_YEAR - 1)];

function RecallsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 w-48 rounded bg-gray-200 mb-2" />
          <div
            className="rounded-lg p-5"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="h-3 w-32 rounded bg-gray-200 mb-3" />
            <div className="h-4 w-56 rounded bg-gray-200 mb-2" />
            <div className="h-3 w-full rounded bg-gray-200 mb-1" />
            <div className="h-3 w-3/4 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RecallsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Recent Recalls", href: "/recalls" },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Recent Vehicle Safety Recalls
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          The latest safety recalls issued by NHTSA. This page updates daily.
        </p>
      </div>

      <Suspense fallback={<RecallsSkeleton />}>
        <RecentRecalls />
      </Suspense>
    </div>
  );
}

async function RecentRecalls() {
  // Fetch recalls for popular makes across current and previous year
  const fetches = POPULAR_MAKES.flatMap((make) =>
    YEARS.map((year) => getRecalls(make, "", year))
  );
  const results = await Promise.all(fetches);
  const allRecalls = results.flat();

  // Dedupe by campaign number (same recall can appear for multiple models)
  const seen = new Set<string>();
  const unique: Recall[] = [];
  for (const r of allRecalls) {
    if (!seen.has(r.NHTSACampaignNumber)) {
      seen.add(r.NHTSACampaignNumber);
      unique.push(r);
    }
  }

  // Sort by date descending
  unique.sort((a, b) => {
    const da = new Date(a.ReportReceivedDate).getTime() || 0;
    const db = new Date(b.ReportReceivedDate).getTime() || 0;
    return db - da;
  });

  const recent = unique.slice(0, 50);

  if (recent.length === 0) {
    return (
      <p
        className="text-sm py-4"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        No recent recalls found. Check back soon — we update every 24 hours.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {recent.map((recall) => {
        const makeSlug = toSlug(recall.Make);
        const modelSlug = toSlug(recall.Model);
        const year = recall.ModelYear;
        const href = `/${makeSlug}/${modelSlug}/${year}`;

        return (
          <div key={recall.NHTSACampaignNumber}>
            <div className="flex items-center justify-between mb-1.5">
              <Link
                href={href}
                className="text-sm font-semibold no-underline hover:underline"
                style={{ color: "var(--color-blue)" }}
              >
                {year} {recall.Make} {recall.Model}
              </Link>
              {recall.ReportReceivedDate && (
                <span
                  className="text-xs shrink-0 ml-2"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {formatDate(recall.ReportReceivedDate)}
                </span>
              )}
            </div>
            <RecallCard recall={recall} />
          </div>
        );
      })}
    </div>
  );
}
