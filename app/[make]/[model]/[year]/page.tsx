import type { Metadata } from "next";
import { getVehicleData } from "@/lib/nhtsa";
import { fromSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatBar } from "@/components/StatBar";
import { RecallCard } from "@/components/RecallCard";
import { ComplaintTable } from "@/components/ComplaintTable";
import { InternalLinkBlock } from "@/components/InternalLinkBlock";

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
  const { recalls, complaints } = await getVehicleData(make, model, year);

  const title = `${year} ${make} ${model} Recalls, Problems & Safety | Vehicle Safety Hub`;
  const description = `${recalls.length} recalls and ${complaints.length} complaints for the ${year} ${make} ${model}. Check safety ratings, reliability data, and known issues.`;
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

export default async function YearMakeModelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug, year } = await params;
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);
  const { recalls, complaints, investigations } = await getVehicleData(
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: make, href: `/${makeSlug}` },
          { label: model, href: `/${makeSlug}/${modelSlug}` },
          { label: year, href: `/${makeSlug}/${modelSlug}/${year}` },
        ]}
      />

      {/* Hero */}
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

      {/* Depth 1 — Key Stats */}
      <section className="mb-10">
        <StatBar
          recalls={recalls.length}
          complaints={complaints.length}
          investigations={investigations.length}
        />
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

      {/* Depth 3 — Internal Links */}
      <section className="mb-10">
        <SectionHeading>Explore More</SectionHeading>
        <InternalLinkBlock make={make} model={model} makeSlug={makeSlug} />
      </section>

      {/* Depth 4 — Full Complaint Table */}
      <section className="mb-10">
        <SectionHeading>All Complaints</SectionHeading>
        <ComplaintTable complaints={complaints} />
      </section>
    </div>
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
