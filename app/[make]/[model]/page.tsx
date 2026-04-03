import type { Metadata } from "next";
import { Suspense, use } from "react";
import { getComplaints } from "@/lib/nhtsa";
import { ClickableCard } from "@/components/ClickableCard";
import { fromSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComplaintTrendChart } from "@/components/ComplaintTrendChart";

export const revalidate = 86400;

type Params = { make: string; model: string };

const CURRENT_YEAR = 2026;
const START_YEAR = 2000;
const TREND_START = 2015;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug } = await params;
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);
  const title = `${make} ${model} Recalls & Reliability by Year | Vehicle Safety Hub`;
  const description = `View recalls, complaints, and safety data for the ${make} ${model} by year. Free NHTSA data from ${START_YEAR} to ${CURRENT_YEAR}.`;
  const url = `https://vehiclesafetyhub.com/${makeSlug}/${modelSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "Vehicle Safety Hub",
      type: "website",
    },
  };
}

function TrendSkeleton() {
  return (
    <div className="mb-10">
      <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-4" />
      <div className="flex items-end gap-1 sm:gap-1.5" style={{ height: "160px" }}>
        {Array.from({ length: CURRENT_YEAR - TREND_START + 1 }, (_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t animate-pulse"
            style={{
              height: `${20 + Math.random() * 60}%`,
              background: "var(--color-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ModelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug } = use(params);
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);

  const years: number[] = [];
  for (let y = CURRENT_YEAR; y >= START_YEAR; y--) {
    years.push(y);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: make, href: `/${makeSlug}` },
          { label: model, href: `/${makeSlug}/${modelSlug}` },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {make} {model} Safety Reports by Year
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Select a year to view detailed recalls, complaints, and safety data
          for the {make} {model}.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10">
        {years.map((y) => (
          <ClickableCard
            key={y}
            href={`/${makeSlug}/${modelSlug}/${y}`}
            className="flex items-center justify-center px-3 py-3.5 rounded-xl text-sm font-medium no-underline transition-all hover:shadow-md tabular-nums"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
            }}
          >
            {y}
          </ClickableCard>
        ))}
      </div>

      {/* Complaint trend — streams in after year cards */}
      <Suspense fallback={<TrendSkeleton />}>
        <ComplaintTrend make={make} model={model} />
      </Suspense>
    </div>
  );
}

async function ComplaintTrend({
  make,
  model,
}: {
  make: string;
  model: string;
}) {
  const trendYears = Array.from(
    { length: CURRENT_YEAR - TREND_START + 1 },
    (_, i) => String(TREND_START + i)
  );

  const counts = await Promise.all(
    trendYears.map(async (year) => {
      const complaints = await getComplaints(make, model, year);
      return { year, count: complaints.length };
    })
  );

  return <ComplaintTrendChart data={counts} />;
}
