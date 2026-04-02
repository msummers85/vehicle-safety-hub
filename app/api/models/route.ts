import { NextRequest, NextResponse } from "next/server";
import { getModelsForMake } from "@/lib/nhtsa";

export async function GET(request: NextRequest) {
  const make = request.nextUrl.searchParams.get("make");
  if (!make) {
    return NextResponse.json([]);
  }
  const models = await getModelsForMake(make);
  const sorted = models
    .map((m) => m.name)
    .sort((a, b) => a.localeCompare(b));
  return NextResponse.json(sorted);
}
