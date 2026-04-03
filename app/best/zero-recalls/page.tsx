import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getVehicleData } from "@/lib/nhtsa";
import { DataProvenance } from "@/components/DataProvenance";
import { toSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Vehicles with Zero Recalls | Vehicle Safety Hub",
  description:
    "Browse popular recent vehicles with no safety recalls on file with NHTSA. Zero recall vehicles across top makes and models.",
  alternates: { canonical: "https://vehiclesafetyhub.com/best/zero-recalls" },
  openGraph: {
    title: "Vehicles with Zero Recalls | Vehicle Safety Hub",
    description:
      "Browse popular recent vehicles with no safety recalls on file with NHTSA.",
    url: "https://vehiclesafetyhub.com/best/zero-recalls",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

const CANDIDATES = [
  { year: "2026", make: "Toyota", model: "Camry" },
  { year: "2026", make: "Honda", model: "Civic" },
  { year: "2026", make: "Toyota", model: "Corolla" },
  { year: "2026", make: "Honda", model: "Accord" },
  { year: "2026", make: "Hyundai", model: "Tucson" },
  { year: "2026", make: "Kia", model: "Sportage" },
  { year: "2025", make: "Toyota", model: "RAV4" },
  { year: "2025", make: "Honda", model: "CR-V" },
  { year: "2025", make: "Mazda", model: "CX-5" },
  { year: "2025", make: "Subaru", model: "Outback" },
  { year: "2025", make: "Hyundai", model: "Sonata" },
  { year: "2025", make: "Kia", model: "Forte" },
  { year: "2025", make: "Toyota", model: "Highlander" },
  { year: "2025", make: "Honda", model: "Pilot" },
  { year: "2025", make: "Subaru", model: "Crosstrek" },
  { year: "2024", make: "Mazda", model: "CX-30" },
  { year: "2024", make: "Toyota", model: "Tacoma" },
  { year: "2024", make: "Hyundai", model: "Elantra" },
  { year: "2024", make: "Kia", model: "Seltos" },
  { year: "2024", make: "Subaru", model: "Forester" },
  { year: "2024", make: "Honda", model: "HR-V" },
  { year: "2024", make: "Mazda", model: "Mazda3" },
  { year: "2023", make: "Toyota", model: "Prius" },
  { year: "2023", make: "Honda", model: "Ridgeline" },
  { year: "2023", make: "Subaru", model: "WRX" },
  { year: "2022", make: "Mazda", model: "MX-5 Miata" },
  { year: "2022", make: "Kia", model: "Telluride" },
  { year: "2022", make: "Genesis", model: "G70" },
];

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="rounded-xl p-5 animate-pulse"
          style={{ background: "var(--color-surface)" }}
        >
          <div className="h-5 w-48 rounded bg-gray-200 mb-3" />
          <div className="h-4 w-32 rounded bg-gray-200 mb-2" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function ZeroRecallsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Zero Recalls", href: "/best/zero-recalls" },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Vehicles with Zero Recalls
        </h1>
        <p
          className="mt-2 text-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          These vehicles have no safety recalls on file with NHTSA. A clean recall record
          doesn&apos;t guarantee safety, but it means no manufacturer defects have been
          identified that required a formal recall.
        </p>
      </div>

      <Suspense fallback={<ResultsSkeleton />}>
        <ZeroRecallResults />
      </Suspense>

      <div className="mt-8">
        <DataProvenance />
      </div>
    </div>
  );
}

interface ZeroRecallVehicle {
  year: string;
  make: string;
  model: string;
  makeSlug: string;
  modelSlug: string;
  complaints: number;
  overallRating: string | null;
  fiveStar: boolean;
}

async function ZeroRecallResults() {
  const results = await Promise.all(
    CANDIDATES.map(async (v) => {
      const data = await getVehicleData(v.make, v.model, v.year);
      return { ...v, data };
    })
  );

  const zeroRecall: ZeroRecallVehicle[] = results
    .filter((r) => r.data.recalls.length === 0)
    .map((r) => {
      const rating = r.data.safetyRating?.OverallRating ?? null;
      const ratingNum = rating ? parseInt(rating, 10) : NaN;
      return {
        year: r.year,
        make: r.make,
        model: r.model,
        makeSlug: toSlug(r.make),
        modelSlug: toSlug(r.model),
        complaints: r.data.complaints.length,
        overallRating: rating,
        fiveStar: !isNaN(ratingNum) && ratingNum === 5,
      };
    });

  if (zeroRecall.length === 0) {
    return (
      <p
        className="text-sm py-4"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        No zero-recall vehicles found in our current data set. Check back soon — we update every 24 hours.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {zeroRecall.map((v) => {
        const ratingNum = v.overallRating ? parseInt(v.overallRating, 10) : NaN;
        const hasRating = !isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5;

        return (
          <Link
            key={`${v.year}-${v.make}-${v.model}`}
            href={`/${v.makeSlug}/${v.modelSlug}/${v.year}`}
            className="block rounded-xl p-5 no-underline transition-shadow hover:shadow-md relative"
            style={{
              background: v.fiveStar ? "rgba(36, 138, 61, 0.04)" : "var(--color-surface)",
              border: v.fiveStar
                ? "1px solid rgba(36, 138, 61, 0.2)"
                : "1px solid var(--color-border)",
            }}
          >
            {v.fiveStar && (
              <span
                className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(36, 138, 61, 0.1)", color: "#248a3d" }}
              >
                ★ Top Safety
              </span>
            )}
            <p
              className="text-base font-semibold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {v.year} {v.make} {v.model}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span
                className="text-sm font-medium"
                style={{ color: "#248a3d" }}
              >
                0 Recalls
              </span>
              <span
                className="text-sm"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {v.complaints} complaint{v.complaints !== 1 ? "s" : ""}
              </span>
            </div>
            {hasRating && (
              <p className="mt-2 text-sm" style={{ color: "#248a3d" }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} style={{ opacity: i < ratingNum ? 1 : 0.25 }}>
                    ★
                  </span>
                ))}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}
