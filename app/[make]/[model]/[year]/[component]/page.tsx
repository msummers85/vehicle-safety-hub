import type { Metadata } from "next";
import { Suspense, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicleData, classifyComponent, getComponentCounts, COMPONENT_LABELS } from "@/lib/nhtsa";
import { fromSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RecallCard } from "@/components/RecallCard";
import { ComplaintTable } from "@/components/ComplaintTable";
import { MileageChart } from "@/components/MileageChart";
import { ComponentPills } from "@/components/ComponentPills";
import { DataProvenance } from "@/components/DataProvenance";
import type { Complaint, Recall } from "@/lib/types";

export const revalidate = 604800; // 7 days

type Params = { make: string; model: string; year: string; component: string };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { make: makeSlug, model: modelSlug, year, component: componentSlug } = await params;
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);
  const label = COMPONENT_LABELS[componentSlug] ?? fromSlug(componentSlug);

  const title = `${year} ${make} ${model} ${label} Problems & Complaints | Vehicle Safety Hub`;
  const description = `View ${label.toLowerCase()} complaints and recalls for the ${year} ${make} ${model}. Detailed NHTSA data on ${label.toLowerCase()} issues.`;
  const url = `https://www.vehiclesafetyhub.com/${makeSlug}/${modelSlug}/${year}/${componentSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, siteName: "Vehicle Safety Hub", type: "article" },
  };
}

function ContentSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl p-4 sm:p-5 animate-pulse" style={{ background: "var(--color-surface)" }}>
            <div className="h-8 w-12 mx-auto rounded bg-gray-200 mb-2" />
            <div className="h-4 w-16 mx-auto rounded bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="mb-10">
        <div className="h-6 w-24 rounded bg-gray-200 animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-lg p-5 animate-pulse" style={{ background: "var(--color-surface)" }}>
              <div className="h-4 w-48 rounded bg-gray-200 mb-2" />
              <div className="h-3 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ComponentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug, year, component: componentSlug } = use(params);
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);
  const label = COMPONENT_LABELS[componentSlug] ?? fromSlug(componentSlug);

  if (!COMPONENT_LABELS[componentSlug]) {
    notFound();
  }

  const basePath = `/${makeSlug}/${modelSlug}/${year}`;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: make, href: `/${makeSlug}` },
          { label: model, href: `/${makeSlug}/${modelSlug}` },
          { label: year, href: basePath },
          { label: label, href: `${basePath}/${componentSlug}` },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {year} {make} {model} {label} Problems
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {label} complaints and recalls from NHTSA
        </p>
      </div>

      <Suspense fallback={<ContentSkeleton />}>
        <ComponentContent
          make={make}
          model={model}
          year={year}
          makeSlug={makeSlug}
          modelSlug={modelSlug}
          componentSlug={componentSlug}
          label={label}
          basePath={basePath}
        />
      </Suspense>
    </div>
  );
}

async function ComponentContent({
  make,
  model,
  year,
  makeSlug,
  modelSlug,
  componentSlug,
  label,
  basePath,
}: {
  make: string;
  model: string;
  year: string;
  makeSlug: string;
  modelSlug: string;
  componentSlug: string;
  label: string;
  basePath: string;
}) {
  const { recalls, complaints } = await getVehicleData(make, model, year);

  // Filter complaints to this component
  const filtered = complaints.filter((c) =>
    classifyComponent(c.components || "").includes(componentSlug)
  );

  if (filtered.length < 3) {
    notFound();
  }

  // Filter recalls to this component (match on Component field)
  const relatedRecalls = recalls.filter((r) =>
    classifyComponent(r.Component || "").includes(componentSlug)
  );

  // All component counts for pill navigation
  const allComponents = getComponentCounts(complaints).filter((c) => c.count >= 3);

  // Stats
  const mileages = filtered.filter((c) => c.mileage > 0).map((c) => c.mileage);
  const avgMileage = mileages.length > 0 ? Math.round(mileages.reduce((a, b) => a + b, 0) / mileages.length) : 0;
  const totalInjuries = filtered.reduce((sum, c) => sum + (c.injuries || 0), 0);

  // JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.vehiclesafetyhub.com" },
      { "@type": "ListItem", position: 2, name: make, item: `https://www.vehiclesafetyhub.com/${makeSlug}` },
      { "@type": "ListItem", position: 3, name: model, item: `https://www.vehiclesafetyhub.com/${makeSlug}/${modelSlug}` },
      { "@type": "ListItem", position: 4, name: year, item: `https://www.vehiclesafetyhub.com${basePath}` },
      { "@type": "ListItem", position: 5, name: label, item: `https://www.vehiclesafetyhub.com${basePath}/${componentSlug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How many ${label.toLowerCase()} complaints does the ${year} ${make} ${model} have?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The ${year} ${make} ${model} has ${filtered.length} ${label.toLowerCase()} complaint${filtered.length !== 1 ? "s" : ""} on file with NHTSA.${avgMileage > 0 ? ` The average failure mileage is ${avgMileage.toLocaleString()} miles.` : ""}`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Summary box */}
      <div
        className="rounded-xl px-5 py-4 mb-8"
        style={{ background: "#f0f7ff", border: "1px solid #cce0ff" }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-1.5"
          style={{ color: "var(--color-blue)" }}
        >
          Summary
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
          The {year} {make} {model} has {filtered.length} NHTSA {label.toLowerCase()} complaint{filtered.length !== 1 ? "s" : ""} and {relatedRecalls.length} {label.toLowerCase()}-related recall{relatedRecalls.length !== 1 ? "s" : ""}.{mileages.length > 0 ? ` Average failure mileage: ${avgMileage.toLocaleString()} miles.` : ""}
        </p>
      </div>

      {/* Stat cards */}
      <section className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard value={String(filtered.length)} label="Complaints" color="#f59e0b" />
          <StatCard value={String(relatedRecalls.length)} label="Recalls" color="#d32f2f" />
          <StatCard
            value={avgMileage > 0 ? `${(avgMileage / 1000).toFixed(0)}K` : "—"}
            label="Avg Failure Miles"
            color="var(--color-text-primary)"
          />
          <StatCard
            value={String(totalInjuries)}
            label="Injuries Reported"
            color={totalInjuries > 0 ? "#d32f2f" : "var(--color-text-primary)"}
          />
        </div>
        <div className="mt-3">
          <DataProvenance />
        </div>
      </section>

      {/* Component navigation */}
      <section className="mb-10">
        <SectionHeading>Problems by Component</SectionHeading>
        <ComponentPills components={allComponents} basePath={basePath} activeSlug={componentSlug} />
      </section>

      {/* Related recalls */}
      {relatedRecalls.length > 0 && (
        <section className="mb-10">
          <SectionHeading>{label} Recalls</SectionHeading>
          <div className="space-y-3">
            {relatedRecalls.map((r) => (
              <RecallCard key={r.NHTSACampaignNumber} recall={r} />
            ))}
          </div>
        </section>
      )}

      {/* Mileage chart */}
      <MileageChart complaints={filtered} />

      {/* Complaint table */}
      <section className="mb-10">
        <SectionHeading>All {label} Complaints</SectionHeading>
        <ComplaintTable complaints={filtered} />
      </section>

      {/* Internal links */}
      <section className="mb-10">
        <SectionHeading>Explore More</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href={basePath}
            className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium no-underline transition-colors hover:brightness-95"
            style={{ background: "var(--color-surface)", color: "var(--color-text-primary)" }}
          >
            {year} {make} {model} Full Report
            <span style={{ color: "var(--color-text-tertiary)" }}>→</span>
          </Link>
          <Link
            href={`/${makeSlug}`}
            className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium no-underline transition-colors hover:brightness-95"
            style={{ background: "var(--color-surface)", color: "var(--color-text-primary)" }}
          >
            All {make} Models
            <span style={{ color: "var(--color-text-tertiary)" }}>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl p-4 sm:p-5 text-center" style={{ background: "var(--color-surface)" }}>
      <p className="text-2xl sm:text-3xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
      {children}
    </h2>
  );
}
