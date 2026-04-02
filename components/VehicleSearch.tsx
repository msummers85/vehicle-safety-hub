"use client";

import { useState } from "react";

type SearchMode = "ymm" | "vin";

// Static data — will be replaced with API-driven data in Session D
const YEARS = Array.from({ length: 30 }, (_, i) =>
  (new Date().getFullYear() + 1 - i).toString()
);

const MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti",
  "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Lincoln", "Mazda",
  "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Porsche", "Ram",
  "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

export function VehicleSearch() {
  const [mode, setMode] = useState<SearchMode>("ymm");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");

  const handleYMMSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !make || !model) return;
    const slug = `/${make.toLowerCase().replace(/[\s-]+/g, "-")}/${model.toLowerCase().replace(/[\s-]+/g, "-")}/${year}`;
    window.location.href = slug;
  };

  const handleVINSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = vin.trim().toUpperCase();
    if (cleaned.length !== 17) return;
    window.location.href = `/vin-lookup?vin=${cleaned}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode toggle */}
      <div
        className="flex rounded-full p-1 mb-5 w-fit mx-auto"
        style={{ background: "var(--color-surface)" }}
      >
        <button
          onClick={() => setMode("ymm")}
          className="px-5 py-2 text-sm font-medium rounded-full transition-all"
          style={{
            background: mode === "ymm" ? "white" : "transparent",
            color:
              mode === "ymm"
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
            boxShadow: mode === "ymm" ? "var(--shadow-sm)" : "none",
          }}
        >
          Year / Make / Model
        </button>
        <button
          onClick={() => setMode("vin")}
          className="px-5 py-2 text-sm font-medium rounded-full transition-all"
          style={{
            background: mode === "vin" ? "white" : "transparent",
            color:
              mode === "vin"
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
            boxShadow: mode === "vin" ? "var(--shadow-sm)" : "none",
          }}
        >
          VIN Number
        </button>
      </div>

      {/* Year/Make/Model form */}
      {mode === "ymm" && (
        <form onSubmit={handleYMMSubmit}>
          <div
            className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl"
            style={{
              background: "white",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <Select
              value={year}
              onChange={setYear}
              placeholder="Year"
              options={YEARS}
            />
            <Select
              value={make}
              onChange={setMake}
              placeholder="Make"
              options={MAKES}
            />
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
              className="flex-1 min-w-0 px-4 py-3 text-sm rounded-xl outline-none"
              style={{
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
              }}
            />
            <button
              type="submit"
              disabled={!year || !make || !model}
              className="px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40"
              style={{
                background: "var(--color-blue)",
                cursor: year && make && model ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (year && make && model)
                  e.currentTarget.style.background = "var(--color-blue-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-blue)";
              }}
            >
              Search
            </button>
          </div>
        </form>
      )}

      {/* VIN form */}
      {mode === "vin" && (
        <form onSubmit={handleVINSubmit}>
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
              disabled={vin.trim().length !== 17}
              className="px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40"
              style={{
                background: "var(--color-blue)",
                cursor: vin.trim().length === 17 ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (vin.trim().length === 17)
                  e.currentTarget.style.background = "var(--color-blue-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-blue)";
              }}
            >
              Look Up
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
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 min-w-0 px-4 py-3 text-sm rounded-xl outline-none appearance-none cursor-pointer"
      style={{
        background: "var(--color-surface)",
        color: value ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2386868b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        paddingRight: "2.5rem",
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}