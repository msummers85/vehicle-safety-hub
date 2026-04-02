import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIN Lookup — Vehicle Safety Hub",
  description:
    "Decode any VIN to see vehicle details, safety data, and recall information.",
  robots: { index: false, follow: true },
};

export default function VinLookupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
