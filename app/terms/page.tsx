import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Terms of Service | Vehicle Safety Hub",
  description:
    "Terms of service for Vehicle Safety Hub. We provide NHTSA vehicle safety data for informational purposes only.",
  alternates: { canonical: "https://vehiclesafetyhub.com/terms" },
  openGraph: {
    title: "Terms of Service | Vehicle Safety Hub",
    description:
      "Terms of service for Vehicle Safety Hub. We provide NHTSA vehicle safety data for informational purposes only.",
    url: "https://vehiclesafetyhub.com/terms",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Terms of Service", href: "/terms" },
        ]}
      />

      <h1
        className="mt-6 mb-2 text-3xl sm:text-4xl font-semibold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Terms of Service
      </h1>
      <p className="mb-8 text-sm" style={{ color: "var(--color-text-tertiary)" }}>
        Last updated: April 2, 2026
      </p>

      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Acceptance of Terms
        </h2>
        <p>
          By accessing and using Vehicle Safety Hub, you agree to be bound by these terms of
          service. If you do not agree with any part of these terms, please do not use our site.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Nature of Service
        </h2>
        <p>
          Vehicle Safety Hub provides access to publicly available vehicle safety data from the
          National Highway Traffic Safety Administration (NHTSA). We aggregate, organize, and
          present this data for informational purposes only. We are not affiliated with, endorsed
          by, or officially connected to NHTSA or the U.S. Department of Transportation.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          No Professional Advice
        </h2>
        <p>
          The information on this site does not constitute professional mechanical, legal, or
          safety advice. Vehicle safety decisions should consider multiple information sources. If
          you believe your vehicle has a safety defect, report it directly to NHTSA at{" "}
          <a
            href="https://www.nhtsa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "var(--color-blue)" }}
          >
            nhtsa.gov
          </a>{" "}
          and consult a qualified mechanic.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Data Accuracy
        </h2>
        <p>
          While we make every effort to display accurate and current information, all data
          originates from NHTSA&apos;s public databases and is subject to their data collection
          limitations. We do not guarantee the completeness, accuracy, or timeliness of any
          information displayed on this site. Recall and complaint data may be updated or
          corrected by NHTSA at any time.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Limitation of Liability
        </h2>
        <p>
          Vehicle Safety Hub and its operators shall not be held liable for any decisions made
          based on information presented on this site. We provide data as-is from government
          sources and make no warranties, express or implied, regarding its fitness for any
          particular purpose.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Intellectual Property
        </h2>
        <p>
          The data displayed on this site is sourced from U.S. government public databases and is
          not subject to copyright. The site design, code, and original content are the property
          of Vehicle Safety Hub.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Changes to Terms
        </h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the site after
          changes constitutes acceptance of the revised terms.
        </p>
      </div>
    </div>
  );
}
