import { NextResponse } from "next/server";

const VIN_API = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues";
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

export async function POST(request: Request) {
  let body: { vin?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const vin = (body.vin ?? "").trim().toUpperCase();

  if (vin.length !== 17 || !VIN_REGEX.test(vin)) {
    return NextResponse.json(
      { error: "VIN must be exactly 17 alphanumeric characters (no I, O, or Q)" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${VIN_API}/${encodeURIComponent(vin)}?format=json`
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "NHTSA API unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const raw = data.Results?.[0];

    if (!raw || !raw.Make) {
      return NextResponse.json(
        { error: "Could not decode this VIN" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      result: {
        Make: raw.Make || "",
        Model: raw.Model || "",
        ModelYear: raw.ModelYear || "",
        BodyClass: raw.BodyClass || "",
        FuelTypePrimary: raw.FuelTypePrimary || "",
        DriveType: raw.DriveType || "",
        EngineNumberOfCylinders: raw.EngineNumberOfCylinders || "",
        DisplacementL: raw.DisplacementL || "",
        TransmissionStyle: raw.TransmissionStyle || "",
        VehicleType: raw.VehicleType || "",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to decode VIN" },
      { status: 500 }
    );
  }
}
