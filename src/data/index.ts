import registryData from "./registry.json";
import filesData from "./files.json";

export interface Source {
  source_id: string;
  source_type: string;
  source_name: string;
  country: string;
  region: string;
  official_domain: string;
  booking_url: string;
  iata_code: string;
  icao_code: string;
  india_relevant: string;
  domestic_india_flights: string;
  international_flights: string;
  source_category: string;
  access_method: string;
  api_available: string;
  route_coverage: string;
  status: string;
  last_verified: string;
  verification_source: string;
  notes: string;
}

export interface FileMeta {
  name: string;
  format: string;
  sizeBytes: number;
  sizeFormatted: string;
}

// All sources from the main registry
export const allSources: Source[] = registryData as Source[];

// File metadata for downloads
export const dataFiles: FileMeta[] = filesData as FileMeta[];

// Helper functions to calculate stats dynamically
export function getSourcesByType(type: string): Source[] {
  return allSources.filter(
    (s) => s.source_type.toLowerCase() === type.toLowerCase()
  );
}

export function getIndiaRelevantSources(): Source[] {
  return allSources.filter(
    (s) => s.india_relevant.toLowerCase() === "yes"
  );
}

export function getUniqueCountries(): string[] {
  const countries = new Set<string>();
  allSources.forEach((s) => {
    if (s.country && s.country !== "Unknown") {
      countries.add(s.country);
    }
  });
  return Array.from(countries).sort();
}

export function getUniqueRegions(): string[] {
  const regions = new Set<string>();
  allSources.forEach((s) => {
    if (s.region && s.region !== "Unknown") {
      regions.add(s.region);
    }
  });
  return Array.from(regions).sort();
}

export function getUniqueSourceTypes(): string[] {
  const types = new Set<string>();
  allSources.forEach((s) => {
    if (s.source_type) {
      types.add(s.source_type);
    }
  });
  return Array.from(types).sort();
}

export function getUniqueStatuses(): string[] {
  const statuses = new Set<string>();
  allSources.forEach((s) => {
    if (s.status) {
      statuses.add(s.status);
    }
  });
  return Array.from(statuses).sort();
}

export function getCountryStats(): { country: string; count: number }[] {
  const countMap: Record<string, number> = {};
  allSources.forEach((s) => {
    if (s.country && s.country !== "Unknown") {
      countMap[s.country] = (countMap[s.country] || 0) + 1;
    }
  });
  return Object.entries(countMap)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTypeStats(): { type: string; count: number }[] {
  const countMap: Record<string, number> = {};
  allSources.forEach((s) => {
    if (s.source_type) {
      countMap[s.source_type] = (countMap[s.source_type] || 0) + 1;
    }
  });
  return Object.entries(countMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

export function getStatusStats(): { status: string; count: number }[] {
  const countMap: Record<string, number> = {};
  allSources.forEach((s) => {
    if (s.status) {
      countMap[s.status] = (countMap[s.status] || 0) + 1;
    }
  });
  return Object.entries(countMap)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSourceById(id: string): Source | undefined {
  return allSources.find((s) => s.source_id === id);
}

export function searchSources(query: string, sources: Source[]): Source[] {
  if (!query.trim()) return sources;
  const q = query.toLowerCase().trim();
  return sources.filter((source) =>
    Object.values(source).some((value) => value.toLowerCase().includes(q))
  );
}

export function filterSources(
  sources: Source[],
  filters: {
    type?: string;
    indiaRelevance?: string;
    country?: string;
    status?: string;
  }
): Source[] {
  let result = sources;

  if (filters.type && filters.type !== "All") {
    result = result.filter(
      (s) => s.source_type.toLowerCase() === filters.type!.toLowerCase()
    );
  }

  if (filters.indiaRelevance === "India Relevant") {
    result = result.filter(
      (s) => s.india_relevant.toLowerCase() === "yes"
    );
  } else if (filters.indiaRelevance === "International") {
    result = result.filter(
      (s) => s.india_relevant.toLowerCase() !== "yes"
    );
  }

  if (filters.country && filters.country !== "All") {
    result = result.filter((s) => s.country === filters.country);
  }

  if (filters.status && filters.status !== "All") {
    result = result.filter((s) => s.status === filters.status);
  }

  return result;
}

export function sortSources(
  sources: Source[],
  sortBy: string
): Source[] {
  const sorted = [...sources];
  switch (sortBy) {
    case "name-asc":
      return sorted.sort((a, b) =>
        a.source_name.localeCompare(b.source_name)
      );
    case "name-desc":
      return sorted.sort((a, b) =>
        b.source_name.localeCompare(a.source_name)
      );
    case "country":
      return sorted.sort((a, b) =>
        a.country.localeCompare(b.country)
      );
    case "type":
      return sorted.sort((a, b) =>
        a.source_type.localeCompare(b.source_type)
      );
    default:
      return sorted;
  }
}

export function getDisplayValue(value: string): string {
  if (
    !value ||
    value === "Unknown" ||
    value === "Not verified" ||
    value === "Not applicable" ||
    value === ""
  ) {
    return "Not available";
  }
  return value;
}

export function isValidUrl(url: string): boolean {
  if (!url || url === "Unknown" || url === "Not applicable") return false;
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

export function getFileDescription(filename: string): string {
  if (filename.includes("airfare_source_registry") && filename.endsWith(".csv"))
    return "Complete source registry with all airlines, OTAs, metasearch platforms, GDS systems, and travel technology providers.";
  if (filename.includes("airfare_source_registry") && filename.endsWith(".xlsx"))
    return "Complete source registry in Excel format with all entries and fields.";
  if (filename.includes("India_Airlines"))
    return "Indian airlines subset — domestic and India-based carriers including active, inactive, and charter operators.";
  if (filename.includes("India_OTAs"))
    return "India-relevant OTAs and booking platforms — domestic platforms and international OTAs serving India routes.";
  if (filename.includes("Metasearch"))
    return "Metasearch engines and fare aggregator platforms — comparison and discovery layer sources.";
  return "Registry data file.";
}
