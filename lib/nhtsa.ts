import type {
  Recall,
  Complaint,
  Investigation,
  VehicleData,
  VinResult,
} from "./types";
import { toSlug } from "./utils";

const RECALLS_API = "https://api.nhtsa.gov/recalls/recallsByVehicle";
const COMPLAINTS_API = "https://api.nhtsa.gov/complaints/complaintsByVehicle";
const INVESTIGATIONS_API = "https://api.nhtsa.gov/investigations";
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

export async function getInvestigations(
  make: string,
  model: string,
  year: string
): Promise<Investigation[]> {
  try {
    const res = await fetch(
      `${INVESTIGATIONS_API}?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${year}`,
      fetchOptions
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getVehicleData(
  make: string,
  model: string,
  year: string
): Promise<VehicleData> {
  const [recalls, complaints, investigations] = await Promise.all([
    getRecalls(make, model, year),
    getComplaints(make, model, year),
    getInvestigations(make, model, year),
  ]);
  return { recalls, complaints, investigations };
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
