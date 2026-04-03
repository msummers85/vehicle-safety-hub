import { MAKES_LIST } from "@/lib/utils";

const BASE_URL = "https://vehiclesafetyhub.com";

export async function GET() {
  const sitemaps = [
    `${BASE_URL}/sitemap/main`,
    ...MAKES_LIST.map((m) => `${BASE_URL}/sitemap/${m.slug}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`).join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
