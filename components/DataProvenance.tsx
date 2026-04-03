const today = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function DataProvenance() {
  return (
    <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
      Data source:{" "}
      <a
        href="https://www.nhtsa.gov"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
        style={{ color: "var(--color-text-tertiary)" }}
      >
        National Highway Traffic Safety Administration (NHTSA)
      </a>
      {" "}· Last updated {today}
    </p>
  );
}
