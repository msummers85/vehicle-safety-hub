import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Our Methodology — How Vehicle Safety Hub Works",
  description:
    "Learn how Vehicle Safety Hub collects, processes, and displays vehicle safety data from NHTSA's public APIs.",
  alternates: { canonical: "https://vehiclesafetyhub.com/methodology" },
  openGraph: {
    title: "Our Methodology — How Vehicle Safety Hub Works",
    description:
      "Learn how Vehicle Safety Hub collects, processes, and displays vehicle safety data from NHTSA's public APIs.",
    url: "https://vehiclesafetyhub.com/methodology",
    siteName: "Vehicle Safety Hub",
    type: "website",
  },
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Methodology", href: "/methodology" },
        ]}
      />

      <h1
        className="mt-6 mb-8 text-3xl sm:text-4xl font-semibold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        How Our Data Works
      </h1>

      <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Data Sources
        </h2>
        <p>
          All vehicle safety data on this site comes from the National Highway Traffic Safety
          Administration (NHTSA), a division of the U.S. Department of Transportation. NHTSA
          maintains several public databases that we query through their official APIs. These
          include the Recalls API for manufacturer safety recalls, the Complaints API for
          consumer-reported vehicle problems, and the Safety Ratings API for crash test results
          from NHTSA&apos;s New Car Assessment Program (NCAP).
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          How Recalls Work
        </h2>
        <p>
          When a manufacturer or NHTSA determines that a vehicle has a safety defect or does
          not comply with federal safety standards, a recall is issued. Each recall has a unique
          NHTSA Campaign Number and includes information about the affected vehicles, the nature
          of the defect, the potential consequences, and the manufacturer&apos;s remedy. Vehicle
          Safety Hub displays all active recalls for any vehicle searched on our site.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          How Complaints Work
        </h2>
        <p>
          Any vehicle owner can file a safety complaint with NHTSA through their online portal.
          Complaints describe problems experienced with a vehicle, including the component
          involved, mileage at time of failure, and whether the issue resulted in a crash, fire,
          injury, or death. We display all complaints on file for each vehicle and group them by
          component category to help identify patterns.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Safety Ratings
        </h2>
        <p>
          NHTSA&apos;s 5-Star Safety Ratings program evaluates vehicles through frontal crash,
          side crash, and rollover resistance tests. Ratings range from 1 star (lowest) to 5
          stars (highest). Not all vehicles have been tested — ratings availability depends on
          NHTSA&apos;s testing schedule. We display ratings when available and clearly indicate
          when a vehicle has not been rated.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Update Frequency
        </h2>
        <p>
          Our data refreshes every 24 hours through NHTSA&apos;s APIs. This means new recalls,
          complaints, and ratings typically appear on our site within one day of being published
          by NHTSA.
        </p>

        <h2
          className="text-xl font-semibold pt-4"
          style={{ color: "var(--color-text-primary)" }}
        >
          Limitations
        </h2>
        <p>
          While we strive for accuracy, all data originates from NHTSA and is subject to their
          data collection and publication processes. Complaint counts reflect reports filed with
          NHTSA and may not represent the full scope of issues experienced by vehicle owners.
          Safety ratings reflect controlled test conditions and may not predict real-world crash
          outcomes. We encourage users to verify critical safety information directly with NHTSA
          at{" "}
          <a
            href="https://www.nhtsa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "var(--color-blue)" }}
          >
            nhtsa.gov
          </a>.
        </p>
      </div>
    </div>
  );
}
