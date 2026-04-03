import type { MetadataRoute } from "next";
import { MAKES_LIST, toSlug } from "@/lib/utils";
import { getModelsForMake } from "@/lib/nhtsa";

const BASE_URL = "https://vehiclesafetyhub.com";
const CURRENT_YEAR = 2026;
const START_YEAR = 2015;

// ID 0 = main sitemap, IDs 1..N = one per make
export async function generateSitemaps() {
  return [
    { id: 0 },
    ...MAKES_LIST.map((_, i) => ({ id: i + 1 })),
  ];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Main sitemap
  if (id === 0) {
    return [
      {
        url: BASE_URL,
        lastModified: now,
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/makes`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/recalls`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${BASE_URL}/compare`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/best/zero-recalls`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/about`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/methodology`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/data-sources`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      },
      {
        url: `${BASE_URL}/privacy`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.3,
      },
      {
        url: `${BASE_URL}/terms`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.3,
      },
      // All make pages
      ...MAKES_LIST.map((m) => ({
        url: `${BASE_URL}/${m.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  }

  // Per-make sitemap
  const makeIndex = id - 1;
  if (makeIndex < 0 || makeIndex >= MAKES_LIST.length) return [];

  const make = MAKES_LIST[makeIndex];
  const models = await getModelsForMake(make.name);
  const entries: MetadataRoute.Sitemap = [];

  for (const model of models) {
    // Model page
    entries.push({
      url: `${BASE_URL}/${make.slug}/${model.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    // Year/make/model pages
    for (let year = CURRENT_YEAR; year >= START_YEAR; year--) {
      const isRecent = year >= CURRENT_YEAR - 2;
      entries.push({
        url: `${BASE_URL}/${make.slug}/${model.slug}/${year}`,
        lastModified: now,
        changeFrequency: isRecent ? "weekly" : "monthly",
        priority: isRecent ? 0.6 : 0.5,
      });
    }
  }

  return entries;
}
