"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ExternalLink,
  Copy,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  MinusCircle,
} from "lucide-react";
import {
  Source,
  searchSources,
  filterSources,
  sortSources,
  getDisplayValue,
  isValidUrl,
} from "@/data";

interface SourceExplorerProps {
  sources: Source[];
  title?: string;
  subtitle?: string;
  showTypeFilter?: boolean;
  defaultType?: string;
  typeOptions?: string[];
}

const ITEMS_PER_PAGE = 20;

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  if (normalized === "verified") {
    return (
      <span className="badge badge-verified">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </span>
    );
  }
  if (normalized === "candidate") {
    return (
      <span className="badge badge-candidate">
        <AlertCircle className="w-3 h-3" />
        Candidate
      </span>
    );
  }
  if (normalized === "inactive") {
    return (
      <span className="badge badge-inactive">
        <XCircle className="w-3 h-3" />
        Inactive
      </span>
    );
  }
  if (normalized === "needs review") {
    return (
      <span className="badge badge-needs-review">
        <Clock className="w-3 h-3" />
        Needs review
      </span>
    );
  }
  if (normalized === "not relevant") {
    return (
      <span className="badge badge-not-relevant">
        <MinusCircle className="w-3 h-3" />
        Not relevant
      </span>
    );
  }
  return <span className="badge badge-needs-review">{status || "Unknown"}</span>;
}

function TypeBadge({ type }: { type: string }) {
  return <span className="badge badge-type">{type}</span>;
}

function IndiaBadge({ relevant }: { relevant: string }) {
  if (relevant.toLowerCase() === "yes") {
    return (
      <span className="badge badge-india">
        <span className="text-[10px]">🇮🇳</span>
        India
      </span>
    );
  }
  return null;
}

// Source detail modal
function SourceDetail({
  source,
  onClose,
}: {
  source: Source;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    const url = source.booking_url || source.official_domain;
    if (url && url !== "Unknown") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sections = [
    {
      title: "Identity",
      fields: [
        { label: "Source ID", value: source.source_id },
        { label: "Source Name", value: source.source_name },
        { label: "Type", value: source.source_type },
        { label: "Category", value: source.source_category },
      ],
    },
    {
      title: "Website",
      fields: [
        { label: "Official Domain", value: source.official_domain },
        { label: "Booking URL", value: source.booking_url },
      ],
    },
    {
      title: "Geography",
      fields: [
        { label: "Country", value: source.country },
        { label: "Region", value: source.region },
      ],
    },
    {
      title: "Classification",
      fields: [
        { label: "IATA Code", value: source.iata_code },
        { label: "ICAO Code", value: source.icao_code },
        { label: "Route Coverage", value: source.route_coverage },
      ],
    },
    {
      title: "India Relevance",
      fields: [
        { label: "India Relevant", value: source.india_relevant },
        {
          label: "Domestic India Flights",
          value: source.domestic_india_flights,
        },
        {
          label: "International Flights",
          value: source.international_flights,
        },
      ],
    },
    {
      title: "Data Access",
      fields: [
        { label: "Access Method", value: source.access_method },
        { label: "API Available", value: source.api_available },
      ],
    },
    {
      title: "Verification",
      fields: [
        { label: "Status", value: source.status },
        { label: "Last Verified", value: source.last_verified },
        { label: "Verification Source", value: source.verification_source },
      ],
    },
  ];

  const visibleSections = sections;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[5vh] pb-8 px-4 bg-black/30 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", damping: 28, stiffness: 350 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[var(--color-border)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {source.source_name}
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <TypeBadge type={source.source_type} />
                <StatusBadge status={source.status} />
                <IndiaBadge relevant={source.india_relevant} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[rgba(0,0,0,0.04)] transition-colors shrink-0"
              aria-label="Close detail view"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
          {source.country && source.country !== "Unknown" && (
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-2">
              {source.country}
              {source.region && source.region !== "Unknown" && ` · ${source.region}`}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-3 border-b border-[var(--color-border-subtle)] flex gap-2 flex-wrap">
          {isValidUrl(source.booking_url) && (
            <a
              href={source.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-[#333] transition-colors no-underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Visit Official Website
            </a>
          )}
          {(isValidUrl(source.booking_url) ||
            isValidUrl(source.official_domain)) && (
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] text-[13px] font-medium text-[var(--color-text-secondary)] hover:border-[#c0c0c2] hover:text-[#1d1d1f] transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy URL"}
            </button>
          )}
        </div>

        {/* Content sections */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {visibleSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)] mb-2.5">
                {section.title}
              </h3>
              <div className="space-y-1.5">
                {section.fields.map((field) => (
                  <div
                    key={field.label}
                    className="flex items-start justify-between gap-4 py-1"
                  >
                    <span className="text-[13px] text-[var(--color-text-secondary)] shrink-0">
                      {field.label}
                    </span>
                    <span className="text-[13px] text-right font-medium text-[var(--color-text-primary)] break-all">
                      {getDisplayValue(field.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notes */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)] mb-2.5">
              Notes
            </h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed bg-[#f9f9fb] rounded-lg p-3">
              {getDisplayValue(source.notes)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[var(--color-border-subtle)] bg-[#fafafa]">
          <p className="text-[11px] text-[var(--color-text-tertiary)]">
            Source ID: {source.source_id} · Last verified:{" "}
            {getDisplayValue(source.last_verified)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SourceExplorer({
  sources,
  title,
  subtitle,
  showTypeFilter = true,
  defaultType = "All",
  typeOptions,
}: SourceExplorerProps) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState(defaultType);
  const [indiaFilter, setIndiaFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          sources
            .map((source) => source.country)
            .filter((country) => country && country !== "Unknown")
        )
      ).sort(),
    [sources]
  );
  const statuses = useMemo(
    () => Array.from(new Set(sources.map((source) => source.status))).sort(),
    [sources]
  );

  const types = useMemo(
    () =>
      typeOptions ||
      Array.from(new Set(sources.map((s) => s.source_type))).sort(),
    [sources, typeOptions]
  );

  const filteredSources = useMemo(() => {
    let result = searchSources(query, sources);
    result = filterSources(result, {
      type: typeFilter,
      indiaRelevance: indiaFilter,
      country: countryFilter,
      status: statusFilter,
    });
    result = sortSources(result, sortBy);
    return result;
  }, [query, sources, typeFilter, indiaFilter, countryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredSources.length / ITEMS_PER_PAGE);
  const paginatedSources = filteredSources.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const resetFilters = useCallback(() => {
    setQuery("");
    setTypeFilter("All");
    setIndiaFilter("All");
    setCountryFilter("All");
    setStatusFilter("All");
    setSortBy("name-asc");
    setPage(1);
  }, []);

  // Reset page on filter change
  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <div>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          )}
          {subtitle && (
            <p className="text-[15px] text-[var(--color-text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Search + Filter Bar */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search by name, domain, country, IATA, type..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="input-search"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[rgba(0,0,0,0.04)]"
              >
                <X className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type filter chips */}
            {showTypeFilter && (
              <>
                <button
                  onClick={() => handleFilterChange(setTypeFilter)("All")}
                  className={`chip ${typeFilter === "All" ? "chip-active" : ""}`}
                >
                  All
                </button>
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleFilterChange(setTypeFilter)(t)}
                    className={`chip ${typeFilter === t ? "chip-active" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </>
            )}

            <div className="w-px h-5 bg-[var(--color-border)] mx-1 hidden sm:block" />

            {/* India relevance */}
            {["All", "India Relevant", "International"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleFilterChange(setIndiaFilter)(opt)}
                className={`chip ${indiaFilter === opt ? "chip-active" : ""}`}
              >
                {opt === "India Relevant" && "🇮🇳 "}
                {opt}
              </button>
            ))}

            <div className="w-px h-5 bg-[var(--color-border)] mx-1 hidden sm:block" />

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`chip ${showFilters ? "chip-active" : ""}`}
            >
              <Filter className="w-3.5 h-3.5" />
              More
            </button>
          </div>

          {/* Extended filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
                  <div className="flex items-center gap-2">
                    <label className="text-[12px] text-[var(--color-text-tertiary)] font-medium">
                      Country
                    </label>
                    <select
                      value={countryFilter}
                      onChange={(e) =>
                        handleFilterChange(setCountryFilter)(e.target.value)
                      }
                      className="text-[13px] px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white"
                    >
                      <option value="All">All countries</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[12px] text-[var(--color-text-tertiary)] font-medium">
                      Sort
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-[13px] px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white"
                    >
                      <option value="name-asc">Name A → Z</option>
                      <option value="name-desc">Name Z → A</option>
                      <option value="country">Country</option>
                      <option value="type">Type</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[12px] text-[var(--color-text-tertiary)] font-medium">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        handleFilterChange(setStatusFilter)(e.target.value)
                      }
                      className="text-[13px] px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-white"
                    >
                      <option value="All">All statuses</option>
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="text-[13px] text-[var(--color-accent)] font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-[13px] text-[var(--color-text-secondary)]">
          Showing{" "}
          <span className="font-semibold text-[var(--color-text-primary)]">
            {filteredSources.length}
          </span>{" "}
          {filteredSources.length !== sources.length && (
            <>of {sources.length} </>
          )}
          source{filteredSources.length !== 1 ? "s" : ""}
        </p>
        {filteredSources.length > 0 && totalPages > 1 && (
          <p className="text-[12px] text-[var(--color-text-tertiary)]">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* Source list */}
      {filteredSources.length === 0 ? (
        <div className="card empty-state">
          <Search className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)]" />
          <h3 className="text-[16px] font-semibold mt-3 text-[var(--color-text-primary)]">
            No sources found
          </h3>
          <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-5 py-2 rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium hover:bg-[#333] transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Country</th>
                    <th>Domain</th>
                    <th>India</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSources.map((source, idx) => (
                    <motion.tr
                      key={source.source_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => setSelectedSource(source)}
                      className="group"
                    >
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium text-[14px]">
                            {source.source_name}
                          </span>
                          {source.iata_code &&
                            source.iata_code !== "Not applicable" &&
                            source.iata_code !== "Unknown" && (
                              <span className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                                {source.iata_code}
                                {source.icao_code &&
                                  source.icao_code !== "Not applicable" &&
                                  source.icao_code !== "Unknown" &&
                                  ` / ${source.icao_code}`}
                              </span>
                            )}
                        </div>
                      </td>
                      <td>
                        <TypeBadge type={source.source_type} />
                      </td>
                      <td className="text-[13px] text-[var(--color-text-secondary)]">
                        {getDisplayValue(source.country)}
                      </td>
                      <td className="text-[13px] text-[var(--color-text-secondary)]">
                        {source.official_domain &&
                        source.official_domain !== "Unknown"
                          ? source.official_domain
                          : "—"}
                      </td>
                      <td>
                        <IndiaBadge relevant={source.india_relevant} />
                      </td>
                      <td>
                        <StatusBadge status={source.status} />
                      </td>
                      <td className="text-right">
                        {isValidUrl(source.booking_url) && (
                          <a
                            href={source.booking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors opacity-0 group-hover:opacity-100 no-underline"
                          >
                            Visit
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {paginatedSources.map((source, idx) => (
              <motion.div
                key={source.source_id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="card p-4 cursor-pointer"
                onClick={() => setSelectedSource(source)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium text-[15px] truncate">
                      {source.source_name}
                    </h3>
                    <p className="text-[13px] text-[var(--color-text-secondary)] mt-0.5">
                      {getDisplayValue(source.country)}
                      {source.official_domain &&
                        source.official_domain !== "Unknown" &&
                        ` · ${source.official_domain}`}
                    </p>
                  </div>
                  {isValidUrl(source.booking_url) && (
                    <a
                      href={source.booking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 p-2 rounded-full hover:bg-[rgba(0,0,0,0.04)] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[var(--color-accent)]" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  <TypeBadge type={source.source_type} />
                  <StatusBadge status={source.status} />
                  <IndiaBadge relevant={source.india_relevant} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-[var(--color-border)] bg-white disabled:opacity-30 hover:bg-[#f9f9fb] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                        page === pageNum
                          ? "bg-[#1d1d1f] text-white"
                          : "hover:bg-[rgba(0,0,0,0.04)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-[var(--color-border)] bg-white disabled:opacity-30 hover:bg-[#f9f9fb] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Source detail modal */}
      <AnimatePresence>
        {selectedSource && (
          <SourceDetail
            source={selectedSource}
            onClose={() => setSelectedSource(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
