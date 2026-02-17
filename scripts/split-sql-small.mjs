#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";

const sql = readFileSync("scripts/seed-availability.sql", "utf-8");
const lines = sql.split("\n");
const header = "INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source)\nVALUES\n";
const footer = "\nON CONFLICT (location_id, flavor_id) DO NOTHING;";
const valueLines = lines.filter((l) => l.trim().startsWith("('"));

const BATCH_SIZE = 100;
const batches = [];
for (let i = 0; i < valueLines.length; i += BATCH_SIZE) {
  batches.push(valueLines.slice(i, i + BATCH_SIZE));
}

for (let i = 0; i < batches.length; i++) {
  const batchSql = `-- Batch ${i + 1}/${batches.length}\n${header}${batches[i].join(",\n")}${footer}`;
  writeFileSync(`scripts/batch-${i + 1}.sql`, batchSql);
}

console.log(`${batches.length} batches of ${BATCH_SIZE} rows`);
