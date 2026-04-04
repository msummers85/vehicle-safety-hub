import Link from "next/link";

interface ComponentPillsProps {
  components: { slug: string; label: string; count: number }[];
  basePath: string;
  activeSlug?: string;
}

export function ComponentPills({ components, basePath, activeSlug }: ComponentPillsProps) {
  if (components.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {components.map((c) => {
        const isActive = c.slug === activeSlug;
        return (
          <Link
            key={c.slug}
            href={`${basePath}/${c.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium no-underline transition-colors"
            style={{
              background: isActive ? "#d32f2f" : "var(--color-surface)",
              color: isActive ? "white" : "var(--color-text-primary)",
              border: isActive ? "1px solid #d32f2f" : "1px solid var(--color-border)",
            }}
          >
            {c.label}
            <span
              className="text-xs tabular-nums"
              style={{ opacity: 0.7 }}
            >
              {c.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
