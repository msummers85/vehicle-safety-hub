import type { MetadataRoute } from "next";
import { MAKES_LIST } from "@/lib/utils";
import { getModelsForMake } from "@/lib/nhtsa";

const BASE_URL = "https://vehiclesafetyhub.com";
const CURRENT_YEAR = 2026;
const START_YEAR = 2015;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/makes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/recalls`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/best/zero-recalls`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/data-sources`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Fetch all models for all makes in parallel
  const makeResults = await Promise.all(
    MAKES_LIST.map(async (make) => {
      const models = await getModelsForMake(make.name);
      return { make, models };
    })
  );

  const dynamicPages: MetadataRoute.Sitemap = [];

  for (const { make, models } of makeResults) {
    // Make page
    dynamicPages.push({
      url: `${BASE_URL}/${make.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    for (const model of models) {
      // Model page
      dynamicPages.push({
        url: `${BASE_URL}/${make.slug}/${model.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });

      // Year pages
      for (let year = CURRENT_YEAR; year >= START_YEAR; year--) {
        const isRecent = year >= CURRENT_YEAR - 2;
        dynamicPages.push({
          url: `${BASE_URL}/${make.slug}/${model.slug}/${year}`,
          lastModified: now,
          changeFrequency: isRecent ? "weekly" : "monthly",
          priority: isRecent ? 0.6 : 0.5,
        });
      }
    }
  }

  return [...staticPages, ...dynamicPages];
}
