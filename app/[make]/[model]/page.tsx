import type { Metadata } from "next";
import Link from "next/link";
import { fromSlug } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 86400;

type Params = { make: string; model: string };

const CURRENT_YEAR = 2026;
const START_YEAR = 2000;

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
  const model = fromSlug(modelSlug);
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

export default async function ModelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug, model: modelSlug } = await params;
  const make = fromSlug(makeSlug);
  const model = fromSlug(modelSlug);

  const years: number[] = [];
  for (let y = CURRENT_YEAR; y >= START_YEAR; y--) {
    years.push(y);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
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

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {years.map((y) => (
          <Link
            key={y}
            href={`/${makeSlug}/${modelSlug}/${y}`}
            className="flex items-center justify-center px-3 py-3.5 rounded-xl text-sm font-medium no-underline transition-all hover:shadow-md tabular-nums"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
            }}
          >
            {y}
          </Link>
        ))}
      </div>
    </div>
  );
}
