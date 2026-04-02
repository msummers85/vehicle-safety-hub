import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompareForm } from "@/components/CompareForm";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Compare Vehicle Safety | Vehicle Safety Hub",
  description:
    "Compare recalls, complaints, and safety ratings between two vehicles side by side. Free NHTSA data comparison tool.",
  alternates: { canonical: "https://vehiclesafetyhub.com/compare" },
  openGraph: {
    title: "Compare Vehicle Safety | Vehicle Safety Hub",
    description:
      "Compare recalls, complaints, and safety ratings between two vehicles side by side.",
    url: "https://vehiclesafetyhub.com/compare",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

const popularComparisons = [
  { label: "Camry vs Accord", slug: "toyota-camry-vs-honda-accord" },
  { label: "CR-V vs RAV4", slug: "honda-cr-v-vs-toyota-rav4" },
  { label: "F-150 vs Silverado", slug: "ford-f-150-vs-chevrolet-silverado" },
  { label: "Civic vs Corolla", slug: "honda-civic-vs-toyota-corolla" },
  { label: "Highlander vs Pilot", slug: "toyota-highlander-vs-honda-pilot" },
  { label: "Tucson vs Sportage", slug: "hyundai-tucson-vs-kia-sportage" },
];

export default function CompareLandingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Compare Vehicle Safety
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Compare recalls, complaints, and safety ratings between two vehicles side by side.
        </p>
      </div>

      <CompareForm />

      <section className="mt-12">
        <h2
          className="text-xl font-semibold mb-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Popular Comparisons
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {popularComparisons.map((comp) => (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="flex items-center justify-center rounded-xl px-4 py-4 text-sm font-medium no-underline transition-shadow hover:shadow-md"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
              }}
            >
              {comp.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
