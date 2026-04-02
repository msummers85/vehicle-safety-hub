"use client";

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <ShieldIcon />
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Vehicle Safety Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/recalls">Recalls</NavLink>
            <NavLink href="/vin-lookup">VIN Lookup</NavLink>
            <NavLink href="/best/zero-recalls">Zero Recalls</NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 flex flex-col gap-1">
            <MobileNavLink
              href="/recalls"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recalls
            </MobileNavLink>
            <MobileNavLink
              href="/vin-lookup"
              onClick={() => setMobileMenuOpen(false)}
            >
              VIN Lookup
            </MobileNavLink>
            <MobileNavLink
              href="/best/zero-recalls"
              onClick={() => setMobileMenuOpen(false)}
            >
              Zero Recalls
            </MobileNavLink>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm no-underline transition-colors"
      style={{ color: "var(--color-text-secondary)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = "var(--color-text-primary)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "var(--color-text-secondary)")
      }
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-sm no-underline rounded-lg transition-colors"
      style={{ color: "var(--color-text-secondary)" }}
    >
      {children}
    </Link>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2L4 6.5V13C4 19.35 8.26 25.22 14 27C19.74 25.22 24 19.35 24 13V6.5L14 2Z"
        fill="#0071e3"
        fillOpacity="0.1"
        stroke="#0071e3"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 14L13 16.5L18 11.5"
        stroke="#0071e3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12h18M3 6h18M3 18h18"
        stroke="var(--color-text-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="var(--color-text-primary)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}