import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { toSlug } from "@/lib/utils";

const RECALLS_API = "https://api.nhtsa.gov/recalls/recallsByVehicle";

const POPULAR_MAKES = [
  "Toyota", "Honda", "Ford", "Chevrolet", "Nissan",
  "Hyundai", "Kia", "BMW", "Tesla", "Subaru",
  "Mazda", "Volkswagen", "Mercedes-Benz", "Lexus", "Jeep",
  "Dodge", "Ram", "GMC", "Chrysler", "Acura",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = [String(CURRENT_YEAR), String(CURRENT_YEAR - 1)];

interface RecallResult {
  ReportReceivedDate: string;
  Make: string;
  Model: string;
  ModelYear: string;
  NHTSACampaignNumber: string;
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 8);

  const revalidatedPaths = new Set<string>();
  const newRecalls: { campaign: string; make: string; model: string; year: string }[] = [];

  // Fetch recalls for popular makes across current and previous year
  const fetches = POPULAR_MAKES.flatMap((make) =>
    YEARS.map(async (year) => {
      try {
        const res = await fetch(
          `${RECALLS_API}?make=${encodeURIComponent(make)}&model=&modelYear=${year}`,
          { cache: "no-store" }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return (data.results ?? []) as RecallResult[];
      } catch {
        return [];
      }
    })
  );

  const results = await Promise.all(fetches);

  for (const recalls of results) {
    for (const recall of recalls) {
      // Parse date — format is MM/DD/YYYY
      const [month, day, yr] = recall.ReportReceivedDate.split("/");
      const recallDate = new Date(`${yr}-${month}-${day}`);

      if (recallDate >= cutoff) {
        const makeSlug = toSlug(recall.Make);
        const modelSlug = toSlug(recall.Model);
        const year = recall.ModelYear;

        newRecalls.push({
          campaign: recall.NHTSACampaignNumber,
          make: recall.Make,
          model: recall.Model,
          year,
        });

        // Revalidate affected paths
        const paths = [
          `/${makeSlug}`,
          `/${makeSlug}/${modelSlug}`,
          `/${makeSlug}/${modelSlug}/${year}`,
        ];

        for (const path of paths) {
          if (!revalidatedPaths.has(path)) {
            revalidatePath(path);
            revalidatedPaths.add(path);
          }
        }
      }
    }
  }

  // Always revalidate the recalls feed and homepage
  if (newRecalls.length > 0) {
    revalidatePath("/recalls");
    revalidatePath("/");
    revalidatedPaths.add("/recalls");
    revalidatedPaths.add("/");
  }

  const summary = {
    timestamp: new Date().toISOString(),
    newRecalls: newRecalls.length,
    revalidatedPaths: revalidatedPaths.size,
    paths: Array.from(revalidatedPaths),
    recalls: newRecalls.slice(0, 20),
  };

  console.log(
    `[check-recalls] Found ${newRecalls.length} new recalls, revalidated ${revalidatedPaths.size} paths`
  );

  return NextResponse.json(summary);
}
