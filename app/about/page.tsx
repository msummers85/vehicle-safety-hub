import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "About Vehicle Safety Hub | Independent Vehicle Safety Data",
  description:
    "Vehicle Safety Hub is an independent platform that makes NHTSA government safety data accessible and understandable for every car buyer and vehicle owner.",
  alternates: { canonical: "https://vehiclesafetyhub.com/about" },
  openGraph: {
    title: "About Vehicle Safety Hub | Independent Vehicle Safety Data",
    description:
      "Vehicle Safety Hub is an independent platform that makes NHTSA government safety data accessible and understandable.",
    url: "https://vehiclesafetyhub.com/about",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
      />

      <h1
        className="mt-6 mb-8 text-3xl sm:text-4xl font-semibold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        About Vehicle Safety Hub
      </h1>

      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        <p>
          Vehicle Safety Hub is an independent vehicle safety research platform that makes
          government safety data accessible and understandable. We aggregate data from the
          National Highway Traffic Safety Administration (NHTSA) — including recalls, consumer
          complaints, and crash test ratings — and present it in a clear, searchable format
          that helps people make informed decisions about vehicle safety.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Why We Built This
        </h2>
        <p>
          Government safety data is public, but it&apos;s scattered across multiple databases
          and difficult to navigate. We believe every car buyer, vehicle owner, and parent
          deserves easy access to the safety record of any vehicle — without paywalls, without
          ads cluttering the data, and without editorial bias.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          How It Works
        </h2>
        <p>
          Every vehicle page on this site pulls data directly from NHTSA&apos;s public APIs in
          real time. Recall notices, consumer complaints, and crash test safety ratings are
          retrieved and updated every 24 hours. We don&apos;t editorialize the data — we
          organize it, contextualize it, and let the numbers speak for themselves.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          What We Don&apos;t Do
        </h2>
        <p>
          We don&apos;t sell vehicles, accept manufacturer sponsorships, or provide paid
          reviews. We don&apos;t collect your VIN or personal information. Our only goal is to
          help you access the safety data you need.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Contact
        </h2>
        <p>
          For questions or corrections, email{" "}
          <a
            href="mailto:contact@vehiclesafetyhub.com"
            className="underline"
            style={{ color: "var(--color-blue)" }}
          >
            contact@vehiclesafetyhub.com
          </a>.
        </p>
      </div>
    </div>
  );
}
