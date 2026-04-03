export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Maps slugs to their exact NHTSA API names for makes that don't follow simple title case */
const MAKE_NAME_MAP: Record<string, string> = {
  "mercedes-benz": "Mercedes-Benz",
  "land-rover": "Land Rover",
  "alfa-romeo": "Alfa Romeo",
  "bmw": "BMW",
  "gmc": "GMC",
  "ram": "Ram",
  "mini": "MINI",
};

export function fromSlug(slug: string): string {
  if (MAKE_NAME_MAP[slug]) return MAKE_NAME_MAP[slug];
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const MAKES_LIST = [
  { name: "Toyota", slug: "toyota" },
  { name: "Honda", slug: "honda" },
  { name: "Ford", slug: "ford" },
  { name: "Chevrolet", slug: "chevrolet" },
  { name: "Nissan", slug: "nissan" },
  { name: "Hyundai", slug: "hyundai" },
  { name: "Kia", slug: "kia" },
  { name: "BMW", slug: "bmw" },
  { name: "Mercedes-Benz", slug: "mercedes-benz" },
  { name: "Subaru", slug: "subaru" },
  { name: "Volkswagen", slug: "volkswagen" },
  { name: "Mazda", slug: "mazda" },
  { name: "Lexus", slug: "lexus" },
  { name: "Audi", slug: "audi" },
  { name: "Jeep", slug: "jeep" },
  { name: "Dodge", slug: "dodge" },
  { name: "Ram", slug: "ram" },
  { name: "GMC", slug: "gmc" },
  { name: "Chrysler", slug: "chrysler" },
  { name: "Buick", slug: "buick" },
  { name: "Cadillac", slug: "cadillac" },
  { name: "Lincoln", slug: "lincoln" },
  { name: "Acura", slug: "acura" },
  { name: "Infiniti", slug: "infiniti" },
  { name: "Mitsubishi", slug: "mitsubishi" },
  { name: "Volvo", slug: "volvo" },
  { name: "Porsche", slug: "porsche" },
  { name: "Land Rover", slug: "land-rover" },
  { name: "Mini", slug: "mini" },
  { name: "Fiat", slug: "fiat" },
  { name: "Alfa Romeo", slug: "alfa-romeo" },
  { name: "Genesis", slug: "genesis" },
  { name: "Tesla", slug: "tesla" },
] as const;
