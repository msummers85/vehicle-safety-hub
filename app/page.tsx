"use client";

import { VehicleSearch } from "@/components/VehicleSearch";
import Link from "next/link";

const popularMakes = [
  { name: "Toyota", slug: "toyota", count: "2,400+" },
  { name: "Honda", slug: "honda", count: "1,800+" },
  { name: "Ford", slug: "ford", count: "3,100+" },
  { name: "Chevrolet", slug: "chevrolet", count: "2,900+" },
  { name: "Nissan", slug: "nissan", count: "1,600+" },
  { name: "Hyundai", slug: "hyundai", count: "1,200+" },
  { name: "Kia", slug: "kia", count: "900+" },
  { name: "Jeep", slug: "jeep", count: "1,100+" },
  { name: "BMW", slug: "bmw", count: "800+" },
  { name: "Subaru", slug: "subaru", count: "700+" },
  { name: "Mercedes-Benz", slug: "mercedes-benz", count: "900+" },
  { name: "Tesla", slug: "tesla", count: "400+" },
];

export default function HomePage() {
  return (
    <>
      <section className="px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h1
            className="font-semibold tracking-tight leading-tight mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--color-text-primary)",
            }}
          >
            Is your vehicle safe?
          </h1>
          <p
            className="text-lg sm:text-xl mb-10 max-w-xl mx-auto"
            style={{
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            Check recalls, complaints, and reliability data for any car, truck,
            or SUV. Free. Powered by NHTSA government data.
          </p>
          <VehicleSearch />
        </div>
      </section>

      <section
        className="py-6"
        style={{ borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="mx-auto max-w-4xl px-4 flex flex-wrap justify-center gap-x-12 gap-y-4">
          <Stat value="40,000+" label="vehicles covered" />
          <Stat value="30+" label="years of data" />
          <Stat value="100%" label="free" />
          <Stat value="Daily" label="NHTSA updates" />
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2
            className="text-2xl font-semibold text-center mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Browse by make
          </h2>
          <p
            className="text-center mb-10"
            style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-body)" }}
          >
            Select a manufacturer to explore models and safety data.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularMakes.map((m) => (
              <Link
                key={m.slug}
                href={`/${m.slug}`}
                className="flex flex-col items-center gap-2 p-5 rounded-xl no-underline transition-all hover:shadow-md"
                style={{
                  background: "white",
                  border: "1px solid var(--color-border)",
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {m.name}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {m.count} reports
                </span>
              </Link>
            ))}
            <Link
              href="/makes"
              className="flex flex-col items-center justify-center gap-1 p-5 rounded-xl no-underline transition-all hover:shadow-md"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-blue)" }}
              >
                {"All makes \u2192"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="py-16 px-4"
        style={{ background: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-2xl font-semibold text-center mb-12"
            style={{ color: "var(--color-text-primary)" }}
          >
            What you get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FeatureCard
              icon={<RecallIcon />}
              title="Recall alerts"
              description="Every active recall from NHTSA — the same database dealers use. Know immediately if your vehicle has an open safety recall."
            />
            <FeatureCard
              icon={<ComplaintIcon />}
              title="Owner complaints"
              description="Real complaints from real owners filed with the federal government. See patterns, common failures, and mileage at failure."
            />
            <FeatureCard
              icon={<RankIcon />}
              title="Reliability ranking"
              description="See how your vehicle compares to others in its class. Percentile rankings based on complaint frequency per 10,000 sold."
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
            style={{
              background: "var(--color-green-light)",
              color: "var(--color-green)",
            }}
          >
            Official government data
          </div>
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Data you can trust
          </h2>
          <p
            className="leading-relaxed mb-6"
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-body)",
            }}
          >
            Every data point on this site comes directly from the National
            Highway Traffic Safety Administration (NHTSA). We do not
            editorialize or add opinions — we surface the data, add context with
            statistical analysis, and let you make informed decisions.
          </p>
          <Link
            href="/methodology"
            className="text-sm font-medium no-underline"
            style={{ color: "var(--color-blue)" }}
          >
            {"Read our methodology \u2192"}
          </Link>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p
        className="text-xl font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3
        className="font-semibold mb-2"
        style={{ color: "var(--color-text-primary)", fontSize: "var(--text-h3)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {description}
      </p>
    </div>
  );
}

function RecallIcon() {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ background: "var(--color-red-light)" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="var(--color-red)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ComplaintIcon() {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ background: "var(--color-amber-light)" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          stroke="var(--color-amber)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function RankIcon() {
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ background: "var(--color-blue-light)" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 20V10m-6 10V4M6 20v-6"
          stroke="var(--color-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}