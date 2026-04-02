"use client";

import { useState, useEffect, useRef } from "react";
import { MAKES_LIST, toSlug } from "@/lib/utils";

const MAKES = MAKES_LIST.map((m) => m.name).sort();

export function CompareForm() {
  const [make1, setMake1] = useState("");
  const [model1, setModel1] = useState("");
  const [models1, setModels1] = useState<string[]>([]);
  const [loading1, setLoading1] = useState(false);

  const [make2, setMake2] = useState("");
  const [model2, setModel2] = useState("");
  const [models2, setModels2] = useState<string[]>([]);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    if (!make1) { setModels1([]); setModel1(""); return; }
    setModel1("");
    setLoading1(true);
    fetch(`/api/models?make=${encodeURIComponent(make1)}`)
      .then((r) => r.json())
      .then((data: string[]) => setModels1(data))
      .catch(() => setModels1([]))
      .finally(() => setLoading1(false));
  }, [make1]);

  useEffect(() => {
    if (!make2) { setModels2([]); setModel2(""); return; }
    setModel2("");
    setLoading2(true);
    fetch(`/api/models?make=${encodeURIComponent(make2)}`)
      .then((r) => r.json())
      .then((data: string[]) => setModels2(data))
      .catch(() => setModels2([]))
      .finally(() => setLoading2(false));
  }, [make2]);

  const canCompare = make1 && model1 && make2 && model2;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canCompare) return;
    const slug = `${toSlug(make1)}-${toSlug(model1)}-vs-${toSlug(make2)}-${toSlug(model2)}`;
    window.location.href = `/compare/${slug}`;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-2xl p-4 sm:p-6"
        style={{
          background: "white",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Vehicle 1 */}
          <div>
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              Vehicle 1
            </p>
            <div className="space-y-2">
              <MakeSelect value={make1} onChange={setMake1} />
              <ModelCombobox
                value={model1}
                onChange={setModel1}
                models={models1}
                loading={loading1}
                disabled={!make1}
              />
            </div>
          </div>

          {/* Vehicle 2 */}
          <div>
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              Vehicle 2
            </p>
            <div className="space-y-2">
              <MakeSelect value={make2} onChange={setMake2} />
              <ModelCombobox
                value={model2}
                onChange={setModel2}
                models={models2}
                loading={loading2}
                disabled={!make2}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canCompare}
          className="mt-4 w-full px-6 py-3 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-40"
          style={{
            background: "var(--color-blue)",
            cursor: canCompare ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (canCompare)
              e.currentTarget.style.background = "var(--color-blue-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-blue)";
          }}
        >
          Compare Safety Data
        </button>
      </div>
    </form>
  );
}

function MakeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 text-sm rounded-xl outline-none appearance-none cursor-pointer"
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
        Make
      </option>
      {MAKES.map((m) => (
        <option key={m} value={m}>
          {m}
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
    <div ref={wrapperRef} className="relative">
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
