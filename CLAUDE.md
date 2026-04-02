# Vehicle Safety Hub — Claude Code Instructions

## Project Overview
Programmatic SEO site showing vehicle safety data from NHTSA APIs. Deployed on Vercel via GitHub auto-deploy. Live at https://vehiclesafetyhub.com.

## Tech Stack
- **Framework:** Next.js (TypeScript, App Router, Turbopack)
- **Styling:** Tailwind CSS v4 (uses `@import "tailwindcss"`, NOT old `@tailwind` directives)
- **Font:** Inter via `next/font/google`
- **Deploy:** Vercel (auto-deploy on `git push`)
- **DNS:** Cloudflare
- **Forced light mode:** `color-scheme: only light` in globals.css

## Design System
- **Primary (CTA):** #0071e3
- **Trust/Gov green:** #248a3d
- **Recall red:** #d32f2f
- **Complaint amber:** #f59e0b
- **Background:** #ffffff (white), #f5f5f7 (surface)
- **Text:** #1d1d1f (primary), #6e6e73 (secondary), #86868b (tertiary)
- **Border:** #e5e5e7
- **Style:** Apple-clean. Minimal borders, generous whitespace, no dark mode.

## URL Structure
```
/                           → Homepage
/makes/                     → All makes page
/[make]/                    → Make page (e.g., /toyota/)
/[make]/[model]/            → Model page (e.g., /toyota/camry/)
/[make]/[model]/[year]/     → Year/Make/Model page (core pSEO page)
/vin-lookup/                → VIN lookup tool (noindex)
/recalls/                   → Recent recalls feed
/compare/[x]-vs-[y]/       → Comparison pages (future)
/best/[category]/           → Category pages (future)
```

All URLs: lowercase, hyphens between words, no trailing slashes, no file extensions.

## NHTSA APIs (No API Key Required)

### Recalls by Year/Make/Model
```
GET https://api.nhtsa.gov/recalls/recallsByVehicle?make={make}&model={model}&modelYear={year}
```
Returns: `{ results: [{ NHTSACampaignNumber, Component, Summary, Consequence, Remedy, ... }] }`

### Complaints by Year/Make/Model
```
GET https://api.nhtsa.gov/complaints/complaintsByVehicle?make={make}&model={model}&modelYear={year}
```
Returns: `{ results: [{ components, summary, dateOfIncident, odiNumber, mileage, ... }] }`

### Investigations by Year/Make/Model
```
GET https://api.nhtsa.gov/investigations?make={make}&model={model}&modelYear={year}
```
Returns: `{ results: [{ investigationId, subject, summary, components, ... }] }`

### VIN Decode
```
GET https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}?format=json
```
Returns: `{ Results: [{ Make, Model, ModelYear, BodyClass, FuelTypePrimary, ... }] }`

### All Makes
```
GET https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json
```
Returns: `{ Results: [{ Make_ID, Make_Name }] }`

### Models for Make
```
GET https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/{make}?format=json
```
Returns: `{ Results: [{ Make_ID, Make_Name, Model_ID, Model_Name }] }`

## Data Fetching Pattern
All data fetching goes in `lib/nhtsa.ts`. Use typed interfaces for all API responses. Functions should:
- Accept lowercase slugs (e.g., "toyota") and convert to proper API format
- Handle errors gracefully (return empty arrays, not throw)
- Include proper TypeScript types for all return values

Example:
```typescript
export async function getRecalls(make: string, model: string, year: string): Promise<Recall[]> {
  const res = await fetch(
    `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`,
    { next: { revalidate: 86400 } } // ISR: 24-hour cache
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}
```

## Page Architecture (Four-Depth Template)
Every year/make/model page has four sections:

1. **Depth 1 — Answer the question:** Recall count, complaint count, investigation count, key specs. Immediate, zero friction.
2. **Depth 2 — Context:** Reliability percentile vs class, complaint trend, top issue categories. (Defer percentile calculation to later — just show counts for now.)
3. **Depth 3 — Decision:** Internal linking block (All [Make] Models, Best [Class], Compare). Keep simple for now.
4. **Depth 4 — Deep cut:** Full complaint table (sortable, with mileage), full recall details.

## ISR (Incremental Static Regeneration)
```typescript
export const revalidate = 86400; // 24 hours — matches NHTSA update frequency
```

For build-time generation, start with top ~100 most popular vehicles. Everything else generates on first request.

## SEO Requirements (Every Page)
- Unique `<title>` via Next.js Metadata API (`generateMetadata`)
- Unique meta description with recall/complaint counts
- Canonical URL via `alternates.canonical`
- BreadcrumbList JSON-LD schema
- Open Graph tags
- Vehicle pages also get: Car schema, FAQPage schema

Title formula: `[Year] [Make] [Model] Recalls, Problems & Safety | Vehicle Safety Hub`
Description formula: `[X] recalls and [Y] complaints for the [Year] [Make] [Model]. Check safety ratings, reliability data, and known issues.`

## File Organization
```
app/
  globals.css              → Design tokens, forced light mode
  layout.tsx               → Root layout, Inter font, site-wide schema
  page.tsx                 → Homepage
  not-found.tsx            → Custom 404
  makes/page.tsx           → All makes listing
  [make]/
    page.tsx               → Make page (all models for a make)
    [model]/
      page.tsx             → Model page (all years for a model)
      [year]/
        page.tsx           → Year/Make/Model page (core pSEO page)
  vin-lookup/
    page.tsx               → VIN lookup tool

components/
  Header.tsx               → Sticky header with nav
  Footer.tsx               → Four-column footer
  VehicleSearch.tsx         → Dual-mode search (Year/Make/Model + VIN)
  RecallCard.tsx            → Individual recall display
  ComplaintTable.tsx        → Sortable complaint table (Depth 4)
  Breadcrumbs.tsx           → Visual breadcrumbs + schema
  StatBar.tsx               → Key stats row (Depth 1)
  InternalLinkBlock.tsx     → 3-4 card grid (Depth 3)

lib/
  nhtsa.ts                 → All NHTSA API fetch functions
  types.ts                 → TypeScript interfaces for API responses
  utils.ts                 → URL slug helpers, formatting, make/model mappings
```

## Coding Standards
- Use Server Components by default. Only add "use client" when event handlers or hooks are needed.
- All API calls use `fetch` with `{ next: { revalidate: 86400 } }` for ISR.
- Use `@/` path alias for imports (e.g., `import { getRecalls } from '@/lib/nhtsa'`).
- No external UI libraries — plain Tailwind only.
- All make/model slugs are lowercase with hyphens (e.g., "grand-cherokee").
- Error boundaries: every data section should handle API failures gracefully (show "Data unavailable" not crash).

## Deployment
```powershell
npm run dev          # Test locally at http://localhost:3000
git add .
git commit -m "description"
git push             # Vercel auto-deploys in ~60 seconds
```

## What NOT To Build Yet
- Comparison pages (/compare/)
- Category pages (/best/)
- PDF/CSV export
- Email capture / alerts
- Ad placements (placeholders only)
- Repair cost estimates
- Reliability percentile calculations
- OG image generation
