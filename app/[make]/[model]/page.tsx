import type { Metadata } from "next";
import { Suspense } from "react";
import { getComplaints, getRecalls, resolveModelName } from "@/lib/nhtsa";
import { ClickableCard } from "@/components/ClickableCard";
import { fromSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComplaintTrendChart } from "@/components/ComplaintTrendChart";

export const revalidate = 604800;

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
  const model = await resolveModelName(make, modelSlug);
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

function YearCardsSkeleton() {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl p-3 animate-pulse"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="h-5 w-10 mx-auto rounded bg-gray-200 mb-1.5" />
            <div className="h-3 w-14 mx-auto rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
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

export default async function ModelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug } = await params;
  const make = fromSlug(makeSlug);
  const model = await resolveModelName(make, modelSlug);

  const allYears: number[] = [];
  for (let y = CURRENT_YEAR; y >= START_YEAR; y--) {
    allYears.push(y);
  }
  // Older years without data — just show as plain link cards
  const olderYears = allYears.filter((y) => y < TREND_START);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${make} ${model} Safety Reports by Year`,
    itemListElement: allYears.map((y, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${y} ${make} ${model}`,
      url: `https://vehiclesafetyhub.com/${makeSlug}/${modelSlug}/${y}`,
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
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

      {/* Recent years with data — streams in */}
      <Suspense fallback={<YearCardsSkeleton />}>
        <EnrichedYearCards make={make} model={model} makeSlug={makeSlug} modelSlug={modelSlug} />
      </Suspense>

      {/* Complaint trend chart — streams in */}
      <Suspense fallback={<TrendSkeleton />}>
        <ComplaintTrend make={make} model={model} />
      </Suspense>

      {/* Older years — plain cards, render instantly */}
      {olderYears.length > 0 && (
        <div className="mb-10">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Earlier Years
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {olderYears.map((y) => (
              <ClickableCard
                key={y}
                href={`/${makeSlug}/${modelSlug}/${y}`}
                className="flex items-center justify-center px-2 py-2.5 rounded-lg text-sm font-medium no-underline transition-all hover:shadow-md tabular-nums"
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {y}
              </ClickableCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

async function EnrichedYearCards({
  make,
  model,
  makeSlug,
  modelSlug,
}: {
  make: string;
  model: string;
  makeSlug: string;
  modelSlug: string;
}) {
  const years = Array.from(
    { length: CURRENT_YEAR - TREND_START + 1 },
    (_, i) => CURRENT_YEAR - i
  );

  const data = await Promise.all(
    years.map(async (year) => {
      const [complaints, recalls] = await Promise.all([
        getComplaints(make, model, String(year)),
        getRecalls(make, model, String(year)),
      ]);
      return { year, complaints: complaints.length, recalls: recalls.length };
    })
  );

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10">
      {data.map(({ year, complaints, recalls }) => (
        <ClickableCard
          key={year}
          href={`/${makeSlug}/${modelSlug}/${year}`}
          className="flex flex-col items-center justify-center px-3 py-3 rounded-xl text-sm font-medium no-underline transition-all hover:shadow-md"
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
          }}
        >
          <span className="font-semibold tabular-nums">{year}</span>
          <span
            className="text-xs mt-1 tabular-nums"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {complaints > 0 || recalls > 0
              ? `${complaints}C · ${recalls}R`
              : "No data"}
          </span>
        </ClickableCard>
      ))}
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
