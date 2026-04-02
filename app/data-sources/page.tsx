import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Data Sources | Vehicle Safety Hub",
  description:
    "All data on Vehicle Safety Hub comes from official U.S. government sources including NHTSA recalls, complaints, safety ratings, and vehicle identification APIs.",
  alternates: { canonical: "https://vehiclesafetyhub.com/data-sources" },
  openGraph: {
    title: "Data Sources | Vehicle Safety Hub",
    description:
      "All data on Vehicle Safety Hub comes from official U.S. government sources.",
    url: "https://vehiclesafetyhub.com/data-sources",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

const sources = [
  {
    name: "NHTSA Recalls API",
    description:
      "Manufacturer safety recall notices issued when a vehicle has a safety defect or does not comply with federal safety standards.",
    url: "https://www.nhtsa.gov/recalls",
  },
  {
    name: "NHTSA Complaints API",
    description:
      "Consumer-reported vehicle safety problems filed directly with NHTSA, including details about crashes, fires, injuries, and component failures.",
    url: "https://www.nhtsa.gov/report-a-safety-problem",
  },
  {
    name: "NHTSA Safety Ratings API",
    description:
      "5-Star crash test ratings from the New Car Assessment Program (NCAP), evaluating vehicles through frontal crash, side crash, and rollover resistance tests.",
    url: "https://www.nhtsa.gov/campaign/5-star-safety-ratings",
  },
  {
    name: "NHTSA vPIC API",
    description:
      "Vehicle identification and specifications database used for VIN decoding and retrieving make, model, and year information.",
    url: "https://vpic.nhtsa.dot.gov/api/",
  },
];

export default function DataSourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Data Sources", href: "/data-sources" },
        ]}
      />

      <h1
        className="mt-6 mb-4 text-3xl sm:text-4xl font-semibold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Our Data Sources
      </h1>

      <p
        className="mb-8 text-base leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        All data on Vehicle Safety Hub comes from official U.S. government sources. We do not
        create, modify, or editorialize safety data.
      </p>

      <div className="grid gap-4">
        {sources.map((source) => (
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl p-5 no-underline transition-shadow hover:shadow-md"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2
              className="text-base font-semibold mb-1.5 flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              {source.name}
              <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                ↗
              </span>
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {source.description}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
