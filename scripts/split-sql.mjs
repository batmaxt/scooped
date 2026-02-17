#!/usr/bin/env node

/**
 * Split seed-availability.sql into multiple batch files.
 */
import { readFileSync, writeFileSync } from "fs";

const sql = readFileSync("scripts/seed-availability.sql", "utf-8");

// Extract the VALUES lines (each starts with "  ('")
const lines = sql.split("\n");
const header = "INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source)\nVALUES\n";
const footer = "\nON CONFLICT (location_id, flavor_id) DO NOTHING;";

const valueLines = lines.filter((l) => l.trim().startsWith("('"));

const BATCH_SIZE = 350;
const batches = [];
for (let i = 0; i < valueLines.length; i += BATCH_SIZE) {
  batches.push(valueLines.slice(i, i + BATCH_SIZE));
}

for (let i = 0; i < batches.length; i++) {
  const batchSql = `-- Batch ${i + 1}/${batches.length} (${batches[i].length} rows)\n${header}${batches[i].join(",\n")}${footer}\n`;
  writeFileSync(`scripts/seed-availability-batch-${i + 1}.sql`, batchSql);
  console.log(`Batch ${i + 1}: ${batches[i].length} rows`);
}

console.log(`\nTotal: ${valueLines.length} rows in ${batches.length} batches`);
