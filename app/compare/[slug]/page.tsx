import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getVehicleData, resolveModelName } from "@/lib/nhtsa";
import { MAKES_LIST, fromSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataProvenance } from "@/components/DataProvenance";
import type { VehicleData } from "@/lib/types";

export const revalidate = 604800;

type Params = { slug: string };

const CURRENT_YEAR = new Date().getFullYear();

interface ParsedVehicle {
  make: string;
  model: string;
  makeSlug: string;
  modelSlug: string;
  year: string;
}

/** Parse "toyota-camry-2024" or "toyota-camry" from a slug segment.
 *  Matches known make slugs (longest first) then splits model and optional trailing year. */
function parseVehicleSlug(slug: string): ParsedVehicle | null {
  const sorted = [...MAKES_LIST].sort((a, b) => b.slug.length - a.slug.length);
  for (const m of sorted) {
    if (slug.startsWith(m.slug + "-")) {
      const rest = slug.slice(m.slug.length + 1);
      if (!rest) continue;

      // Check if rest ends with a 4-digit year
      const yearMatch = rest.match(/^(.+)-(\d{4})$/);
      if (yearMatch) {
        return {
          make: m.name,
          model: fromSlug(yearMatch[1]),
          makeSlug: m.slug,
          modelSlug: yearMatch[1],
          year: yearMatch[2],
        };
      }

      // No year in slug — will use default
      return {
        make: m.name,
        model: fromSlug(rest),
        makeSlug: m.slug,
        modelSlug: rest,
        year: "",
      };
    }
  }
  return null;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) {
    return { title: "Vehicle Comparison | Vehicle Safety Hub" };
  }

  const v1 = parseVehicleSlug(parts[0]);
  const v2 = parseVehicleSlug(parts[1]);
  if (!v1 || !v2) {
    return { title: "Vehicle Comparison | Vehicle Safety Hub" };
  }

  const [model1, model2] = await Promise.all([
    resolveModelName(v1.make, v1.modelSlug),
    resolveModelName(v2.make, v2.modelSlug),
  ]);

  const title = `${v1.make} ${model1} vs ${v2.make} ${model2} — Safety Comparison | Vehicle Safety Hub`;
  const description = `Compare recalls, complaints, and safety ratings between the ${v1.make} ${model1} and ${v2.make} ${model2}. Free NHTSA data comparison.`;
  const url = `https://vehiclesafetyhub.com/compare/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, siteName: "Vehicle Safety Hub", type: "article" },
  };
}

function ComparisonSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6">
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-7 w-40 rounded bg-gray-200 animate-pulse" />
          <div className="rounded-xl p-5 animate-pulse" style={{ background: "var(--color-surface)" }}>
            <div className="space-y-3">
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-5 w-24 rounded bg-gray-200" />
              <div className="h-5 w-32 rounded bg-gray-200" />
            </div>
          </div>
          <div className="rounded-xl p-5 animate-pulse" style={{ background: "var(--color-surface)" }}>
            <div className="h-4 w-36 rounded bg-gray-200 mb-3" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const parts = slug.split("-vs-");

  if (parts.length !== 2) {
    return <InvalidComparison />;
  }

  const v1 = parseVehicleSlug(parts[0]);
  const v2 = parseVehicleSlug(parts[1]);

  if (!v1 || !v2) {
    return <InvalidComparison />;
  }

  // Resolve canonical model names
  const [model1Name, model2Name] = await Promise.all([
    resolveModelName(v1.make, v1.modelSlug),
    resolveModelName(v2.make, v2.modelSlug),
  ]);
  v1.model = model1Name;
  v2.model = model2Name;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: `${model1Name} vs ${model2Name}`, href: `/compare/${slug}` },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {v1.make} {model1Name} vs {v2.make} {model2Name}
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Side-by-side safety comparison using NHTSA data
        </p>
      </div>

      <Suspense fallback={<ComparisonSkeleton />}>
        <ComparisonContent v1={v1} v2={v2} />
      </Suspense>
    </div>
  );
}

async function resolveYear(
  make: string,
  model: string,
  preferredYear: string
): Promise<{ data: VehicleData; year: string }> {
  if (preferredYear) {
    const data = await getVehicleData(make, model, preferredYear);
    return { data, year: preferredYear };
  }
  // No year specified — try current year, then previous
  const current = await getVehicleData(make, model, String(CURRENT_YEAR));
  if (current.recalls.length > 0 || current.complaints.length > 0 || current.safetyRating) {
    return { data: current, year: String(CURRENT_YEAR) };
  }
  const prev = await getVehicleData(make, model, String(CURRENT_YEAR - 1));
  return { data: prev, year: String(CURRENT_YEAR - 1) };
}

async function ComparisonContent({
  v1,
  v2,
}: {
  v1: ParsedVehicle;
  v2: ParsedVehicle;
}) {
  const [res1, res2] = await Promise.all([
    resolveYear(v1.make, v1.model, v1.year),
    resolveYear(v2.make, v2.model, v2.year),
  ]);

  const { data: data1, year: year1 } = res1;
  const { data: data2, year: year2 } = res2;

  const cats1 = getTopCategories(data1);
  const cats2 = getTopCategories(data2);

  const rating1 = parseRating(data1.safetyRating?.OverallRating);
  const rating2 = parseRating(data2.safetyRating?.OverallRating);

  const recallWinner = data1.recalls.length < data2.recalls.length ? 1 : data2.recalls.length < data1.recalls.length ? 2 : 0;
  const complaintWinner = data1.complaints.length < data2.complaints.length ? 1 : data2.complaints.length < data1.complaints.length ? 2 : 0;
  const ratingWinner = rating1 !== null && rating2 !== null
    ? rating1 > rating2 ? 1 : rating2 > rating1 ? 2 : 0
    : rating1 !== null ? 1 : rating2 !== null ? 2 : 0;

  return (
    <>
      <p className="text-xs mb-6" style={{ color: "var(--color-text-tertiary)" }}>
        Comparing {year1} {v1.make} {v1.model} vs {year2} {v2.make} {v2.model}
      </p>

      <div className="space-y-3 mb-10">
        <CompareRow
          label="Recalls"
          value1={String(data1.recalls.length)}
          value2={String(data2.recalls.length)}
          winner={recallWinner}
        />
        <CompareRow
          label="Complaints"
          value1={String(data1.complaints.length)}
          value2={String(data2.complaints.length)}
          winner={complaintWinner}
        />
        <CompareRow
          label="Safety Rating"
          value1={rating1 !== null ? renderStars(rating1) : "Not Rated"}
          value2={rating2 !== null ? renderStars(rating2) : "Not Rated"}
          winner={ratingWinner}
          isRating
        />
      </div>

      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Top Complaint Categories
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <CategoryList vehicleName={`${v1.make} ${v1.model}`} categories={cats1} />
        <CategoryList vehicleName={`${v2.make} ${v2.model}`} categories={cats2} />
      </div>

      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Full Safety Reports
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href={`/${v1.makeSlug}/${v1.modelSlug}/${year1}`}
          className="flex items-center justify-center rounded-xl px-4 py-4 text-sm font-medium no-underline transition-shadow hover:shadow-md"
          style={{ background: "var(--color-surface)", color: "var(--color-blue)", border: "1px solid var(--color-border)" }}
        >
          {year1} {v1.make} {v1.model} Safety Report →
        </Link>
        <Link
          href={`/${v2.makeSlug}/${v2.modelSlug}/${year2}`}
          className="flex items-center justify-center rounded-xl px-4 py-4 text-sm font-medium no-underline transition-shadow hover:shadow-md"
          style={{ background: "var(--color-surface)", color: "var(--color-blue)", border: "1px solid var(--color-border)" }}
        >
          {year2} {v2.make} {v2.model} Safety Report →
        </Link>
      </div>

      <div className="mt-8">
        <DataProvenance />
      </div>
    </>
  );
}

function CompareRow({
  label,
  value1,
  value2,
  winner,
  isRating,
}: {
  label: string;
  value1: string;
  value2: string;
  winner: number;
  isRating?: boolean;
}) {
  const winBg = "rgba(36, 138, 61, 0.08)";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
      <div
        className="rounded-xl px-4 py-4 text-center"
        style={{ background: winner === 1 ? winBg : "var(--color-surface)" }}
      >
        {isRating ? (
          <span className="text-sm font-semibold" style={{ color: winner === 1 ? "#248a3d" : "var(--color-text-primary)" }}>{value1}</span>
        ) : (
          <span className="text-2xl font-bold" style={{ color: winner === 1 ? "#248a3d" : "var(--color-text-primary)" }}>{value1}</span>
        )}
      </div>
      <span className="text-xs font-medium px-2 shrink-0" style={{ color: "var(--color-text-tertiary)" }}>{label}</span>
      <div
        className="rounded-xl px-4 py-4 text-center"
        style={{ background: winner === 2 ? winBg : "var(--color-surface)" }}
      >
        {isRating ? (
          <span className="text-sm font-semibold" style={{ color: winner === 2 ? "#248a3d" : "var(--color-text-primary)" }}>{value2}</span>
        ) : (
          <span className="text-2xl font-bold" style={{ color: winner === 2 ? "#248a3d" : "var(--color-text-primary)" }}>{value2}</span>
        )}
      </div>
    </div>
  );
}

function CategoryList({
  vehicleName,
  categories,
}: {
  vehicleName: string;
  categories: { component: string; count: number }[];
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--color-surface)" }}>
      <p className="text-xs font-semibold mb-3 truncate" style={{ color: "var(--color-text-secondary)" }}>
        {vehicleName}
      </p>
      {categories.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>No complaints on record</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.component} className="flex items-center justify-between gap-2">
              <span className="text-sm truncate" style={{ color: "var(--color-text-primary)" }}>{cat.component}</span>
              <span className="text-sm tabular-nums shrink-0 font-medium" style={{ color: "var(--color-amber)" }}>{cat.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InvalidComparison() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-3xl font-semibold tracking-tight mb-4" style={{ color: "var(--color-text-primary)" }}>
          Invalid Comparison
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          We couldn&apos;t parse the vehicles from the URL. Please use the{" "}
          <Link href="/compare" className="underline" style={{ color: "var(--color-blue)" }}>comparison tool</Link>{" "}
          to select two vehicles.
        </p>
      </div>
    </div>
  );
}

function parseRating(value: string | undefined): number | null {
  if (!value) return null;
  const n = parseInt(value, 10);
  return !isNaN(n) && n >= 1 && n <= 5 ? n : null;
}

function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function getTopCategories(data: VehicleData): { component: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of data.complaints) {
    const name = c.components || "Unknown";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts, ([component, count]) => ({ component, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}
