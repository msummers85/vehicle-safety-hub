import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getModelsForMake, getComplaints } from "@/lib/nhtsa";
import { fromSlug, toSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 86400;

type Params = { make: string };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { make: makeSlug } = await params;
  const make = fromSlug(makeSlug);
  const title = `${make} Vehicles — Recalls & Safety Data | Vehicle Safety Hub`;
  const description = `Browse safety data, recalls, and complaints for all ${make} models. Free NHTSA data for every ${make} vehicle.`;
  const url = `https://vehiclesafetyhub.com/${makeSlug}`;

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

function TableSkeleton() {
  return (
    <div className="mb-10">
      <div className="h-6 w-72 rounded bg-gray-200 animate-pulse mb-4" />
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 animate-pulse"
            style={{ background: i % 2 === 0 ? "white" : "var(--color-surface)" }}
          >
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200 ml-auto" />
            <div className="h-4 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function MakePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug } = await params;
  const make = fromSlug(makeSlug);
  const models = (await getModelsForMake(make)).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: make, href: `/${makeSlug}` },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {make} Vehicle Safety Reports
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Browse safety data, recalls, and complaints for all {make} models.
        </p>
      </div>

      {models.length > 0 && (
        <Suspense fallback={<TableSkeleton />}>
          <ModelComparisonTable make={make} makeSlug={makeSlug} modelNames={models.slice(0, 15).map((m) => m.name)} />
        </Suspense>
      )}

      {models.length === 0 ? (
        <p
          className="text-sm py-4"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          No models found for {make}. Check the spelling or browse{" "}
          <Link
            href="/makes"
            className="no-underline font-medium"
            style={{ color: "var(--color-blue)" }}
          >
            all makes
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {models.map((m) => (
            <Link
              key={m.id}
              href={`/${makeSlug}/${m.slug}`}
              className="flex items-center justify-center px-4 py-4 rounded-xl text-sm font-medium no-underline transition-all hover:shadow-md"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
              }}
            >
              {m.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

interface ModelRow {
  name: string;
  slug: string;
  complaints: number;
  year: string;
}

async function ModelComparisonTable({
  make,
  makeSlug,
  modelNames,
}: {
  make: string;
  makeSlug: string;
  modelNames: string[];
}) {
  const rows = await Promise.all(
    modelNames.map(async (model): Promise<ModelRow> => {
      const complaints2025 = await getComplaints(make, model, "2025");

      if (complaints2025.length > 0) {
        return {
          name: model,
          slug: toSlug(model),
          complaints: complaints2025.length,
          year: "2025",
        };
      }

      const complaints2024 = await getComplaints(make, model, "2024");
      return {
        name: model,
        slug: toSlug(model),
        complaints: complaints2024.length,
        year: "2024",
      };
    })
  );

  // Filter to models with complaints, sort descending, cap at 10
  const withComplaints = rows
    .filter((r) => r.complaints > 0)
    .sort((a, b) => b.complaints - a.complaints)
    .slice(0, 10);

  if (withComplaints.length < 3) return null;

  const maxCount = withComplaints[0].complaints;

  return (
    <section className="mb-10">
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        {make} Models with Most Reported Issues
      </h2>

      <div className="space-y-2">
        {withComplaints.map((row) => (
          <Link
            key={row.slug}
            href={`/${makeSlug}/${row.slug}`}
            className="flex items-center gap-3 no-underline group"
          >
            <span
              className="text-sm font-medium w-32 sm:w-40 shrink-0 truncate transition-colors group-hover:underline"
              style={{ color: "var(--color-text-primary)" }}
            >
              {row.name}
            </span>
            <div
              className="flex-1 h-6 rounded-full overflow-hidden"
              style={{ background: "var(--color-surface)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(row.complaints / maxCount) * 100}%`,
                  background: "#f59e0b",
                  minWidth: "4px",
                }}
              />
            </div>
            <span
              className="text-sm tabular-nums w-12 text-right shrink-0 font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {row.complaints}
              {row.year !== "2025" && (
                <span
                  className="text-[10px] ml-0.5"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  *
                </span>
              )}
            </span>
          </Link>
        ))}
      </div>
      {withComplaints.some((r) => r.year !== "2025") && (
        <p
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          * 2024 data (no 2025 complaints on file)
        </p>
      )}
      <p
        className="mt-3 text-sm italic"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Vehicles with higher sales volumes typically receive more complaints. This chart shows total reports filed with NHTSA and does not reflect complaint rate per vehicle sold.
      </p>
    </section>
  );
}
