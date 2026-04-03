"use client";

import { useState } from "react";
import Link from "next/link";

export function ClickableCard({
  href,
  children,
  className = "",
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [clicked, setClicked] = useState(false);

  return (
    <Link
      href={href}
      onClick={() => setClicked(true)}
      className={`${className} ${clicked ? "animate-pulse" : ""}`}
      style={{
        ...style,
        opacity: clicked ? 0.6 : undefined,
      }}
    >
      {clicked ? (
        <span style={{ color: "var(--color-text-tertiary)" }}>Loading…</span>
      ) : (
        children
      )}
    </Link>
  );
}
