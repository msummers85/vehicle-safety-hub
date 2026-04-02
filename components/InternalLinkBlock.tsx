import Link from "next/link";

interface InternalLinkBlockProps {
  make: string;
  model: string;
  makeSlug: string;
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InternalLinkBlock({
  make,
  model,
  makeSlug,
}: InternalLinkBlockProps) {
  const links = [
    {
      label: `All ${make} Models`,
      href: `/${makeSlug}/`,
      enabled: true,
    },
    {
      label: `Compare ${model}`,
      href: "#",
      enabled: false,
    },
    {
      label: "Vehicles with Zero Recalls",
      href: "#",
      enabled: false,
    },
    {
      label: "View All Makes",
      href: "/makes/",
      enabled: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {links.map((link) => {
        if (!link.enabled) {
          return (
            <span
              key={link.label}
              className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-tertiary)",
              }}
            >
              {link.label}
              <ArrowIcon />
            </span>
          );
        }

        return (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium no-underline transition-colors hover:brightness-95"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
            }}
          >
            {link.label}
            <ArrowIcon />
          </Link>
        );
      })}
    </div>
  );
}
