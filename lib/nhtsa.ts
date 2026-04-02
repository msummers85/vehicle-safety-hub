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

const fetchOptions: RequestInit = { next: { revalidate: 86400 } };

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
