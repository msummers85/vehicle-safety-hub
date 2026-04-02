"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toSlug } from "@/lib/utils";

interface VinResult {
  Make: string;
  Model: string;
  ModelYear: string;
  BodyClass: string;
  FuelTypePrimary: string;
  DriveType: string;
  EngineNumberOfCylinders: string;
  DisplacementL: string;
  TransmissionStyle: string;
  VehicleType: string;
}

export function VinLookupContent() {
  const searchParams = useSearchParams();
  const [vin, setVin] = useState("");
  const [result, setResult] = useState<VinResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const decodeVin = useCallback(async (vinValue: string) => {
    const cleaned = vinValue.trim().toUpperCase();
    if (cleaned.length !== 17) {
      setError("VIN must be exactly 17 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/vin-decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: cleaned }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to decode VIN.");
        return;
      }

      setResult(data.result);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const vinParam = searchParams.get("vin");
    if (vinParam) {
      setVin(vinParam.toUpperCase());
      decodeVin(vinParam);
    }
  }, [searchParams, decodeVin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    decodeVin(vin);
  };

  const makeSlug = result ? toSlug(result.Make) : "";
  const modelSlug = result ? toSlug(result.Model) : "";
  const safetyReportHref =
    result && result.Make && result.Model && result.ModelYear
      ? `/${makeSlug}/${modelSlug}/${result.ModelYear}`
      : null;

  const specs = result
    ? [
        { label: "Year", value: result.ModelYear },
        { label: "Make", value: result.Make },
        { label: "Model", value: result.Model },
        { label: "Body Class", value: result.BodyClass },
        { label: "Fuel Type", value: result.FuelTypePrimary },
        { label: "Drive Type", value: result.DriveType },
        {
          label: "Engine",
          value: [
            result.EngineNumberOfCylinders
              ? `${result.EngineNumberOfCylinders}-cyl`
              : "",
            result.DisplacementL ? `${result.DisplacementL}L` : "",
          ]
            .filter(Boolean)
            .join(" "),
        },
      ].filter((s) => s.value)
    : [];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          VIN Lookup
        </h1>
        <p
          className="mt-2 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Decode any VIN to see vehicle details and safety data.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl"
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            maxLength={17}
            className="flex-1 min-w-0 px-4 py-3 text-sm rounded-xl outline-none font-mono tracking-wider"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-primary)",
            }}
          />
          <button
            type="submit"
            disabled={vin.trim().length !== 17 || loading}
            className="px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40"
            style={{
              background: "var(--color-blue)",
              cursor:
                vin.trim().length === 17 && !loading
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            {loading ? "Decoding..." : "Look Up"}
          </button>
        </div>
        <p
          className="mt-2 text-center text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Find your VIN on the driver&apos;s side dashboard or inside the
          driver&apos;s door jamb.
        </p>
      </form>

      {error && (
        <div
          className="mt-6 rounded-xl px-5 py-4 text-sm font-medium"
          style={{
            background: "var(--color-red-light)",
            color: "var(--color-red)",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            {result.ModelYear} {result.Make} {result.Model}
          </h2>

          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--color-border)" }}
          >
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className="flex items-center px-5 py-3 text-sm"
                style={{
                  background:
                    i % 2 === 0 ? "white" : "var(--color-surface)",
                  borderTop:
                    i > 0 ? "1px solid var(--color-border)" : undefined,
                }}
              >
                <span
                  className="w-32 shrink-0 font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {spec.label}
                </span>
                <span style={{ color: "var(--color-text-primary)" }}>
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {safetyReportHref && (
            <Link
              href={safetyReportHref}
              className="mt-5 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white no-underline transition-all"
              style={{ background: "var(--color-blue)" }}
            >
              View full safety report
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10m-4-4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
