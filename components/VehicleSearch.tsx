"use client";

import { useState, useEffect, useRef } from "react";
import { MAKES_LIST, toSlug } from "@/lib/utils";

type SearchMode = "ymm" | "vin";

const YEARS = Array.from({ length: 30 }, (_, i) =>
  (new Date().getFullYear() + 1 - i).toString()
);

const MAKES = MAKES_LIST.map((m) => m.name).sort();

export function VehicleSearch() {
  const [mode, setMode] = useState<SearchMode>("ymm");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");

  const [models, setModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  useEffect(() => {
    if (!make) {
      setModels([]);
      setModel("");
      return;
    }
    setModel("");
    setModelsLoading(true);
    fetch(`/api/models?make=${encodeURIComponent(make)}`)
      .then((r) => r.json())
      .then((data: string[]) => setModels(data))
      .catch(() => setModels([]))
      .finally(() => setModelsLoading(false));
  }, [make]);

  const handleYMMSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year || !make || !model) return;
    window.location.href = `/${toSlug(make)}/${toSlug(model)}/${year}`;
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
            <ModelCombobox
              value={model}
              onChange={setModel}
              models={models}
              loading={modelsLoading}
              disabled={!make}
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

function ModelCombobox({
  value,
  onChange,
  models,
  loading,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  models: string[];
  loading: boolean;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? models.filter((m) => m.toLowerCase().includes(query.toLowerCase()))
    : models;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync query with selected value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  function selectModel(m: string) {
    onChange(m);
    setQuery(m);
    setOpen(false);
    inputRef.current?.blur();
  }

  return (
    <div ref={wrapperRef} className="flex-1 min-w-0 relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        disabled={disabled}
        placeholder={loading ? "Loading models…" : disabled ? "Select make first" : "Model"}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange("");
          setOpen(true);
        }}
        onFocus={() => {
          if (models.length > 0) setOpen(true);
        }}
        className="w-full px-4 py-3 text-sm rounded-xl outline-none disabled:opacity-50"
        style={{
          background: "var(--color-surface)",
          color: query ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
        }}
        autoComplete="off"
      />
      {loading && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--color-border)", borderTopColor: "transparent" }}
        />
      )}
      {open && filtered.length > 0 && (
        <ul
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl py-1"
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {filtered.map((m) => (
            <li key={m}>
              <button
                type="button"
                onClick={() => selectModel(m)}
                className="w-full text-left px-4 text-sm transition-colors"
                style={{
                  color: "var(--color-text-primary)",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-surface)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {m}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && !loading && filtered.length === 0 && query && models.length > 0 && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 rounded-xl px-4 py-3 text-sm"
          style={{
            background: "white",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
            color: "var(--color-text-tertiary)",
          }}
        >
          No models match &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
