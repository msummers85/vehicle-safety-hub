import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vehicle Safety Hub — Recalls, Complaints & Reliability Data",
    template: "%s | Vehicle Safety Hub",
  },
  description:
    "Free vehicle safety lookup. Check recalls, complaints, and reliability data for any car, truck, or SUV. Powered by NHTSA government data.",
  metadataBase: new URL("https://vehiclesafetyhub.com"),
  alternates: {
    canonical: "https://vehiclesafetyhub.com",
  },
  openGraph: {
    title: "Vehicle Safety Hub — Recalls, Complaints & Reliability Data",
    description:
      "Free vehicle safety lookup. Check recalls, complaints, and reliability data for any car, truck, or SUV.",
    url: "https://vehiclesafetyhub.com",
    siteName: "Vehicle Safety Hub",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Force light mode */}
        <meta name="color-scheme" content="only light" />

        {/* Schema: Organization + WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "Vehicle Safety Hub",
                  url: "https://vehiclesafetyhub.com",
                  description:
                    "Free vehicle safety data powered by NHTSA government records.",
                },
                {
                  "@type": "WebSite",
                  name: "Vehicle Safety Hub",
                  url: "https://vehiclesafetyhub.com",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: {
                      "@type": "EntryPoint",
                      urlTemplate:
                        "https://vehiclesafetyhub.com/search?q={search_term_string}",
                    },
                    "query-input":
                      "required name=search_term_string",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}