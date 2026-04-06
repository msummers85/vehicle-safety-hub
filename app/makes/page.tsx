import type { Metadata } from "next";
import { MAKES_LIST } from "@/lib/utils";
import { ClickableCard } from "@/components/ClickableCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "All Vehicle Makes — Safety Data & Recalls | Vehicle Safety Hub",
  description:
    "Browse safety reports, recalls, and complaints for every vehicle make. Free NHTSA data for all manufacturers.",
  alternates: { canonical: "https://vehiclesafetyhub.com/makes" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "All Vehicle Makes — Safety Data & Recalls | Vehicle Safety Hub",
    description:
      "Browse safety reports, recalls, and complaints for every vehicle make.",
    url: "https://vehiclesafetyhub.com/makes",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

export default function AllMakesPage() {
  const sorted = [...MAKES_LIST].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "All Makes", href: "/makes" },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Vehicle Safety Reports by Make
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Select a manufacturer to explore models and safety data.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sorted.map((m) => (
          <ClickableCard
            key={m.slug}
            href={`/${m.slug}`}
            className="flex items-center justify-center px-4 py-4 rounded-xl text-sm font-medium no-underline transition-all hover:shadow-md"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
            }}
          >
            {m.name}
          </ClickableCard>
        ))}
      </div>
    </div>
  );
}
