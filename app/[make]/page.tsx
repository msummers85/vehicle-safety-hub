import type { Metadata } from "next";
import { Suspense, use } from "react";
import Link from "next/link";
import { getModelsForMake, getComplaints } from "@/lib/nhtsa";
import { ClickableCard } from "@/components/ClickableCard";
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

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={i}
          className="flex items-center justify-center px-4 py-4 rounded-xl animate-pulse"
          style={{ background: "var(--color-surface)" }}
        >
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="mb-10">
      <div className="h-6 w-72 rounded bg-gray-200 animate-pulse mb-4" />
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="h-4 w-32 rounded bg-gray-200 shrink-0" />
            <div className="flex-1 h-6 rounded-full bg-gray-100" />
            <div className="h-4 w-8 rounded bg-gray-200 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MakePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { make: makeSlug } = use(params);
  const make = fromSlug(makeSlug);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Shell — renders immediately */}
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

      {/* Complaint chart — slow, streams in separately */}
      <Suspense fallback={<ChartSkeleton />}>
        <ModelComparisonTable make={make} makeSlug={makeSlug} />
      </Suspense>

      {/* Model cards — single fast API call, streams in */}
      <Suspense fallback={<CardsSkeleton />}>
        <ModelCards make={make} makeSlug={makeSlug} />
      </Suspense>
    </div>
  );
}

async function ModelCards({
  make,
  makeSlug,
}: {
  make: string;
  makeSlug: string;
}) {
  const models = (await getModelsForMake(make)).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  if (models.length === 0) {
    return (
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
    );
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${make} Models`,
    itemListElement: models.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${make} ${m.name}`,
      url: `https://vehiclesafetyhub.com/${makeSlug}/${m.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {models.map((m) => (
          <ClickableCard
          key={m.id}
          href={`/${makeSlug}/${m.slug}`}
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
    </>
  );
}

/** Popular models per make for the comparison chart. Falls back to API results for unlisted makes. */
const POPULAR_MODELS: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "4Runner", "Prius", "Sienna", "Venza", "Crown", "GR86", "Sequoia", "Supra", "Corolla Cross"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Odyssey", "Ridgeline", "Passport", "Prologue"],
  Ford: ["F-150", "Explorer", "Escape", "Bronco", "Maverick", "Mustang", "Edge", "Expedition", "Ranger", "Transit", "Bronco Sport", "F-250", "F-350"],
  Chevrolet: ["Silverado", "Equinox", "Traverse", "Malibu", "Tahoe", "Suburban", "Colorado", "Trax", "Blazer", "Camaro", "Corvette", "Trailblazer"],
  Nissan: ["Altima", "Rogue", "Sentra", "Pathfinder", "Frontier", "Murano", "Kicks", "Versa", "Armada", "LEAF", "Titan"],
  Hyundai: ["Tucson", "Elantra", "Sonata", "Santa Fe", "Kona", "Palisade", "Ioniq 5", "Venue", "Santa Cruz"],
  Kia: ["Forte", "Sportage", "Telluride", "Sorento", "Seltos", "Soul", "K5", "Carnival", "EV6", "Niro"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1", "4 Series", "7 Series", "X7", "iX", "i4"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLC", "GLE", "A-Class", "S-Class", "CLA", "GLB", "GLA", "EQS"],
  Subaru: ["Outback", "Forester", "Crosstrek", "Impreza", "Ascent", "WRX", "Legacy", "BRZ", "Solterra"],
  Volkswagen: ["Jetta", "Tiguan", "Atlas", "Taos", "ID.4", "Golf GTI", "Atlas Cross Sport"],
  Mazda: ["CX-5", "Mazda3", "CX-30", "CX-50", "CX-90", "MX-5 Miata", "CX-9"],
  Jeep: ["Grand Cherokee", "Wrangler", "Cherokee", "Compass", "Gladiator", "Renegade", "Wagoneer", "Grand Wagoneer"],
  Dodge: ["Durango", "Charger", "Challenger", "Hornet"],
  Ram: ["1500", "2500", "3500", "ProMaster"],
  GMC: ["Sierra", "Terrain", "Acadia", "Yukon", "Canyon", "Hummer EV"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  Lexus: ["RX", "NX", "ES", "IS", "GX", "TX", "UX", "LC", "LS"],
  Audi: ["A4", "Q5", "A3", "Q7", "A6", "Q3", "e-tron", "Q8"],
  Volvo: ["XC90", "XC60", "XC40", "S60", "V60", "S90", "C40"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Defender", "Discovery", "Range Rover Velar", "Range Rover Evoque"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
  Genesis: ["G70", "G80", "G90", "GV70", "GV80", "GV60"],
  Acura: ["MDX", "RDX", "TLX", "Integra"],
  Infiniti: ["QX60", "QX80", "QX50", "Q50"],
  Porsche: ["Cayenne", "Macan", "911", "Taycan", "Panamera"],
  Lincoln: ["Corsair", "Nautilus", "Aviator", "Navigator"],
  Cadillac: ["Escalade", "XT5", "XT4", "CT5", "CT4", "Lyriq"],
  Buick: ["Encore GX", "Enclave", "Envision", "Encore"],
  Chrysler: ["Pacifica", "300"],
  Mitsubishi: ["Outlander", "Eclipse Cross", "Mirage"],
  Fiat: ["500X", "500"],
  MINI: ["Cooper", "Countryman", "Clubman"],
};

interface ModelRow {
  name: string;
  slug: string;
  complaints: number;
}

async function ModelComparisonTable({
  make,
  makeSlug,
}: {
  make: string;
  makeSlug: string;
}) {
  const thisYear = new Date().getFullYear();
  const lastYear = thisYear - 1;

  // Use curated list if available, otherwise fetch and take first 15
  let modelNames = POPULAR_MODELS[make];
  if (!modelNames) {
    const models = (await getModelsForMake(make)).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    modelNames = models.slice(0, 15).map((m) => m.name);
  }

  const rows = await Promise.all(
    modelNames.map(async (model): Promise<ModelRow> => {
      const [cThis, cLast] = await Promise.all([
        getComplaints(make, model, String(thisYear)),
        getComplaints(make, model, String(lastYear)),
      ]);
      return {
        name: model,
        slug: toSlug(model),
        complaints: cThis.length + cLast.length,
      };
    })
  );

  // Filter to models with complaints, sort descending, cap at 10
  const withComplaints = rows
    .filter((r) => r.complaints > 0)
    .sort((a, b) => b.complaints - a.complaints)
    .slice(0, 10);

  if (withComplaints.length < 1) return null;

  const maxCount = withComplaints[0].complaints;

  return (
    <section className="mb-10">
      <h2
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        {make} Models with Most Reported Issues ({lastYear}–{thisYear})
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
            </span>
          </Link>
        ))}
      </div>
      <p
        className="mt-3 text-sm italic"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        Vehicles with higher sales volumes typically receive more complaints. This chart shows total reports filed with NHTSA and does not reflect complaint rate per vehicle sold.
      </p>
    </section>
  );
}
