#!/usr/bin/env node

/**
 * Generate SQL INSERT statements for the availability table.
 * Output can be pasted into the Supabase SQL Editor.
 *
 * Usage:  node scripts/generate-availability-sql.mjs > scripts/seed-availability.sql
 */

const SUPABASE_URL = "https://xuaeycylayiimocwnjix.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YWV5Y3lsYXlpaW1vY3duaml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4Mjc0NTIsImV4cCI6MjA4NjQwMzQ1Mn0.c32jt12ZlskBjXvyQV7v7ccdS6dAATfa6N0jnOBl888";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function supaGet(table, params = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers });
  if (!res.ok) throw new Error(`GET ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[''`èé]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BRAND_MATCHERS = {
  "van-leeuwen": (loc) => normalize(loc.name).startsWith("van leeuwen"),
  "ben-and-jerrys": (loc) => normalize(loc.name).includes("ben and jerry"),
  "ample-hills": (loc) => normalize(loc.name).startsWith("ample hills"),
  "haagen-dazs": (loc) => normalize(loc.name).includes("haagen daz") || normalize(loc.name).includes("hagen daz"),
  "jenis": (loc) => normalize(loc.name).startsWith("jeni") && normalize(loc.name).includes("splendid"),
  "salt-and-straw": (loc) => normalize(loc.name).includes("salt and straw") || normalize(loc.name).startsWith("salt straw"),
  "oddfellows": (loc) => normalize(loc.name).startsWith("oddfellow"),
  "morgensterns": (loc) => normalize(loc.name).startsWith("morgenstern"),
  "big-gay-ice-cream": (loc) => normalize(loc.name).includes("big gay ice cream"),
  "talenti": (loc) => normalize(loc.name).startsWith("talenti"),
  "carvel": (loc) => normalize(loc.name).startsWith("carvel"),
  "kilwins": (loc) => normalize(loc.name).startsWith("kilwin"),
  "tipsy-scoop": (loc) => normalize(loc.name).startsWith("tipsy scoop"),
  "soft-swerve": (loc) => normalize(loc.name).startsWith("soft swerve"),
  "daveys": (loc) => normalize(loc.name).startsWith("davey"),
  "eggers": (loc) => normalize(loc.name).startsWith("egger"),
  "emack-and-bolios": (loc) => normalize(loc.name).includes("emack") && normalize(loc.name).includes("bolio"),
  "ralphs-italian-ices": (loc) => normalize(loc.name).startsWith("ralph") && normalize(loc.name).includes("italian"),
  "il-laboratorio": (loc) => normalize(loc.name).includes("il laboratorio"),
  "caffe-panna": (loc) => normalize(loc.name).includes("caffe panna") || normalize(loc.name).includes("caff panna"),
  "blue-marble": (loc) => normalize(loc.name).includes("blue marble"),
  "noonas": (loc) => normalize(loc.name).startsWith("noona"),
  "surreal-creamery": (loc) => normalize(loc.name).includes("surreal creamery"),
  "softside": (loc) => normalize(loc.name).startsWith("softside"),
  "baskin-robbins": (loc) => normalize(loc.name).includes("baskin"),
  "pessos": (loc) => normalize(loc.name).startsWith("pesso"),
  "marvel-frozen-dairy": (loc) => normalize(loc.name).includes("marvel frozen"),
  "taiyaki-nyc": (loc) => normalize(loc.name).startsWith("taiyaki"),
  "serendipity": (loc) => normalize(loc.name).startsWith("serendipity"),
  "ghirardelli": (loc) => normalize(loc.name).startsWith("ghirardelli"),
};

async function main() {
  const [brands, flavors, locations] = await Promise.all([
    supaGet("brands", "select=id,name,slug&order=name"),
    supaGet("flavors", "select=id,name,slug,brand_id&order=name"),
    supaGet("locations", "select=id,name,slug,location_type&location_type=eq.scoop_shop&order=name"),
  ]);

  const brandById = Object.fromEntries(brands.map((b) => [b.id, b]));
  const brandedFlavors = flavors.filter((f) => f.brand_id);
  const genericFlavors = flavors.filter((f) => !f.brand_id);

  const rows = [];
  const matchedLocationIds = new Set();

  // Branded flavors → matching locations
  for (const flavor of brandedFlavors) {
    const brand = brandById[flavor.brand_id];
    if (!brand) continue;
    const matcher = BRAND_MATCHERS[brand.slug];
    if (!matcher) continue;
    const matchingLocations = locations.filter(matcher);
    for (const loc of matchingLocations) {
      matchedLocationIds.add(loc.id);
      rows.push({ location_id: loc.id, flavor_id: flavor.id, brand_id: brand.id });
    }
  }

  // Generic flavors → independent shops
  const independentShops = locations.filter((loc) => !matchedLocationIds.has(loc.id));

  // Use a seeded random for reproducibility
  let seed = 42;
  function seededRandom() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  for (const shop of independentShops) {
    const shuffled = [...genericFlavors].sort(() => seededRandom() - 0.5);
    const count = Math.min(4 + Math.floor(seededRandom() * 5), shuffled.length);
    for (const flavor of shuffled.slice(0, count)) {
      rows.push({ location_id: shop.id, flavor_id: flavor.id, brand_id: null });
    }
  }

  // Staple flavors to branded shops
  const stapleNames = ["vanilla", "chocolate", "strawberry", "cookies and cream", "mint chocolate chip"];
  const stapleFlavors = genericFlavors.filter((f) => stapleNames.includes(f.name.toLowerCase()));
  const brandedShops = locations.filter((loc) => matchedLocationIds.has(loc.id));

  for (const shop of brandedShops.slice(0, 30)) {
    for (const flavor of stapleFlavors) {
      const exists = rows.some((r) => r.location_id === shop.id && r.flavor_id === flavor.id);
      if (!exists) {
        rows.push({ location_id: shop.id, flavor_id: flavor.id, brand_id: null });
      }
    }
  }

  // Generate SQL
  console.log("-- Scooped: Seed availability data");
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log(`-- Total rows: ${rows.length}`);
  console.log("");
  console.log("INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source)");
  console.log("VALUES");

  const values = rows.map((r) => {
    const brandVal = r.brand_id ? `'${r.brand_id}'` : "NULL";
    return `  ('${r.location_id}', '${r.flavor_id}', ${brandVal}, TRUE, 'seed')`;
  });

  console.log(values.join(",\n"));
  console.log("ON CONFLICT (location_id, flavor_id) DO NOTHING;");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
