import type { Metadata } from "next";
import { Suspense, use } from "react";
import { getVehicleData, getComponentCounts } from "@/lib/nhtsa";
import { fromSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatBar } from "@/components/StatBar";
import { RecallCard } from "@/components/RecallCard";
import { ComplaintTable } from "@/components/ComplaintTable";
import { InternalLinkBlock } from "@/components/InternalLinkBlock";
import { MileageChart } from "@/components/MileageChart";
import { DataProvenance } from "@/components/DataProvenance";
import { ComponentPills } from "@/components/ComponentPills";

export const revalidate = 86400;

type Params = { make: string; model: string; year: string };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug, year } = await params;
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);

  const title = `${year} ${make} ${model} Recalls, Problems & Safety | Vehicle Safety Hub`;
  const description = `Check recalls, complaints, and safety ratings for the ${year} ${make} ${model}. Free NHTSA data and known issues.`;
  const url = `https://vehiclesafetyhub.com/${makeSlug}/${modelSlug}/${year}`;

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
      type: "article",
    },
  };
}

function ContentSkeleton() {
  return (
    <>
      {/* StatBar skeleton */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl p-4 sm:p-5 flex flex-col items-center gap-2 animate-pulse"
            style={{ background: "var(--color-surface)" }}
          >
            <div className="h-2.5 w-2.5 rounded-full bg-gray-200" />
            <div className="h-8 w-12 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Recalls skeleton */}
      <div className="mb-10">
        <div className="h-6 w-24 rounded bg-gray-200 animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse"
              style={{ background: "var(--color-surface)" }}
            >
              <div className="h-4 w-48 rounded bg-gray-200 mb-3" />
              <div className="h-3 w-full rounded bg-gray-200 mb-2" />
              <div className="h-3 w-3/4 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function YearMakeModelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug, year } = use(params);
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs — renders immediately */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: make, href: `/${makeSlug}` },
          { label: model, href: `/${makeSlug}/${modelSlug}` },
          { label: year, href: `/${makeSlug}/${modelSlug}/${year}` },
        ]}
      />

      {/* Hero — renders immediately */}
      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {year} {make} {model} Safety Report
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Recalls, complaints, and safety data from NHTSA
        </p>
      </div>

      {/* Data-dependent content — streams in */}
      <Suspense fallback={<ContentSkeleton />}>
        <VehicleContent make={make} model={model} year={year} makeSlug={makeSlug} modelSlug={modelSlug} />
      </Suspense>
    </div>
  );
}

async function VehicleContent({
  make,
  model,
  year,
  makeSlug,
  modelSlug,
}: {
  make: string;
  model: string;
  year: string;
  makeSlug: string;
  modelSlug: string;
}) {
  const { recalls, complaints, safetyRating } = await getVehicleData(
    make,
    model,
    year
  );

  const complaintCategories = getComplaintCategories(complaints);

  const topComplaintText =
    complaintCategories.length > 0
      ? `The most common issue is ${complaintCategories[0].component.toLowerCase()} with ${complaintCategories[0].count} complaints.`
      : "No complaints have been filed.";

  const carJsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${year} ${make} ${model}`,
    manufacturer: { "@type": "Organization", name: make },
    model,
    vehicleModelDate: year,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Recall Count",
        value: recalls.length,
      },
      {
        "@type": "PropertyValue",
        name: "Complaint Count",
        value: complaints.length,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many recalls does the ${year} ${make} ${model} have?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${year} ${make} ${model} has ${recalls.length} recall${recalls.length !== 1 ? "s" : ""} on record with NHTSA.`,
        },
      },
      {
        "@type": "Question",
        name: `Is the ${year} ${make} ${model} reliable?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${year} ${make} ${model} has ${complaints.length} complaint${complaints.length !== 1 ? "s" : ""} and ${recalls.length} recall${recalls.length !== 1 ? "s" : ""} filed with NHTSA. ${topComplaintText}`,
        },
      },
      {
        "@type": "Question",
        name: `What are the most common problems with the ${year} ${make} ${model}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            complaintCategories.length > 0
              ? `The most common problems reported for the ${year} ${make} ${model} are: ${complaintCategories
                  .slice(0, 3)
                  .map((c) => `${c.component} (${c.count} complaints)`)
                  .join(", ")}.`
              : `No problems have been reported for the ${year} ${make} ${model}.`,
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Summary sentence */}
      <p
        className="text-lg mb-6"
        style={{ color: "var(--color-text-secondary)" }}
      >
        The {year} {make} {model} has {recalls.length} recall{recalls.length !== 1 ? "s" : ""}, {complaints.length} complaint{complaints.length !== 1 ? "s" : ""}{safetyRating && !isNaN(parseInt(safetyRating.OverallRating, 10)) ? `, and a ${safetyRating.OverallRating}-star overall safety rating from NHTSA` : ""}.
      </p>

      {/* Depth 1 — Key Stats */}
      <section className="mb-10">
        <StatBar
          recalls={recalls.length}
          complaints={complaints.length}
          overallRating={safetyRating?.OverallRating ?? null}
        />
        <div className="mt-3">
          <DataProvenance />
        </div>
      </section>

      {/* Depth 2 — Recalls */}
      <section className="mb-10">
        <SectionHeading>Recalls</SectionHeading>
        {recalls.length === 0 ? (
          <div
            className="rounded-xl px-5 py-4 text-sm font-medium"
            style={{
              background: "var(--color-green-light)",
              color: "var(--color-green)",
            }}
          >
            No recalls found for the {year} {make} {model}.
          </div>
        ) : (
          <div className="space-y-3">
            {recalls.map((r) => (
              <RecallCard key={r.NHTSACampaignNumber} recall={r} />
            ))}
          </div>
        )}
      </section>

      {/* Depth 2 — Safety Ratings */}
      <section className="mb-10">
        <SectionHeading>Safety Ratings</SectionHeading>
        {safetyRating ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { label: "Overall", value: safetyRating.OverallRating },
              { label: "Front Crash", value: safetyRating.OverallFrontCrashRating },
              { label: "Side Crash", value: safetyRating.OverallSideCrashRating },
              { label: "Rollover", value: safetyRating.RolloverRating },
            ] as const).map(({ label, value }) => {
              const num = parseInt(value, 10);
              const rated = !isNaN(num) && num >= 1 && num <= 5;
              return (
                <div
                  key={label}
                  className="rounded-xl p-4 text-center"
                  style={{ background: "var(--color-surface)" }}
                >
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {label}
                  </p>
                  {rated ? (
                    <p className="text-base sm:text-xl tracking-wide" style={{ color: "#248a3d" }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} style={{ opacity: i < num ? 1 : 0.25 }}>
                          ★
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      Not Rated
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p
            className="text-sm py-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            No NHTSA safety ratings available for the {year} {make} {model}.
          </p>
        )}
        {safetyRating?.VehicleDescription && (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Rating for: {safetyRating.VehicleDescription}
          </p>
        )}
      </section>

      {/* Depth 2 — Top Complaint Categories */}
      <section className="mb-10">
        <SectionHeading>Top Complaint Categories</SectionHeading>
        {complaintCategories.length === 0 ? (
          <p
            className="text-sm py-2"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            No complaints on record for the {year} {make} {model}.
          </p>
        ) : (
          <div className="space-y-2">
            {complaintCategories.slice(0, 8).map((cat) => (
              <div key={cat.component} className="flex items-center gap-3">
                <div
                  className="text-sm font-medium w-40 sm:w-48 shrink-0 truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {cat.component}
                </div>
                <div className="flex-1 h-5 rounded-full overflow-hidden"
                  style={{ background: "var(--color-surface)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(cat.count / complaintCategories[0].count) * 100}%`,
                      background: "var(--color-amber)",
                      minWidth: "4px",
                    }}
                  />
                </div>
                <span
                  className="text-sm tabular-nums w-8 text-right shrink-0"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Depth 2 — Problems by Component */}
      {(() => {
        const componentCounts = getComponentCounts(complaints).filter((c) => c.count >= 3);
        if (componentCounts.length === 0) return null;
        return (
          <section className="mb-10">
            <SectionHeading>Problems by Component</SectionHeading>
            <ComponentPills
              components={componentCounts}
              basePath={`/${makeSlug}/${modelSlug}/${year}`}
            />
          </section>
        );
      })()}

      {/* Depth 2 — Mileage Distribution */}
      <MileageChart complaints={complaints} />

      {/* Depth 3 — Internal Links */}
      <section className="mb-10">
        <SectionHeading>Explore More</SectionHeading>
        <InternalLinkBlock make={make} model={model} makeSlug={makeSlug} modelSlug={modelSlug} year={year} />
      </section>

      {/* Depth 4 — Full Complaint Table */}
      <section className="mb-10">
        <SectionHeading>All Complaints</SectionHeading>
        <ComplaintTable complaints={complaints} />
      </section>
    </>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl font-semibold mb-4"
      style={{ color: "var(--color-text-primary)" }}
    >
      {children}
    </h2>
  );
}

interface ComplaintCategory {
  component: string;
  count: number;
}

function getComplaintCategories(
  complaints: { components: string }[]
): ComplaintCategory[] {
  const counts = new Map<string, number>();
  for (const c of complaints) {
    const name = c.components || "Unknown";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts, ([component, count]) => ({ component, count })).sort(
    (a, b) => b.count - a.count
  );
}
