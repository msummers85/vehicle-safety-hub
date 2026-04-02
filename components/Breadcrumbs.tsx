import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `https://vehiclesafetyhub.com${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    &gt;
                  </span>
                )}
                {isLast ? (
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="no-underline transition-colors hover:underline"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
