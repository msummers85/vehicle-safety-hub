import type { MetadataRoute } from "next";
import { MAKES_LIST } from "@/lib/utils";

const BASE_URL = "https://vehiclesafetyhub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const makePages: MetadataRoute.Sitemap = MAKES_LIST.map((m) => ({
    url: `${BASE_URL}/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

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
    ...makePages,
  ];
}
