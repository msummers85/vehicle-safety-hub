import type { Metadata } from "next";
import Link from "next/link";
import { getModelsForMake } from "@/lib/nhtsa";
import { fromSlug } from "@/lib/utils";
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
