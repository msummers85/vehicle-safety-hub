import { NextRequest } from "next/server";
import { MAKES_LIST } from "@/lib/utils";
import { getModelsForMake } from "@/lib/nhtsa";

const BASE_URL = "https://www.vehiclesafetyhub.com";
const CURRENT_YEAR = 2026;
const START_YEAR = 2015;

interface SitemapEntry {
  url: string;
  changefreq: string;
  priority: number;
}

function toXml(entries: SitemapEntry[]): string {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>
    <loc>${e.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

function mainSitemap(): SitemapEntry[] {
  return [
    { url: BASE_URL, changefreq: "daily", priority: 1.0 },
    { url: `${BASE_URL}/makes`, changefreq: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/recalls`, changefreq: "daily", priority: 0.9 },
    { url: `${BASE_URL}/compare`, changefreq: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/best/zero-recalls`, changefreq: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, changefreq: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/methodology`, changefreq: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/data-sources`, changefreq: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changefreq: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changefreq: "monthly", priority: 0.3 },
    ...MAKES_LIST.map((m) => ({
      url: `${BASE_URL}/${m.slug}`,
      changefreq: "weekly",
      priority: 0.8,
    })),
  ];
}

async function makeSitemap(makeSlug: string): Promise<SitemapEntry[]> {
  const make = MAKES_LIST.find((m) => m.slug === makeSlug);
  if (!make) return [];

  const models = await getModelsForMake(make.name);
  const entries: SitemapEntry[] = [];

  for (const model of models) {
    entries.push({
      url: `${BASE_URL}/${make.slug}/${model.slug}`,
      changefreq: "weekly",
      priority: 0.7,
    });

    for (let year = CURRENT_YEAR; year >= START_YEAR; year--) {
      const isRecent = year >= CURRENT_YEAR - 2;
      entries.push({
        url: `${BASE_URL}/${make.slug}/${model.slug}/${year}`,
        changefreq: isRecent ? "weekly" : "monthly",
        priority: isRecent ? 0.6 : 0.5,
      });
    }
  }

  return entries;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let entries: SitemapEntry[];
  if (id === "main") {
    entries = mainSitemap();
  } else {
    entries = await makeSitemap(id);
  }

  if (entries.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(toXml(entries), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
