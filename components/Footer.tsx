import Link from "next/link";

const topMakes = [
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Nissan",
  "Hyundai",
  "Kia",
  "BMW",
  "Mercedes-Benz",
  "Subaru",
];

const toolLinks = [
  { label: "VIN Lookup", href: "/vin-lookup" },
  { label: "Recent Recalls", href: "/recalls" },
  { label: "Compare Vehicles", href: "/compare" },
  { label: "Zero-Recall Vehicles", href: "/best/zero-recalls" },
];

const trustLinks = [
  { label: "About", href: "/about" },
  { label: "Methodology", href: "/methodology" },
  { label: "Data Sources", href: "/data-sources" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

function NHTSALink() {
  return <a href="https://www.nhtsa.gov" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--color-text-tertiary)" }}>National Highway Traffic Safety Administration</a>;
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto" style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: "var(--color-text-primary)" }}>Vehicle Safety Hub</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-tertiary)" }}>Free vehicle safety data powered by NHTSA government records. Recalls, complaints, and reliability information for every car, truck, and SUV.</p>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: "var(--color-text-primary)" }}>Browse by Make</p>
            <ul className="space-y-1.5">
              {topMakes.map((make) => (
                <li key={make}>
                  <Link href={`/${make.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm no-underline transition-colors" style={{ color: "var(--color-text-secondary)" }}>{make}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: "var(--color-text-primary)" }}>Tools</p>
            <ul className="space-y-1.5">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm no-underline transition-colors" style={{ color: "var(--color-text-secondary)" }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: "var(--color-text-primary)" }}>About</p>
            <ul className="space-y-1.5">
              {trustLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm no-underline transition-colors" style={{ color: "var(--color-text-secondary)" }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid var(--color-border)" }}>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{"\u00A9 " + year + " Vehicle Safety Hub. Not affiliated with NHTSA or any government agency."}</p>
          <p className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>{"Data source: "}<NHTSALink /></p>
        </div>
      </div>
    </footer>
  );
}
