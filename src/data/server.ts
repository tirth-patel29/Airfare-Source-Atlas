import "server-only";

import { headers } from "next/headers";
import { parse } from "csv-parse/sync";
import type { FileMeta, Source } from "@/data";
import filesData from "./files.json";

export const dataFileNames = [
  "SIH26056_airfare_source_registry.csv",
  "SIH26056_airfare_source_registry.xlsx",
  "SIH26056_India_Airlines.csv",
  "SIH26056_India_OTAs.csv",
  "SIH26056_Metasearch_Aggregators.csv",
];

export async function getAllSources(): Promise<Source[]> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) {
    throw new Error("Unable to determine the request host for registry data.");
  }

  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  const registryUrl = new URL(
    "/data/SIH26056_airfare_source_registry.csv",
    `${protocol.split(",")[0]}://${host}`
  );
  const response = await fetch(registryUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to fetch registry data (${response.status}).`);
  }

  const csv = await response.text();
  return parse(csv, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Source[];
}

export async function getDataFiles(): Promise<FileMeta[]> {
  return filesData as FileMeta[];
}