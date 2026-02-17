#!/usr/bin/env node

/**
 * Seed the availability table — connect branded flavors to their scoop shop locations.
 *
 * Usage:  node scripts/seed-availability.mjs
 *
 * This script reads flavors, brands, and scoop_shop locations from Supabase,
 * then creates availability rows for each (location, flavor) pair where the
 * location name matches the brand that owns the flavor.
 *
 * For generic (unbranded) flavors, they're distributed to local/independent shops
 * that don't have their own branded flavors.
 */

const SUPABASE_URL = "https://xuaeycylayiimocwnjix.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YWV5Y3lsYXlpaW1vY3duaml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4Mjc0NTIsImV4cCI6MjA4NjQwMzQ1Mn0.c32jt12ZlskBjXvyQV7v7ccdS6dAATfa6N0jnOBl888";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

async function supaGet(table, params = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers,
  });
  if (!res.ok) throw new Error(`GET ${table}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function supaPost(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation,resolution=ignore-duplicates" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    // 409 = duplicate key, which is fine
    if (res.status === 409) {
      console.log(`  ⚠️  Some rows already existed (skipped duplicates)`);
      return [];
    }
    throw new Error(`POST ${table}: ${res.status} ${text}`);
  }
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

// ── Brand → Location matching rules ─────────────────────────────────────────
// Key = brand slug, Value = function that returns true if a location belongs to this brand

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

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🍦 Seeding availability table...\n");

  // 1. Fetch all data
  const [brands, flavors, locations] = await Promise.all([
    supaGet("brands", "select=id,name,slug&order=name"),
    supaGet("flavors", "select=id,name,slug,brand_id&order=name"),
    supaGet("locations", "select=id,name,slug,location_type&location_type=eq.scoop_shop&order=name"),
  ]);

  console.log(`📦 ${brands.length} brands, ${flavors.length} flavors, ${locations.length} scoop shops\n`);

  // 2. Build brand lookup: brand_id → brand
  const brandById = Object.fromEntries(brands.map((b) => [b.id, b]));

  // 3. Separate branded vs generic flavors
  const brandedFlavors = flavors.filter((f) => f.brand_id);
  const genericFlavors = flavors.filter((f) => !f.brand_id);

  console.log(`🏷️  ${brandedFlavors.length} branded flavors, ${genericFlavors.length} generic flavors\n`);

  // 4. For each branded flavor, find matching locations
  const availabilityRows = [];
  const matchedLocationIds = new Set();

  for (const flavor of brandedFlavors) {
    const brand = brandById[flavor.brand_id];
    if (!brand) {
      console.log(`⚠️  Flavor "${flavor.name}" has unknown brand_id ${flavor.brand_id}`);
      continue;
    }

    const matcher = BRAND_MATCHERS[brand.slug];
    if (!matcher) {
      console.log(`⚠️  No matcher for brand "${brand.name}" (${brand.slug}) — skipping ${flavor.name}`);
      continue;
    }

    const matchingLocations = locations.filter(matcher);
    if (matchingLocations.length === 0) {
      console.log(`📍 No locations found for brand "${brand.name}"`);
      continue;
    }

    for (const loc of matchingLocations) {
      matchedLocationIds.add(loc.id);
      availabilityRows.push({
        location_id: loc.id,
        flavor_id: flavor.id,
        brand_id: brand.id,
        is_available: true,
        source: "seed",
      });
    }

    console.log(
      `✅ ${brand.name} → "${flavor.name}" → ${matchingLocations.length} location(s)`
    );
  }

  // 5. Distribute generic flavors to independent shops (those not matched to a brand)
  const independentShops = locations.filter((loc) => !matchedLocationIds.has(loc.id));
  console.log(`\n🏪 ${independentShops.length} independent shops (no brand match)`);

  // Give each independent shop a random selection of 4-8 generic flavors
  for (const shop of independentShops) {
    // Shuffle generic flavors and pick some
    const shuffled = [...genericFlavors].sort(() => Math.random() - 0.5);
    const count = Math.min(4 + Math.floor(Math.random() * 5), shuffled.length);
    const picked = shuffled.slice(0, count);

    for (const flavor of picked) {
      availabilityRows.push({
        location_id: shop.id,
        flavor_id: flavor.id,
        brand_id: null,
        is_available: true,
        source: "seed",
      });
    }
  }

  // 6. Also give branded shops a few generic staples (Vanilla, Chocolate, Strawberry)
  const stapleNames = ["vanilla", "chocolate", "strawberry", "cookies and cream", "mint chocolate chip"];
  const stapleFlavors = genericFlavors.filter((f) =>
    stapleNames.includes(f.name.toLowerCase())
  );

  // Add staples to the first 30 branded shops (to make data richer)
  const brandedShops = locations.filter((loc) => matchedLocationIds.has(loc.id));
  for (const shop of brandedShops.slice(0, 30)) {
    for (const flavor of stapleFlavors) {
      // Avoid duplicating if this exact pair already exists
      const exists = availabilityRows.some(
        (r) => r.location_id === shop.id && r.flavor_id === flavor.id
      );
      if (!exists) {
        availabilityRows.push({
          location_id: shop.id,
          flavor_id: flavor.id,
          brand_id: null,
          is_available: true,
          source: "seed",
        });
      }
    }
  }

  console.log(`\n📊 Total availability rows to insert: ${availabilityRows.length}`);

  // 7. Insert in batches of 50
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < availabilityRows.length; i += BATCH_SIZE) {
    const batch = availabilityRows.slice(i, i + BATCH_SIZE);
    try {
      const result = await supaPost("availability", batch);
      inserted += result.length;
      process.stdout.write(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(availabilityRows.length / BATCH_SIZE)}: ${result.length} rows inserted\n`);
    } catch (err) {
      console.error(`  ❌ Batch error: ${err.message}`);
    }
  }

  console.log(`\n✅ Done! ${inserted} availability rows created.`);
  console.log("🍦 Flavors are now linked to their shops!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
