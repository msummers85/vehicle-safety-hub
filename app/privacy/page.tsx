import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Privacy Policy | Vehicle Safety Hub",
  description:
    "Vehicle Safety Hub's privacy policy. We don't collect personal information, require accounts, or store your VIN searches.",
  alternates: { canonical: "https://vehiclesafetyhub.com/privacy" },
  openGraph: {
    title: "Privacy Policy | Vehicle Safety Hub",
    description:
      "Vehicle Safety Hub's privacy policy. We don't collect personal information or store your searches.",
    url: "https://vehiclesafetyhub.com/privacy",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy" },
        ]}
      />

      <h1
        className="mt-6 mb-2 text-3xl sm:text-4xl font-semibold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Privacy Policy
      </h1>
      <p className="mb-8 text-sm" style={{ color: "var(--color-text-tertiary)" }}>
        Last updated: April 2, 2026
      </p>

      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Information We Collect
        </h2>
        <p>
          Vehicle Safety Hub does not require account creation, login, or personal information
          to use our site. We do not collect your name, email address, VIN, or any
          vehicle-specific information you search for. When you use our VIN lookup tool, the VIN
          is sent directly to NHTSA&apos;s API and is not stored on our servers.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Analytics
        </h2>
        <p>
          We use Google Analytics 4 to understand how visitors use our site. This collects
          anonymous usage data including pages viewed, time spent on site, device type, and
          general geographic region. This data is aggregated and cannot identify individual
          users. You can opt out of Google Analytics by installing the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "var(--color-blue)" }}
          >
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Cookies
        </h2>
        <p>
          We use only essential cookies required for site functionality. Google Analytics sets
          its own cookies for usage tracking. We do not use advertising cookies or tracking
          pixels.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Third-Party Services
        </h2>
        <p>
          Our site is hosted on Vercel. Our domain is managed through Cloudflare. Vehicle data
          is retrieved from NHTSA APIs. Each of these services has their own privacy policies.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Data Retention
        </h2>
        <p>
          We do not store any user-submitted data. Vehicle safety data is cached temporarily (up
          to 24 hours) to improve site performance and is refreshed from NHTSA&apos;s APIs on a
          daily basis.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Changes to This Policy
        </h2>
        <p>
          We may update this privacy policy from time to time. The date at the top of this page
          indicates when it was last revised.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Contact
        </h2>
        <p>
          If you have questions about this privacy policy, contact us at{" "}
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
