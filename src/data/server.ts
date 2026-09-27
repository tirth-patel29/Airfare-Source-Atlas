import "server-only";

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import type { FileMeta, Source } from "@/data";

export const dataDirectory = path.resolve(
  process.cwd(),
  "..",
);

export const dataFileNames = [
  "SIH26056_airfare_source_registry.csv",
  "SIH26056_airfare_source_registry.xlsx",
  "SIH26056_India_Airlines.csv",
  "SIH26056_India_OTAs.csv",
  "SIH26056_Metasearch_Aggregators.csv",
];

const registryPath = path.join(
  dataDirectory,
  "SIH26056_airfare_source_registry.csv"
);

export async function getAllSources(): Promise<Source[]> {
  const csv = await readFile(registryPath, "utf8");
  return parse(csv, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Source[];
}

export async function getDataFiles(): Promise<FileMeta[]> {
  return Promise.all(
    dataFileNames.map(async (name) => {
      const { size } = await stat(path.join(dataDirectory, name));
      return {
        name,
        format: name.endsWith(".xlsx") ? "XLSX" : "CSV",
        sizeBytes: size,
        sizeFormatted:
          size < 1024 * 1024
            ? `${(size / 1024).toFixed(1)} KB`
            : `${(size / (1024 * 1024)).toFixed(1)} MB`,
      };
    })
  );
}