import type {
  Recall,
  Complaint,
  SafetyRating,
  VehicleData,
  VinResult,
} from "./types";
import { toSlug } from "./utils";

const RECALLS_API = "https://api.nhtsa.gov/recalls/recallsByVehicle";
const COMPLAINTS_API = "https://api.nhtsa.gov/complaints/complaintsByVehicle";
const SAFETY_RATINGS_API = "https://api.nhtsa.gov/SafetyRatings";
const VIN_API = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues";
const ALL_MAKES_API =
  "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json";
const MODELS_API =
  "https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake";

const fetchOptions: RequestInit = { next: { revalidate: 604800 } };

export async function getRecalls(
  make: string,
  model: string,
  year: string
): Promise<Recall[]> {
  try {
    const res = await fetch(
      `${RECALLS_API}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`,
      fetchOptions
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getComplaints(
  make: string,
  model: string,
  year: string
): Promise<Complaint[]> {
  try {
    const res = await fetch(
      `${COMPLAINTS_API}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`,
      fetchOptions
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getSafetyRating(
  make: string,
  model: string,
  year: string
): Promise<SafetyRating | null> {
  try {
    const variantsRes = await fetch(
      `${SAFETY_RATINGS_API}/modelyear/${encodeURIComponent(year)}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}?format=json`,
      fetchOptions
    );
    if (!variantsRes.ok) return null;
    const variantsData = await variantsRes.json();
    const variants = variantsData.Results ?? [];
    if (variants.length === 0) return null;

    const vehicleId = variants[0].VehicleId;
    if (!vehicleId) return null;

    const ratingRes = await fetch(
      `${SAFETY_RATINGS_API}/VehicleId/${vehicleId}?format=json`,
      fetchOptions
    );
    if (!ratingRes.ok) return null;
    const ratingData = await ratingRes.json();
    const result = ratingData.Results?.[0];
    if (!result) return null;

    return {
      OverallRating: result.OverallRating ?? "Not Rated",
      OverallFrontCrashRating: result.OverallFrontCrashRating ?? "Not Rated",
      OverallSideCrashRating: result.OverallSideCrashRating ?? "Not Rated",
      RolloverRating: result.RolloverRating ?? "Not Rated",
      VehicleDescription: result.VehicleDescription ?? "",
      VehicleId: vehicleId,
    };
  } catch {
    return null;
  }
}

export async function getVehicleData(
  make: string,
  model: string,
  year: string
): Promise<VehicleData> {
  const [recalls, complaints, safetyRating] = await Promise.all([
    getRecalls(make, model, year),
    getComplaints(make, model, year),
    getSafetyRating(make, model, year),
  ]);
  return { recalls, complaints, safetyRating };
}

export async function decodeVin(vin: string): Promise<VinResult | null> {
  try {
    const res = await fetch(
      `${VIN_API}/${encodeURIComponent(vin)}?format=json`,
      fetchOptions
    );
    if (!res.ok) return null;
    const data = await res.json();
    const result = data.Results?.[0];
    if (!result || !result.Make) return null;
    return result as VinResult;
  } catch {
    return null;
  }
}

export async function getAllMakes(): Promise<
  { id: number; name: string; slug: string }[]
> {
  try {
    const res = await fetch(ALL_MAKES_API, fetchOptions);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.Results ?? []).map(
      (m: { Make_ID: number; Make_Name: string }) => ({
        id: m.Make_ID,
        name: m.Make_Name,
        slug: toSlug(m.Make_Name),
      })
    );
  } catch {
    return [];
  }
}

const COMPONENT_MAP: [RegExp, string][] = [
  [/^SERVICE BRAKES|^PARKING BRAKE/i, "brakes"],
  [/^POWER TRAIN|^AUTOMATIC TRANSMISSION|^MANUAL TRANSMISSION/i, "powertrain"],
  [/^ENGINE AND ENGINE COOLING|^ENGINE/i, "engine"],
  [/^ELECTRICAL SYSTEM/i, "electrical"],
  [/^AIR BAGS/i, "airbags"],
  [/^STEERING/i, "steering"],
  [/^SUSPENSION/i, "suspension"],
  [/^FUEL SYSTEM/i, "fuel-system"],
  [/^EXTERIOR LIGHTING|^INTERIOR LIGHTING/i, "lights"],
  [/^VISIBILITY|^WINDSHIELD WIPER/i, "visibility"],
  [/^SEAT BELT/i, "seat-belts"],
  [/^TIRES/i, "tires"],
  [/^WHEELS/i, "wheels"],
  [/^SEATS/i, "seats"],
  [/^STRUCTURE|^BODY/i, "structure"],
  [/^VEHICLE SPEED CONTROL|^CRUISE CONTROL/i, "speed-control"],
  [/^LATCHES|^LOCKS|^DOOR/i, "latches"],
];

export const COMPONENT_LABELS: Record<string, string> = {
  brakes: "Brakes",
  powertrain: "Powertrain",
  engine: "Engine",
  electrical: "Electrical",
  airbags: "Airbags",
  steering: "Steering",
  suspension: "Suspension",
  "fuel-system": "Fuel System",
  lights: "Lights",
  visibility: "Visibility",
  "seat-belts": "Seat Belts",
  tires: "Tires",
  wheels: "Wheels",
  seats: "Seats",
  structure: "Structure",
  "speed-control": "Speed Control",
  latches: "Latches & Locks",
  other: "Other",
};

/** Map a raw NHTSA component string to a clean category slug */
export function classifyComponent(raw: string): string[] {
  const parts = raw.split(" | ").map((s) => s.trim()).filter(Boolean);
  const categories = new Set<string>();
  for (const part of parts) {
    let matched = false;
    for (const [pattern, slug] of COMPONENT_MAP) {
      if (pattern.test(part)) {
        categories.add(slug);
        matched = true;
        break;
      }
    }
    if (!matched) categories.add("other");
  }
  return categories.size > 0 ? Array.from(categories) : ["other"];
}

/** Get component category counts for a set of complaints */
export function getComponentCounts(
  complaints: { components: string }[]
): { slug: string; label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of complaints) {
    const cats = classifyComponent(c.components || "Unknown");
    for (const cat of cats) {
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([slug, count]) => ({
    slug,
    label: COMPONENT_LABELS[slug] ?? slug,
    count,
  })).sort((a, b) => b.count - a.count);
}

/** Resolve a model slug to its canonical NHTSA name via cached API lookup */
export async function resolveModelName(
  make: string,
  modelSlug: string
): Promise<string> {
  const models = await getModelsForMake(make);
  const match = models.find((m) => m.slug === modelSlug);
  return match?.name ?? modelSlug;
}

export async function getModelsForMake(
  make: string
): Promise<{ id: number; name: string; slug: string }[]> {
  try {
    const res = await fetch(
      `${MODELS_API}/${encodeURIComponent(make)}?format=json`,
      fetchOptions
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.Results ?? []).map(
      (m: { Model_ID: number; Model_Name: string }) => ({
        id: m.Model_ID,
        name: m.Model_Name,
        slug: toSlug(m.Model_Name),
      })
    );
  } catch {
    return [];
  }
}
