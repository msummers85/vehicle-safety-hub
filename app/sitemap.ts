import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // This is intentionally minimal — it serves as the sitemap index entry point.
  // The full sitemap with all URLs is served via /sitemap/[id] route handlers.
  // Google will discover sub-sitemaps from the sitemap index at /sitemap-index.xml
  const now = new Date();

  return [
    { url: "https://vehiclesafetyhub.com", lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: "https://vehiclesafetyhub.com/makes", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://vehiclesafetyhub.com/recalls", lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: "https://vehiclesafetyhub.com/compare", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://vehiclesafetyhub.com/best/zero-recalls", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://vehiclesafetyhub.com/about", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://vehiclesafetyhub.com/methodology", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://vehiclesafetyhub.com/data-sources", lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: "https://vehiclesafetyhub.com/privacy", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: "https://vehiclesafetyhub.com/terms", lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    // Sub-sitemap references for Google to discover
    ...["toyota", "honda", "ford", "chevrolet", "nissan", "hyundai", "kia", "bmw",
      "mercedes-benz", "subaru", "volkswagen", "mazda", "lexus", "audi", "jeep",
      "dodge", "ram", "gmc", "chrysler", "buick", "cadillac", "lincoln", "acura",
      "infiniti", "mitsubishi", "volvo", "porsche", "land-rover", "mini", "fiat",
      "alfa-romeo", "genesis", "tesla"
    ].map((slug) => ({
      url: `https://vehiclesafetyhub.com/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
