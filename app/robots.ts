import type { MetadataRoute } from "next";
import { MAKES_LIST } from "@/lib/utils";

const BASE_URL = "https://www.vehiclesafetyhub.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      ...MAKES_LIST.map((m) => `${BASE_URL}/sitemap/${m.slug}`),
    ],
  };
}
