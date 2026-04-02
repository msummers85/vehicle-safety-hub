import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <p
        className="text-6xl font-semibold mb-4"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        404
      </p>
      <h1
        className="text-xl font-semibold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        Page not found
      </h1>
      <p
        className="mb-8 max-w-md"
        style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-body)" }}
      >
        The page you&apos;re looking for doesn&apos;t exist or the vehicle may
        not be in our database yet.
      </p>
      <Link
        href="/"
        className="px-6 py-3 text-sm font-semibold text-white rounded-xl no-underline transition-all"
        style={{ background: "var(--color-blue)" }}
      >
        Search for a vehicle
      </Link>
    </section>
  );
}